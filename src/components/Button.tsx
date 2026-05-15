import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Theme } from '../theme/theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
  style?: ViewStyle;
}

export const PrimaryButton = ({ label, onPress, variant = 'primary', style }: ButtonProps) => (
  <TouchableOpacity 
    style={[styles.button, variant === 'outline' && styles.outline, style]} 
    onPress={onPress} 
    activeOpacity={0.8}
  >
    <Text style={[styles.text, variant === 'outline' && styles.textOutline]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: Theme.colors.luxuryBlack,
    paddingVertical: 18,
    borderRadius: 2,
    alignItems: 'center',
    width: '100%',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Theme.colors.luxuryBlack,
  },
  text: {
    color: Theme.colors.softIvory,
    fontFamily: Theme.fonts.semibold,
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase'
  },
  textOutline: { color: Theme.colors.luxuryBlack }
});