/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTenant } from '../context/tenant-context';
import { Theme } from '../theme/theme';

export function TenantGatewayScreen({ navigation }: any) {
  const [slugInput, setSlugInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setTenant } = useTenant();

  const handleVerifyTenant = async () => {
    if (!slugInput.trim()) {
      Alert.alert("Input Required", "Please specify a tenant workspace domain identifier.");
      return;
    }

    setIsLoading(true);
    const sanitizedSlug = slugInput.toLowerCase().trim();

    try {
      // In a live production system, verify the slug against your system lookup node:
      // const response = await fetch(`https://your-api.com/api/v1/business/lookup/${sanitizedSlug}`);
      // const result = await response.json();
      
      // Simulating a network discovery verification check matching the API schemas
      setTimeout(() => {
        setIsLoading(false);
        
        // Mocking validation logic success state matches
        if (sanitizedSlug === 'merlua' || sanitizedSlug === 'heras-salon') { 
          const properName = sanitizedSlug === 'merlua' ? 'Merlua Beauty Salon' : "Hera's Nail Salon";
          
          // Persist tenant state parameters
          setTenant(sanitizedSlug, properName);
          
          // Safe navigation jump forward to localized onboarding auth grid
          navigation.navigate('Login', { tenantSlug: sanitizedSlug });
        } else {
          Alert.alert(
            "Workspace Matrix Unresolved", 
            "No active platform configuration coordinates matched this specific sub-tenant domain key mapping."
          );
        }
      }, 1000);

    } catch (error) {
      setIsLoading(false);
      Alert.alert("System Fault", "Network error encountered checking environment parameters.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerStack}>
        <Text style={styles.tagline}>FLEXCHANCE ECOSYSTEM ENTRY</Text>
        <Text style={styles.title}>Connect to Business</Text>
        <Text style={styles.description}>
          Enter the specific tenant workspace handle, brand index string, or custom slug to initialize your isolated environment workspace context layer.
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Business Handle / Slug</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="e.g. merlua or heras-salon"
            placeholderTextColor="#8E8A80"
            value={slugInput}
            onChangeText={setSlugInput}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />
          <Text style={styles.suffix}>.flexchance.com</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.actionBtn, !slugInput.trim() && styles.disabledBtn]}
        onPress={handleVerifyTenant}
        disabled={isLoading || !slugInput.trim()}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator color={Theme.colors.softIvory} size="small" />
        ) : (
          <Text style={styles.actionBtnText}>Initialize Session</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.softIvory, paddingHorizontal: Theme.spacing.m, justifyContent: 'center' },
  headerStack: { marginBottom: Theme.spacing.xl },
  tagline: { fontFamily: Theme.fonts.bold, fontSize: 10, letterSpacing: 2.5, color: Theme.colors.textSecondary },
  title: { fontFamily: Theme.fonts.semibold, fontSize: 32, color: Theme.colors.textPrimary, marginTop: Theme.spacing.xs, textTransform: 'uppercase' },
  description: { fontFamily: Theme.fonts.regular, fontSize: 14, color: Theme.colors.textSecondary, lineHeight: 22, marginTop: Theme.spacing.s },
  inputContainer: { marginBottom: Theme.spacing.l },
  inputLabel: { fontFamily: Theme.fonts.semibold, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: Theme.colors.textSecondary, marginBottom: 8 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: Theme.colors.white, borderWidth: 1, borderColor: Theme.colors.border },
  input: { flex: 1, paddingHorizontal: Theme.spacing.s, paddingVertical: 16, fontSize: 14, fontFamily: Theme.fonts.regular, color: Theme.colors.textPrimary },
  suffix: { paddingRight: Theme.spacing.s, color: Theme.colors.textSecondary, fontFamily: Theme.fonts.regular, fontSize: 13 },
  actionBtn: { backgroundColor: Theme.colors.luxuryBlack, paddingVertical: 18, alignItems: 'center', justifyContent: 'center' },
  disabledBtn: { opacity: 0.5 },
  actionBtnText: { fontFamily: Theme.fonts.bold, color: Theme.colors.softIvory, fontSize: 12, textTransform: 'uppercase', letterSpacing: 2 }
});