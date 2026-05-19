/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  withSpring,
  interpolateColor
} from 'react-native-reanimated';
import { Theme } from '../theme/theme';

interface AddOnItem {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
}

interface ServiceCardProps {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  imageUrl: string;
  isSelected: boolean;
  onPress: () => void;
  addOns?: AddOnItem[];
  selectedAddOnIds?: string[];
  onToggleAddOn?: (addOnId: string) => void;
  isPackageVariant?: boolean;
}

export function ServiceCard({ 
  name, 
  description, 
  durationMinutes, 
  price, 
  imageUrl, 
  isSelected, 
  onPress,
  addOns = [],
  selectedAddOnIds = [],
  onToggleAddOn,
  isPackageVariant = false 
}: ServiceCardProps) {
  
  const progress = useSharedValue(0);
  const pressScale = useSharedValue(1);

  useEffect(() => {
    progress.value = withTiming(isSelected ? 1 : 0, { duration: 250 });
  }, [isSelected]);

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

  const expandableDrawerStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(isSelected ? 'auto' : 0, { duration: 300 }),
      opacity: progress.value,
      marginTop: withTiming(isSelected ? Theme.spacing.s : 0, { duration: 200 })
    };
  });

  return (
    <Animated.View style={[styles.cardContainer, cardStyle]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={() => { pressScale.value = withSpring(0.99, { damping: 15 }); }}
        onPressOut={() => { pressScale.value = withSpring(1, { damping: 15 }); }}
        style={styles.clickableRegion}
      >
        <View style={styles.topInfoRow}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.mediaFrame} resizeMode="cover" />
          ) : (
            <View style={[styles.mediaFrame, styles.fallbackMedia]} />
          )}

          <View style={styles.textStack}>
            {isPackageVariant && (
              <View style={styles.packageBadge}>
                <Text style={styles.packageBadgeText}>Curated Package</Text>
              </View>
            )}
            <Text style={styles.titleText}>{name}</Text>
            <Text style={styles.metaSubtext}>{durationMinutes} Mins • Base Treatment</Text>
          </View>

          <View style={styles.pricingSection}>
            <Text style={styles.priceLabel}>${Number(price).toFixed(2)}</Text>
            <View style={[styles.radioFrame, isSelected && styles.radioFrameActive]}>
              {isSelected && <View style={styles.radioCenterNode} />}
            </View>
          </View>
        </View>

        {/* Expandable Menu Details (Add-ons & System Descriptions) */}
        <Animated.View style={[styles.drawerContent, expandableDrawerStyle]}>
          <View style={styles.divider} />
          <Text style={styles.descriptionBody}>{description}</Text>

          {/* Render Addons Block if items are available inside the specification array */}
          {addOns.length > 0 && (
            <View style={styles.addOnSection}>
              <Text style={styles.addOnSectionHeader}>Enhance Treatment (Optional Add-ons)</Text>
              {addOns.map((addOn) => {
                const isAddOnChecked = selectedAddOnIds.includes(addOn.id);
                return (
                  <TouchableOpacity
                    key={addOn.id}
                    activeOpacity={0.8}
                    onPress={() => onToggleAddOn?.(addOn.id)}
                    style={[styles.addOnRow, isAddOnChecked && styles.addOnRowChecked]}
                  >
                    <View style={styles.addOnLeft}>
                      <View style={[styles.squareBox, isAddOnChecked && styles.squareBoxChecked]}>
                        {isAddOnChecked && <Text style={styles.checkmarkIcon}>✓</Text>}
                      </View>
                      <Text style={styles.addOnName}>{addOn.name}</Text>
                    </View>
                    <Text style={styles.addOnMeta}>+{addOn.durationMinutes}m (+${addOn.price})</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </Animated.View>
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
    padding: Theme.spacing.s
  },
  topInfoRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  mediaFrame: {
    width: 64,
    height: 64,
    backgroundColor: Theme.colors.warmStone
  },
  fallbackMedia: {
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderStyle: 'dashed'
  },
  textStack: {
    flex: 1,
    marginLeft: Theme.spacing.s,
    paddingRight: Theme.spacing.xs
  },
  packageBadge: {
    backgroundColor: Theme.colors.luxuryBlack,
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 4
  },
  packageBadgeText: {
    color: Theme.colors.softIvory,
    fontFamily: Theme.fonts.bold,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  titleText: {
    fontFamily: Theme.fonts.semibold,
    fontSize: 15,
    color: Theme.colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  metaSubtext: {
    fontFamily: Theme.fonts.regular,
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: 4
  },
  pricingSection: {
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  priceLabel: {
    fontFamily: Theme.fonts.bold,
    fontSize: 16,
    color: Theme.colors.textPrimary,
    marginBottom: 8
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
  },
  drawerContent: {
    overflow: 'hidden'
  },
  divider: {
    height: 1,
    backgroundColor: Theme.colors.border,
    width: '100%',
    marginBottom: 12
  },
  descriptionBody: {
    fontFamily: Theme.fonts.regular,
    fontSize: 13,
    lineHeight: 20,
    color: Theme.colors.textSecondary
  },
  addOnSection: {
    marginTop: 18,
    backgroundColor: 'rgba(255,255,255,0.4)',
    padding: 12,
    borderWidth: 0.5,
    borderColor: Theme.colors.border
  },
  addOnSectionHeader: {
    fontFamily: Theme.fonts.bold,
    fontSize: 11,
    textTransform: 'uppercase',
    color: Theme.colors.textPrimary,
    letterSpacing: 1,
    marginBottom: 10
  },
  addOnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: Theme.colors.warmStone
  },
  addOnRowChecked: {
    backgroundColor: 'rgba(15,15,15,0.03)'
  },
  addOnLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  squareBox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.white
  },
  squareBoxChecked: {
    backgroundColor: Theme.colors.luxuryBlack,
    borderColor: Theme.colors.luxuryBlack
  },
  checkmarkIcon: {
    color: Theme.colors.softIvory,
    fontSize: 10,
    fontFamily: Theme.fonts.bold,
    lineHeight: 12
  },
  addOnName: {
    fontFamily: Theme.fonts.medium,
    fontSize: 13,
    color: Theme.colors.textPrimary
  },
  addOnMeta: {
    fontFamily: Theme.fonts.regular,
    fontSize: 12,
    color: Theme.colors.textSecondary
  }
});