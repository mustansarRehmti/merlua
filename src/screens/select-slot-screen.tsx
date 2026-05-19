import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { BookingLayout } from '../components/booking-layout';
import { CalendarStrip } from '../components/calendar-strip';
import { SlotPicker } from '../components/slot-picker';
import { Theme } from '../theme/theme';

// Generate dynamic continuous upcoming dates matching premium calendar configurations
const GENERATED_DATES = [
  { dayName: 'Tue', dayNumber: '19', fullDate: '2026-05-19' },
  { dayName: 'Wed', dayNumber: '20', fullDate: '2026-05-20' },
  { dayName: 'Thu', dayNumber: '21', fullDate: '2026-05-21' },
  { dayName: 'Fri', dayNumber: '22', fullDate: '2026-05-22' },
  { dayName: 'Sat', dayNumber: '23', fullDate: '2026-05-23' },
  { dayName: 'Sun', dayNumber: '24', fullDate: '2026-05-24' },
  { dayName: 'Mon', dayNumber: '25', fullDate: '2026-05-25' },
];

const MOCK_TIME_SLOTS = [
  '09:00 AM', '10:30 AM', '11:00 AM', '01:30 PM', '03:00 PM', '04:30 PM'
];

export function SelectSlotScreen({ navigation }: any) {
  const [selectedDate, setSelectedDate] = useState('2026-05-19');
  const [selectedSlot, setSelectedSlot] = useState('');

  return (
    <BookingLayout
      step={3}
      stepTitle="Select Slot"
      onBackPress={() => navigation.goBack()}
      onForwardPress={() => navigation.navigate('BookingReview')}
      isForwardDisabled={!selectedSlot}
      forwardLabel="Confirm Slot & Proceed"
    >
      <ScrollView style={styles.scrollCanvas} showsVerticalScrollIndicator={false}>
        {/* Section Heading Metadata */}
        <Text style={styles.sectionSectionMarker}>Available Dates</Text>
        <CalendarStrip
          dates={GENERATED_DATES}
          selectedDate={selectedDate}
          onDateSelect={(date) => { setSelectedDate(date); setSelectedSlot(''); }}
        />

        <View style={styles.spacingDivider} />

        <Text style={styles.sectionSectionMarker}>Available Studio Allocations</Text>
        <SlotPicker
          slots={MOCK_TIME_SLOTS}
          selectedSlot={selectedSlot}
          onSlotSelect={setSelectedSlot}
        />
        
        <View style={styles.bottomBuffer} />
      </ScrollView>
    </BookingLayout>
  );
}

const styles = StyleSheet.create({
  scrollCanvas: {
    flex: 1,
    backgroundColor: Theme.colors.softIvory
  },
  sectionSectionMarker: {
    fontFamily: Theme.fonts.bold,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: Theme.colors.textSecondary,
    marginLeft: Theme.spacing.m,
    marginTop: Theme.spacing.m,
    marginBottom: Theme.spacing.xs
  },
  spacingDivider: {
    height: 1,
    backgroundColor: Theme.colors.warmStone,
    marginHorizontal: Theme.spacing.m,
    marginVertical: Theme.spacing.s
  },
  bottomBuffer: {
    height: Theme.spacing.xl
  }
});