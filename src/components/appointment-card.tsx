import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Theme } from '../theme/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface Appointment {
  id: string;
  service: string;
  provider: string;
  schedule: string;
  price: string;
  category: 'UPCOMING' | 'HISTORY' | 'CANCELLED';
}

interface AppointmentCardProps {
  item: Appointment;
  onCancelPress: (id: string) => void;
  onReschedulePress: (id: string) => void;
}

export function AppointmentCard({ item, onCancelPress, onReschedulePress }: AppointmentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  const isUpcoming = item.category === 'UPCOMING';

  return (
    <View style={styles.cardContainer}>
      {/* Tap to Toggle Expand/Collapse Layout */}
      <TouchableOpacity onPress={toggleExpand} activeOpacity={0.9} style={styles.mainInfoBlock}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.serviceNameLabel}>{item.service}</Text>
          <Text style={styles.priceValueText}>{item.price}</Text>
        </View>
        <Text style={styles.providerLabelText}>Specialist: {item.provider}</Text>
        
        <View style={styles.footerScheduleRow}>
          <Text style={styles.timestampValueText}>⏱ {item.schedule}</Text>
          <Text style={styles.expandIndicator}>{isExpanded ? '▴' : '▾'}</Text>
        </View>
      </TouchableOpacity>

      {/* Advanced Action Panel Drawer Tray */}
      {isExpanded && (
        <View style={styles.actionDrawerTray}>
          {isUpcoming ? (
            <View style={styles.upcomingActionGroup}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.rescheduleBtn]} 
                onPress={() => onReschedulePress(item.id)}
              >
                <Text style={styles.rescheduleBtnText}>Reschedule Appointment</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.cancelBtn]} 
                onPress={() => onCancelPress(item.id)}
              >
                <Text style={styles.cancelBtnText}>Cancel Session</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.historyMetaGroup}>
              <Text style={styles.historyMetaText}>
                This transaction status has finalized under the reference matrix parameter: ID-{item.id.toUpperCase()}.
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    marginBottom: Theme.spacing.xs,
    borderRadius: 0
  },
  mainInfoBlock: {
    padding: Theme.spacing.s
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4
  },
  serviceNameLabel: {
    fontFamily: Theme.fonts.semibold,
    fontSize: 14,
    color: Theme.colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
    paddingRight: Theme.spacing.xs
  },
  priceValueText: {
    fontFamily: Theme.fonts.bold,
    fontSize: 15,
    color: Theme.colors.textPrimary
  },
  providerLabelText: {
    fontFamily: Theme.fonts.regular,
    fontSize: 13,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.s
  },
  footerScheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Theme.spacing.xs,
    borderTopWidth: 0.5,
    borderColor: Theme.colors.warmStone
  },
  timestampValueText: {
    fontFamily: Theme.fonts.medium,
    fontSize: 12,
    color: Theme.colors.textPrimary
  },
  expandIndicator: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    fontFamily: Theme.fonts.bold
  },
  actionDrawerTray: {
    backgroundColor: Theme.colors.softIvory,
    borderTopWidth: 1,
    borderColor: Theme.colors.border,
    padding: Theme.spacing.s
  },
  upcomingActionGroup: {
    flexDirection: 'column',
    gap: Theme.spacing.xs
  },
  actionButton: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 0
  },
  rescheduleBtn: {
    backgroundColor: Theme.colors.luxuryBlack,
    borderColor: Theme.colors.luxuryBlack
  },
  rescheduleBtnText: {
    fontFamily: Theme.fonts.bold,
    fontSize: 11,
    color: Theme.colors.softIvory,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  cancelBtn: {
    backgroundColor: 'transparent',
    borderColor: '#BA1A1A'
  },
  cancelBtnText: {
    fontFamily: Theme.fonts.bold,
    fontSize: 11,
    color: '#BA1A1A',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  historyMetaGroup: {
    paddingVertical: Theme.spacing.xs
  },
  historyMetaText: {
    fontFamily: Theme.fonts.regular,
    fontSize: 12,
    color: Theme.colors.textSecondary,
    lineHeight: 18,
    fontStyle: 'italic'
  }
});