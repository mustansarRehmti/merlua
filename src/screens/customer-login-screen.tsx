import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../navigation/types';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearAuthError, requestCustomerOtp } from '../features/auth/auth.slice';
import {
  selectCustomerAuthError,
  selectOtpRequestStatus,
} from '../features/auth/auth.selectors';
import { selectActiveTenantSlug } from '../features/tenant/tenant.selectors';
import { Theme } from '../theme/theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'CustomerLogin'>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CustomerLoginScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const activeSlug = useAppSelector(selectActiveTenantSlug);
  const requestStatus = useAppSelector(selectOtpRequestStatus);
  const authError = useAppSelector(selectCustomerAuthError);

  const [email, setEmail] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const isSubmitting = requestStatus === 'loading';

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const handleContinue = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!activeSlug) {
      Alert.alert('Salon required', 'Choose a salon before continuing.');
      navigation.goBack();
      return;
    }

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      Alert.alert('Check your email', 'Enter a valid email address.');
      return;
    }

    const result = await dispatch(requestCustomerOtp({ email: normalizedEmail }));

    if (requestCustomerOtp.fulfilled.match(result)) {
      navigation.navigate('CustomerOtpVerification', {
        email: result.payload.email,
        session: result.payload.session,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.brand}>MERLUA</Text>
          <Text style={styles.title}>Book Your Appointment</Text>
          <Text style={styles.subtitle}>
            Enter your email address. We will send you a one-time verification code.
          </Text>

          <View style={styles.form}>
            <Text style={styles.label}>Email address</Text>

            <TextInput
              accessibilityLabel="Email address"
              style={[styles.input, isFocused && styles.inputFocused]}
              placeholder="you@example.com"
              placeholderTextColor="#8E8A80"
              value={email}
              onChangeText={value => {
                setEmail(value);
                if (authError) dispatch(clearAuthError());
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              editable={!isSubmitting}
              returnKeyType="send"
              onSubmitEditing={handleContinue}
            />

            {authError && <Text style={styles.errorText}>{authError.message}</Text>}

            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Send verification code"
              style={[
                styles.primaryButton,
                (!email.trim() || isSubmitting) && styles.primaryButtonDisabled,
              ]}
              onPress={handleContinue}
              disabled={!email.trim() || isSubmitting}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>
                {isSubmitting ? 'Sending Code...' : 'Send Verification Code'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Choose a different salon"
              style={styles.secondaryButton}
              onPress={() => navigation.goBack()}
              disabled={isSubmitting}
            >
              <Text style={styles.secondaryButtonText}>Choose a Different Salon</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: Theme.colors.softIvory },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Theme.spacing.m,
  },
  brand: {
    fontFamily: Theme.fonts.bold,
    fontSize: 20,
    color: Theme.colors.luxuryBlack,
    letterSpacing: 7,
    marginBottom: Theme.spacing.l,
  },
  title: {
    fontFamily: Theme.fonts.semibold,
    fontSize: 30,
    color: Theme.colors.luxuryBlack,
  },
  subtitle: {
    fontFamily: Theme.fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    color: Theme.colors.textSecondary,
    marginTop: 12,
  },
  form: { marginTop: Theme.spacing.xl },
  label: {
    fontFamily: Theme.fonts.semibold,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: Theme.colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    paddingHorizontal: Theme.spacing.s,
    paddingVertical: 16,
    fontSize: 15,
    color: Theme.colors.textPrimary,
    fontFamily: Theme.fonts.regular,
  },
  inputFocused: { borderColor: Theme.colors.luxuryBlack },
  errorText: {
    color: '#BA1A1A',
    fontFamily: Theme.fonts.regular,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 10,
  },
  primaryButton: {
    backgroundColor: Theme.colors.luxuryBlack,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Theme.spacing.l,
  },
  primaryButtonDisabled: { opacity: 0.5 },
  primaryButtonText: {
    fontFamily: Theme.fonts.bold,
    color: Theme.colors.softIvory,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: Theme.spacing.s,
  },
  secondaryButtonText: {
    color: Theme.colors.luxuryBlack,
    fontFamily: Theme.fonts.semibold,
    fontSize: 13,
    textDecorationLine: 'underline',
  },
});
