/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  withSpring,
  interpolateColor
} from 'react-native-reanimated';
import { Theme } from '../theme/theme';

interface StaffSelectorProps {
  id: string;
  name: string;
  role: string;
  isSelected: boolean;
  onSelect: () => void;
  isAnyStaffVariant?: boolean;
}

export function StaffSelector({ 
  name, 
  role, 
  isSelected, 
  onSelect,
  isAnyStaffVariant = false 
}: StaffSelectorProps) {
  
  const progress = useSharedValue(0);
  const pressScale = useSharedValue(1);

  useEffect(() => {
    progress.value = withTiming(isSelected ? 1 : 0, { duration: 250 });
  }, [isSelected]);

  // Card background and border color interpolation matching the login context
  const cardStyle = useAnimatedStyle(() => {
    const bgShift = interpolateColor(
      progress.value,
      [0, 1],
      [Theme.colors.white, Theme.colors.warmStone]
    );
    return {
      backgroundColor: bgShift,
      borderColor: isSelected ? Theme.colors.luxuryBlack : Theme.colors.border,
      transform: [{ scale: pressScale.value }]
    };
  });

  return (
    <Animated.View style={[styles.cardContainer, cardStyle]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onSelect}
        onPressIn={() => { pressScale.value = withSpring(0.99, { damping: 15 }); }}
        onPressOut={() => { pressScale.value = withSpring(1, { damping: 15 }); }}
        style={styles.clickableRegion}
      >
        {/* Avatar Bracket Frame */}
        <View style={[styles.avatarFrame, isAnyStaffVariant && styles.anyStaffAvatar]}>
          <Text style={[styles.avatarText, isAnyStaffVariant && styles.anyStaffAvatarText]}>
            {isAnyStaffVariant ? '✧' : name.charAt(0).toUpperCase()}
          </Text>
        </View>

        {/* Professional Meta Stack */}
        <View style={styles.metaStack}>
          <Text style={styles.nameText}>{name}</Text>
          <Text style={styles.roleText}>{role}</Text>
        </View>

        {/* Editorial Custom Radio Indicator */}
        <View style={[styles.radioFrame, isSelected && styles.radioFrameActive]}>
          {isSelected && <View style={styles.radioCenterNode} />}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderWidth: 1,
    marginBottom: Theme.spacing.s,
    borderRadius: 0,
    overflow: 'hidden'
  },
  clickableRegion: {
    padding: Theme.spacing.s,
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatarFrame: {
    width: 48,
    height: 48,
    backgroundColor: Theme.colors.luxuryBlack,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0
  },
  anyStaffAvatar: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Theme.colors.luxuryBlack,
    borderStyle: 'dashed'
  },
  avatarText: {
    fontFamily: Theme.fonts.bold,
    color: Theme.colors.softIvory,
    fontSize: 16,
    letterSpacing: 0.5
  },
  anyStaffAvatarText: {
    color: Theme.colors.luxuryBlack,
    fontSize: 20,
    lineHeight: 24
  },
  metaStack: {
    flex: 1,
    marginLeft: Theme.spacing.s,
    paddingRight: Theme.spacing.xs
  },
  nameText: {
    fontFamily: Theme.fonts.semibold,
    fontSize: 15,
    color: Theme.colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  roleText: {
    fontFamily: Theme.fonts.regular,
    fontSize: 13,
    color: Theme.colors.textSecondary,
    marginTop: 2
  },
  radioFrame: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center'
  },
  radioFrameActive: {
    borderColor: Theme.colors.luxuryBlack
  },
  radioCenterNode: {
    width: 10,
    height: 10,
    backgroundColor: Theme.colors.luxuryBlack
  }
});