import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookingHeader } from '../components/booking-header';
import { StaffSelector } from '../components/staff-selector';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  fetchBookingStaffOptions,
  selectAnyStaff,
  selectSpecificStaff,
} from '../features/booking/booking-draft.slice';
import {
  selectBookingStaffError,
  selectBookingStaffOptions,
  selectBookingStaffStatus,
  selectDraftCatalogItem,
  selectDraftSelectedStaff,
} from '../features/booking/booking-draft.selectors';
import { selectActiveTenantSlug } from '../features/tenant/tenant.selectors';
import { Theme } from '../theme/theme';

export function SelectStaffScreen({ navigation }: any) {
  const dispatch = useAppDispatch();

  const activeSlug = useAppSelector(selectActiveTenantSlug);
  const selectedItem = useAppSelector(selectDraftCatalogItem);
  const selectedStaff = useAppSelector(selectDraftSelectedStaff);

  const staffOptions = useAppSelector(selectBookingStaffOptions);
  const staffStatus = useAppSelector(selectBookingStaffStatus);
  const staffError = useAppSelector(selectBookingStaffError);

  const [searchQuery, setSearchQuery] = useState('');

  const isLoading = staffStatus === 'loading';

  useEffect(() => {
    if (!activeSlug) {
      Alert.alert('Salon required', 'Choose a salon before selecting staff.');
      navigation.goBack();
      return;
    }

    if (!selectedItem) {
      Alert.alert(
        'Service required',
        'Choose a service or package before selecting staff.',
      );
      navigation.goBack();
      return;
    }

    dispatch(fetchBookingStaffOptions({ slug: activeSlug }));
  }, [activeSlug, dispatch, navigation, selectedItem]);

  const filteredStaff = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return staffOptions;

    return staffOptions.filter(staff =>
      staff.name.toLowerCase().includes(query),
    );
  }, [searchQuery, staffOptions]);

  const canContinue = Boolean(selectedStaff);

  const handleContinue = () => {
    if (!selectedStaff) return;
    navigation.navigate('SelectSlot');
  };

  return (
    <SafeAreaView style={styles.outerContainer} edges={['top', 'left', 'right']}>
      <BookingHeader
        title="Select Professional"
        step={2}
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.searchBoxFrame}>
        <TextInput
          style={styles.inputField}
          placeholder="Search capable professionals..."
          placeholderTextColor={Theme.colors.border}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCorrect={false}
        />
      </View>

      {isLoading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={Theme.colors.luxuryBlack} />
          <Text style={styles.stateText}>Finding capable professionals...</Text>
        </View>
      ) : staffError ? (
        <View style={styles.centerState}>
          <Text style={styles.errorText}>{staffError.message}</Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              if (activeSlug) dispatch(fetchBookingStaffOptions({ slug: activeSlug }));
            }}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : staffOptions.length === 0 ? (
        <View style={styles.centerState}>
          <Text style={styles.stateTitle}>No capable professionals</Text>
          <Text style={styles.stateText}>
            No staff member can perform the selected service, package, and add-ons.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredStaff}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.scrollListContainer}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View>
              <StaffSelector
                id="any"
                name="Any Available Professional"
                role="Fastest booking. We will assign a capable available professional."
                isSelected={selectedStaff?.mode === 'any'}
                onSelect={() => dispatch(selectAnyStaff())}
                isAnyStaffVariant
              />

              <Text style={styles.capableLabel}>
                Specific capable professionals
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptySearchState}>
              <Text style={styles.stateText}>No capable professional matches your search.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <StaffSelector
              id={item.id}
              name={item.name}
              role="Can perform your selected booking"
              isSelected={
                selectedStaff?.mode === 'specific' &&
                selectedStaff.id === item.id
              }
              onSelect={() => dispatch(selectSpecificStaff(item))}
            />
          )}
        />
      )}

      <View style={styles.stickyFooter}>
        <TouchableOpacity
          style={[styles.primarySubmitBtn, !canContinue && styles.primarySubmitBtnDisabled]}
          disabled={!canContinue}
          onPress={handleContinue}
          activeOpacity={0.9}
        >
          <Text
            style={[
              styles.primarySubmitBtnText,
              !canContinue && styles.primarySubmitBtnTextDisabled,
            ]}
          >
            Confirm Professional & Proceed
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
    borderRadius: 0,
  },
  scrollListContainer: {
    paddingHorizontal: Theme.spacing.m,
    paddingTop: 12,
    paddingBottom: Theme.spacing.l,
  },
  capableLabel: {
    fontFamily: Theme.fonts.bold,
    fontSize: 10,
    color: Theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    marginTop: Theme.spacing.s,
    marginBottom: Theme.spacing.xs,
  },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.m,
  },
  emptySearchState: {
    paddingVertical: Theme.spacing.l,
    alignItems: 'center',
  },
  stateTitle: {
    fontFamily: Theme.fonts.semibold,
    fontSize: 18,
    color: Theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  stateText: {
    fontFamily: Theme.fonts.regular,
    fontSize: 14,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 10,
  },
  errorText: {
    fontFamily: Theme.fonts.regular,
    fontSize: 14,
    color: '#BA1A1A',
    textAlign: 'center',
    lineHeight: 20,
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
    fontSize: 11,
    color: Theme.colors.luxuryBlack,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  stickyFooter: {
    paddingHorizontal: Theme.spacing.m,
    paddingVertical: Theme.spacing.s,
    borderTopWidth: 1,
    borderColor: Theme.colors.warmStone,
    backgroundColor: Theme.colors.white,
  },
  primarySubmitBtn: {
    backgroundColor: Theme.colors.luxuryBlack,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 0,
  },
  primarySubmitBtnDisabled: {
    backgroundColor: Theme.colors.warmStone,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    opacity: 1,
  },
  primarySubmitBtnText: {
    fontFamily: Theme.fonts.bold,
    color: Theme.colors.softIvory,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  primarySubmitBtnTextDisabled: {
    color: Theme.colors.textSecondary,
  },
});
