import type { RootState } from '../../app/store';

export const selectBookingSubmitStatus = (state: RootState) =>
  state.bookingSubmit.submitStatus;

export const selectBookingCheckoutStatus = (state: RootState) =>
  state.bookingSubmit.checkoutStatus;

export const selectBookingSubmitError = (state: RootState) =>
  state.bookingSubmit.error;

export const selectBookingSubmitResult = (state: RootState) =>
  state.bookingSubmit.result;
