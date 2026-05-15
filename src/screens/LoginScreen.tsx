import React, { useState } from 'react';
import { 
  View, Text, TextInput, StyleSheet, SafeAreaView, 
  ScrollView, TouchableOpacity, KeyboardAvoidingView, 
  Platform, 
} from 'react-native';
import Animated, { FadeInDown, FadeInUp, Layout } from 'react-native-reanimated';
import { Theme } from '../theme/theme';
import { PrimaryButton } from '../components/Button';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;
type AuthMethod = 'password' | 'magicLink';

export function LoginScreen({ navigation }: Props) {
  const [authMethod, setAuthMethod] = useState<AuthMethod>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFocused, setIsFocused] = useState<string | null>(null);

  

  const entranceDelay = 100;

 const handlePrimaryAction = () => {
    if (authMethod === 'password') {
      // This will now smoothly switch stacks without breaking!
      navigation.replace('BookingFlow');
    } else {
      navigation.navigate('MagicLinkCheck', { email: email || 'studio@merlua.com' });
    }
  };

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

          {/* Inline Auth Method Toggle Selector */}
          <Animated.View 
            entering={FadeInDown.delay(entranceDelay + 100).duration(800)}
            style={styles.selectorContainer}
          >
            <TouchableOpacity 
              style={[styles.selectorTab, authMethod === 'password' && styles.selectorTabActive]}
              onPress={() => setAuthMethod('password')}
            >
              <Text style={[styles.selectorText, authMethod === 'password' && styles.selectorTextActive]}>
                Security Key
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.selectorTab, authMethod === 'magicLink' && styles.selectorTabActive]}
              onPress={() => setAuthMethod('magicLink')}
            >
              <Text style={[styles.selectorText, authMethod === 'magicLink' && styles.selectorTextActive]}>
                Magic Link
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* 2. Unified Input Section Layout */}
          <Animated.View 
            layout={Layout.springify()}
            entering={FadeInUp.delay(entranceDelay + 200).duration(800)}
            style={styles.form}
          >
            {/* Shared Email Field */}
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

            {/* Contextual Password Field Container */}
            {authMethod === 'password' && (
              <Animated.View entering={FadeInUp.duration(400)}>
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
                  onPress={() => navigation.navigate('forgot', { email })}
                  style={styles.forgotPasswordContainer}
                >
                  <Text style={styles.forgotPassword}>Forgot password?</Text>
                </TouchableOpacity>
              </Animated.View>
            )}

            {authMethod === 'magicLink' && (
              <Animated.View entering={FadeInUp.duration(400)} style={styles.magicLinkMessageContainer}>
                <Text style={styles.magicLinkDescription}>
                  We will issue a unique code connection framework to verification servers. No password keys required.
                </Text>
              </Animated.View>
            )}

            {/* Main Action Call to Action Button */}
            <View style={styles.buttonContainer}>
              <PrimaryButton 
                label={authMethod === 'password' ? "Access Platform" : "Send Magic Link"} 
                onPress={handlePrimaryAction} 
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
    marginBottom: 40, 
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
  selectorContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#D1CDDA',
    marginBottom: 32,
  },
  selectorTab: {
    paddingVertical: 12,
    marginRight: 24,
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  selectorTabActive: {
    borderColor: Theme.colors.luxuryBlack,
  },
  selectorText: {
    fontFamily: Theme.fonts.medium,
    fontSize: 14,
    color: '#626262',
    letterSpacing: 0.5,
  },
  selectorTextActive: {
    color: Theme.colors.luxuryBlack,
    fontFamily: Theme.fonts.semibold,
  },
  form: { 
    marginTop: 0 
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
    borderColor: '#D1CDDA', 
    paddingVertical: 14,
    fontSize: 18,
    fontFamily: Theme.fonts.regular,
    color: Theme.colors.luxuryBlack
  },
  inputFocused: {
    borderColor: Theme.colors.luxuryBlack, 
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
  magicLinkMessageContainer: {
    marginBottom: 40,
    paddingVertical: 4,
  },
  magicLinkDescription: {
    fontFamily: Theme.fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    color: Theme.colors.textSecondary,
  },
  buttonContainer: { 
    marginTop: Theme.spacing.m 
  },
  footer: { 
    marginTop: 64, 
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
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