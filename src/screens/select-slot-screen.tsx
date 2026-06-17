import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BookingLayout } from '../components/booking-layout';
import { CalendarStrip } from '../components/calendar-strip';
import { SlotPicker } from '../components/slot-picker';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  fetchBookingAvailability,
  fetchBookingSlots,
  selectBookingDate,
  selectBookingSlot,
} from '../features/booking/booking-draft.slice';
import {
  selectBookingAvailability,
  selectBookingAvailabilityError,
  selectBookingAvailabilityStatus,
  selectBookingSlots,
  selectBookingSlotsError,
  selectBookingSlotsStatus,
  selectDraftCatalogItem,
  selectDraftSelectedDate,
  selectDraftSelectedSlot,
  selectDraftSelectedStaff,
} from '../features/booking/booking-draft.selectors';
import { selectActiveTenantSlug } from '../features/tenant/tenant.selectors';
import {
  formatLongDate,
  generateDateStrip,
} from '../features/booking/booking.utils';
import { Theme } from '../theme/theme';

const BLOCKED_DAY_STATUSES = new Set([
  'CLOSED',
  'OFF',
  'UNAVAILABLE',
  'NO_AVAILABILITY',
]);

type DateItem = {
  dayName: string;
  dayNumber: string;
  fullDate: string;
};

