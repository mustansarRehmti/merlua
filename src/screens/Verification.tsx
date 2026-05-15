/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Theme } from '../theme/theme';
import { PrimaryButton } from '../components/Button';
import { Input } from '../components/Input';

export function VerificationScreen({ route }: any) {
  const { email } = route.params || { email: 'your email' };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Final Step</Text>
        <Text style={styles.subtitle}>We’ve sent a private access code to {email}.</Text>

        <View style={styles.form}>
          <Input 
            label="Access Code" 
            placeholder="000000" 
            keyboardType="number-pad" 
            maxLength={6} 
            style={{ textAlign: 'center', letterSpacing: 10, fontSize: 24 }}
          />
          
          <PrimaryButton label="Activate Membership" onPress={() => {}} />
          
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive the code?</Text>
            <TouchableOpacity><Text style={styles.resendLink}> Request new code</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.softIvory },
  content: { padding: Theme.spacing.m, flex: 1, justifyContent: 'center' },
  title: { fontFamily: Theme.fonts.bold, fontSize: 32, color: Theme.colors.luxuryBlack },
  subtitle: { fontFamily: Theme.fonts.regular, fontSize: 17, color: Theme.colors.textSecondary, marginTop: 12, lineHeight: 24 },
  form: { marginTop: 60 },
  resendContainer: { marginTop: 32, alignItems: 'center' },
  resendText: { color: Theme.colors.textSecondary, fontFamily: Theme.fonts.regular },
  resendLink: { textDecorationLine: 'underline', color: Theme.colors.luxuryBlack, fontFamily: Theme.fonts.bold }
});