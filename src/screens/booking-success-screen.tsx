import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BookingStackParamList } from '../navigation/types';
import { useAppDispatch } from '../app/hooks';
import { clearBookingDraft } from '../features/booking/booking-draft.slice';
import { resetBookingSubmit } from '../features/booking-submit/booking-submit.slice';
import { Theme } from '../theme/theme';

type Props = NativeStackScreenProps<BookingStackParamList, 'BookingSuccess'>;

export function BookingSuccessScreen({ navigation, route }: Props) {
  const dispatch = useAppDispatch();

  const bookingGroupId = route.params?.bookingGroupId ?? null;
  const appointmentIds = route.params?.appointmentIds ?? [];
  const clientSecret = route.params?.clientSecret ?? null;

  const goToAppointments = () => {
    dispatch(clearBookingDraft());
    dispatch(resetBookingSubmit());
    navigation.navigate('AppointmentsDashboard');
  };

  const bookAnother = () => {
    dispatch(clearBookingDraft());
    dispatch(resetBookingSubmit());
    navigation.navigate('SelectService');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.content}>
        <View style={styles.successMark}>
          <Text style={styles.successMarkText}>✓</Text>
        </View>

        <Text style={styles.title}>Booking Created</Text>
        <Text style={styles.subtitle}>
          Your appointment has been created. Complete payment if your salon requires online payment.
        </Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Booking reference</Text>
          <Text style={styles.infoValue}>{bookingGroupId ?? 'Created'}</Text>

          {appointmentIds.length > 0 && (
            <>
              <View style={styles.divider} />
              <Text style={styles.infoLabel}>Appointments</Text>
              <Text style={styles.infoValue}>{appointmentIds.length}</Text>
            </>
          )}

          {clientSecret && (
            <>
              <View style={styles.divider} />
              <Text style={styles.infoLabel}>Payment session</Text>
              <Text style={styles.infoValue}>Ready for Stripe</Text>
            </>
          )}
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={goToAppointments}>
          <Text style={styles.primaryButtonText}>View My Appointments</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={bookAnother}>
          <Text style={styles.secondaryButtonText}>Book Another Service</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.softIvory,
  },
  content: {
    flex: 1,
    padding: Theme.spacing.m,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successMark: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: Theme.colors.luxuryBlack,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.l,
  },
  successMarkText: {
    fontFamily: Theme.fonts.bold,
    fontSize: 42,
    color: Theme.colors.softIvory,
  },
  title: {
    fontFamily: Theme.fonts.semibold,
    fontSize: 28,
    color: Theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: Theme.fonts.regular,
    fontSize: 15,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: Theme.spacing.l,
  },
  infoCard: {
    width: '100%',
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    padding: Theme.spacing.s,
    marginBottom: Theme.spacing.l,
  },
  infoLabel: {
    fontFamily: Theme.fonts.bold,
    fontSize: 10,
    color: Theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: Theme.fonts.semibold,
    fontSize: 15,
    color: Theme.colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Theme.colors.warmStone,
    marginVertical: Theme.spacing.s,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: Theme.colors.luxuryBlack,
    paddingVertical: 18,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontFamily: Theme.fonts.bold,
    fontSize: 13,
    color: Theme.colors.softIvory,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
  },
  secondaryButton: {
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: Theme.spacing.xs,
  },
  secondaryButtonText: {
    fontFamily: Theme.fonts.semibold,
    fontSize: 13,
    color: Theme.colors.textPrimary,
    textDecorationLine: 'underline',
  },
});
