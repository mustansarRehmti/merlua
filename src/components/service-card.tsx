import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Theme } from '../theme/theme';
import type {
  CatalogAddOn,
  CatalogItem,
  CatalogLoadStatus,
} from '../features/catalog/catalog.types';
import {
  formatDuration,
  formatMoney,
} from '../features/catalog/catalog.utils';

interface ServiceCardProps {
  item: CatalogItem;
  isSelected: boolean;
  onSelect: () => void;
  addOns: CatalogAddOn[];
  selectedAddOnIds: string[];
  onToggleAddOn: (addOnId: string) => void;
  addOnsStatus: CatalogLoadStatus;
  addOnsErrorMessage?: string | null;
  onRetryAddOns: () => void;
}

export function ServiceCard({
  item,
  isSelected,
  onSelect,
  addOns,
  selectedAddOnIds,
  onToggleAddOn,
  addOnsStatus,
  addOnsErrorMessage,
  onRetryAddOns,
}: ServiceCardProps) {
  const isPackage = item.type === 'package';
  const servicesInPackage = isPackage ? item.services ?? [] : [];

  // ─── Package image slideshow ────────────────────────────────
  const packageImages: string[] = servicesInPackage
    .map(s => s.imageUrl)
    .filter(Boolean) as string[];
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isPackage || packageImages.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev === packageImages.length - 1 ? 0 : prev + 1));
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPackage, packageImages.length]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [item.id]);

  // ─── Meta subtext (service count + duration) ─────────────────
  const metaSubtextContent = (() => {
    if (isPackage) {
      const count = servicesInPackage.length;
      const dur = formatDuration(item.durationMinutes);
      return `${count} service${count !== 1 ? 's' : ''} • ${dur}`;
    }
    return formatDuration(item.durationMinutes);
  })();

  // ─── Render ────────────────────────────────────────────────
  return (
    <View
      style={[
        styles.cardContainer,
        isSelected && styles.cardContainerSelected,
      ]}
    >
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={`${item.name}, ${formatMoney(item.priceCents)}, ${metaSubtextContent}`}
        activeOpacity={0.85}
        onPress={onSelect}
        style={styles.clickableRegion}
      >
        {/* ── Image area ────────────────────────────────── */}
        {isPackage && packageImages.length > 0 ? (
          <View style={styles.mediaFrame}>
            {packageImages.map((uri, idx) => (
              <Image
                key={idx}
                source={{ uri }}
                style={[
                  styles.mediaFrame,
                  {
                    position: idx === currentIndex ? 'relative' : 'absolute',
                    opacity: idx === currentIndex ? 1 : 0,
                  },
                ]}
                resizeMode="cover"
              />
            ))}

            {packageImages.length > 1 && (
              <View style={styles.dotsContainer}>
                {packageImages.map((_, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.dot,
                      idx === currentIndex && styles.dotActive,
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
        ) : item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.mediaFrame}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.mediaFrame, styles.fallbackMedia]}>
            <Text style={styles.fallbackMediaText}>No image</Text>
          </View>
        )}

        {/* ── Text + price ──────────────────────────────── */}
        <View style={styles.textStack}>
          <View style={styles.badgeRow}>
            <Text style={styles.typeBadgeText}>
              {isPackage ? 'Package' : 'Service'}
            </Text>

            {item.categoryName ? (
              <Text style={styles.categoryText}>{item.categoryName}</Text>
            ) : null}
          </View>

          <Text style={styles.titleText}>{item.name}</Text>
          <Text style={styles.metaSubtext}>{metaSubtextContent}</Text>
        </View>

        <View style={styles.pricingSection}>
          <Text style={styles.priceLabel}>{formatMoney(item.priceCents)}</Text>

          <View style={[styles.radioFrame, isSelected && styles.radioFrameActive]}>
            {isSelected ? <View style={styles.radioCenterNode} /> : null}
          </View>
        </View>
      </TouchableOpacity>

      {/* ── Expanded drawer ───────────────────────────── */}
      {isSelected && (
        <View style={styles.drawerContent}>
          <View style={styles.divider} />

          {/* Description */}
          {item.description ? (
            <Text style={styles.descriptionBody}>{item.description}</Text>
          ) : (
            <Text style={styles.descriptionBodyMuted}>
              No description has been added for this {item.type}.
            </Text>
          )}

          {/* ── Included services (only for packages) ─── */}
          {isPackage && servicesInPackage.length > 0 && (
            <View style={styles.includedServicesContainer}>
              <Text style={styles.sectionHeader}>Included services</Text>
              {servicesInPackage.map(svc => (
                <View key={svc.id} style={styles.includedServiceRow}>
                  <Text style={styles.includedServiceName}>{svc.name}</Text>
                  <Text style={styles.includedServiceDuration}>
                    {formatDuration(svc.durationMinutes)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* ── Add‑ons (only for services) ──────────── */}
          {item.type === 'service' && (
            <>
              <Text style={styles.addOnSectionHeader}>Optional add-ons</Text>

              {addOnsStatus === 'loading' ? (
                <View style={styles.feedbackRow}>
                  <ActivityIndicator size="small" color={Theme.colors.luxuryBlack} />
                  <Text style={styles.feedbackText}>Loading add-ons...</Text>
                </View>
              ) : null}

              {addOnsStatus === 'failed' ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>
                    {addOnsErrorMessage ?? 'Could not load add-ons.'}
                  </Text>

                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel={`Retry loading add-ons for ${item.name}`}
                    onPress={onRetryAddOns}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.retryText}>Try again</Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              {addOnsStatus === 'succeeded' && addOns.length === 0 ? (
                <Text style={styles.descriptionBodyMuted}>
                  No add-ons are available for this service.
                </Text>
              ) : null}

              {addOnsStatus === 'succeeded'
                ? addOns.map(addOn => {
                    const isChecked = selectedAddOnIds.includes(addOn.id);

                    return (
                      <TouchableOpacity
                        key={addOn.id}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: isChecked }}
                        accessibilityLabel={`${addOn.name}, ${formatMoney(addOn.priceCents)}, ${formatDuration(addOn.durationMinutes)}`}
                        activeOpacity={0.8}
                        onPress={() => onToggleAddOn(addOn.id)}
                        style={[styles.addOnRow, isChecked && styles.addOnRowChecked]}
                      >
                        <View style={styles.addOnLeft}>
                          {addOn.imageUrl ? (
                            <Image
                              source={{ uri: addOn.imageUrl }}
                              style={styles.addOnImage}
                              resizeMode="cover"
                            />
                          ) : null}

                          <View style={[styles.squareBox, isChecked && styles.squareBoxChecked]}>
                            {isChecked ? <Text style={styles.checkmarkIcon}>✓</Text> : null}
                          </View>

                          <View style={styles.addOnTextStack}>
                            <Text style={styles.addOnName}>{addOn.name}</Text>

                            {addOn.description ? (
                              <Text style={styles.addOnDescription} numberOfLines={2}>
                                {addOn.description}
                              </Text>
                            ) : null}
                          </View>
                        </View>

                        <View style={styles.addOnMetaStack}>
                          <Text style={styles.addOnPrice}>
                            +{formatMoney(addOn.priceCents)}
                          </Text>
                          <Text style={styles.addOnDuration}>
                            {formatDuration(addOn.durationMinutes)}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })
                : null}
            </>
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
    marginBottom: Theme.spacing.s,
  },
  cardContainerSelected: {
    backgroundColor: Theme.colors.warmStone,
    borderColor: Theme.colors.luxuryBlack,
  },
  clickableRegion: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.s,
  },
  mediaFrame: {
    width: 76,
    height: 76,
    backgroundColor: Theme.colors.warmStone,
  },
  fallbackMedia: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  fallbackMediaText: {
    fontFamily: Theme.fonts.medium,
    fontSize: 10,
    textTransform: 'uppercase',
    color: Theme.colors.textSecondary,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 6,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Theme.colors.warmStone,
  },
  dotActive: {
    backgroundColor: Theme.colors.luxuryBlack,
    width: 12,
  },
  textStack: {
    flex: 1,
    marginLeft: Theme.spacing.s,
    paddingRight: Theme.spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 4,
  },
  typeBadgeText: {
    fontFamily: Theme.fonts.bold,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: Theme.colors.textSecondary,
    marginRight: 8,
  },
  categoryText: {
    fontFamily: Theme.fonts.medium,
    fontSize: 10,
    color: Theme.colors.textSecondary,
  },
  titleText: {
    fontFamily: Theme.fonts.semibold,
    fontSize: 14,
    color: Theme.colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metaSubtext: {
    fontFamily: Theme.fonts.regular,
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: 4,
  },
  pricingSection: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: 68,
  },
  priceLabel: {
    fontFamily: Theme.fonts.bold,
    fontSize: 14,
    color: Theme.colors.textPrimary,
  },
  radioFrame: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioFrameActive: {
    borderColor: Theme.colors.luxuryBlack,
  },
  radioCenterNode: {
    width: 10,
    height: 10,
    backgroundColor: Theme.colors.luxuryBlack,
  },
  drawerContent: {
    paddingHorizontal: Theme.spacing.s,
    paddingBottom: Theme.spacing.s,
  },
  divider: {
    height: 1,
    backgroundColor: Theme.colors.border,
    marginBottom: Theme.spacing.s,
  },
  descriptionBody: {
    fontFamily: Theme.fonts.regular,
    fontSize: 13,
    lineHeight: 19,
    color: Theme.colors.textPrimary,
  },
  descriptionBodyMuted: {
    fontFamily: Theme.fonts.regular,
    fontSize: 12,
    lineHeight: 18,
    color: Theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  // ─── Included services list (packages) ──────────────
  includedServicesContainer: {
    marginTop: Theme.spacing.s,
    marginBottom: Theme.spacing.s,
  },
  sectionHeader: {
    fontFamily: Theme.fonts.bold,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.xs,
  },
  includedServiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: Theme.colors.border,
  },
  includedServiceName: {
    fontFamily: Theme.fonts.regular,
    fontSize: 12,
    color: Theme.colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  includedServiceDuration: {
    fontFamily: Theme.fonts.regular,
    fontSize: 12,
    color: Theme.colors.textSecondary,
  },
  // ─── Add‑ons section ────────────────────────────────
  addOnSectionHeader: {
    fontFamily: Theme.fonts.bold,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: Theme.colors.textSecondary,
    marginTop: Theme.spacing.s,
    marginBottom: Theme.spacing.xs,
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.xs,
  },
  feedbackText: {
    marginLeft: Theme.spacing.xs,
    fontFamily: Theme.fonts.regular,
    fontSize: 12,
    color: Theme.colors.textSecondary,
  },
  errorBox: {
    padding: Theme.spacing.s,
    borderWidth: 1,
    borderColor: '#E1A3A3',
    backgroundColor: '#FFF6F6',
  },
  errorText: {
    fontFamily: Theme.fonts.regular,
    fontSize: 12,
    lineHeight: 18,
    color: '#BA1A1A',
  },
  retryText: {
    marginTop: Theme.spacing.xs,
    fontFamily: Theme.fonts.bold,
    fontSize: 12,
    textDecorationLine: 'underline',
    color: Theme.colors.luxuryBlack,
  },
  addOnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    padding: Theme.spacing.xs,
    marginTop: Theme.spacing.xs,
  },
  addOnRowChecked: {
    borderColor: Theme.colors.luxuryBlack,
  },
  addOnLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: Theme.spacing.xs,
  },
  addOnImage: {
    width: 40,
    height: 40,
    marginRight: Theme.spacing.xs,
    backgroundColor: Theme.colors.warmStone,
  },
  squareBox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.xs,
  },
  squareBoxChecked: {
    borderColor: Theme.colors.luxuryBlack,
    backgroundColor: Theme.colors.luxuryBlack,
  },
  checkmarkIcon: {
    color: Theme.colors.softIvory,
    fontFamily: Theme.fonts.bold,
    fontSize: 12,
  },
  addOnTextStack: {
    flex: 1,
  },
  addOnName: {
    fontFamily: Theme.fonts.semibold,
    fontSize: 12,
    color: Theme.colors.textPrimary,
  },
  addOnDescription: {
    marginTop: 2,
    fontFamily: Theme.fonts.regular,
    fontSize: 11,
    lineHeight: 15,
    color: Theme.colors.textSecondary,
  },
  addOnMetaStack: {
    alignItems: 'flex-end',
  },
  addOnPrice: {
    fontFamily: Theme.fonts.bold,
    fontSize: 12,
    color: Theme.colors.textPrimary,
  },
  addOnDuration: {
    marginTop: 2,
    fontFamily: Theme.fonts.regular,
    fontSize: 10,
    color: Theme.colors.textSecondary,
  },
});