import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Theme } from '../theme/theme';

interface DateItem {
  dayName: string;
  dayNumber: string;
  fullDate: string;
}

interface CalendarStripProps {
  dates: DateItem[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

export function CalendarStrip({ dates, selectedDate, onDateSelect }: CalendarStripProps) {
  return (
    <View style={styles.wrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {dates.map((item) => {
          const isSelected = selectedDate === item.fullDate;
          return (
            <TouchableOpacity
              key={item.fullDate}
              style={[styles.dayBubble, isSelected && styles.dayBubbleActive]}
              onPress={() => onDateSelect(item.fullDate)}
              activeOpacity={0.9}
            >
              <Text style={[styles.dayName, isSelected && styles.textActive]}>{item.dayName}</Text>
              <Text style={[styles.dayNumber, isSelected && styles.textActive]}>{item.dayNumber}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 24,
    backgroundColor: Theme.colors.softIvory,
  },
  scrollContainer: {
    paddingLeft: 24,
    paddingVertical: 4,
  },
  dayBubble: {
    width: 62,
    height: 76,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E2D9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderRadius: 0,
  },
  dayBubbleActive: {
    backgroundColor: Theme.colors.luxuryBlack,
    borderColor: Theme.colors.luxuryBlack,
  },
  dayName: {
    fontFamily: Theme.fonts.medium,
    fontSize: 11,
    textTransform: 'uppercase',
    color: Theme.colors.textSecondary,
    letterSpacing: 0.5,
  },
  dayNumber: {
    fontFamily: Theme.fonts.bold,
    fontSize: 18,
    color: Theme.colors.luxuryBlack,
    marginTop: 4,
  },
  textActive: {
    color: Theme.colors.softIvory,
  },
});