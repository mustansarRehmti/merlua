import React, { useMemo } from 'react';
import {
  Alert,
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
  selectDraftIsPaymentComplete,
  selectDraftNotes,
  selectDraftPromoCodeName,
  selectDraftSelectedSlot,
  selectDraftSelectedStaff,
} from '../features/booking/booking-draft.selectors';
import { selectActiveTenantSlug } from '../features/tenant/tenant.selectors';
import { selectCatalogAddOns } from '../features/catalog/catalog.selectors';
import {
  formatDuration,
  formatMoney,
} from '../features/catalog/catalog.utils';
import {
  getBookingDurationMinutes,
  getBookingTotalCents,
  getSelectedAddOns,
} from '../features/booking/booking-flow.utils';
import { Theme } from '../theme/theme';

export function BookingReviewScreen({ navigation }: any) {
  const dispatch = useAppDispatch();

  const activeSlug = useAppSelector(selectActiveTenantSlug);
  const selectedItem = useAppSelector(selectDraftCatalogItem);
  const selectedAddOnIds = useAppSelector(selectDraftAddOnIds);
  const selectedStaff = useAppSelector(selectDraftSelectedStaff);
  const selectedSlot = useAppSelector(selectDraftSelectedSlot);
  const notes = useAppSelector(selectDraftNotes);
  const promoCodeName = useAppSelector(selectDraftPromoCodeName);
  const isPaymentComplete = useAppSelector(selectDraftIsPaymentComplete);

  const availableAddOns = useAppSelector(state =>
    activeSlug && selectedItem
      ? selectCatalogAddOns(state, activeSlug, selectedItem.type, selectedItem.id)
      : [],
  );

  const selectedAddOns = useMemo(
    () => getSelectedAddOns(availableAddOns, selectedAddOnIds),
    [availableAddOns, selectedAddOnIds],
  );

  const totalCents = getBookingTotalCents(selectedItem, selectedAddOns);
  const totalDuration = getBookingDurationMinutes(selectedItem, selectedAddOns);

  const handleContinue = () => {
    if (!selectedItem || !selectedStaff || !selectedSlot) {
      Alert.alert('Booking incomplete', 'Choose a service, professional, date, and time first.');
      return;
    }

    navigation.navigate('CustomerDetails');
  };

  return (
    <BookingLayout
      step={4}
      stepTitle="Review Booking"
      onBackPress={() => navigation.goBack()}
      onForwardPress={handleContinue}
      forwardLabel="Continue to Details"
    >
      <ScrollView style={styles.canvas} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>Appointment Summary</Text>

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View style={styles.mainMeta}>
              <Text style={styles.title}>{selectedItem?.name ?? 'Selected booking'}</Text>
              <Text style={styles.subtitle}>
                {selectedItem?.type === 'package' ? 'Package' : 'Service'} • {formatDuration(totalDuration)}
              </Text>
            </View>

            <Text style={styles.price}>{formatMoney(totalCents)}</Text>
          </View>

          <View style={styles.divider} />

          <InfoRow label="Professional" value={selectedStaff?.name ?? 'Any available professional'} />
          <InfoRow label="Time" value={selectedSlot?.label ?? 'No time selected'} />

          {selectedAddOns.length > 0 && (
            <View style={styles.addOnBlock}>
              <Text style={styles.subSectionLabel}>Selected Add-ons</Text>
              {selectedAddOns.map(addOn => (
                <View key={addOn.id} style={styles.addOnRow}>
                  <Text style={styles.addOnName}>+ {addOn.name}</Text>
                  <Text style={styles.addOnPrice}>{formatMoney(addOn.priceCents)}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <Text style={styles.sectionLabel}>Promo Code</Text>
        <View style={styles.inputCard}>
          <TextInput
            style={styles.input}
            placeholder="Enter promo code"
            placeholderTextColor={Theme.colors.textSecondary}
            autoCapitalize="characters"
            value={promoCodeName}
            onChangeText={value => dispatch(setPromoCodeName(value))}
          />
        </View>

        <Text style={styles.sectionLabel}>Payment Preference</Text>
        <View style={styles.optionGroup}>
          <PaymentOption
            title="Pay Deposit"
            subtitle="Pay the required deposit now. Balance is due at the appointment."
            selected={!isPaymentComplete}
            onPress={() => dispatch(setIsPaymentComplete(false))}
          />

          <PaymentOption
            title="Pay Full Amount"
            subtitle="Pay the full booking amount now."
            selected={isPaymentComplete}
            onPress={() => dispatch(setIsPaymentComplete(true))}
          />
        </View>

        <Text style={styles.sectionLabel}>Notes</Text>
        <View style={styles.inputCard}>
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Add preferences, allergies, or anything the salon should know..."
            placeholderTextColor={Theme.colors.textSecondary}
            multiline
            textAlignVertical="top"
            value={notes}
            onChangeText={value => dispatch(setBookingNotes(value))}
          />
        </View>

        <View style={styles.bottomBuffer} />
      </ScrollView>
    </BookingLayout>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
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
  sectionLabel: {
    fontFamily: Theme.fonts.bold,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: Theme.colors.textSecondary,
    marginLeft: Theme.spacing.m,
    marginTop: Theme.spacing.m,
    marginBottom: Theme.spacing.xs,
  },
  card: {
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    marginHorizontal: Theme.spacing.m,
    padding: Theme.spacing.s,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Theme.spacing.s,
  },
  mainMeta: {
    flex: 1,
  },
  title: {
    fontFamily: Theme.fonts.semibold,
    fontSize: 17,
    color: Theme.colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  subtitle: {
    fontFamily: Theme.fonts.regular,
    fontSize: 13,
    color: Theme.colors.textSecondary,
    marginTop: 4,
  },
  price: {
    fontFamily: Theme.fonts.bold,
    fontSize: 19,
    color: Theme.colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Theme.colors.warmStone,
    marginVertical: Theme.spacing.s,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Theme.spacing.s,
    marginBottom: 10,
  },
  infoLabel: {
    fontFamily: Theme.fonts.medium,
    fontSize: 12,
    color: Theme.colors.textSecondary,
  },
  infoValue: {
    flex: 1,
    textAlign: 'right',
    fontFamily: Theme.fonts.semibold,
    fontSize: 12,
    color: Theme.colors.textPrimary,
  },
  subSectionLabel: {
    fontFamily: Theme.fonts.bold,
    fontSize: 10,
    color: Theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  addOnBlock: {
    marginTop: Theme.spacing.s,
    paddingTop: Theme.spacing.s,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.warmStone,
  },
  addOnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  addOnName: {
    fontFamily: Theme.fonts.regular,
    fontSize: 13,
    color: Theme.colors.textSecondary,
  },
  addOnPrice: {
    fontFamily: Theme.fonts.medium,
    fontSize: 13,
    color: Theme.colors.textPrimary,
  },
  inputCard: {
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    marginHorizontal: Theme.spacing.m,
  },
  input: {
    paddingHorizontal: Theme.spacing.s,
    paddingVertical: 15,
    fontFamily: Theme.fonts.regular,
    fontSize: 14,
    color: Theme.colors.textPrimary,
  },
  notesInput: {
    minHeight: 110,
  },
  optionGroup: {
    paddingHorizontal: Theme.spacing.m,
    gap: Theme.spacing.xs,
  },
  paymentOption: {
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    padding: Theme.spacing.s,
    flexDirection: 'row',
    alignItems: 'center',
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
  bottomBuffer: {
    height: Theme.spacing.xl,
  },
});
