import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../navigation/types';
import { useAppDispatch } from '../app/hooks';
import { setTenant } from '../features/tenant/tenant.slice';
import {
  isValidTenantSlug,
  normalizeTenantSlug,
} from '../features/tenant/tenant.utils';
import { Theme } from '../theme/theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'TenantGateway'>;

export function TenantGatewayScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const [slugInput, setSlugInput] = useState('');

  const handleContinue = () => {
    const slug = normalizeTenantSlug(slugInput);

    if (!isValidTenantSlug(slug)) {
      Alert.alert(
        'Check the booking-page name',
        'Use lowercase letters, numbers, and hyphens only.',
      );
      return;
    }

    dispatch(setTenant({ slug }));
    navigation.navigate('CustomerLogin');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.headerStack}>
        <Text style={styles.tagline}>MERLUA CUSTOMER BOOKING</Text>
        <Text style={styles.title}>Find Your Salon</Text>
        <Text style={styles.description}>
          Enter the salon booking-page name to continue.
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Booking-page name</Text>

        <View style={styles.inputWrapper}>
          <Text style={styles.prefix}>merlua.com/book/</Text>

          <TextInput
            style={styles.input}
            placeholder="orbydev"
            placeholderTextColor="#8E8A80"
            value={slugInput}
            onChangeText={setSlugInput}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            returnKeyType="done"
            onSubmitEditing={handleContinue}
          />
        </View>
      </View>

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Continue to customer login"
        style={[
          styles.actionButton,
          !slugInput.trim() && styles.actionButtonDisabled,
        ]}
        onPress={handleContinue}
        disabled={!slugInput.trim()}
        activeOpacity={0.8}
      >
        <Text style={styles.actionButtonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.softIvory,
    paddingHorizontal: Theme.spacing.m,
    justifyContent: 'center',
  },
  headerStack: {
    marginBottom: Theme.spacing.xl,
  },
  tagline: {
    fontFamily: Theme.fonts.bold,
    fontSize: 10,
    letterSpacing: 2.5,
    color: Theme.colors.textSecondary,
  },
  title: {
    fontFamily: Theme.fonts.semibold,
    fontSize: 32,
    color: Theme.colors.textPrimary,
    marginTop: Theme.spacing.xs,
    textTransform: 'uppercase',
  },
  description: {
    fontFamily: Theme.fonts.regular,
    fontSize: 15,
    color: Theme.colors.textSecondary,
    lineHeight: 22,
    marginTop: Theme.spacing.s,
  },
  inputContainer: {
    marginBottom: Theme.spacing.l,
  },
  inputLabel: {
    fontFamily: Theme.fonts.semibold,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: Theme.colors.textSecondary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  prefix: {
    paddingLeft: Theme.spacing.s,
    color: Theme.colors.textSecondary,
    fontFamily: Theme.fonts.regular,
    fontSize: 13,
  },
  input: {
    flex: 1,
    paddingHorizontal: 4,
    paddingRight: Theme.spacing.s,
    paddingVertical: 16,
    fontSize: 14,
    fontFamily: Theme.fonts.regular,
    color: Theme.colors.textPrimary,
  },
  actionButton: {
    backgroundColor: Theme.colors.luxuryBlack,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionButtonText: {
    fontFamily: Theme.fonts.bold,
    color: Theme.colors.softIvory,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
