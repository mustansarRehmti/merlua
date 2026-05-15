import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Theme } from '../theme/theme';
import { PrimaryButton } from '../components/Button';
import { Input } from '../components/Input';
export function RegisterScreen({ navigation }: any) {

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Membership Application</Text>
        <Text style={styles.subtitle}>Join an exclusive community of elite beauty specialists.</Text>

        <View style={styles.form}>
          <Input label="Legal Name" placeholder="Mustansar Rehmati" />
          <Input label="Studio / Brand Name" placeholder="Luxe Aesthetics" />
          <Input label="Professional Email" placeholder="name@studio.com" />
          <Input label="Portfolio / Instagram" placeholder="@yourhandle" />
          <Input label="Create Password" placeholder="••••••••" secureTextEntry />

          <PrimaryButton 
            label="Submit for Review" 
            style={{ marginTop: 40 }}
            onPress={() => navigation.navigate('Verification', { email: 'name@studio.com' })} 
          />
        </View>

        <Text style={styles.loginLink} onPress={() => navigation.goBack()}>
          Existing member? <Text style={styles.bold}>Enter Studio</Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.softIvory },
  content: { padding: Theme.spacing.m, paddingVertical: 60 },
  title: { fontFamily: Theme.fonts.bold, fontSize: 32, color: Theme.colors.luxuryBlack, letterSpacing: -0.5 },
  subtitle: { fontFamily: Theme.fonts.regular, fontSize: 17, color: Theme.colors.textSecondary, marginTop: 12, lineHeight: 24 },
  form: { marginTop: 48 },
  loginLink: { marginTop: 48, textAlign: 'center', fontFamily: Theme.fonts.regular, color: Theme.colors.textSecondary, fontSize: 15 },
  bold: { fontFamily: Theme.fonts.bold, color: Theme.colors.luxuryBlack, textDecorationLine: 'underline' }
});