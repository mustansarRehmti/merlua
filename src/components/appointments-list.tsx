import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { AppointmentCard, Appointment } from './appointment-card';
import { Theme } from '../theme/theme';

// 1. ADD THE MISSING TYPING METRIC HERE
interface AppointmentsListProps {
  data: Appointment[];
  onCancelItem: (id: string) => void;
  onRescheduleItem: (id: string) => void;
  onNavigateToBooking: () => void;
  onItemPress: (item: Appointment) => void; // Added type parameter definition
}

export function AppointmentsList({ 
  data, 
  onCancelItem, 
  onRescheduleItem, 
  onNavigateToBooking,
  onItemPress // Destructure it cleanly here
}: AppointmentsListProps) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainerPadding}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View style={styles.emptyStatusWrapper}>
          <Text style={styles.emptyStatusMainText}>No session archives allocated under this category matrix.</Text>
          <TouchableOpacity 
            style={styles.bookTreatmentPromptBtn}
            onPress={onNavigateToBooking}
            activeOpacity={0.8}
          >
            <Text style={styles.bookTreatmentPromptBtnText}>Schedule New Session</Text>
          </TouchableOpacity>
        </View>
      }
      renderItem={({ item }) => (
        /* 2. WRAP CARD SO CLICKING THE ENTIRE ROW TRIGGERS THE DETAILED BLOCK */
        <TouchableOpacity 
          activeOpacity={0.9} 
          onPress={() => onItemPress(item)}
        >
          <AppointmentCard
            item={item}
            onCancelPress={onCancelItem}
            onReschedulePress={onRescheduleItem}
          />
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContainerPadding: {
    paddingHorizontal: Theme.spacing.m,
    paddingTop: Theme.spacing.m,
    paddingBottom: Theme.spacing.xl
  },
  emptyStatusWrapper: {
    padding: Theme.spacing.l,
    alignItems: 'center',
    marginTop: Theme.spacing.l
  },
  emptyStatusMainText: {
    fontFamily: Theme.fonts.regular,
    fontSize: 13,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.s,
    textAlign: 'center'
  },
  bookTreatmentPromptBtn: {
    backgroundColor: Theme.colors.luxuryBlack,
    paddingHorizontal: Theme.spacing.m,
    paddingVertical: 14,
    borderRadius: 0
  },
  bookTreatmentPromptBtnText: {
    fontFamily: Theme.fonts.bold,
    color: Theme.colors.softIvory,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1
  }
});