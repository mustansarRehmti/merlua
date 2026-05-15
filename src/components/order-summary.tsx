import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Theme } from '../theme/theme';

interface OrderSummaryProps {
  totalAmount: number;
  taxAmount: number;
}

export function OrderSummary({ totalAmount, taxAmount }: OrderSummaryProps) {
  const grandTotal = totalAmount + taxAmount;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manifest Summary</Text>
      
      <View style={styles.row}>
        <Text style={styles.label}>Selected Experience Subtotal</Text>
        <Text style={styles.value}>${totalAmount.toFixed(2)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Multi-Tenant Local Assessment Fee</Text>
        <Text style={styles.value}>${taxAmount.toFixed(2)}</Text>
      </View>

      <View style={styles.divider} />

      <View style={[styles.row, { marginBottom: 0 }]}>
        <Text style={styles.totalLabel}>Grand Value Total</Text>
        <Text style={styles.totalValue}>${grandTotal.toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.warmStone,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E2D9',
    borderRadius: 0,
    marginBottom: 24,
  },
  title: {
    fontFamily: Theme.fonts.bold,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: Theme.colors.luxuryBlack,
    marginBottom: 18,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontFamily: Theme.fonts.regular,
    fontSize: 14,
    color: Theme.colors.textSecondary,
  },
  value: {
    fontFamily: Theme.fonts.medium,
    fontSize: 14,
    color: Theme.colors.luxuryBlack,
  },
  divider: {
    height: 1,
    backgroundColor: '#C4C1B8',
    marginVertical: 16,
  },
  totalLabel: {
    fontFamily: Theme.fonts.bold,
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: Theme.colors.luxuryBlack,
  },
  totalValue: {
    fontFamily: Theme.fonts.bold,
    fontSize: 20,
    color: Theme.colors.luxuryBlack,
  },
});