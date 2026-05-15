import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Theme } from '../theme/theme';
import { PrimaryButton } from '../components/Button';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'MagicLinkCheck'>;

export function MagicLinkCheckScreen({ route, navigation }: Props) {
  const { email } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        <Animated.View entering={FadeInDown.duration(800)} style={styles.frame}>
          <Text style={styles.title}>Check your workspace inbox.</Text>
          <Text style={styles.subtitle}>
            We've sent a private access signature link to{' '}
            <Text style={styles.boldTarget}>{email}</Text>. Click the validation anchor inside the email layout to safely initialize this terminal interface.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(800)} style={styles.actions}>
          <PrimaryButton 
            label="Return to Studio Portal" 
            variant="outline"
            onPress={() => navigation.navigate('Login')} 
          />
          
          <TouchableOpacity 
            style={styles.resendAnchor}
            onPress={() => { /* Phase 2 trigger fallback UI animation if required */ }}
          >
            <Text style={styles.resendText}>Didn't receive the entry link? Try again</Text>
          </TouchableOpacity>
        </Animated.View>

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
    paddingHorizontal: Theme.spacing.m,
    justifyContent: 'center',
  },
  frame: {
    backgroundColor: Theme.colors.warmStone, // Secondary layout tone block contrast background frame
    padding: 32,
    borderRadius: 2,
    marginBottom: 40,
  },
  title: {
    fontFamily: Theme.fonts.bold,
    fontSize: 22,
    color: Theme.colors.luxuryBlack,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: Theme.fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    color: Theme.colors.luxuryBlack,
    opacity: 0.85,
  },
  boldTarget: {
    fontFamily: Theme.fonts.semibold,
    color: Theme.colors.luxuryBlack,
  },
  actions: {
    width: '100%',
    alignItems: 'center',
  },
  resendAnchor: {
    marginTop: 24,
    paddingVertical: 8,
  },
  resendText: {
    fontFamily: Theme.fonts.regular,
    fontSize: 14,
    color: Theme.colors.textSecondary,
    textDecorationLine: 'underline',
  },
});