import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Theme } from '../theme/theme';

interface BookingHeaderProps {
  title: string;
  step: number;
  onBackPress?: () => void;
}

export function BookingHeader({ title, step, onBackPress }: BookingHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {onBackPress ? (
          <TouchableOpacity onPress={onBackPress} activeOpacity={0.7} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.brandMark}>MERLUA</Text>
        )}
        <Text style={styles.stepIndicator}>Step {step} of 5</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressBar, { width: `${(step / 5) * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: Theme.colors.softIvory,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  brandMark: {
    fontFamily: Theme.fonts.bold,
    fontSize: 12,
    letterSpacing: 4,
    color: Theme.colors.luxuryBlack,
  },
  backButton: {
    paddingVertical: 4,
  },
  backText: {
    fontFamily: Theme.fonts.medium,
    fontSize: 13,
    color: Theme.colors.luxuryBlack,
    textDecorationLine: 'underline',
  },
  stepIndicator: {
    fontFamily: Theme.fonts.medium,
    fontSize: 11,
    textTransform: 'uppercase',
    color: Theme.colors.textSecondary,
    letterSpacing: 1,
  },
  title: {
    fontFamily: Theme.fonts.semibold,
    fontSize: 26,
    color: Theme.colors.luxuryBlack,
    marginTop: 4,
  },
  progressTrack: {
    height: 2,
    backgroundColor: '#E5E2D9',
    marginTop: 16,
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Theme.colors.luxuryBlack,
  },
});