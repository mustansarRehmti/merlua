import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Theme } from '../theme/theme';

interface ServiceCardProps {
  name: string;
  duration: number;
  price: number;
  isSelected: boolean;
  onPress: () => void;
}

export function ServiceCard({ name, duration, price, isSelected, onPress }: ServiceCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.cardSelected]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.infoSide}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.duration}>{duration} Minutes</Text>
      </View>
      <View style={styles.priceSide}>
        <Text style={styles.price}>${price}</Text>
        <View style={[styles.checkbox, isSelected && styles.checkboxChecked]} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E2D9',
    padding: 20,
    borderRadius: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardSelected: {
    borderColor: Theme.colors.luxuryBlack,
    backgroundColor: Theme.colors.warmStone,
  },
  infoSide: {
    flex: 1,
    paddingRight: 16,
  },
  name: {
    fontFamily: Theme.fonts.semibold,
    fontSize: 16,
    color: Theme.colors.luxuryBlack,
  },
  duration: {
    fontFamily: Theme.fonts.regular,
    fontSize: 13,
    color: Theme.colors.textSecondary,
    marginTop: 4,
  },
  priceSide: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontFamily: Theme.fonts.bold,
    fontSize: 16,
    color: Theme.colors.luxuryBlack,
    marginRight: 16,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#D1CDDA',
    borderRadius: 0,
  },
  checkboxChecked: {
    backgroundColor: Theme.colors.luxuryBlack,
    borderColor: Theme.colors.luxuryBlack,
  },
});