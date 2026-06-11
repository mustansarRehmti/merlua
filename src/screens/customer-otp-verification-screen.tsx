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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../navigation/types';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  clearAuthError,
  confirmCustomerOtp,
  requestCustomerOtp,
} from '../features/auth/auth.slice';
import {
  selectCustomerAuthError,
  selectOtpRequestStatus,
  selectOtpVerificationStatus,
} from '../features/auth/auth.selectors';
import { selectActiveTenantSlug } from '../features/tenant/tenant.selectors';
import { Theme } from '../theme/theme';

type Props = NativeStackScreenProps<
  AuthStackParamList,
  'CustomerOtpVerification'
>;

const OTP_LENGTH = 8;
const RESEND_COOLDOWN_SECONDS = 30;

export function CustomerOtpVerificationScreen({
  navigation,
  route,
}: Props) {
  const dispatch = useAppDispatch();
  const activeSlug = useAppSelector(selectActiveTenantSlug);
  const verificationStatus = useAppSelector(selectOtpVerificationStatus);
  const requestStatus = useAppSelector(selectOtpRequestStatus);
  const authError = useAppSelector(selectCustomerAuthError);

  const [code, setCode] = useState('');
  const [session, setSession] = useState(route.params.session);
  const [secondsUntilResend, setSecondsUntilResend] = useState(
    RESEND_COOLDOWN_SECONDS,
  );

  const isVerifying = verificationStatus === 'loading';
  const isResending = requestStatus === 'loading';

  useEffect(() => {
    if (secondsUntilResend <= 0) return;

    const timer = setInterval(() => {
      setSecondsUntilResend(previous => Math.max(previous - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsUntilResend]);

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const handleVerify = async () => {
    if (!activeSlug) {
      Alert.alert('Salon required', 'Choose a salon before continuing.');
      navigation.popToTop();
      return;
    }

    if (!new RegExp(`^\\d{${OTP_LENGTH}}$`).test(code)) {
      Alert.alert(
        'Check your code',
        `Enter the ${OTP_LENGTH}-digit code sent to your email.`,
      );
      return;
    }

    await dispatch(
      confirmCustomerOtp({
        email: route.params.email,
        session,
        code,
        slug: activeSlug,
      }),
    );
  };

  const handleResend = async () => {
    if (secondsUntilResend > 0 || isResending) return;

    const result = await dispatch(
      requestCustomerOtp({ email: route.params.email }),
    );

    if (requestCustomerOtp.fulfilled.match(result)) {
      setSession(result.payload.session);
      setCode('');
      setSecondsUntilResend(RESEND_COOLDOWN_SECONDS);

      Alert.alert(
        'Code sent',
        'A new verification code has been sent to your email.',
      );
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

          <Text style={styles.title}>Verify Your Email</Text>

          <Text style={styles.subtitle}>
            Enter the {OTP_LENGTH}-digit code sent to{' '}
            <Text style={styles.email}>{route.params.email}</Text>.
          </Text>

          <Text style={styles.label}>Verification code</Text>

          <TextInput
            accessibilityLabel={`${OTP_LENGTH}-digit verification code`}
            style={styles.codeInput}
            placeholder="00000000"
            placeholderTextColor="#8E8A80"
            value={code}
            onChangeText={value => {
              setCode(value.replace(/\D/g, '').slice(0, OTP_LENGTH));

              if (authError) {
                dispatch(clearAuthError());
              }
            }}
            keyboardType="number-pad"
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            maxLength={OTP_LENGTH}
            editable={!isVerifying}
            returnKeyType="done"
            onSubmitEditing={handleVerify}
          />

          {authError && (
            <Text style={styles.errorText}>{authError.message}</Text>
          )}

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Verify email and continue"
            style={[
              styles.primaryButton,
              (code.length !== OTP_LENGTH || isVerifying) &&
                styles.primaryButtonDisabled,
            ]}
            onPress={handleVerify}
            disabled={code.length !== OTP_LENGTH || isVerifying}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>
              {isVerifying ? 'Verifying...' : 'Verify and Continue'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Resend verification code"
            style={styles.secondaryButton}
            onPress={handleResend}
            disabled={secondsUntilResend > 0 || isResending}
          >
            <Text
              style={[
                styles.secondaryButtonText,
                (secondsUntilResend > 0 || isResending) &&
                  styles.secondaryButtonTextDisabled,
              ]}
            >
              {isResending
                ? 'Sending a new code...'
                : secondsUntilResend > 0
                  ? `Resend code in ${secondsUntilResend}s`
                  : 'Resend Code'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Change email address"
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
            disabled={isVerifying || isResending}
          >
            <Text style={styles.secondaryButtonText}>
              Change Email Address
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Theme.colors.softIvory,
  },
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
    marginBottom: Theme.spacing.xl,
  },
  email: {
    fontFamily: Theme.fonts.semibold,
    color: Theme.colors.textPrimary,
  },
  label: {
    fontFamily: Theme.fonts.semibold,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: Theme.colors.textSecondary,
    marginBottom: 8,
  },
  codeInput: {
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    paddingHorizontal: Theme.spacing.s,
    paddingVertical: 16,
    fontSize: 24,
    letterSpacing: 6,
    textAlign: 'center',
    color: Theme.colors.textPrimary,
    fontFamily: Theme.fonts.semibold,
  },
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
  primaryButtonDisabled: {
    opacity: 0.5,
  },
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
    marginTop: Theme.spacing.xs,
  },
  secondaryButtonText: {
    color: Theme.colors.luxuryBlack,
    fontFamily: Theme.fonts.semibold,
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  secondaryButtonTextDisabled: {
    color: Theme.colors.textSecondary,
    textDecorationLine: 'none',
  },
});
