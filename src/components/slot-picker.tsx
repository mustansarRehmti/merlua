import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { Theme } from '../theme/theme';

interface SlotPickerProps {
  slots: string[];
  selectedSlot: string;
  onSlotSelect: (slot: string) => void;
}

const { width } = Dimensions.get('window');
const itemWidth = (width - 60) / 2; // Perfectly balanced 2-column grid placement

export function SlotPicker({ slots, selectedSlot, onSlotSelect }: SlotPickerProps) {
  return (
    <View style={styles.grid}>
      {slots.map((slot) => {
        const isSelected = selectedSlot === slot;
        return (
          <TouchableOpacity
            key={slot}
            style={[styles.badge, isSelected && styles.badgeActive]}
            onPress={() => onSlotSelect(slot)}
            activeOpacity={0.9}
          >
            <Text style={[styles.text, isSelected && styles.textActive]}>{slot}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  badge: {
    width: itemWidth,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E2D9',
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderRadius: 0,
  },
  badgeActive: {
    backgroundColor: Theme.colors.luxuryBlack,
    borderColor: Theme.colors.luxuryBlack,
  },
  text: {
    fontFamily: Theme.fonts.medium,
    fontSize: 14,
    color: Theme.colors.luxuryBlack,
  },
  textActive: {
    color: Theme.colors.softIvory,
    fontFamily: Theme.fonts.semibold,
  },
});