import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export function BookingReviewScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepTitle}>Confirm Booking</Text>
        <Text style={styles.stepSubtitle}>Step 5 of 5</Text>
      </View>

      <View style={styles.receiptCard}>
        <Text style={styles.receiptTitle}>Summary Detail</Text>
        
        <View style={styles.receiptRow}>
          <Text style={styles.receiptItem}>Editorial Precision Cut</Text>
          <Text style={styles.receiptPrice}>$120.00</Text>
        </View>

        <View style={styles.receiptRow}>
          <Text style={styles.receiptItem}>Balayage & Soft Ivory Toning</Text>
          <Text style={styles.receiptPrice}>$280.00</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.receiptRow}>
          <Text style={styles.totalLabel}>Total Due</Text>
          <Text style={styles.totalValue}>$400.00</Text>
        </View>
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.paymentButton}>
          <Text style={styles.paymentButtonText}>Authorize via Stripe</Text>
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
  receiptCard: { backgroundColor: '#FFFFFF', marginHorizontal: 24, padding: 24, borderWidth: 1, borderColor: '#E6E3D8' },
  receiptTitle: { fontSize: 16, fontWeight: '700', color: '#0F0F0F', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5 },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  receiptItem: { fontSize: 15, color: '#444' },
  receiptPrice: { fontSize: 15, color: '#0F0F0F', fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#E6E3D8', marginVertical: 16 },
  totalLabel: { fontSize: 16, fontWeight: '700', color: '#0F0F0F' },
  totalValue: { fontSize: 18, fontWeight: '700', color: '#0F0F0F' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', padding: 24, borderTopWidth: 1, borderColor: '#E6E3D8' },
  paymentButton: { backgroundColor: '#0F0F0F', paddingVertical: 16, alignItems: 'center' },
  paymentButtonText: { color: '#F0EEE6', fontSize: 16, fontWeight: '600', letterSpacing: 0.5 },
});