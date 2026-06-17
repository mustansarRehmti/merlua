import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { normalizeApiError } from '../../lib/api/api-error';
import type { RootState } from '../../app/store';
import type { CatalogItem } from '../catalog/catalog.types';
import { getCatalogItemKey } from '../catalog/catalog.utils';
import type {
  BookingAvailabilityCalendar,
  BookingCustomerDetails,
  BookingDraftState,
  BookingSignedConsent,
  BookingSlot,
  BookingStaffOption,
} from './booking-draft.types';
import * as bookingService from './booking.service';
import {
  normalizeAvailabilityCalendar,
  normalizeSlots,
  normalizeStaffOptions,
} from './booking.utils';

const initialState: BookingDraftState = {
  selectedItem: null,
  selectedAddOnIds: [],

  selectedStaff: null,
  selectedDate: null,
  selectedSlot: null,

  customerDetails: {
    name: '',
    email: '',
    phone: '',
  },
  notes: '',
  promoCodeName: '',
  isPaymentComplete: false,
  signedConsents: [],

  staffOptions: [],
  staffStatus: 'idle',
  staffError: null,

  availability: null,
  availabilityStatus: 'idle',
  availabilityError: null,

  slots: [],
  slotsStatus: 'idle',
  slotsError: null,
};

function clearScheduleState(state: BookingDraftState) {
  state.selectedStaff = null;
  state.selectedDate = null;
  state.selectedSlot = null;

  state.staffOptions = [];
  state.staffStatus = 'idle';
  state.staffError = null;

  state.availability = null;
  state.availabilityStatus = 'idle';
  state.availabilityError = null;

  state.slots = [];
  state.slotsStatus = 'idle';
  state.slotsError = null;

  state.signedConsents = [];
}

function clearDateAndSlotState(state: BookingDraftState) {
  state.selectedDate = null;
  state.selectedSlot = null;

  state.availability = null;
  state.availabilityStatus = 'idle';
  state.availabilityError = null;

  state.slots = [];
  state.slotsStatus = 'idle';
  state.slotsError = null;
}

function clearSlotState(state: BookingDraftState) {
  state.selectedSlot = null;
  state.slots = [];
  state.slotsStatus = 'idle';
  state.slotsError = null;
}

export const fetchBookingStaffOptions = createAsyncThunk<
  BookingStaffOption[],
  { slug: string },
  { state: RootState; rejectValue: ReturnType<typeof normalizeApiError> }
>('bookingDraft/fetchStaffOptions', async ({ slug }, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const selectedItem = state.bookingDraft.selectedItem;
    const addOnIds = state.bookingDraft.selectedAddOnIds;

    if (!selectedItem) {
      throw new Error('Select a service or package before choosing staff.');
    }

    const payload =
      selectedItem.type === 'service'
        ? await bookingService.fetchServiceCapableStaff({
            slug,
            serviceId: selectedItem.id,
            addOnIds,
          })
        : await bookingService.fetchPackageCapableStaff({
            slug,
            packageId: selectedItem.id,
          });

    return normalizeStaffOptions(payload);
  } catch (error: unknown) {
    return rejectWithValue(normalizeApiError(error));
  }
});

export const fetchBookingAvailability = createAsyncThunk<
  BookingAvailabilityCalendar,
  { slug: string },
  { state: RootState; rejectValue: ReturnType<typeof normalizeApiError> }
