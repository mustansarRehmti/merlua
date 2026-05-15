import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Theme } from '../theme/theme';

interface StaffProps {
  id: string;
  name: string;
  role: string;
  isSelected: boolean;
  onSelect: () => void;
}

export function StaffSelector({ name, role, isSelected, onSelect }: StaffProps) {
  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.cardSelected]}
      onPress={onSelect}
      activeOpacity={0.9}
    >
      <View style={styles.avatarFrame}>
        <Text style={styles.avatarText}>{name.charAt(0)}</Text>
      </View>
      <View style={styles.metaFrame}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.role}>{role}</Text>
      </View>
      <View style={[styles.radioOuter, isSelected && styles.radioOuterActive]}>
        {isSelected && <View style={styles.radioInner} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E2D9',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderRadius: 0,
  },
  cardSelected: {
    borderColor: Theme.colors.luxuryBlack,
    backgroundColor: Theme.colors.warmStone,
  },
  avatarFrame: {
    width: 44,
    height: 44,
    backgroundColor: Theme.colors.luxuryBlack,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: Theme.fonts.bold,
    color: Theme.colors.softIvory,
    fontSize: 16,
  },
  metaFrame: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontFamily: Theme.fonts.semibold,
    fontSize: 16,
    color: Theme.colors.luxuryBlack,
  },
  role: {
    fontFamily: Theme.fonts.regular,
    fontSize: 13,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1CDDA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterActive: {
    borderColor: Theme.colors.luxuryBlack,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Theme.colors.luxuryBlack,
  },
});