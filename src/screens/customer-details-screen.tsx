/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { BookingLayout } from '../components/booking-layout';
import { Theme } from '../theme/theme';

export function CustomerDetailsScreen({ navigation, route }: any) {
  const historicalRemarks = route?.params?.remarks || '';

  // Form Field States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Better email validation regex
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Form Validation: Fixed validation logic
  const isFormValid = fullName.trim().length > 1 && 
                      isValidEmail(email) &&
                      phone.trim().length >= 8;

  const handleProceedToPayment = () => {
    if (!isFormValid || isProcessing) return;

    setIsProcessing(true);

    // Simulate Stripe payment gateway latency
    setTimeout(() => {
      setIsProcessing(false);
      
      // Navigate forward and pass the customer data including historical remarks
      navigation.reset({
        index: 0,
        routes: [{ 
          name: 'AppointmentsDashboard',
          params: {
            customerData: {
              fullName,
              email,
              phone,
              historicalRemarks
            }
          }
        }],
      });
    }, 1800);
  };

  return (
    <BookingLayout
      step={5}
      stepTitle="Customer Details"
      onBackPress={() => navigation.goBack()}
      onForwardPress={undefined} 
    >
      <ScrollView 
        style={styles.scrollCanvas} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionLabelHeader}>Intake Questionnaire Form</Text>
        
        {/* Show historical remarks if they exist */}
        {historicalRemarks ? (
          <View style={styles.remarksContainer}>
            <Text style={styles.remarksTitle}>Previous Remarks</Text>
            <Text style={styles.remarksText}>{historicalRemarks}</Text>
          </View>
        ) : null}
        
        <View style={styles.formContainerWrapper}>
          
          {/* 1. FULL NAME FIELD */}
          <View style={styles.inputStackFieldCell}>
            <Text style={[styles.fieldLabelLabel, focusedField === 'name' && styles.fieldLabelActive]}>
              Full Name <Text style={styles.asteriskIndicator}>*</Text>
            </Text>
            <TextInput
              style={[styles.textInputFieldFrame, focusedField === 'name' && styles.textInputFieldFrameFocused]}
              placeholder="e.g. Alexander Wright"
              placeholderTextColor="#8E8A80"
              value={fullName}
              onChangeText={setFullName}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              autoCapitalize="words"
              autoCorrect={false}
              editable={!isProcessing}
            />
          </View>

          {/* 2. EMAIL ADDRESS FIELD */}
          <View style={styles.inputStackFieldCell}>
            <Text style={[styles.fieldLabelLabel, focusedField === 'email' && styles.fieldLabelActive]}>
              Email Address <Text style={styles.asteriskIndicator}>*</Text>
            </Text>
            <TextInput
              style={[styles.textInputFieldFrame, focusedField === 'email' && styles.textInputFieldFrameFocused]}
              placeholder="alexander@merlua.com"
              placeholderTextColor="#8E8A80"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isProcessing}
            />
          </View>

          {/* 3. PHONE NUMBER FIELD */}
          <View style={styles.inputStackFieldCell}>
            <Text style={[styles.fieldLabelLabel, focusedField === 'phone' && styles.fieldLabelActive]}>
              Phone Number <Text style={styles.asteriskIndicator}>*</Text>
            </Text>
            <TextInput
              style={[styles.textInputFieldFrame, focusedField === 'phone' && styles.textInputFieldFrameFocused]}
              placeholder="+1 (555) 019-2834"
              placeholderTextColor="#8E8A80"
              value={phone}
              onChangeText={setPhone}
              onFocus={() => setFocusedField('phone')}
              onBlur={() => setFocusedField(null)}
              keyboardType="phone-pad"
              editable={!isProcessing}
            />
          </View>

          {/* 4. EXPLICIT PROCEED TO PAY INTERACTIVE BUTTON */}
          <TouchableOpacity
            style={[
              styles.payActionButton,
              (!isFormValid || isProcessing) && styles.payActionButtonDisabled
            ]}
            disabled={!isFormValid || isProcessing}
            onPress={handleProceedToPayment}
            activeOpacity={0.9}
          >
            {isProcessing ? (
              <View style={styles.loadingButtonContent}>
                <ActivityIndicator size="small" color={Theme.colors.softIvory} />
                <Text style={styles.payActionButtonText}>Authorizing Securely...</Text>
              </View>
            ) : (
              <Text style={styles.payActionButtonText}>Proceed to Pay ($400.00)</Text>
            )}
          </TouchableOpacity>

        </View>

        {/* SECURITY & ENCRYPTION DISCLOSURE */}
        <View style={styles.securityEncryptionNoticeCard}>
          <Text style={styles.lockVectorIcon}>✧</Text>
          <View style={styles.noticeTextStack}>
            <Text style={styles.noticeMainTitle}>Encrypted Stripe Payment Terminal</Text>
            <Text style={styles.noticeBodyDescription}>
              Connection paths route securely through AES-256 merchant encryption standards. Booking states update instantaneously in client dashboard archives upon clearing verification metrics.
            </Text>
          </View>
        </View>

        <View style={styles.layoutBottomBuffer} />
      </ScrollView>
    </BookingLayout>
  );
}

