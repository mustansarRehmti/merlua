import React, { useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, interpolateColor } from 'react-native-reanimated';
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

function CalendarDayBubble({ item, isSelected, onSelect }: { item: DateItem; isSelected: boolean; onSelect: () => void }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(isSelected ? 1 : 0, { duration: 200 });
  }, [isSelected, progress]);

  const animatedBubbleStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
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
      progress.value,
      [0, 1],
      [Theme.colors.textPrimary, Theme.colors.softIvory]
    );
    return { color };
  });

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onSelect}>
      <Animated.View style={[styles.dayBubble, animatedBubbleStyle]}>
        <Animated.Text style={[styles.dayName, animatedTextStyle]}>{item.dayName}</Animated.Text>
        <Animated.Text style={[styles.dayNumber, animatedTextStyle]}>{item.dayNumber}</Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

export function CalendarStrip({ dates, selectedDate, onDateSelect }: CalendarStripProps) {
  return (
    <View style={styles.wrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {dates.map((item) => (
          <CalendarDayBubble
            key={item.fullDate}
            item={item}
            isSelected={selectedDate === item.fullDate}
            onSelect={() => onDateSelect(item.fullDate)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: Theme.spacing.xs,
    backgroundColor: Theme.colors.softIvory
  },
  scrollContainer: {
    paddingLeft: Theme.spacing.m,
    paddingRight: Theme.spacing.xs
  },
  dayBubble: {
    width: 66,
    height: 80,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderRadius: 0
  },
  dayName: {
    fontFamily: Theme.fonts.medium,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  dayNumber: {
    fontFamily: Theme.fonts.bold,
    fontSize: 20,
    marginTop: 4
  }
});