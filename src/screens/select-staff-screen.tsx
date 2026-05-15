import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';

export function SelectStaffScreen() {
  const staffMembers = [
    { id: 'stf-1', name: 'Amara Vance', role: 'Master Stylist' },
    { id: 'stf-2', name: 'Marcus Sterling', role: 'Color Expert' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepTitle}>Choose Professional</Text>
        <Text style={styles.stepSubtitle}>Step 2 of 5</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={[styles.anyStaffCard, styles.selectedCard]}>
          <View style={styles.radioCircleActive} />
          <View>
            <Text style={styles.anyStaffText}>Any Available Professional</Text>
            <Text style={styles.anyStaffSub}>Matches you with the best open window</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionHeader}>Our Specialists</Text>
        {staffMembers.map((member) => (
          <TouchableOpacity key={member.id} style={styles.staffCard}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitials}>{member.name.charAt(0)}</Text>
            </View>
            <View style={styles.staffMeta}>
              <Text style={styles.staffName}>{member.name}</Text>
              <Text style={styles.staffRole}>{member.role}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0EEE6' },
  header: { paddingHorizontal: 24, paddingTop: 20, marginBottom: 16 },
  stepTitle: { fontSize: 24, color: '#0F0F0F', fontWeight: '700' },
  stepSubtitle: { fontSize: 13, color: '#666', marginTop: 4 },
  scrollContent: { paddingHorizontal: 24 },
  anyStaffCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6E3D8',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  selectedCard: { borderColor: '#0F0F0F', borderWidth: 1.5 },
  radioCircleActive: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#0F0F0F', marginRight: 16 },
  anyStaffText: { fontSize: 16, fontWeight: '600', color: '#0F0F0F' },
  anyStaffSub: { fontSize: 13, color: '#666', marginTop: 2 },
  sectionHeader: { fontSize: 14, color: '#666', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  staffCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6E3D8',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarPlaceholder: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#0F0F0F', justifyContent: 'center', alignItems: 'center' },
  avatarInitials: { color: '#F0EEE6', fontWeight: '600' },
  staffMeta: { marginLeft: 16 },
  staffName: { fontSize: 16, color: '#0F0F0F', fontWeight: '600' },
  staffRole: { fontSize: 14, color: '#777', marginTop: 2 },
});