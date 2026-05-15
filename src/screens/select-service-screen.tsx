import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; // in minutes
}

export function SelectServiceScreen({ navigation, route }: any) {
  // Mock array matching NestJS DTO payload
  const services: Service[] = [
    { id: 'srv-1', name: 'Editorial Precision Cut', price: 120, duration: 45 },
    { id: 'srv-2', name: 'Balayage & Soft Ivory Toning', price: 280, duration: 120 },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepTitle}>Select Services</Text>
        <Text style={styles.stepSubtitle}>Step 1 of 5</Text>
      </View>

      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} activeOpacity={0.8}>
            <View style={styles.cardInfo}>
              <Text style={styles.serviceName}>{item.name}</Text>
              <Text style={styles.serviceMeta}>{item.duration} min</Text>
            </View>
            <Text style={styles.servicePrice}>${item.price}</Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Continue to Barber/Staff</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0EEE6' }, // Soft Ivory background
  header: { paddingHorizontal: 24, paddingTop: 20, marginBottom: 16 },
  stepTitle: { fontSize: 24, fontFamily: 'Playfair Display', color: '#0F0F0F', fontWeight: '700' }, // Editorial theme
  stepSubtitle: { fontSize: 13, color: '#666', marginTop: 4, letterSpacing: 1 },
  list: { paddingHorizontal: 24 },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6E3D8',
    padding: 20,
    borderRadius: 0, // Hard minimalist layout corners
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardInfo: { flex: 1 },
  serviceName: { fontSize: 16, color: '#0F0F0F', fontWeight: '600' },
  serviceMeta: { fontSize: 14, color: '#777', marginTop: 4 },
  servicePrice: { fontSize: 16, color: '#0F0F0F', fontWeight: '700' },
  bottomBar: { backgroundColor: '#FFFFFF', padding: 24, borderTopWidth: 1, borderColor: '#E6E3D8' },
  primaryButton: { backgroundColor: '#0F0F0F', paddingVertical: 16, alignItems: 'center' }, // Luxury Black
  primaryButtonText: { color: '#F0EEE6', fontSize: 16, fontWeight: '600', letterSpacing: 0.5 },
});