>('bookingDraft/fetchAvailability', async ({ slug }, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const selectedItem = state.bookingDraft.selectedItem;
    const selectedStaff = state.bookingDraft.selectedStaff;
    const addOnIds = state.bookingDraft.selectedAddOnIds;

    if (!selectedItem) {
      throw new Error('Select a service or package before choosing a date.');
    }

    if (!selectedStaff) {
      throw new Error('Select a professional before choosing a date.');
    }

    let payload: unknown;

    if (selectedItem.type === 'service') {
      payload =
        selectedStaff.mode === 'specific'
          ? await bookingService.fetchServiceStaffAvailability({
              slug,
              staffId: selectedStaff.id,
              serviceId: selectedItem.id,
              addOnIds,
            })
          : await bookingService.fetchServiceAnyStaffAvailability({
              slug,
              serviceId: selectedItem.id,
              addOnIds,
            });
    } else {
      payload =
        selectedStaff.mode === 'specific'
          ? await bookingService.fetchPackageStaffAvailability({
              slug,
              staffId: selectedStaff.id,
              packageId: selectedItem.id,
              addOnIds,
            })
          : await bookingService.fetchPackageAnyStaffAvailability({
              slug,
              packageId: selectedItem.id,
              addOnIds,
            });
    }

    return normalizeAvailabilityCalendar(payload);
  } catch (error: unknown) {
    return rejectWithValue(normalizeApiError(error));
  }
});

export const fetchBookingSlots = createAsyncThunk<
  BookingSlot[],
  { slug: string; date: string },
  { state: RootState; rejectValue: ReturnType<typeof normalizeApiError> }
>('bookingDraft/fetchSlots', async ({ slug, date }, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const selectedItem = state.bookingDraft.selectedItem;
    const selectedStaff = state.bookingDraft.selectedStaff;
    const addOnIds = state.bookingDraft.selectedAddOnIds;

    if (!selectedItem) {
      throw new Error('Select a service or package before choosing a time.');
    }

    if (!selectedStaff) {
      throw new Error('Select a professional before choosing a time.');
    }

    let payload: unknown;

    if (selectedItem.type === 'service') {
      payload =
        selectedStaff.mode === 'specific'
          ? await bookingService.fetchServiceStaffTimeSlots({
              slug,
              staffId: selectedStaff.id,
              serviceId: selectedItem.id,
              addOnIds,
              date,
            })
          : await bookingService.fetchServiceAnyStaffTimeSlots({
              slug,
              serviceId: selectedItem.id,
              addOnIds,
              date,
            });
    } else {
      payload =
        selectedStaff.mode === 'specific'
          ? await bookingService.fetchPackageStaffTimeSlots({
              slug,
              staffId: selectedStaff.id,
              packageId: selectedItem.id,
              addOnIds,
              date,
            })
          : await bookingService.fetchPackageAnyStaffTimeSlots({
              slug,
              packageId: selectedItem.id,
              addOnIds,
              date,
            });
    }

    return normalizeSlots(payload, date);
  } catch (error: unknown) {
    return rejectWithValue(normalizeApiError(error));
  }
});