export function SelectSlotScreen({ navigation }: any) {
  const dispatch = useAppDispatch();

  const activeSlug = useAppSelector(selectActiveTenantSlug);
  const selectedItem = useAppSelector(selectDraftCatalogItem);
  const selectedStaff = useAppSelector(selectDraftSelectedStaff);
  const selectedDate = useAppSelector(selectDraftSelectedDate);
  const selectedSlot = useAppSelector(selectDraftSelectedSlot);

  const availability = useAppSelector(selectBookingAvailability);
  const availabilityStatus = useAppSelector(selectBookingAvailabilityStatus);
  const availabilityError = useAppSelector(selectBookingAvailabilityError);

  const slots = useAppSelector(selectBookingSlots);
  const slotsStatus = useAppSelector(selectBookingSlotsStatus);
  const slotsError = useAppSelector(selectBookingSlotsError);

  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);

  const isAvailabilityLoading = availabilityStatus === 'loading';
  const isSlotsLoading = slotsStatus === 'loading';

  useEffect(() => {
    if (!activeSlug) {
      Alert.alert('Salon required', 'Choose a salon before selecting a time.');
      navigation.goBack();
      return;
    }

    if (!selectedItem) {
      Alert.alert('Service required', 'Choose a service or package first.');
      navigation.navigate('SelectService');
      return;
    }

    if (!selectedStaff) {
      Alert.alert('Professional required', 'Choose a professional first.');
      navigation.navigate('SelectStaff');
      return;
    }

    dispatch(fetchBookingAvailability({ slug: activeSlug }));
  }, [activeSlug, dispatch, navigation, selectedItem, selectedStaff]);

  const availableDates = useMemo(() => {
    const unavailableMap = new Map(
      availability?.days.map(day => [day.date, day]) ?? [],
    );

    return generateDateStrip(
      availability?.rangeStart,
      availability?.rangeEnd,
      60,
    ).filter(dateItem => {
      const backendDay = unavailableMap.get(dateItem.fullDate);

      if (!backendDay) return true;

      return !BLOCKED_DAY_STATUSES.has(backendDay.status.toUpperCase());
    });
  }, [availability]);

  useEffect(() => {
    if (!selectedDate && availableDates.length > 0) {
      dispatch(selectBookingDate(availableDates[0].fullDate));
    }
  }, [availableDates, dispatch, selectedDate]);

  useEffect(() => {
    if (!activeSlug || !selectedDate) return;

    dispatch(fetchBookingSlots({ slug: activeSlug, date: selectedDate }));
  }, [activeSlug, dispatch, selectedDate]);

  const groupedDates = useMemo(() => {
    return availableDates.reduce<Record<string, DateItem[]>>((acc, item) => {
      const date = new Date(`${item.fullDate}T00:00:00`);
      const key = Number.isNaN(date.getTime())
        ? 'Available Dates'
        : date.toLocaleDateString([], { month: 'long', year: 'numeric' });

      acc[key] = acc[key] ?? [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [availableDates]);

  const handleDateSelect = (date: string) => {
    dispatch(selectBookingDate(date));
    setDatePickerVisible(false);
  };

  const handleSlotSelect = (slotLabel: string) => {
    const slot = slots.find(currentSlot => currentSlot.label === slotLabel);
    if (!slot) return;

    dispatch(selectBookingSlot(slot));
    setTimePickerVisible(false);
  };

  const handleContinue = () => {
    if (!selectedSlot) return;
    navigation.navigate('CustomerDetails');
  };

  return (
    <BookingLayout
      step={3}
      stepTitle="Select Slot"
      onBackPress={() => navigation.goBack()}
      onForwardPress={handleContinue}
      isForwardDisabled={!selectedSlot}
      forwardLabel="Confirm Slot & Proceed"
    >
      <ScrollView style={styles.scrollCanvas} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionMarker}>Available Dates</Text>

        {isAvailabilityLoading ? (
          <View style={styles.stateBox}>
            <ActivityIndicator size="large" color={Theme.colors.luxuryBlack} />
            <Text style={styles.stateText}>Checking calendar availability...</Text>
          </View>
        ) : availabilityError ? (
          <View style={styles.stateBox}>
            <Text style={styles.errorText}>{availabilityError.message}</Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                if (activeSlug) dispatch(fetchBookingAvailability({ slug: activeSlug }));
              }}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : availableDates.length === 0 ? (
          <View style={styles.stateBox}>
            <Text style={styles.stateTitle}>No dates available</Text>
            <Text style={styles.stateText}>
              There are no available booking dates for this selection.
            </Text>
          </View>
        ) : (
          <>
            <CalendarStrip
              dates={availableDates.slice(0, 14)}
              selectedDate={selectedDate ?? ''}
              onDateSelect={handleDateSelect}
            />

            <View style={styles.pickerSummaryRow}>
              <View style={styles.selectedPill}>
                <Text style={styles.selectedPillLabel}>Selected date</Text>
                <Text style={styles.selectedPillValue}>
                  {selectedDate ? formatLongDate(selectedDate) : 'Choose a date'}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.secondaryPickerButton}
                onPress={() => setDatePickerVisible(true)}
                activeOpacity={0.85}
              >
                <Text style={styles.secondaryPickerButtonText}>Open Calendar</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <View style={styles.spacingDivider} />

        <Text style={styles.sectionMarker}>Available Times</Text>

        {!selectedDate ? (
          <View style={styles.stateBox}>
            <Text style={styles.stateText}>Choose a date to view times.</Text>
          </View>
        ) : isSlotsLoading ? (
          <View style={styles.stateBox}>
            <ActivityIndicator size="large" color={Theme.colors.luxuryBlack} />
            <Text style={styles.stateText}>Loading available times...</Text>
          </View>
        ) : slotsError ? (
          <View style={styles.stateBox}>
            <Text style={styles.errorText}>{slotsError.message}</Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                if (activeSlug && selectedDate) {
                  dispatch(fetchBookingSlots({ slug: activeSlug, date: selectedDate }));
                }
              }}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : slots.length === 0 ? (
          <View style={styles.stateBox}>
            <Text style={styles.stateTitle}>No times available</Text>
            <Text style={styles.stateText}>
              Try another date or choose Any Available Professional.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.pickerSummaryRow}>
              <View style={styles.selectedPill}>
                <Text style={styles.selectedPillLabel}>Selected time</Text>
                <Text style={styles.selectedPillValue}>
                  {selectedSlot?.label ?? 'Choose a time'}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.secondaryPickerButton}
                onPress={() => setTimePickerVisible(true)}
                activeOpacity={0.85}
              >
                <Text style={styles.secondaryPickerButtonText}>Open Time Picker</Text>
              </TouchableOpacity>
            </View>

            <SlotPicker
              slots={slots.map(slot => slot.label)}
              selectedSlot={selectedSlot?.label ?? ''}
              onSlotSelect={handleSlotSelect}
            />
          </>
        )}

        <View style={styles.bottomBuffer} />
      </ScrollView>

      <Modal
        animationType="slide"
        transparent
        visible={datePickerVisible}
        onRequestClose={() => setDatePickerVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setDatePickerVisible(false)}
        >
          <Pressable style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Choose Date</Text>
                <Text style={styles.modalSubtitle}>Book up to 60 days ahead</Text>
              </View>

              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setDatePickerVisible(false)}
              >
                <Text style={styles.modalCloseButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {Object.entries(groupedDates).map(([month, dates]) => (
                <View key={month} style={styles.monthBlock}>
                  <Text style={styles.monthTitle}>{month}</Text>

                  <View style={styles.dateGrid}>
                    {dates.map(item => {
                      const selected = selectedDate === item.fullDate;

                      return (
                        <TouchableOpacity
                          key={item.fullDate}
                          style={[
                            styles.dateCell,
                            selected && styles.dateCellSelected,
                          ]}
                          onPress={() => handleDateSelect(item.fullDate)}
                          activeOpacity={0.85}
                        >
                          <Text
                            style={[
                              styles.dateCellDay,
                              selected && styles.dateCellTextSelected,
                            ]}
                          >
                            {item.dayName}
                          </Text>
                          <Text
                            style={[
                              styles.dateCellNumber,
                              selected && styles.dateCellTextSelected,
                            ]}
                          >
                            {item.dayNumber}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        animationType="slide"
        transparent
        visible={timePickerVisible}
        onRequestClose={() => setTimePickerVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setTimePickerVisible(false)}
        >
          <Pressable style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Choose Time</Text>
                <Text style={styles.modalSubtitle}>
                  {selectedDate ? formatLongDate(selectedDate) : 'Available slots'}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setTimePickerVisible(false)}
              >
                <Text style={styles.modalCloseButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={slots}
              keyExtractor={item => item.id}
              numColumns={2}
              columnWrapperStyle={styles.timeModalRow}
              contentContainerStyle={styles.timeModalList}
              renderItem={({ item }) => {
                const selected = selectedSlot?.id === item.id;

                return (
                  <TouchableOpacity
                    style={[
                      styles.timeCell,
                      selected && styles.timeCellSelected,
                    ]}
                    onPress={() => handleSlotSelect(item.label)}
                    activeOpacity={0.85}
                  >
                    <Text
                      style={[
                        styles.timeCellText,
                        selected && styles.timeCellTextSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </BookingLayout>
  );
}

const styles = StyleSheet.create({
  scrollCanvas: {
    flex: 1,
    backgroundColor: Theme.colors.softIvory,
  },
  sectionMarker: {
    fontFamily: Theme.fonts.bold,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: Theme.colors.textSecondary,
    marginLeft: Theme.spacing.m,
    marginTop: Theme.spacing.m,
    marginBottom: Theme.spacing.xs,
  },
  pickerSummaryRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.m,
    marginTop: Theme.spacing.s,
  },
  selectedPill: {
    flex: 1,
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    padding: Theme.spacing.s,
  },
  selectedPillLabel: {
    fontFamily: Theme.fonts.bold,
    fontSize: 9,
    color: Theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  selectedPillValue: {
    fontFamily: Theme.fonts.semibold,
    fontSize: 13,
    color: Theme.colors.textPrimary,
  },
  secondaryPickerButton: {
    minWidth: 128,
    backgroundColor: Theme.colors.luxuryBlack,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing.s,
  },
  secondaryPickerButtonText: {
    fontFamily: Theme.fonts.bold,
    fontSize: 10,
    color: Theme.colors.softIvory,
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
  },
  spacingDivider: {
    height: 1,
    backgroundColor: Theme.colors.warmStone,
    marginHorizontal: Theme.spacing.m,
    marginVertical: Theme.spacing.s,
  },
  stateBox: {
    padding: Theme.spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
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
  bottomBuffer: {
    height: Theme.spacing.xl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 15, 15, 0.35)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    maxHeight: '82%',
    backgroundColor: Theme.colors.softIvory,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: Theme.spacing.m,
    paddingTop: Theme.spacing.m,
    paddingBottom: Theme.spacing.l,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.s,
  },
  modalTitle: {
    fontFamily: Theme.fonts.semibold,
    fontSize: 22,
    color: Theme.colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalSubtitle: {
    fontFamily: Theme.fonts.regular,
    fontSize: 13,
    color: Theme.colors.textSecondary,
    marginTop: 4,
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    backgroundColor: Theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseButtonText: {
    fontFamily: Theme.fonts.bold,
    fontSize: 24,
    lineHeight: 26,
    color: Theme.colors.textPrimary,
  },
  monthBlock: {
    marginBottom: Theme.spacing.m,
  },
  monthTitle: {
    fontFamily: Theme.fonts.bold,
    fontSize: 11,
    color: Theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    marginBottom: Theme.spacing.xs,
  },
  dateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  dateCell: {
    width: '22.8%',
    minHeight: 72,
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateCellSelected: {
    backgroundColor: Theme.colors.luxuryBlack,
    borderColor: Theme.colors.luxuryBlack,
  },
  dateCellDay: {
    fontFamily: Theme.fonts.medium,
    fontSize: 10,
    color: Theme.colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  dateCellNumber: {
    fontFamily: Theme.fonts.bold,
    fontSize: 20,
    color: Theme.colors.textPrimary,
    marginTop: 4,
  },
  dateCellTextSelected: {
    color: Theme.colors.softIvory,
  },
  timeModalList: {
    paddingBottom: Theme.spacing.s,
  },
  timeModalRow: {
    gap: Theme.spacing.xs,
  },
  timeCell: {
    flex: 1,
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.xs,
  },
  timeCellSelected: {
    backgroundColor: Theme.colors.luxuryBlack,
    borderColor: Theme.colors.luxuryBlack,
  },
  timeCellText: {
    fontFamily: Theme.fonts.semibold,
    fontSize: 14,
    color: Theme.colors.textPrimary,
  },
  timeCellTextSelected: {
    color: Theme.colors.softIvory,
  },
});
