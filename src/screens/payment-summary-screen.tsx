import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { BookingLayout } from '../components/booking-layout';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  setBookingNotes,
  setIsPaymentComplete,
  setPromoCodeName,
} from '../features/booking/booking-draft.slice';
import {
  selectDraftAddOnIds,
  selectDraftCatalogItem,
  selectDraftCustomerDetails,
  selectDraftIsPaymentComplete,
  selectDraftNotes,
  selectDraftPromoCodeName,
  selectDraftSelectedSlot,
  selectDraftSelectedStaff,
  selectDraftSignedConsents,
} from '../features/booking/booking-draft.selectors';
import { selectActiveTenantSlug } from '../features/tenant/tenant.selectors';
import { selectCatalogAddOns } from '../features/catalog/catalog.selectors';
import { formatDuration } from '../features/catalog/catalog.utils';
import {
  getBookingDurationMinutes,
  getBookingTotalCents,
  getSelectedAddOns,
} from '../features/booking/booking-flow.utils';
import {
  selectBookingSubmitError,
  selectBookingSubmitResult,
  selectBookingSubmitStatus,
} from '../features/booking-submit/booking-submit.selectors';
import { submitBookingAndPrepareCheckout } from '../features/booking-submit/booking-submit.slice';
import type { CreateCustomerAppointmentPayload } from '../features/booking-submit/booking-submit.types';
import { Theme } from '../theme/theme';

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function readNumber(record: Record<string, unknown> | null, keys: string[]): number | null {
  if (!record) return null;

  for (const key of keys) {
    const value = record[key];

    if (typeof value === 'number' && Number.isFinite(value)) return value;

    if (typeof value === 'string' && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }

  return null;
}

function readString(record: Record<string, unknown> | null, keys: string[]): string | null {
  if (!record) return null;

  for (const key of keys) {
    const value = record[key];

    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number') return String(value);
  }

  return null;
}

function extractArray(value: unknown, preferredKeys: string[]): unknown[] {
  if (Array.isArray(value)) return value;

  const record = asRecord(value);
  if (!record) return [];

  for (const key of [...preferredKeys, 'items', 'results', 'data']) {
    if (key in record) {
      const nested = extractArray(record[key], preferredKeys);
      if (nested.length > 0 || Array.isArray(record[key])) return nested;
    }
  }

  return [];
}

function unwrapData(payload: unknown): Record<string, unknown> | null {
  const record = asRecord(payload);
  return asRecord(record?.data) ?? record;
}

function toCentsFromDollars(value: number | null): number | null {
  if (value === null) return null;
  return Math.round(value * 100);
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function extractBackendAppointmentsTotalCents(payload: unknown): number | null {
  const root = unwrapData(payload);
  const appointments = extractArray(root?.appointments ?? root?.appointment, [
    'appointments',
  ]);

  if (appointments.length === 0) return null;

  const total = appointments.reduce<number>((sum, appointment) => {
    const record = asRecord(appointment);
    const dollars = readNumber(record, [
      'totalPrice',
      'finalPrice',
      'amount',
      'price',
      'discountedTotal',
    ]);

    return sum + (toCentsFromDollars(dollars) ?? 0);
  }, 0);

  return total > 0 ? total : null;
}

function extractMoneyCents(payloads: unknown[], keys: string[]): number | null {
  for (const payload of payloads) {
    const root = unwrapData(payload);
    const direct = toCentsFromDollars(readNumber(root, keys));
    if (direct !== null) return direct;

    const checkout = asRecord(root?.checkout);
    const checkoutVal = toCentsFromDollars(readNumber(checkout, keys));
    if (checkoutVal !== null) return checkoutVal;

    const payment = asRecord(root?.payment);
    const paymentVal = toCentsFromDollars(readNumber(payment, keys));
    if (paymentVal !== null) return paymentVal;
  }

  return null;
}

function extractPercent(payloads: unknown[], keys: string[]): number | null {
  for (const payload of payloads) {
    const root = unwrapData(payload);
    const direct = readNumber(root, keys);
    if (direct !== null) return direct;

    const checkout = asRecord(root?.checkout);
    const checkoutVal = readNumber(checkout, keys);
    if (checkoutVal !== null) return checkoutVal;

    const payment = asRecord(root?.payment);
    const paymentVal = readNumber(payment, keys);
    if (paymentVal !== null) return paymentVal;
  }

  return null;
}

function extractExpiry(payloads: unknown[]): string | null {
  for (const payload of payloads) {
    const root = unwrapData(payload);
    const direct = readString(root, ['expiresAt', 'expires_at', 'expiration']);
    if (direct) return direct;

    const checkout = asRecord(root?.checkout);
    const checkoutVal = readString(checkout, ['expiresAt', 'expires_at', 'expiration']);
    if (checkoutVal) return checkoutVal;
  }

  return null;
}

function extractDiscountLabel(
  promoCodeName: string,
  appointmentResponse: unknown,
): string {
  if (promoCodeName.trim()) return `Promo (${promoCodeName.trim()})`;

  const root = unwrapData(appointmentResponse);
  const appointments = extractArray(root?.appointments ?? root?.appointment, [
    'appointments',
  ]);

  const notes = appointments
    .map(item => readString(asRecord(item), ['notes']))
    .filter(Boolean)
    .join(' ');

  const loyaltyMatch = notes.match(/Loyalty discount applied\s*\(visit\s*#?(\d+)\)/i);
  if (loyaltyMatch) {
    const visitNum = loyaltyMatch[1];
    const suffix =
      visitNum === '1' ? 'st' :
      visitNum === '2' ? 'nd' :
      visitNum === '3' ? 'rd' : 'th';

    return `${visitNum}${suffix} visit loyalty discount`;
  }

  if (/first[- ]?time/i.test(notes)) return 'First-time client discount';

  return 'Discount';
}

function formatBackendDate(value: string | null): string {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function PaymentSummaryScreen({ navigation }: any) {
  const dispatch = useAppDispatch();

  const activeSlug = useAppSelector(selectActiveTenantSlug);
  const selectedItem = useAppSelector(selectDraftCatalogItem);
  const selectedAddOnIds = useAppSelector(selectDraftAddOnIds);
  const selectedStaff = useAppSelector(selectDraftSelectedStaff);
  const selectedSlot = useAppSelector(selectDraftSelectedSlot);
  const customerDetails = useAppSelector(selectDraftCustomerDetails);
  const notes = useAppSelector(selectDraftNotes);
  const promoCodeName = useAppSelector(selectDraftPromoCodeName);
  const isPaymentComplete = useAppSelector(selectDraftIsPaymentComplete);
  const signedConsents = useAppSelector(selectDraftSignedConsents);

  const submitStatus = useAppSelector(selectBookingSubmitStatus);
  const submitError = useAppSelector(selectBookingSubmitError);
  const submitResult = useAppSelector(selectBookingSubmitResult);

  const availableAddOns = useAppSelector(state =>
    activeSlug && selectedItem
      ? selectCatalogAddOns(state, activeSlug, selectedItem.type, selectedItem.id)
      : [],
  );

  const selectedAddOns = useMemo(
    () => getSelectedAddOns(availableAddOns, selectedAddOnIds),
    [availableAddOns, selectedAddOnIds],
  );

  const serviceTotalCents = getBookingTotalCents(selectedItem, selectedAddOns);
  const totalDuration = getBookingDurationMinutes(selectedItem, selectedAddOns);
  const isSubmitting = submitStatus === 'loading';

  const backendTotalCents =
    extractBackendAppointmentsTotalCents(submitResult?.appointmentResponse) ??
    extractMoneyCents(
      [submitResult?.appointmentResponse, submitResult?.checkoutResponse],
      ['actualTotal', 'discountedTotal', 'totalPrice', 'total'],
    );

  const finalTotalCents = backendTotalCents ?? serviceTotalCents;
  const discountCents = Math.max(0, serviceTotalCents - finalTotalCents);
  const depositPercent = extractPercent(
    [submitResult?.appointmentResponse, submitResult?.checkoutResponse],
    ['depositPercent', 'deposit_percentage'],
  );
  const depositAmountCents = extractMoneyCents(
    [submitResult?.appointmentResponse, submitResult?.checkoutResponse],
    ['depositAmount', 'deposit', 'amountDueNow'],
  );
  const processingFeeCents = extractMoneyCents(
    [submitResult?.appointmentResponse, submitResult?.checkoutResponse],
    ['processingFee', 'fee', 'stripeFee'],
  );
  const depositWithFeeCents = extractMoneyCents(
    [submitResult?.appointmentResponse, submitResult?.checkoutResponse],
    ['depositWithFee', 'amountToPayNow', 'payNow', 'checkoutAmount'],
  );
  const expiresAt = extractExpiry([
    submitResult?.appointmentResponse,
    submitResult?.checkoutResponse,
  ]);
  const discountLabel = extractDiscountLabel(
    promoCodeName,
    submitResult?.appointmentResponse,
  );

  const amountToPayNowCents = isPaymentComplete
    ? finalTotalCents
    : depositWithFeeCents ?? depositAmountCents ?? 0;

  const buildPayload = (): CreateCustomerAppointmentPayload | null => {
    if (!selectedItem || !selectedSlot || !selectedStaff) return null;

    const appointment: CreateCustomerAppointmentPayload['appointments'][number] = {
      startDateTime: selectedSlot.startDateTime,
      notes: notes.trim() || undefined,
      addonIds: selectedAddOnIds.length > 0 ? selectedAddOnIds : undefined,
    };

    /**
     * Important:
     * - Specific staff: send selected staff id.
     * - Any staff: if the /slots/any endpoint returned a concrete staffId
     *   for that slot, send it. Otherwise omit staffId and let backend resolve.
     */
    const resolvedStaffId =
      selectedStaff.mode === 'specific'
        ? selectedStaff.id
        : selectedSlot.staffId ?? null;

    if (resolvedStaffId && resolvedStaffId !== 'any') {
      appointment.staffId = resolvedStaffId;
    }

    if (selectedItem.type === 'package') {
      appointment.packageId = selectedItem.id;
    } else {
      appointment.serviceId = selectedItem.id;
    }

    return {
      customerName: customerDetails.name,
      customerPhone: customerDetails.phone,
      promoCodeName: promoCodeName || undefined,
      isPaymentComplete,
      signedConsents: signedConsents.length > 0 ? signedConsents : undefined,
      appointments: [appointment],
    };
  };

  const openStripeCheckout = async (checkoutUrl: string) => {
    try {
      await Linking.openURL(checkoutUrl);
    } catch {
      Alert.alert(
        'Stripe checkout could not open',
        'The booking was created, but the payment link could not be opened on this device.',
      );
    }
  };

  const handleSubmit = async () => {
    if (!activeSlug) {
      Alert.alert('Salon required', 'Choose a salon before booking.');
      return;
    }

    const payload = buildPayload();

    if (!payload) {
      Alert.alert('Booking incomplete', 'Please review your booking details.');
      return;
    }

    const result = await dispatch(
      submitBookingAndPrepareCheckout({
        slug: activeSlug,
        payload,
      }),
    );

    if (submitBookingAndPrepareCheckout.fulfilled.match(result)) {
      if (result.payload.checkoutUrl) {
        await openStripeCheckout(result.payload.checkoutUrl);
        return;
      }

      if (result.payload.clientSecret) {
        Alert.alert(
          'Payment sheet required',
          'Stripe returned a client secret, not a checkout URL. Add @stripe/stripe-react-native PaymentSheet to complete in-app payment.',
        );
        return;
      }

      navigation.navigate('BookingSuccess', {
        bookingGroupId: result.payload.bookingGroupId,
        appointmentIds: result.payload.appointmentIds,
        clientSecret: result.payload.clientSecret,
        sessionId: result.payload.sessionId,
      });
    }
  };

  const reopenCheckout = async () => {
    if (!submitResult?.checkoutUrl) return;
    await openStripeCheckout(submitResult.checkoutUrl);
  };

  return (
    <BookingLayout
      step={5}
      stepTitle="Booking Summary"
      onBackPress={() => navigation.goBack()}
      onForwardPress={handleSubmit}
      isForwardDisabled={isSubmitting}
      forwardLabel={isSubmitting ? 'Preparing Checkout...' : 'Proceed to Stripe'}
    >
      <ScrollView style={styles.canvas} contentContainerStyle={styles.content}>
        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>Final Summary</Text>
          <Text style={styles.headerText}>
            Review your appointment, customer details, discounts, and payment before continuing to Stripe.
          </Text>
        </View>

        <SummaryCard title="Appointment">
          <SummaryRow label="Service" value={selectedItem?.name ?? '—'} />
          <SummaryRow label="Type" value={selectedItem?.type === 'package' ? 'Package' : 'Service'} />
          <SummaryRow label="Professional" value={selectedStaff?.name ?? 'Any'} />
          <SummaryRow label="Time" value={selectedSlot?.label ?? '—'} />
          <SummaryRow label="Duration" value={formatDuration(totalDuration)} />
        </SummaryCard>

        <SummaryCard title="Customer">
          <SummaryRow label="Name" value={customerDetails.name || '—'} />
          <SummaryRow label="Email" value={customerDetails.email || '—'} />
          <SummaryRow label="Phone" value={customerDetails.phone || '—'} />
        </SummaryCard>

        <SummaryCard title="Add-ons & Notes">
          {selectedAddOns.length > 0 ? (
            selectedAddOns.map(addOn => (
              <SummaryRow
                key={addOn.id}
                label={addOn.name}
                value={formatCents(addOn.priceCents)}
              />
            ))
          ) : (
            <SummaryRow label="Add-ons" value="None" />
          )}

          <Text style={styles.inputLabel}>Promo Code</Text>
          <TextInput
            style={styles.input}
            placeholder="SAVE10"
            placeholderTextColor="#9CA3AF"
            value={promoCodeName}
            onChangeText={value => dispatch(setPromoCodeName(value))}
            autoCapitalize="characters"
          />

          <Text style={styles.inputLabel}>Appointment Notes</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Example: Please avoid strong fragrance products."
            placeholderTextColor="#9CA3AF"
            value={notes}
            onChangeText={value => dispatch(setBookingNotes(value))}
            multiline
            textAlignVertical="top"
          />
        </SummaryCard>

        <SummaryCard title="Payment Method">
          <PaymentOption
            title="Pay Deposit"
            subtitle="Pay the required deposit now. Remaining balance is due at the appointment."
            selected={!isPaymentComplete}
            onPress={() => dispatch(setIsPaymentComplete(false))}
          />

          <PaymentOption
            title="Pay Full Amount"
            subtitle="Pay the full booking amount now through Stripe checkout."
            selected={isPaymentComplete}
            onPress={() => dispatch(setIsPaymentComplete(true))}
          />
        </SummaryCard>

        <SummaryCard title="Price Breakdown">
          <SummaryRow label="Service total" value={formatCents(serviceTotalCents)} />

          {discountCents > 0 && (
            <SummaryRow
              label={discountLabel}
              value={`-${formatCents(discountCents)}`}
              positive
            />
          )}

          <SummaryRow label="Discounted total" value={formatCents(finalTotalCents)} />

          {!isPaymentComplete && depositPercent !== null && (
            <SummaryRow
              label={`Deposit (${depositPercent}%)`}
              value={depositAmountCents !== null ? formatCents(depositAmountCents) : 'Calculated by Stripe'}
            />
          )}

          {!isPaymentComplete && processingFeeCents !== null && processingFeeCents > 0 && (
            <SummaryRow label="Processing fee" value={formatCents(processingFeeCents)} />
          )}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>You pay now</Text>
            <Text style={styles.totalValue}>
              {submitResult
                ? formatCents(amountToPayNowCents)
                : isPaymentComplete
                  ? formatCents(serviceTotalCents)
                  : 'Calculated after confirm'}
            </Text>
          </View>

          {!isPaymentComplete && submitResult && (
            <Text style={styles.disclaimer}>
              Remaining balance of {formatCents(Math.max(0, finalTotalCents - (depositAmountCents ?? 0)))} is due at the appointment.
            </Text>
          )}

          {expiresAt && (
            <Text style={styles.disclaimer}>
              Checkout expires: {formatBackendDate(expiresAt)}
            </Text>
          )}
        </SummaryCard>

        {submitError && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{submitError.message}</Text>
          </View>
        )}

        {isSubmitting && (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={Theme.colors.luxuryBlack} />
            <Text style={styles.loadingText}>Creating booking and preparing Stripe checkout...</Text>
          </View>
        )}

        {submitResult?.checkoutUrl && (
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={reopenCheckout}
            activeOpacity={0.9}
          >
            <Text style={styles.checkoutButtonText}>Open Stripe Checkout Again</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.secureText}>
          Stripe handles payment securely. Merlua does not store card details.
        </Text>
      </ScrollView>
    </BookingLayout>
  );
}

function SummaryCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}

function SummaryRow({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={[styles.summaryValue, positive && styles.positiveValue]}>
        {value}
      </Text>
    </View>
  );
}

function PaymentOption({
  title,
  subtitle,
  selected,
  onPress,
}: {
  title: string;
  subtitle: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.paymentOption, selected && styles.paymentOptionSelected]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioDot} />}
      </View>

      <View style={styles.paymentTextBlock}>
        <Text style={styles.paymentTitle}>{title}</Text>
        <Text style={styles.paymentSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    backgroundColor: Theme.colors.softIvory,
  },
  content: {
    padding: Theme.spacing.m,
  },
  headerCard: {
    backgroundColor: Theme.colors.luxuryBlack,
    padding: Theme.spacing.m,
    marginBottom: Theme.spacing.s,
  },
  headerTitle: {
    fontFamily: Theme.fonts.semibold,
    fontSize: 22,
    color: Theme.colors.softIvory,
    marginBottom: 6,
  },
  headerText: {
    fontFamily: Theme.fonts.regular,
    fontSize: 13,
    lineHeight: 19,
    color: Theme.colors.warmStone,
  },
  card: {
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    padding: Theme.spacing.s,
    marginBottom: Theme.spacing.s,
  },
  cardTitle: {
    fontFamily: Theme.fonts.bold,
    fontSize: 11,
    color: Theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    marginBottom: Theme.spacing.s,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Theme.spacing.s,
    marginBottom: 10,
  },
  summaryLabel: {
    fontFamily: Theme.fonts.regular,
    fontSize: 13,
    color: Theme.colors.textSecondary,
  },
  summaryValue: {
    flex: 1,
    textAlign: 'right',
    fontFamily: Theme.fonts.semibold,
    fontSize: 13,
    color: Theme.colors.textPrimary,
  },
  positiveValue: {
    color: '#167A3C',
  },
  inputLabel: {
    fontFamily: Theme.fonts.bold,
    fontSize: 10,
    color: Theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: Theme.spacing.s,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Theme.colors.border,
    backgroundColor: Theme.colors.softIvory,
    paddingHorizontal: Theme.spacing.s,
    paddingVertical: 14,
    fontFamily: Theme.fonts.regular,
    fontSize: 14,
    color: Theme.colors.textPrimary,
  },
  notesInput: {
    minHeight: 92,
  },
  paymentOption: {
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    padding: Theme.spacing.s,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  paymentOptionSelected: {
    borderColor: Theme.colors.luxuryBlack,
    backgroundColor: Theme.colors.warmStone,
  },
  radio: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.s,
  },
  radioSelected: {
    borderColor: Theme.colors.luxuryBlack,
  },
  radioDot: {
    width: 12,
    height: 12,
    backgroundColor: Theme.colors.luxuryBlack,
  },
  paymentTextBlock: {
    flex: 1,
  },
  paymentTitle: {
    fontFamily: Theme.fonts.semibold,
    fontSize: 14,
    color: Theme.colors.textPrimary,
  },
  paymentSubtitle: {
    fontFamily: Theme.fonts.regular,
    fontSize: 12,
    color: Theme.colors.textSecondary,
    lineHeight: 17,
    marginTop: 3,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Theme.colors.warmStone,
    paddingTop: Theme.spacing.s,
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontFamily: Theme.fonts.bold,
    fontSize: 14,
    color: Theme.colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  totalValue: {
    fontFamily: Theme.fonts.bold,
    fontSize: 20,
    color: Theme.colors.textPrimary,
  },
  disclaimer: {
    fontFamily: Theme.fonts.regular,
    fontSize: 12,
    color: Theme.colors.textSecondary,
    lineHeight: 18,
    marginTop: 8,
  },
  errorBox: {
    backgroundColor: '#FCEEEE',
    borderWidth: 1,
    borderColor: '#F2B8B5',
    padding: Theme.spacing.s,
    marginBottom: Theme.spacing.s,
  },
  errorText: {
    fontFamily: Theme.fonts.regular,
    fontSize: 13,
    color: '#BA1A1A',
    lineHeight: 19,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Theme.spacing.xs,
    paddingVertical: Theme.spacing.s,
  },
  loadingText: {
    fontFamily: Theme.fonts.medium,
    fontSize: 13,
    color: Theme.colors.textSecondary,
  },
  checkoutButton: {
    backgroundColor: Theme.colors.luxuryBlack,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: Theme.spacing.s,
  },
  checkoutButtonText: {
    fontFamily: Theme.fonts.bold,
    fontSize: 12,
    color: Theme.colors.softIvory,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },
  secureText: {
    fontFamily: Theme.fonts.regular,
    fontSize: 12,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: Theme.spacing.s,
    marginBottom: Theme.spacing.l,
  },
});
