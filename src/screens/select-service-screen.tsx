import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookingHeader } from '../components/booking-header';
import { ServiceCard } from '../components/service-card';
import { Theme } from '../theme/theme';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectActiveTenantSlug } from '../features/tenant/tenant.selectors';
import {
  clearCatalogSelection,
  selectCatalogItem,
  toggleSelectedAddOn,
} from '../features/booking/booking-draft.slice';
import {
  selectDraftAddOnIds,
  selectDraftCatalogItem,
} from '../features/booking/booking-draft.selectors';
import {
  fetchCatalogItemAddOns,
  fetchPublicCatalog,
} from '../features/catalog/catalog.slice';
import {
  selectCatalogError,
  selectCatalogStatus,
  selectLoadedCatalogSlug,
  selectPackages,
  selectServices,
} from '../features/catalog/catalog.selectors';
import type {
  CatalogItem,
  CatalogItemType,
} from '../features/catalog/catalog.types';
import {
  formatDuration,
  formatMoney,
  getCatalogAddOnsKey,
  getCatalogItemKey,
} from '../features/catalog/catalog.utils';

export function SelectServiceScreen({ navigation }: any) {
  const dispatch = useAppDispatch();
  const slug = useAppSelector(selectActiveTenantSlug);
  const catalogStatus = useAppSelector(selectCatalogStatus);
  const catalogError = useAppSelector(selectCatalogError);
  const loadedCatalogSlug = useAppSelector(selectLoadedCatalogSlug);
  const services = useAppSelector(selectServices);
  const packages = useAppSelector(selectPackages);
  const selectedItem = useAppSelector(selectDraftCatalogItem);
  const selectedAddOnIds = useAppSelector(selectDraftAddOnIds);

  const [activeFlowType, setActiveFlowType] = useState<CatalogItemType>('service');
  const [searchFilter, setSearchFilter] = useState('');

  // ─── Fetch catalog ─────────────────────────────────────
  useEffect(() => {
    if (
      slug &&
      catalogStatus !== 'loading' &&
      (catalogStatus === 'idle' || loadedCatalogSlug !== slug)
    ) {
      dispatch(fetchPublicCatalog({ slug }));
    }
  }, [catalogStatus, dispatch, loadedCatalogSlug, slug]);

  useEffect(() => {
    if (!selectedItem || catalogStatus !== 'succeeded') return;

    const currentItems = selectedItem.type === 'service' ? services : packages;
    const stillExists = currentItems.some(item => item.id === selectedItem.id);

    if (!stillExists) dispatch(clearCatalogSelection());
  }, [catalogStatus, dispatch, packages, selectedItem, services]);

  const visibleItems = useMemo(() => {
    const normalizedSearch = searchFilter.trim().toLowerCase();
    const items = activeFlowType === 'service' ? services : packages;

    if (!normalizedSearch) return items;

    return items.filter(item =>
      [item.name, item.description, item.categoryName ?? '']
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [activeFlowType, packages, searchFilter, services]);

  // ─── Selected item & add‑ons (only for services) ──────
  const selectedItemKey = selectedItem
    ? getCatalogItemKey(selectedItem.type, selectedItem.id)
    : null;

  // Only build the add‑ons key for services
  const selectedAddOnsKey =
    selectedItem && slug && selectedItem.type === 'service'
      ? getCatalogAddOnsKey(slug, selectedItem.type, selectedItem.id)
      : null;

  const selectedAddOns = useAppSelector(state =>
    selectedAddOnsKey ? state.catalog.addOnsByItemKey[selectedAddOnsKey] ?? [] : [],
  );

  const selectedAddOnsStatus = useAppSelector(state =>
    selectedAddOnsKey
      ? state.catalog.addOnsStatusByItemKey[selectedAddOnsKey] ?? 'idle'
      : 'idle',
  );

  const selectedAddOnsError = useAppSelector(state =>
    selectedAddOnsKey
      ? state.catalog.addOnsErrorByItemKey[selectedAddOnsKey] ?? null
      : null,
  );

  const totalPriceCents = useMemo(() => {
    if (!selectedItem) return 0;

    return selectedAddOns
      .filter(addOn => selectedAddOnIds.includes(addOn.id))
      .reduce((total, addOn) => total + addOn.priceCents, selectedItem.priceCents);
  }, [selectedAddOnIds, selectedAddOns, selectedItem]);

  const totalDurationMinutes = useMemo(() => {
    if (!selectedItem) return 0;

    return selectedAddOns
      .filter(addOn => selectedAddOnIds.includes(addOn.id))
      .reduce(
        (total, addOn) => total + addOn.durationMinutes,
        selectedItem.durationMinutes,
      );
  }, [selectedAddOnIds, selectedAddOns, selectedItem]);

  // ─── Can continue? ─────────────────────────────────────
  const canContinue = useMemo(() => {
    if (!selectedItem) return false;
    if (selectedItem.type === 'package') return true;               // no add‑ons for packages
    return selectedAddOnsStatus === 'succeeded';                   // for services, add‑ons must be loaded
  }, [selectedItem, selectedAddOnsStatus]);

  const refreshCatalog = () => {
    if (slug) dispatch(fetchPublicCatalog({ slug }));
  };

  // Only fetch add‑ons for services
  const loadAddOns = (item: CatalogItem, force = false) => {
    if (!slug || item.type === 'package') return;

    dispatch(
      fetchCatalogItemAddOns({
        slug,
        itemId: item.id,
        itemType: item.type,
        force,
      }),
    );
  };

  const handleSelection = (item: CatalogItem) => {
    dispatch(selectCatalogItem(item));
    // Only services get add‑ons loaded
    if (item.type === 'service') {
      loadAddOns(item);
    }
  };

  const handleTabChange = (nextType: CatalogItemType) => {
    setActiveFlowType(nextType);
    dispatch(clearCatalogSelection());
  };

  // ─── No slug? ──────────────────────────────────────────
  if (!slug) {
    return (
      <SafeAreaView style={styles.outerContainer} edges={['top', 'left', 'right']}>
        <BookingHeader title="Choose a Service" step={1} />
        <View style={styles.centerState}>
          <Text style={styles.stateTitle}>Salon not selected</Text>
          <Text style={styles.stateBody}>
            Return to login and choose a salon before booking.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.outerContainer} edges={['top', 'left', 'right']}>
      <BookingHeader title="Choose a Service" step={1} />

      <View style={styles.utilityAccountRow}>
        <Text style={styles.clientGreetingText}>
          Browse available services and packages
        </Text>

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Open account and bookings"
          style={styles.profileActionLink}
          onPress={() => navigation.navigate('Profile')}
          activeOpacity={0.7}
        >
          <Text style={styles.profileLinkText}>Account & Bookings ↗</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.switcherWrapper}>
        <TouchableOpacity
          accessibilityRole="tab"
          accessibilityState={{ selected: activeFlowType === 'service' }}
          style={[
            styles.switcherTab,
            activeFlowType === 'service' && styles.switcherTabActive,
          ]}
          onPress={() => handleTabChange('service')}
          activeOpacity={0.9}
        >
          <Text
            style={[
              styles.switcherTabText,
              activeFlowType === 'service' && styles.switcherTabTextActive,
            ]}
          >
            Services
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityRole="tab"
          accessibilityState={{ selected: activeFlowType === 'package' }}
          style={[
            styles.switcherTab,
            activeFlowType === 'package' && styles.switcherTabActive,
          ]}
          onPress={() => handleTabChange('package')}
          activeOpacity={0.9}
        >
          <Text
            style={[
              styles.switcherTabText,
              activeFlowType === 'package' && styles.switcherTabTextActive,
            ]}
          >
            Packages
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBoxFrame}>
        <TextInput
          accessibilityLabel="Search available services and packages"
          style={styles.inputField}
          placeholder="Search services or packages"
          placeholderTextColor={Theme.colors.textSecondary}
          value={searchFilter}
          onChangeText={setSearchFilter}
          autoCorrect={false}
        />
      </View>

      {catalogStatus === 'loading' && services.length === 0 && packages.length === 0 ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={Theme.colors.luxuryBlack} />
          <Text style={styles.stateBody}>Loading available options...</Text>
        </View>
      ) : null}

      {catalogStatus === 'failed' ? (
        <View style={styles.centerState}>
          <Text style={styles.stateTitle}>Could not load booking options</Text>
          <Text style={styles.stateBody}>
            {catalogError?.message ?? 'Please check your connection and try again.'}
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Retry loading services and packages"
            style={styles.retryButton}
            onPress={refreshCatalog}
            activeOpacity={0.8}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {catalogStatus !== 'failed' &&
      !(catalogStatus === 'loading' && services.length === 0 && packages.length === 0) ? (
        <FlatList
          data={visibleItems}
          keyExtractor={item => `${item.type}:${item.id}`}
          contentContainerStyle={[
            styles.scrollListContainer,
            visibleItems.length === 0 && styles.scrollListContainerEmpty,
          ]}
          refreshControl={
            <RefreshControl
              refreshing={catalogStatus === 'loading'}
              onRefresh={refreshCatalog}
            />
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.centerState}>
              <Text style={styles.stateTitle}>
                {searchFilter.trim()
                  ? 'No matching options found'
                  : activeFlowType === 'service'
                    ? 'No services available'
                    : 'No packages available'}
              </Text>
              <Text style={styles.stateBody}>
                {searchFilter.trim()
                  ? 'Try a different search term.'
                  : 'This salon has not added any options in this section yet.'}
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const itemKey = getCatalogItemKey(item.type, item.id);
            const isSelected = selectedItemKey === itemKey;
            // For services, pass the loaded add‑ons; for packages, always empty
            const addOns = isSelected && item.type === 'service' ? selectedAddOns : [];
            const addOnsStatus = isSelected && item.type === 'service' ? selectedAddOnsStatus : 'idle';
            const addOnsError = isSelected && item.type === 'service' ? selectedAddOnsError : null;

            return (
              <ServiceCard
                item={item}
                isSelected={isSelected}
                onSelect={() => handleSelection(item)}
                addOns={addOns}
                selectedAddOnIds={selectedAddOnIds}
                onToggleAddOn={addOnId => dispatch(toggleSelectedAddOn(addOnId))}
                addOnsStatus={addOnsStatus}
                addOnsErrorMessage={addOnsError?.message}
                onRetryAddOns={() => loadAddOns(item, true)}
              />
            );
          }}
        />
      ) : null}

      {/* ── Fixed bottom bar ────────────────────────────── */}
      <View style={styles.stickyFooter}>
        {selectedItem ? (
          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.summaryLabel}>Selected total</Text>
              <Text style={styles.summaryValue}>{formatMoney(totalPriceCents)}</Text>
            </View>

            <Text style={styles.summaryDuration}>
              {formatDuration(totalDurationMinutes)}
            </Text>
          </View>
        ) : null}

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Continue to select a professional"
          style={[
            styles.primarySubmitButton,
            !canContinue && styles.primarySubmitButtonDisabled,
          ]}
          disabled={!canContinue}
          onPress={() => navigation.navigate('SelectStaff')}
          activeOpacity={0.9}
        >
          <Text
            style={[
              styles.primarySubmitButtonText,
              !canContinue && { color: Theme.colors.textSecondary },
            ]}
          >
            {selectedItem && selectedItem.type === 'service' && selectedAddOnsStatus === 'loading'
              ? 'Loading Add-ons...'
              : selectedItem && selectedItem.type === 'service' && selectedAddOnsStatus === 'failed'
                ? 'Retry Add-ons to Continue'
                : 'Continue to Professional'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: Theme.colors.softIvory,
  },
  utilityAccountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: Theme.spacing.m,
    marginTop: Theme.spacing.s,
    paddingBottom: Theme.spacing.xs,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  clientGreetingText: {
    flex: 1,
    paddingRight: Theme.spacing.xs,
    fontFamily: Theme.fonts.regular,
    fontSize: 11,
    color: Theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  profileActionLink: {
    paddingVertical: 4,
    paddingLeft: 8,
  },
  profileLinkText: {
    fontFamily: Theme.fonts.bold,
    fontSize: 11,
    color: Theme.colors.luxuryBlack,
    letterSpacing: 0.5,
  },
  switcherWrapper: {
    flexDirection: 'row',
    marginHorizontal: Theme.spacing.m,
    marginTop: Theme.spacing.s,
    borderWidth: 1,
    borderColor: Theme.colors.luxuryBlack,
    backgroundColor: Theme.colors.white,
  },
  switcherTab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switcherTabActive: {
    backgroundColor: Theme.colors.luxuryBlack,
  },
  switcherTabText: {
    fontFamily: Theme.fonts.bold,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: Theme.colors.textPrimary,
  },
  switcherTabTextActive: {
    color: Theme.colors.softIvory,
  },
  searchBoxFrame: {
    marginHorizontal: Theme.spacing.m,
    marginTop: Theme.spacing.s,
    marginBottom: Theme.spacing.xs,
  },
  inputField: {
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    paddingHorizontal: Theme.spacing.s,
    paddingVertical: 14,
    fontSize: 14,
    color: Theme.colors.textPrimary,
    fontFamily: Theme.fonts.regular,
  },
  scrollListContainer: {
    paddingHorizontal: Theme.spacing.m,
    paddingTop: 12,
    paddingBottom: Theme.spacing.l,
  },
  scrollListContainerEmpty: {
    flexGrow: 1,
  },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.l,
  },
  stateTitle: {
    marginTop: Theme.spacing.s,
    fontFamily: Theme.fonts.bold,
    fontSize: 15,
    color: Theme.colors.textPrimary,
    textAlign: 'center',
  },
  stateBody: {
    marginTop: Theme.spacing.xs,
    fontFamily: Theme.fonts.regular,
    fontSize: 13,
    lineHeight: 19,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: Theme.spacing.s,
    borderWidth: 1,
    borderColor: Theme.colors.luxuryBlack,
    paddingHorizontal: Theme.spacing.m,
    paddingVertical: 12,
  },
  retryButtonText: {
    fontFamily: Theme.fonts.bold,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: Theme.colors.luxuryBlack,
  },
  stickyFooter: {
    paddingHorizontal: Theme.spacing.m,
    paddingVertical: Theme.spacing.s,
    borderTopWidth: 1,
    borderColor: Theme.colors.warmStone,
    backgroundColor: Theme.colors.white,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: Theme.spacing.xs,
  },
  summaryLabel: {
    fontFamily: Theme.fonts.medium,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: Theme.colors.textSecondary,
  },
  summaryValue: {
    marginTop: 2,
    fontFamily: Theme.fonts.bold,
    fontSize: 18,
    color: Theme.colors.textPrimary,
  },
  summaryDuration: {
    fontFamily: Theme.fonts.semibold,
    fontSize: 12,
    color: Theme.colors.textSecondary,
  },
  primarySubmitButton: {
    backgroundColor: Theme.colors.luxuryBlack,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primarySubmitButtonDisabled: {
    backgroundColor: Theme.colors.border,
  },
  primarySubmitButtonText: {
    fontFamily: Theme.fonts.bold,
    color: Theme.colors.softIvory,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
});