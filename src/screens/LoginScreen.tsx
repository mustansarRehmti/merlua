import React, { useState, useRef } from 'react';
import { 
  View, Text, TextInput, StyleSheet, SafeAreaView, 
  ScrollView, TouchableOpacity, KeyboardAvoidingView, 
  Platform, Keyboard 
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Theme } from '../theme/theme';
import { PrimaryButton } from '../components/Button';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFocused, setIsFocused] = useState<string | null>(null);

  // Animation constants for high-end feel
  const entranceDelay = 100;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* 1. Editorial Header */}
          <Animated.View 
            entering={FadeInDown.delay(entranceDelay).duration(800)}
            style={styles.header}
          >
            <Text style={styles.brandLogo}>MERLUA</Text>
            <Text style={styles.headline}>The Operating System for Beauty.</Text>
          </Animated.View>

          {/* 2. Input Section */}
          <Animated.View 
            entering={FadeInUp.delay(entranceDelay + 200).duration(800)}
            style={styles.form}
          >
            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={[
                styles.label, 
                isFocused === 'email' && { color: Theme.colors.luxuryBlack }
              ]}>
                Professional Email
              </Text>
              <TextInput 
                style={[
                  styles.input, 
                  isFocused === 'email' && styles.inputFocused
                ]}
                placeholder="studio@merlua.com"
                placeholderTextColor="#A0A0A0"
                autoCapitalize="none"
                keyboardType="email-address"
                onFocus={() => setIsFocused('email')}
                onBlur={() => setIsFocused(null)}
                onChangeText={setEmail}
                value={email}
              />
            </View>

            {/* Password Field */}
            <View style={styles.inputGroup}>
              <Text style={[
                styles.label, 
                isFocused === 'password' && { color: Theme.colors.luxuryBlack }
              ]}>
                Security Key
              </Text>
              <View style={styles.passwordWrapper}>
                <TextInput 
                  style={[
                    styles.input, 
                    { flex: 1 },
                    isFocused === 'password' && styles.inputFocused
                  ]}
                  placeholder="••••••••"
                  placeholderTextColor="#A0A0A0"
                  secureTextEntry
                  onFocus={() => setIsFocused('password')}
                  onBlur={() => setIsFocused(null)}
                  onChangeText={setPassword}
                  value={password}
                />
              </View>
            </View>

            {/* Recovery Link */}
            <TouchableOpacity 
              onPress={() => navigation.navigate('forgot')}
              style={styles.forgotPasswordContainer}
            >
              <Text style={styles.forgotPassword}>Forgot password?</Text>
            </TouchableOpacity>

            {/* Main Action */}
            <View style={styles.buttonContainer}>
              <PrimaryButton 
                label="Access Platform" 
                onPress={() => {
                  Keyboard.dismiss();
                  // Integration point for later
                }} 
              />
            </View>
          </Animated.View>

          {/* 3. Footer / Application Link */}
          <Animated.View 
            entering={FadeInUp.delay(entranceDelay + 400).duration(800)}
            style={styles.footer}
          >
            <Text style={styles.footerText}>Seeking an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.footerLink}> Apply for access</Text>
            </TouchableOpacity>
          </Animated.View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Theme.colors.softIvory 
  },
  scrollContent: { 
    padding: Theme.spacing.m, 
    flexGrow: 1, 
    justifyContent: 'center' 
  },
  header: { 
    marginBottom: 64, 
    alignItems: 'flex-start' 
  },
  brandLogo: { 
    fontFamily: Theme.fonts.bold, 
    fontSize: 24, 
    color: Theme.colors.luxuryBlack, 
    letterSpacing: 8,
    marginBottom: Theme.spacing.s 
  },
  headline: { 
    fontFamily: Theme.fonts.regular, 
    fontSize: 36, 
    lineHeight: 44,
    color: Theme.colors.luxuryBlack,
    maxWidth: '90%'
  },
  form: { 
    marginTop: Theme.spacing.l 
  },
  inputGroup: { 
    marginBottom: 32 
  },
  label: { 
    fontFamily: Theme.fonts.medium, 
    fontSize: 10, 
    textTransform: 'uppercase', 
    color: Theme.colors.textSecondary,
    letterSpacing: 2,
    marginBottom: 8
  },
  input: { 
    borderBottomWidth: 1.5, 
    borderColor: '#D1CDDA', // Muted initially
    paddingVertical: 14,
    fontSize: 18,
    fontFamily: Theme.fonts.regular,
    color: Theme.colors.luxuryBlack
  },
  inputFocused: {
    borderColor: Theme.colors.luxuryBlack, // Becomes bold on focus
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: -12,
    marginBottom: 48
  },
  forgotPassword: {
    fontFamily: Theme.fonts.regular,
    fontSize: 14,
    color: Theme.colors.textSecondary,
    textDecorationLine: 'underline'
  },
  buttonContainer: { 
    marginTop: Theme.spacing.m 
  },
  footer: { 
    marginTop: 64, 
    flexDirection: 'row',
    justifyContent: 'center' 
  },
  footerText: { 
    fontFamily: Theme.fonts.regular, 
    color: Theme.colors.textSecondary,
    fontSize: 15
  },
  footerLink: { 
    color: Theme.colors.luxuryBlack, 
    fontFamily: Theme.fonts.bold,
    fontSize: 15,
    textDecorationLine: 'underline'
  }
});