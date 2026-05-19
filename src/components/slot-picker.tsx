import React, { useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, interpolateColor } from 'react-native-reanimated';
import { Theme } from '../theme/theme';

const { width } = Dimensions.get('window');
const cellWidth = (width - 60) / 2; // Perfectly calculated 2-column spatial grid symmetry

interface SlotPickerProps {
  slots: string[];
  selectedSlot: string;
  onSlotSelect: (slot: string) => void;
}

function SlotBadge({ slot, isSelected, onSelect }: { slot: string; isSelected: boolean; onSelect: () => void }) {
  const transition = useSharedValue(0);

  useEffect(() => {
    transition.value = withTiming(isSelected ? 1 : 0, { duration: 200 });
  }, [isSelected, transition]);

  const animatedBadgeStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      transition.value,
      [0, 1],
      [Theme.colors.white, Theme.colors.luxuryBlack]
    );
    return {
      backgroundColor,
      borderColor: isSelected ? Theme.colors.luxuryBlack : Theme.colors.border
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      transition.value,
      [0, 1],
      [Theme.colors.textPrimary, Theme.colors.softIvory]
    );
    return { color };
  });

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onSelect}>
      <Animated.View style={[styles.badgeCell, animatedBadgeStyle]}>
        <Animated.Text style={[styles.badgeText, animatedTextStyle]}>{slot}</Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

export function SlotPicker({ slots, selectedSlot, onSlotSelect }: SlotPickerProps) {
  return (
    <View style={styles.gridContainer}>
      {slots.map((slot) => (
        <SlotBadge
          key={slot}
          slot={slot}
          isSelected={selectedSlot === slot}
          onSelect={() => onSlotSelect(slot)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.m,
    paddingTop: Theme.spacing.xs
  },
  badgeCell: {
    width: cellWidth,
    borderWidth: 1,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 14,
    borderRadius: 0
  },
  badgeText: {
    fontFamily: Theme.fonts.semibold,
    fontSize: 14,
    letterSpacing: 0.5
  }
});