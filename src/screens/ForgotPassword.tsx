import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { Theme } from '../theme/theme';
import { PrimaryButton } from '../components/Button';

export function ForgotPasswordScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Recovery</Text>
        <Text style={styles.subtitle}>
          Enter your professional email to receive a secure access link.
        </Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Registered Email</Text>
            <TextInput 
              style={styles.input}
              placeholder="studio@merlua.com"
              placeholderTextColor="#A0A0A0"
              autoCapitalize="none"
            />
          </View>

          <PrimaryButton 
            label="Send Access Link" 
            onPress={() => navigation.navigate('Verification', { email: 'user@merlua.com' })} 
          />

          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>Return to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.softIvory },
  content: { padding: Theme.spacing.m, flex: 1, justifyContent: 'center' },
  title: { 
    fontFamily: Theme.fonts.bold, 
    fontSize: 32, 
    color: Theme.colors.luxuryBlack, 
    letterSpacing: -0.5 
  },
  subtitle: { 
    fontFamily: Theme.fonts.regular, 
    fontSize: 18, 
    color: Theme.colors.textSecondary, 
    marginTop: 12,
    lineHeight: 26 
  },
  form: { marginTop: 60 },
  inputGroup: { marginBottom: 48 },
  label: { 
    fontFamily: Theme.fonts.medium, 
    fontSize: 10, 
    textTransform: 'uppercase', 
    letterSpacing: 2, 
    color: Theme.colors.textSecondary,
    marginBottom: 8
  },
  input: { 
    borderBottomWidth: 1, 
    borderColor: Theme.colors.luxuryBlack,
    paddingVertical: 12,
    fontSize: 18,
    fontFamily: Theme.fonts.regular,
    color: Theme.colors.luxuryBlack
  },
  backButton: { marginTop: 32, alignItems: 'center' },
  backText: { 
    fontFamily: Theme.fonts.semibold, 
    fontSize: 12, 
    textTransform: 'uppercase', 
    color: Theme.colors.luxuryBlack,
    letterSpacing: 1
  }
});