const bookingDraftSlice = createSlice({
  name: 'bookingDraft',
  initialState,
  reducers: {
    selectCatalogItem(state, action: PayloadAction<CatalogItem>) {
      const previousKey = state.selectedItem
        ? getCatalogItemKey(state.selectedItem.type, state.selectedItem.id)
        : null;

      const nextKey = getCatalogItemKey(action.payload.type, action.payload.id);

      state.selectedItem = action.payload;

      if (previousKey !== nextKey) {
        state.selectedAddOnIds = [];
        clearScheduleState(state);
      }
    },

    toggleSelectedAddOn(state, action: PayloadAction<string>) {
      const addOnId = action.payload;

      if (state.selectedAddOnIds.includes(addOnId)) {
        state.selectedAddOnIds = state.selectedAddOnIds.filter(
          currentId => currentId !== addOnId,
        );
      } else {
        state.selectedAddOnIds.push(addOnId);
      }

      clearScheduleState(state);
    },

    selectAnyStaff(state) {
      state.selectedStaff = {
        mode: 'any',
        id: null,
        name: 'Any available professional',
        imageUrl: null,
      };

      clearDateAndSlotState(state);
    },

    selectSpecificStaff(state, action: PayloadAction<BookingStaffOption>) {
      state.selectedStaff = {
        mode: 'specific',
        id: action.payload.id,
        name: action.payload.name,
        imageUrl: action.payload.imageUrl,
      };

      clearDateAndSlotState(state);
    },

    selectBookingDate(state, action: PayloadAction<string>) {
      state.selectedDate = action.payload;
      clearSlotState(state);
    },

    selectBookingSlot(state, action: PayloadAction<BookingSlot>) {
      state.selectedSlot = action.payload;
    },

    setCustomerDetails(state, action: PayloadAction<Partial<BookingCustomerDetails>>) {
      state.customerDetails = {
        ...state.customerDetails,
        ...action.payload,
      };
    },

    setBookingNotes(state, action: PayloadAction<string>) {
      state.notes = action.payload;
    },

    setPromoCodeName(state, action: PayloadAction<string>) {
      state.promoCodeName = action.payload.trim();
    },

    setIsPaymentComplete(state, action: PayloadAction<boolean>) {
      state.isPaymentComplete = action.payload;
    },

    upsertSignedConsent(state, action: PayloadAction<BookingSignedConsent>) {
      const index = state.signedConsents.findIndex(
        item => item.templateId === action.payload.templateId,
      );

      if (index >= 0) {
        state.signedConsents[index] = action.payload;
      } else {
        state.signedConsents.push(action.payload);
      }
    },

    clearSignedConsents(state) {
      state.signedConsents = [];
    },

    clearCatalogSelection(state) {
      state.selectedItem = null;
      state.selectedAddOnIds = [];
      clearScheduleState(state);
    },

    clearBookingDraft() {
      return initialState;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchBookingStaffOptions.pending, state => {
        state.staffStatus = 'loading';
        state.staffError = null;
        state.staffOptions = [];
      })
      .addCase(fetchBookingStaffOptions.fulfilled, (state, action) => {
        state.staffStatus = 'succeeded';
        state.staffOptions = action.payload;
        state.staffError = null;

        if (
          state.selectedStaff?.mode === 'specific' &&
          !action.payload.some(staff => staff.id === state.selectedStaff?.id)
        ) {
          state.selectedStaff = null;
        }
      })
      .addCase(fetchBookingStaffOptions.rejected, (state, action) => {
        state.staffStatus = 'failed';
        state.staffOptions = [];
        state.staffError = action.payload ?? null;
      })

      .addCase(fetchBookingAvailability.pending, state => {
        state.availabilityStatus = 'loading';
        state.availabilityError = null;
        state.availability = null;
      })
      .addCase(fetchBookingAvailability.fulfilled, (state, action) => {
        state.availabilityStatus = 'succeeded';
        state.availability = action.payload;
        state.availabilityError = null;
      })
      .addCase(fetchBookingAvailability.rejected, (state, action) => {
        state.availabilityStatus = 'failed';
        state.availability = null;
        state.availabilityError = action.payload ?? null;
      })

      .addCase(fetchBookingSlots.pending, state => {
        state.slotsStatus = 'loading';
        state.slotsError = null;
        state.slots = [];
      })
      .addCase(fetchBookingSlots.fulfilled, (state, action) => {
        state.slotsStatus = 'succeeded';
        state.slots = action.payload;
        state.slotsError = null;
      })
      .addCase(fetchBookingSlots.rejected, (state, action) => {
        state.slotsStatus = 'failed';
        state.slots = [];
        state.slotsError = action.payload ?? null;
      });
  },
});

export const {
  selectCatalogItem,
  toggleSelectedAddOn,
  selectAnyStaff,
  selectSpecificStaff,
  selectBookingDate,
  selectBookingSlot,
  setCustomerDetails,
  setBookingNotes,
  setPromoCodeName,
  setIsPaymentComplete,
  upsertSignedConsent,
  clearSignedConsents,
  clearCatalogSelection,
  clearBookingDraft,
} = bookingDraftSlice.actions;

export default bookingDraftSlice.reducer;
