import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppointmentsList } from '../components/appointments-list';
import { Appointment } from '../components/appointment-card';
import { Theme } from '../theme/theme';

type TabStatus = 'UPCOMING' | 'HISTORY' | 'CANCELLED';

const INITIAL_DATA_SET: Appointment[] = [
  { id: 'apt-901', service: 'Editorial Precision Cut', provider: 'Elena Rostova', schedule: 'May 24, 2026 at 10:30 AM', price: '$120.00', category: 'UPCOMING' },
  { id: 'apt-902', service: 'Balayage & Soft Ivory Toning', provider: 'Marcus Vance', schedule: 'May 24, 2026 at 01:30 PM', price: '$280.00', category: 'UPCOMING' },
  { id: 'apt-781', service: 'Classic French Tip Overlays', provider: 'Sasha Dubois', schedule: 'April 12, 2026 at 03:00 PM', price: '$95.00', category: 'HISTORY' },
  { id: 'apt-612', service: 'Volume Lash Extensions Set', provider: 'Marcus Vance', schedule: 'Feb 19, 2026 at 11:00 AM', price: '$150.00', category: 'CANCELLED' }
];

export function AppointmentsDashboardScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<TabStatus>('UPCOMING');
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_DATA_SET);
  
  // Tracks selection mapping to determine if an individual item details sheet is active
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const filteredAppointments = appointments.filter(item => item.category === activeTab);

  const handleCancelAction = (id: string) => {
    Alert.alert(
      "Cancel Session Parameters",
      "Are you absolutely certain you want to release this reserved specialist time window allocation?",
      [
        { text: "Discard Request", style: "cancel" },
        { 
          text: "Confirm Cancellation", 
          style: "destructive",
          onPress: () => {
            setAppointments(prev => prev.map(item => 
              item.id === id ? { ...item, category: 'CANCELLED' as const } : item
            ));
            setSelectedAppointment(null); // Clear overlay on active cancellation parameters updates
          }
        }
      ]
    );
  };

  const handleRescheduleAction = (id: string) => {
    setSelectedAppointment(null);
    navigation.navigate('SelectSlot', { rescheduleAppointmentId: id });
  };

  // RENDER SELECTION SCREEN MODAL TARGET INTERFACE IF TRACK WAS SELECTED
  if (selectedAppointment) {
    const isUpcomingItem = selectedAppointment.category === 'UPCOMING';

    return (
      <SafeAreaView style={styles.canvasFrame} edges={['top', 'left', 'right', 'bottom']}>
        {/* PREMIUM MINIMALIST STRUCTURAL TOP NAV BAR ELEMENT */}
        <View style={styles.detailsHeaderStickyView}>
          <View style={styles.headerTextStack}>
            <Text style={styles.brandSubtitle}>TRANSACTION ARCHIVE</Text>
            <Text style={styles.screenMainHeading}>Appointment Details</Text>
          </View>
          
          {/* THE REQUESTED DISMISS BUTTON ACTION ELEMENT */}
          <TouchableOpacity 
            style={styles.closeVectorTouchArea} 
            onPress={() => setSelectedAppointment(null)}
            activeOpacity={0.7}
          >
            <Text style={styles.closeVectorIconText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.detailsContentCanvas} showsVerticalScrollIndicator={false}>
          
          {/* CORE TREATMENT STATE INFORMATION BILLBOARD ROW */}
          <View style={styles.billboardCardBanner}>
            <View style={styles.badgeRowWrapper}>
              <View style={[
                styles.detailsBadge,
                selectedAppointment.category === 'UPCOMING' && styles.badgeUpcoming,
                selectedAppointment.category === 'HISTORY' && styles.badgeHistory,
                selectedAppointment.category === 'CANCELLED' && styles.badgeCancelled,
              ]}>
                <Text style={styles.detailsBadgeText}>{selectedAppointment.category}</Text>
              </View>
              <Text style={styles.referenceIdStringLabel}>REF-{selectedAppointment.id.toUpperCase()}</Text>
            </View>
            
            <Text style={styles.detailsTreatmentHeaderTitle}>{selectedAppointment.service}</Text>
            <Text style={styles.detailsTotalPriceDisplay}>{selectedAppointment.price}</Text>
          </View>

          {/* ATTRIBUTE METADATA CONTAINER STACK FRAME */}
          <Text style={styles.sectionLabelHeader}>Allocation Parameters</Text>
          <View style={styles.metaDataGroupingBox}>
            <View style={styles.metaRowCell}>
              <Text style={styles.metaLabelPrefix}>Assigned Professional</Text>
              <Text style={styles.metaValueSuffix}>{selectedAppointment.provider}</Text>
            </View>
            
            <View style={styles.dividerLineBreak} />

            <View style={styles.metaRowCell}>
              <Text style={styles.metaLabelPrefix}>Scheduled Timeline Window</Text>
              <Text style={styles.metaValueSuffix}>{selectedAppointment.schedule}</Text>
            </View>

            <View style={styles.dividerLineBreak} />

            <View style={styles.metaRowCell}>
              <Text style={styles.metaLabelPrefix}>Merchant Routing Channel</Text>
              <Text style={styles.metaValueSuffix}>Stripe Encrypted Terminal</Text>
            </View>
          </View>

          {/* DYNAMIC OPERATION BUTTON FOOTER ELEMENT BOX ACTIONS */}
          {isUpcomingItem && (
            <View style={styles.detailsInteractiveActionWrapper}>
              <TouchableOpacity 
                style={styles.detailsPrimaryActionBtn}
                onPress={() => handleRescheduleAction(selectedAppointment.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.detailsPrimaryActionBtnText}>Reschedule Appointment</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.detailsSecondaryActionBtn}
                onPress={() => handleCancelAction(selectedAppointment.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.detailsSecondaryActionBtnText}>Cancel Booking</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.bottomBufferOffset} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // STANDARD LIST OVERVIEW VIEW CONTAINER SEGMENT DISPLAY TRACK
  return (
    <SafeAreaView style={styles.canvasFrame} edges={['top', 'left', 'right']}>
      <View style={styles.headerTitleContainer}>
        <View style={styles.dashboardTopHeaderRow}>
          <View>
            <Text style={styles.brandSubtitle}>MERLUA STUDIO</Text>
            <Text style={styles.screenMainHeading}>My Bookings</Text>
          </View>
          {/* Dashboard Close Back Button Redirect Route directly into Service Selection Page */}
          <TouchableOpacity 
            style={styles.dashboardXButton}
            onPress={() => navigation.navigate('SelectService')}
            activeOpacity={0.7}
          >
            <Text style={styles.dashboardXButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.segmentedTabWrapper}>
        {(['UPCOMING', 'HISTORY', 'CANCELLED'] as TabStatus[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButtonElement, activeTab === tab && styles.tabButtonElementActive]}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.9}
          >
            <Text style={[styles.tabButtonText, activeTab === tab && styles.tabButtonTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Passing interactive click callback updates out to update active visual focus layout layers */}
      <AppointmentsList
        data={filteredAppointments}
        onCancelItem={handleCancelAction}
        onRescheduleItem={handleRescheduleAction}
        onNavigateToBooking={() => navigation.navigate('SelectService')}
        // We override item navigation loops smoothly here
        onItemPress={(selectedItem: Appointment) => setSelectedAppointment(selectedItem)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  canvasFrame: { flex: 1, backgroundColor: Theme.colors.softIvory },
  headerTitleContainer: { paddingHorizontal: Theme.spacing.m, paddingTop: Theme.spacing.s, marginBottom: Theme.spacing.xs },
  dashboardTopHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brandSubtitle: { fontFamily: Theme.fonts.bold, fontSize: 10, letterSpacing: 3, color: Theme.colors.textSecondary },
  screenMainHeading: { fontFamily: Theme.fonts.semibold, fontSize: 26, color: Theme.colors.textPrimary, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 },
  dashboardXButton: { width: 40, height: 40, backgroundColor: Theme.colors.white, borderWidth: 1, borderColor: Theme.colors.border, alignItems: 'center', justifyContent: 'center' },
  dashboardXButtonText: { fontFamily: Theme.fonts.bold, fontSize: 14, color: Theme.colors.luxuryBlack },
  segmentedTabWrapper: { flexDirection: 'row', marginHorizontal: Theme.spacing.m, marginTop: Theme.spacing.s, borderWidth: 1, borderColor: Theme.colors.border, backgroundColor: Theme.colors.white },
  tabButtonElement: { flex: 1, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  tabButtonElementActive: { backgroundColor: Theme.colors.luxuryBlack },
  tabButtonText: { fontFamily: Theme.fonts.bold, fontSize: 11, color: Theme.colors.textSecondary, letterSpacing: 1 },
  tabButtonTextActive: { color: Theme.colors.softIvory },
  
  // High-Fidelity Custom Appointment Detail Screen Style Rules
  detailsHeaderStickyView: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Theme.spacing.m, paddingVertical: Theme.spacing.s, backgroundColor: Theme.colors.softIvory, borderBottomWidth: 1, borderColor: Theme.colors.border },
  headerTextStack: { flex: 1 },
  closeVectorTouchArea: { width: 44, height: 44, backgroundColor: Theme.colors.white, borderWidth: 1, borderColor: Theme.colors.border, alignItems: 'center', justifyContent: 'center', marginLeft: Theme.spacing.s },
  closeVectorIconText: { fontSize: 16, color: Theme.colors.luxuryBlack, fontFamily: Theme.fonts.bold },
  detailsContentCanvas: { flex: 1, paddingHorizontal: Theme.spacing.m, paddingTop: Theme.spacing.m },
  billboardCardBanner: { backgroundColor: Theme.colors.white, borderWidth: 1, borderColor: Theme.colors.border, padding: Theme.spacing.m, marginBottom: Theme.spacing.m },
  badgeRowWrapper: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Theme.spacing.s },
  detailsBadge: { paddingHorizontal: 10, paddingVertical: 5 },
  badgeUpcoming: { backgroundColor: 'rgba(15,15,15,0.06)' },
  badgeHistory: { backgroundColor: 'rgba(142,138,128,0.15)' },
  badgeCancelled: { backgroundColor: 'rgba(186,26,26,0.1)' },
  detailsBadgeText: { fontFamily: Theme.fonts.bold, fontSize: 9, letterSpacing: 0.5, color: Theme.colors.textPrimary },
  referenceIdStringLabel: { fontFamily: Theme.fonts.bold, fontSize: 11, color: Theme.colors.textSecondary, letterSpacing: 0.5 },
  detailsTreatmentHeaderTitle: { fontFamily: Theme.fonts.semibold, fontSize: 18, color: Theme.colors.textPrimary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  detailsTotalPriceDisplay: { fontFamily: Theme.fonts.bold, fontSize: 22, color: Theme.colors.textPrimary },
  sectionLabelHeader: { fontFamily: Theme.fonts.bold, fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, color: Theme.colors.textSecondary, marginBottom: Theme.spacing.xs },
  metaDataGroupingBox: { backgroundColor: Theme.colors.white, borderWidth: 1, borderColor: Theme.colors.border, padding: Theme.spacing.m, marginBottom: Theme.spacing.m },
  metaRowCell: { paddingVertical: 4 },
  metaLabelPrefix: { fontFamily: Theme.fonts.regular, fontSize: 12, color: Theme.colors.textSecondary, marginBottom: 4 },
  metaValueSuffix: { fontFamily: Theme.fonts.medium, fontSize: 14, color: Theme.colors.textPrimary },
  dividerLineBreak: { height: 0.5, backgroundColor: Theme.colors.warmStone, marginVertical: Theme.spacing.s },
  detailsInteractiveActionWrapper: { flexDirection: 'column', gap: Theme.spacing.xs, marginTop: Theme.spacing.s },
  detailsPrimaryActionBtn: { backgroundColor: Theme.colors.luxuryBlack, paddingVertical: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Theme.colors.luxuryBlack },
  detailsPrimaryActionBtnText: { fontFamily: Theme.fonts.bold, fontSize: 12, color: Theme.colors.softIvory, textTransform: 'uppercase', letterSpacing: 1.5 },
  detailsSecondaryActionBtn: { backgroundColor: 'transparent', paddingVertical: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#BA1A1A' },
  detailsSecondaryActionBtnText: { fontFamily: Theme.fonts.bold, fontSize: 12, color: '#BA1A1A', textTransform: 'uppercase', letterSpacing: 1.5 },
  bottomBufferOffset: { height: 40 }
});