const styles = StyleSheet.create({
  scrollCanvas: { 
    flex: 1, 
    backgroundColor: Theme.colors.softIvory 
  },
  sectionLabelHeader: { 
    fontFamily: Theme.fonts.bold, 
    fontSize: 11, 
    textTransform: 'uppercase', 
    letterSpacing: 2, 
    color: Theme.colors.textSecondary, 
    marginLeft: Theme.spacing.m, 
    marginTop: Theme.spacing.m, 
    marginBottom: Theme.spacing.s 
  },
  remarksContainer: {
    marginHorizontal: Theme.spacing.m,
    marginBottom: Theme.spacing.m,
    padding: Theme.spacing.s,
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  remarksTitle: {
    fontFamily: Theme.fonts.bold,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: Theme.colors.textSecondary,
    marginBottom: 4,
  },
  remarksText: {
    fontFamily: Theme.fonts.regular,
    fontSize: 14,
    color: Theme.colors.textPrimary,
    lineHeight: 20,
  },
  formContainerWrapper: { 
    paddingHorizontal: Theme.spacing.m 
  },
  inputStackFieldCell: { 
    marginBottom: 20 
  },
  fieldLabelLabel: { 
    fontFamily: Theme.fonts.semibold, 
    fontSize: 11, 
    textTransform: 'uppercase', 
    letterSpacing: 1, 
    color: Theme.colors.textSecondary, 
    marginBottom: 8 
  },
  fieldLabelActive: { 
    color: Theme.colors.luxuryBlack 
  },
  asteriskIndicator: { 
    color: Theme.colors.luxuryBlack 
  },
  textInputFieldFrame: { 
    backgroundColor: Theme.colors.white, 
    borderWidth: 1, 
    borderColor: Theme.colors.border, 
    paddingHorizontal: Theme.spacing.s, 
    paddingVertical: 16, 
    fontSize: 14, 
    color: Theme.colors.textPrimary, 
    fontFamily: Theme.fonts.regular, 
    borderRadius: 0 
  },
  textInputFieldFrameFocused: { 
    borderColor: Theme.colors.luxuryBlack, 
    backgroundColor: Theme.colors.white 
  },
  payActionButton: {
    backgroundColor: Theme.colors.luxuryBlack,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Theme.spacing.xs,
    marginBottom: Theme.spacing.m,
    borderRadius: 0
  },
  payActionButtonDisabled: {
    backgroundColor: Theme.colors.border,
    opacity: 0.5
  },
  payActionButtonText: {
    fontFamily: Theme.fonts.bold,
    color: Theme.colors.softIvory,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 2
  },
  loadingButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  securityEncryptionNoticeCard: { 
    flexDirection: 'row', 
    marginHorizontal: Theme.spacing.m, 
    marginTop: Theme.spacing.xs, 
    padding: Theme.spacing.s, 
    backgroundColor: Theme.colors.white, 
    borderWidth: 1, 
    borderColor: Theme.colors.border, 
    alignItems: 'flex-start' 
  },
  lockVectorIcon: { 
    fontSize: 18, 
    color: Theme.colors.luxuryBlack, 
    marginRight: 12, 
    fontFamily: Theme.fonts.bold, 
    lineHeight: 20 
  },
  noticeTextStack: { 
    flex: 1 
  },
  noticeMainTitle: { 
    fontFamily: Theme.fonts.bold, 
    fontSize: 11, 
    textTransform: 'uppercase', 
    letterSpacing: 1, 
    color: Theme.colors.textPrimary, 
    marginBottom: 4 
  },
  noticeBodyDescription: { 
    fontFamily: Theme.fonts.regular, 
    fontSize: 12, 
    color: Theme.colors.textSecondary, 
    lineHeight: 18 
  },
  layoutBottomBuffer: { 
    height: Theme.spacing.xl 
  }
});