import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import { Theme } from '../theme/theme';

interface SelectedAddOn {
  durationMinutes: number;
  id: string;
  name: string;
  price: number;
}

interface SummaryItemCardProps {
  name: string;
  price: number;
  durationMinutes: number;
  addOns?: SelectedAddOn[];
  onRemove?: () => void;
  showRemoveButton?: boolean;
}

export function SummaryItemCard({
  name,
  price,
  durationMinutes,
  addOns = [],
  onRemove,
  showRemoveButton = true
}: SummaryItemCardProps) {
  
  // Calculate total price for this specific row block
  const addOnsTotal = addOns.reduce((sum, item) => sum + item.price, 0);
  const aggregatePrice = price + addOnsTotal;
  const aggregateDuration = durationMinutes + addOns.reduce((sum, item) => sum + item.durationMinutes, 0);

  return (
    <Animated.View 
      entering={FadeInLeft.duration(300)} 
      style={styles.cardContainer}
    >
      <View style={styles.mainRow}>
        <View style={styles.leftMeta}>
          <Text style={styles.serviceNameText}>{name}</Text>
          <Text style={styles.durationSubtext}>{aggregateDuration} Mins Total Allocation</Text>
        </View>
        <View style={styles.rightPricing}>
          <Text style={styles.priceLabel}>${aggregatePrice.toFixed(2)}</Text>
          {showRemoveButton && onRemove && (
            <TouchableOpacity onPress={onRemove} activeOpacity={0.7} style={styles.removeAction}>
              <Text style={styles.removeActionText}>Remove</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Render sub-addons subheaders if any checked dependencies exist */}
      {addOns.length > 0 && (
        <View style={styles.addOnsWrapper}>
          <Text style={styles.addOnsHeading}>Selected Add-ons:</Text>
          {addOns.map((addOn) => (
            <View key={addOn.id} style={styles.addOnRow}>
              <Text style={styles.addOnNameText}>+ {addOn.name}</Text>
              <Text style={styles.addOnPriceText}>${addOn.price.toFixed(2)}</Text>
            </View>
          ))}
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    padding: Theme.spacing.s,
    marginBottom: Theme.spacing.s,
    borderRadius: 0
  },
  mainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  leftMeta: {
    flex: 1,
    paddingRight: Theme.spacing.xs
  },
  serviceNameText: {
    fontFamily: Theme.fonts.semibold,
    fontSize: 15,
    color: Theme.colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  durationSubtext: {
    fontFamily: Theme.fonts.regular,
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: 4
  },
  rightPricing: {
    alignItems: 'flex-end'
  },
  priceLabel: {
    fontFamily: Theme.fonts.bold,
    fontSize: 16,
    color: Theme.colors.textPrimary
  },
  removeAction: {
    marginTop: 6,
    paddingVertical: 2
  },
  removeActionText: {
    fontFamily: Theme.fonts.medium,
    fontSize: 11,
    color: '#BA1A1A', // Editorial alert warning accent color
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  addOnsWrapper: {
    marginTop: Theme.spacing.s,
    paddingTop: Theme.spacing.xs,
    borderTopWidth: 0.5,
    borderColor: Theme.colors.warmStone
  },
  addOnsHeading: {
    fontFamily: Theme.fonts.bold,
    fontSize: 10,
    textTransform: 'uppercase',
    color: Theme.colors.textPrimary,
    letterSpacing: 0.5,
    marginBottom: 4
  },
  addOnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2
  },
  addOnNameText: {
    fontFamily: Theme.fonts.regular,
    fontSize: 12,
    color: Theme.colors.textSecondary
  },
  addOnPriceText: {
    fontFamily: Theme.fonts.medium,
    fontSize: 12,
    color: Theme.colors.textPrimary
  }
});