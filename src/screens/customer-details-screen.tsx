import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

export function CustomerDetailsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepTitle}>Additional Remarks</Text>
        <Text style={styles.stepSubtitle}>Step 4 of 5</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Appointment Notes (Optional)</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={5}
          placeholder="Please specify custom allergy flags, preferences, or styling objectives..."
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Review Summary</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0EEE6' },
  header: { paddingHorizontal: 24, paddingTop: 20, marginBottom: 16 },
  stepTitle: { fontSize: 24, color: '#0F0F0F', fontWeight: '700' },
  stepSubtitle: { fontSize: 13, color: '#666', marginTop: 4 },
  formContainer: { paddingHorizontal: 24 },
  label: { fontSize: 14, color: '#0F0F0F', fontWeight: '600', marginBottom: 8 },
  textArea: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E6E3D8', padding: 16, color: '#0F0F0F', fontSize: 15, textAlignVertical: 'top', height: 140 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', padding: 24, borderTopWidth: 1, borderColor: '#E6E3D8' },
  primaryButton: { backgroundColor: '#0F0F0F', paddingVertical: 16, alignItems: 'center' },
  primaryButtonText: { color: '#F0EEE6', fontSize: 16, fontWeight: '600' },
});