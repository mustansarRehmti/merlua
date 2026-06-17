import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { BookingLayout } from '../components/booking-layout';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setCustomerDetails } from '../features/booking/booking-draft.slice';
import {
  selectDraftCatalogItem,
  selectDraftCustomerDetails,
} from '../features/booking/booking-draft.selectors';
import { selectCurrentCustomerSession } from '../features/auth/auth.selectors';
import { getConsentTemplatesFromItem } from '../features/booking/booking-flow.utils';
import { Theme } from '../theme/theme';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PLACEHOLDER_COLOR = '#9CA3AF';

export function CustomerDetailsScreen({ navigation }: any) {
  const dispatch = useAppDispatch();

  const currentSession = useAppSelector(selectCurrentCustomerSession);
  const customerDetails = useAppSelector(selectDraftCustomerDetails);
  const selectedItem = useAppSelector(selectDraftCatalogItem);

  const [name, setName] = useState(customerDetails.name);
  const [email, setEmail] = useState(
    customerDetails.email || currentSession?.email || '',
  );
  const [phone, setPhone] = useState(customerDetails.phone);

  const consentTemplates = useMemo(
    () => getConsentTemplatesFromItem(selectedItem),
    [selectedItem],
  );

  useEffect(() => {
    if (!customerDetails.email && currentSession?.email) {
      setEmail(currentSession.email);
      dispatch(setCustomerDetails({ email: currentSession.email }));
    }
  }, [currentSession?.email, customerDetails.email, dispatch]);

  const handleContinue = () => {
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();

    if (normalizedName.length < 2) {
      Alert.alert('Check your name', 'Enter the customer full name.');
      return;
    }

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      Alert.alert('Check your email', 'Enter a valid email address.');
      return;
    }

    if (normalizedPhone.length < 7) {
      Alert.alert('Check your phone', 'Enter a valid phone number.');
      return;
    }

    dispatch(
      setCustomerDetails({
        name: normalizedName,
        email: normalizedEmail,
        phone: normalizedPhone,
      }),
    );

    navigation.navigate(consentTemplates.length > 0 ? 'ConsentForm' : 'PaymentSummary');
  };

  return (
    <BookingLayout
      step={4}
      stepTitle="Customer Details"
      onBackPress={() => navigation.goBack()}
      onForwardPress={handleContinue}
      forwardLabel={consentTemplates.length > 0 ? 'Continue to Consent' : 'Continue to Summary'}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.canvas}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.introTitle}>Who is this appointment for?</Text>
          <Text style={styles.introText}>
            Enter the customer details for this booking. Placeholder text is only an example.
          </Text>

          <Field
            label="Full name"
            value={name}
            onChangeText={setName}
            placeholder="Emily Carter"
            autoCapitalize="words"
          />

          <Field
            label="Email address"
            value={email}
            onChangeText={setEmail}
            placeholder="emily.carter@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!currentSession?.email}
          />

          <Field
            label="Phone number"
            value={phone}
            onChangeText={setPhone}
            placeholder="+1 (555) 014-7821"
            keyboardType="phone-pad"
          />

          <View style={styles.noticeBox}>
            <Text style={styles.noticeTitle}>Booking protection</Text>
            <Text style={styles.noticeText}>
              Your appointment is created only after you confirm the final summary.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </BookingLayout>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize = 'none',
  editable = true,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  editable?: boolean;
}) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, !editable && styles.inputDisabled]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={PLACEHOLDER_COLOR}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        editable={editable}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  canvas: {
    flex: 1,
    backgroundColor: Theme.colors.softIvory,
  },
  content: {
    padding: Theme.spacing.m,
  },
  introTitle: {
    fontFamily: Theme.fonts.semibold,
    fontSize: 22,
    color: Theme.colors.textPrimary,
    marginBottom: 8,
  },
  introText: {
    fontFamily: Theme.fonts.regular,
    fontSize: 14,
    color: Theme.colors.textSecondary,
    lineHeight: 21,
    marginBottom: Theme.spacing.l,
  },
  fieldBlock: {
    marginBottom: Theme.spacing.s,
  },
  label: {
    fontFamily: Theme.fonts.bold,
    fontSize: 10,
    color: Theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.3,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    paddingHorizontal: Theme.spacing.s,
    paddingVertical: 16,
    fontFamily: Theme.fonts.regular,
    fontSize: 15,
    color: Theme.colors.textPrimary,
  },
  inputDisabled: {
    backgroundColor: Theme.colors.warmStone,
    color: Theme.colors.textSecondary,
  },
  noticeBox: {
    borderWidth: 1,
    borderColor: Theme.colors.warmStone,
    backgroundColor: Theme.colors.white,
    padding: Theme.spacing.s,
    marginTop: Theme.spacing.s,
  },
  noticeTitle: {
    fontFamily: Theme.fonts.semibold,
    fontSize: 14,
    color: Theme.colors.textPrimary,
    marginBottom: 4,
  },
  noticeText: {
    fontFamily: Theme.fonts.regular,
    fontSize: 13,
    lineHeight: 19,
    color: Theme.colors.textSecondary,
  },
});
