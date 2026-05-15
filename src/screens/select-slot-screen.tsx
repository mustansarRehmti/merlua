import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';

export function SelectSlotScreen() {
  const days = [
    { day: 'Mon', date: '18' },
    { day: 'Tue', date: '19' },
    { day: 'Wed', date: '20' },
    { day: 'Thu', date: '21' },
  ];

  const genericSlots = ['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM', '04:00 PM'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepTitle}>Select Date & Time</Text>
        <Text style={styles.stepSubtitle}>Step 3 of 5</Text>
      </View>

      {/* Horizontal Strip */}
      <View style={styles.stripContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {days.map((d, index) => (
            <TouchableOpacity key={index} style={[styles.dateBubble, index === 1 && styles.activeDateBubble]}>
              <Text style={[styles.dayText, index === 1 && styles.activeText]}>{d.day}</Text>
              <Text style={[styles.dateText, index === 1 && styles.activeText]}>{d.date}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
        <Text style={styles.sessionHeader}>Available Slots</Text>
        <View style={styles.gridContainer}>
          {genericSlots.map((slot, idx) => (
            <TouchableOpacity key={idx} style={styles.slotBadge}>
              <Text style={styles.slotText}>{slot}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0EEE6' },
  header: { paddingHorizontal: 24, paddingTop: 20, marginBottom: 16 },
  stepTitle: { fontSize: 24, color: '#0F0F0F', fontWeight: '700' },
  stepSubtitle: { fontSize: 13, color: '#666', marginTop: 4 },
  stripContainer: { paddingLeft: 24, marginBottom: 24 },
  dateBubble: { width: 60, height: 75, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E6E3D8', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  activeDateBubble: { backgroundColor: '#0F0F0F', borderColor: '#0F0F0F' },
  dayText: { fontSize: 12, color: '#777', textTransform: 'uppercase' },
  dateText: { fontSize: 18, fontWeight: '700', color: '#0F0F0F', marginTop: 4 },
  activeText: { color: '#F0EEE6' },
  sessionHeader: { fontSize: 14, color: '#666', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  slotBadge: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E6E3D8', paddingVertical: 14, paddingHorizontal: 16, width: '31%', alignItems: 'center' },
  slotText: { fontSize: 13, color: '#0F0F0F', fontWeight: '600' },
});