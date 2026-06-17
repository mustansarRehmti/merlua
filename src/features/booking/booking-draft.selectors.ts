import type { RootState } from '../../app/store';

export const selectDraftCatalogItem = (state: RootState) =>
  state.bookingDraft.selectedItem;

export const selectDraftAddOnIds = (state: RootState) =>
  state.bookingDraft.selectedAddOnIds;

export const selectDraftSelectedStaff = (state: RootState) =>
  state.bookingDraft.selectedStaff;

export const selectDraftSelectedDate = (state: RootState) =>
  state.bookingDraft.selectedDate;

export const selectDraftSelectedSlot = (state: RootState) =>
  state.bookingDraft.selectedSlot;

export const selectDraftCustomerDetails = (state: RootState) =>
  state.bookingDraft.customerDetails;

export const selectDraftNotes = (state: RootState) =>
  state.bookingDraft.notes;

export const selectDraftPromoCodeName = (state: RootState) =>
  state.bookingDraft.promoCodeName;

export const selectDraftIsPaymentComplete = (state: RootState) =>
  state.bookingDraft.isPaymentComplete;

export const selectDraftSignedConsents = (state: RootState) =>
  state.bookingDraft.signedConsents;

export const selectBookingStaffOptions = (state: RootState) =>
  state.bookingDraft.staffOptions;

export const selectBookingStaffStatus = (state: RootState) =>
  state.bookingDraft.staffStatus;

export const selectBookingStaffError = (state: RootState) =>
  state.bookingDraft.staffError;

export const selectBookingAvailability = (state: RootState) =>
  state.bookingDraft.availability;

export const selectBookingAvailabilityStatus = (state: RootState) =>
  state.bookingDraft.availabilityStatus;

export const selectBookingAvailabilityError = (state: RootState) =>
  state.bookingDraft.availabilityError;

export const selectBookingSlots = (state: RootState) =>
  state.bookingDraft.slots;

export const selectBookingSlotsStatus = (state: RootState) =>
  state.bookingDraft.slotsStatus;

export const selectBookingSlotsError = (state: RootState) =>
  state.bookingDraft.slotsError;
