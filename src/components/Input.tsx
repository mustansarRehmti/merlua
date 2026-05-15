import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

export const Input = ({ label, ...props }) => (
  <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
    <TextInput 
      style={styles.input} 
      placeholderTextColor={COLORS.textMuted}
      {...props} 
    />
  </View>
);

const styles = StyleSheet.create({
  container: { marginBottom: 24, borderBottomWidth: 1.5, borderColor: COLORS.primary },
  label: {         
    fontFamily: FONTS.semibold, 
    fontSize: 10, 
    textTransform: 'uppercase', 
    letterSpacing: 1.5, 
    color: COLORS.textMuted,
    marginBottom: 4 
  },
  input: { 
    fontFamily: FONTS.medium, 
    fontSize: 18, 
    paddingVertical: 12, 
    color: COLORS.primary 
  },
});