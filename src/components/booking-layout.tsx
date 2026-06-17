import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../theme/theme';

interface BookingLayoutProps {
  step: number;
  stepTitle: string;
  onBackPress?: () => void;
  onForwardPress?: () => void;
  isForwardDisabled?: boolean;
  forwardLabel?: string;
  children: React.ReactNode;
}

export function BookingLayout({
  step,
  stepTitle,
  onBackPress,
  onForwardPress,
  isForwardDisabled = false,
  forwardLabel = 'Continue',
  children
}: BookingLayoutProps) {
  return (
    <SafeAreaView style={styles.safeContainer} edges={['top', 'left', 'right']}>
      <View style={styles.headerContainer}>
        <View style={styles.headerTopRow}>
          {onBackPress ? (
            <TouchableOpacity onPress={onBackPress} activeOpacity={0.7} style={styles.navActionTextTarget}>
              <Text style={styles.navActionText}>← BACK</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.brandLogoText}>MERLUA</Text>
          )}
          <Text style={styles.progressCounter}>Step {step} of 5</Text>
        </View>

        <Text style={styles.screenHeading}>{stepTitle}</Text>

        <View style={styles.progressTrackBackground}>
          <View style={[styles.progressIndicatorBar, { width: `${(step / 5) * 100}%` }]} />
        </View>
      </View>

      <View style={styles.mainContentFrame}>
        {children}
      </View>

      {onForwardPress && (
        <View style={styles.stickyControlFooter}>
          <TouchableOpacity
            style={[styles.primaryActionBtn, isForwardDisabled && styles.primaryActionBtnDisabled]}
            disabled={isForwardDisabled}
            onPress={onForwardPress}
            activeOpacity={0.9}
          >
            <Text
              style={[
                styles.primaryActionBtnText,
                isForwardDisabled && styles.primaryActionBtnTextDisabled,
              ]}
            >
              {forwardLabel}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: Theme.colors.softIvory
  },
  headerContainer: {
    paddingHorizontal: Theme.spacing.m,
    paddingTop: Theme.spacing.s,
    paddingBottom: Theme.spacing.s,
    backgroundColor: Theme.colors.softIvory
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs
  },
  brandLogoText: {
    fontFamily: Theme.fonts.bold,
    fontSize: 13,
    letterSpacing: 4,
    color: Theme.colors.textPrimary
  },
  navActionTextTarget: {
    paddingVertical: 4
  },
  navActionText: {
    fontFamily: Theme.fonts.bold,
    fontSize: 11,
    color: Theme.colors.textPrimary,
    letterSpacing: 1.5
  },
  progressCounter: {
    fontFamily: Theme.fonts.medium,
    fontSize: 11,
    textTransform: 'uppercase',
    color: Theme.colors.textSecondary,
    letterSpacing: 1
  },
  screenHeading: {
    fontFamily: Theme.fonts.semibold,
    fontSize: 24,
    color: Theme.colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 4
  },
  progressTrackBackground: {
    height: 1,
    backgroundColor: Theme.colors.warmStone,
    marginTop: Theme.spacing.s,
    width: '100%'
  },
  progressIndicatorBar: {
    height: '100%',
    backgroundColor: Theme.colors.luxuryBlack
  },
  mainContentFrame: {
    flex: 1
  },
  stickyControlFooter: {
    paddingHorizontal: Theme.spacing.m,
    paddingVertical: Theme.spacing.s,
    borderTopWidth: 1,
    borderColor: Theme.colors.warmStone,
    backgroundColor: Theme.colors.white
  },
  primaryActionBtn: {
    backgroundColor: Theme.colors.luxuryBlack,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 0
  },
  primaryActionBtnDisabled: {
    backgroundColor: Theme.colors.warmStone,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    opacity: 1
  },
  primaryActionBtnText: {
    fontFamily: Theme.fonts.bold,
    color: Theme.colors.softIvory,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 2
  },
  primaryActionBtnTextDisabled: {
    color: Theme.colors.textSecondary,
  },
});
