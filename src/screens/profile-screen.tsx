import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../theme/theme';

export function ProfileScreen({ navigation }: any) {
  const [fullName, setFullName] = useState('Mustansar Rehmati');
  const [email] = useState('mustansar@lamstan.com'); 
  const [phone, setPhone] = useState('+92 300 1234567');

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const hasChanges = fullName.trim().length > 1 && phone.trim().length >= 8;

  const handleUpdateProfile = () => {
    if (!hasChanges || isUpdating) return;
    setIsUpdating(true);

    setTimeout(() => {
      setIsUpdating(false);
      Alert.alert(
        "Identity Synchronized",
        "Your local account parameters have updated successfully across secure node configurations."
      );
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.canvasFrame} edges={['top', 'left', 'right']}>
      
      {/* Editorial Minimalist Profile Navigation Top Bar Header */}
      <View style={styles.profileHeaderView}>
        <View style={styles.headerTextStack}>
          <Text style={styles.brandSubtitle}>ACCOUNT CONTROL PANEL</Text>
          <Text style={styles.screenMainHeading}>My Profile</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.closeVectorTouchArea} 
          onPress={() => navigation.navigate('SelectService')}
          activeOpacity={0.7}
        >
          <Text style={styles.closeVectorIconText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.profileScrollCanvas} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* PREMIUM APPOINTMENTS GATEWAY INTERACTIVE CARD BLOCK */}
        <Text style={styles.sectionLabelHeader}>Your Schedule</Text>
        <TouchableOpacity 
          style={styles.appointmentsDashboardActionCard}
          onPress={() => navigation.navigate('AppointmentsDashboard')}
          activeOpacity={0.85}
        >
          <View style={styles.dashboardCardContent}>
            <Text style={styles.dashboardCardEmoji}>📅</Text>
            <View style={styles.dashboardCardTextWrapper}>
              <Text style={styles.dashboardCardMainTitle}>Track Active Reservations</Text>
              <Text style={styles.dashboardCardSubTitle}>View, manage, or reschedule ongoing studio sessions</Text>
            </View>
          </View>
          <Text style={styles.dashboardCardArrow}>➔</Text>
        </TouchableOpacity>

        <Text style={[styles.sectionLabelHeader, { marginTop: Theme.spacing.m }]}>Personal Credentials</Text>
        
        <View style={styles.formContainerWrapper}>
          
          {/* 1. EDITABLE FULL NAME FIELD INPUT */}
          <View style={styles.inputStackFieldCell}>
            <Text style={[styles.fieldLabelLabel, focusedField === 'name' && styles.fieldLabelActive]}>
              Full Name
            </Text>
            <TextInput
              style={[styles.textInputFieldFrame, focusedField === 'name' && styles.textInputFieldFrameFocused]}
              placeholder="Full Name"
              placeholderTextColor="#8E8A80"
              value={fullName}
              onChangeText={setFullName}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              autoCapitalize="words"
              autoCorrect={false}
              editable={!isUpdating}
            />
          </View>

          {/* 2. READ-ONLY IMMUTABLE EMAIL FIELD BOX */}
          <View style={styles.inputStackFieldCell}>
            <Text style={styles.fieldLabelLabel}>
              Email Address <Text style={styles.immutableFlagText}>(Locked Parameter)</Text>
            </Text>
            <View style={[styles.textInputFieldFrame, styles.textInputFieldFrameDisabled]}>
              <Text style={styles.disabledValueText}>{email}</Text>
            </View>
          </View>

          {/* 3. EDITABLE PHONE NUMBER FIELD INPUT */}
          <View style={styles.inputStackFieldCell}>
            <Text style={[styles.fieldLabelLabel, focusedField === 'phone' && styles.fieldLabelActive]}>
              Phone Number
            </Text>
            <TextInput
              style={[styles.textInputFieldFrame, focusedField === 'phone' && styles.textInputFieldFrameFocused]}
              placeholder="Phone Number"
              placeholderTextColor="#8E8A80"
              value={phone}
              onChangeText={setPhone}
              onFocus={() => setFocusedField('phone')}
              onBlur={() => setFocusedField(null)}
              keyboardType="phone-pad"
              editable={!isUpdating}
            />
          </View>

          {/* PERSISTENT UPDATE SAVE TRIGGER CORE CTA */}
          <TouchableOpacity
            style={[
              styles.saveActionButton,
              (!hasChanges || isUpdating) && styles.saveActionButtonDisabled
            ]}
            disabled={!hasChanges || isUpdating}
            onPress={handleUpdateProfile}
            activeOpacity={0.9}
          >
            {isUpdating ? (
              <View style={styles.loadingButtonContent}>
                <ActivityIndicator size="small" color={Theme.colors.softIvory} />
                <Text style={styles.saveActionButtonText}>Updating Records...</Text>
              </View>
            ) : (
              <Text style={styles.saveActionButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>

        </View>

        {/* COMPLIANCE INFORMATION COMPONENT BOX FOOTER CARD */}
        <View style={styles.identityComplianceNoticeCard}>
          <Text style={styles.badgeIconVector}>✦</Text>
          <View style={styles.noticeTextStack}>
            <Text style={styles.noticeMainTitle}>Identity Protection Protocol</Text>
            <Text style={styles.noticeBodyDescription}>
              Changes submitted process live instantly across associated reservation nodes. Email parameters are locked to secure backend token verification workflows.
            </Text>
          </View>
        </View>

        <View style={styles.layoutBottomBuffer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  canvasFrame: { 
    flex: 1, 
    backgroundColor: Theme.colors.softIvory 
  },
  profileHeaderView: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: Theme.spacing.m, 
    paddingVertical: Theme.spacing.s, 
    backgroundColor: Theme.colors.softIvory, 
    borderBottomWidth: 1, 
    borderColor: Theme.colors.border 
  },
  headerTextStack: { 
    flex: 1 
  },
  brandSubtitle: { 
    fontFamily: Theme.fonts.bold, 
    fontSize: 10, 
    letterSpacing: 3, 
    color: Theme.colors.textSecondary 
  },
  screenMainHeading: { 
    fontFamily: Theme.fonts.semibold, 
    fontSize: 26, 
    color: Theme.colors.textPrimary, 
    textTransform: 'uppercase', 
    letterSpacing: 0.5, 
    marginTop: 2 
  },
  closeVectorTouchArea: { 
    width: 44, 
    height: 44, 
    backgroundColor: Theme.colors.white, 
    borderWidth: 1, 
    borderColor: Theme.colors.border, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  closeVectorIconText: { 
    fontSize: 16, 
    color: Theme.colors.luxuryBlack, 
    fontFamily: Theme.fonts.bold 
  },
  profileScrollCanvas: { 
    flex: 1, 
    paddingHorizontal: Theme.spacing.m, 
    paddingTop: Theme.spacing.m 
  },
  sectionLabelHeader: { 
    fontFamily: Theme.fonts.bold, 
    fontSize: 11, 
    textTransform: 'uppercase', 
    letterSpacing: 2, 
    color: Theme.colors.textSecondary, 
    marginBottom: Theme.spacing.s 
  },
  appointmentsDashboardActionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Theme.colors.luxuryBlack,
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: Theme.colors.luxuryBlack,
    borderRadius: 0,
    marginBottom: 12
  },
  dashboardCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8
  },
  dashboardCardEmoji: {
    fontSize: 20,
    marginRight: 14
  },
  dashboardCardTextWrapper: {
    flex: 1
  },
  dashboardCardMainTitle: {
    fontFamily: Theme.fonts.bold,
    fontSize: 13,
    color: Theme.colors.softIvory,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  dashboardCardSubTitle: {
    fontFamily: Theme.fonts.regular,
    fontSize: 11,
    color: '#8E8A80',
    marginTop: 2,
    lineHeight: 14
  },
  dashboardCardArrow: {
    fontSize: 14,
    color: Theme.colors.softIvory,
    fontFamily: Theme.fonts.bold
  },
  formContainerWrapper: { 
    marginBottom: Theme.spacing.m 
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
  immutableFlagText: {
    fontFamily: Theme.fonts.regular,
    fontSize: 10,
    textTransform: 'none',
    letterSpacing: 0,
    color: '#BA1A1A'
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
  textInputFieldFrameDisabled: {
    backgroundColor: 'rgba(142,138,128,0.08)',
    justifyContent: 'center'
  },
  disabledValueText: {
    fontFamily: Theme.fonts.regular,
    fontSize: 14,
    color: Theme.colors.textSecondary
  },
  saveActionButton: {
    backgroundColor: Theme.colors.luxuryBlack,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Theme.spacing.s,
    borderRadius: 0
  },
  saveActionButtonDisabled: {
    backgroundColor: Theme.colors.border,
    opacity: 0.5
  },
  saveActionButtonText: {
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
  identityComplianceNoticeCard: { 
    flexDirection: 'row', 
    padding: Theme.spacing.s, 
    backgroundColor: Theme.colors.white, 
    borderWidth: 1, 
    borderColor: Theme.colors.border, 
    alignItems: 'flex-start' 
  },
  badgeIconVector: { 
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
    height: 60 
  }
});