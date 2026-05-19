import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
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

  const filteredAppointments = appointments.filter(item => item.category === activeTab);

  const handleCancelAction = (id: string) => {
    Alert.alert(
      "Cancel Registration",
      "Are you sure you want to terminate this reserved time slot execution parameters?",
      [
        { text: "Discard", style: "cancel" },
        { 
          text: "Confirm Cancellation", 
          style: "destructive",
          onPress: () => {
            setAppointments(prev => prev.map(item => 
              item.id === id ? { ...item, category: 'CANCELLED' as const } : item
            ));
          }
        }
      ]
    );
  };

  const handleRescheduleAction = (id: string) => {
    // Routes back to Step 3 (Calendar/Slot Picker) while parsing target identity context records
    navigation.navigate('SelectSlot', { rescheduleAppointmentId: id });
  };

  return (
    <SafeAreaView style={styles.canvasFrame} edges={['top', 'left', 'right']}>
      {/* Brand Header Group */}
      <View style={styles.headerTitleContainer}>
        <Text style={styles.brandSubtitle}>MERLUA STUDIO</Text>
        <Text style={styles.screenMainHeading}>My Bookings</Text>
      </View>

      {/* Segmented Grid Controls */}
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

      {/* Decoupled Child Component Injection */}
      <AppointmentsList
        data={filteredAppointments}
        onCancelItem={handleCancelAction}
        onRescheduleItem={handleRescheduleAction}
        onNavigateToBooking={() => navigation.navigate('SelectService')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  canvasFrame: { 
    flex: 1, 
    backgroundColor: Theme.colors.softIvory 
  },
  headerTitleContainer: { 
    paddingHorizontal: Theme.spacing.m, 
    paddingTop: Theme.spacing.s, 
    marginBottom: Theme.spacing.xs 
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
  segmentedTabWrapper: { 
    flexDirection: 'row', 
    marginHorizontal: Theme.spacing.m, 
    marginTop: Theme.spacing.s, 
    borderWidth: 1, 
    borderColor: Theme.colors.border, 
    backgroundColor: Theme.colors.white 
  },
  tabButtonElement: { 
    flex: 1, 
    paddingVertical: 14, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  tabButtonElementActive: { 
    backgroundColor: Theme.colors.luxuryBlack 
  },
  tabButtonText: { 
    fontFamily: Theme.fonts.bold, 
    fontSize: 11, 
    color: Theme.colors.textSecondary, 
    letterSpacing: 1 
  },
  tabButtonTextActive: { 
    color: Theme.colors.softIvory 
  }
});