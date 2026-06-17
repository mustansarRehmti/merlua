import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { normalizeApiError } from '../../lib/api/api-error';
import type {
  BookingCheckoutResult,
  BookingSubmitState,
  CreateCustomerAppointmentPayload,
} from './booking-submit.types';
import {
  createCustomerAppointment,
  createCustomerCheckout,
} from './booking-submit.service';
import {
  extractAppointmentIds,
  extractBookingGroupId,
  extractCheckoutUrl,
  extractClientSecret,
  extractSessionId,
} from './booking-submit.utils';

const initialState: BookingSubmitState = {
  submitStatus: 'idle',
  checkoutStatus: 'idle',
  error: null,
  result: null,
};

export const submitBookingAndPrepareCheckout = createAsyncThunk<
  BookingCheckoutResult,
  {
    slug: string;
    payload: CreateCustomerAppointmentPayload;
  },
  { state: RootState; rejectValue: ReturnType<typeof normalizeApiError> }
>(
  'bookingSubmit/submitBookingAndPrepareCheckout',
  async ({ slug, payload }, { getState, rejectWithValue }) => {
    try {
      const accessToken = getState().customerAuth.currentSession?.accessToken;

      const appointmentResponse = await createCustomerAppointment({
        slug,
        accessToken,
        payload,
      });

      const bookingGroupId = extractBookingGroupId(appointmentResponse);
      const appointmentIds = extractAppointmentIds(appointmentResponse);

      let checkoutResponse: unknown | null = null;
      let checkoutUrl: string | null = null;
      let clientSecret: string | null = null;
      let sessionId: string | null = null;

      if (bookingGroupId) {
        checkoutResponse = await createCustomerCheckout({
          slug,
          accessToken,
          payload: {
            bookingGroupId,
            isPaymentComplete: payload.isPaymentComplete,
          },
        });

        checkoutUrl = extractCheckoutUrl(checkoutResponse);
        clientSecret = extractClientSecret(checkoutResponse);
        sessionId = extractSessionId(checkoutResponse);
      }

      return {
        bookingGroupId,
        appointmentIds,
        appointmentResponse,
        checkoutResponse,
        checkoutUrl,
        clientSecret,
        sessionId,
      };
    } catch (error: unknown) {
      return rejectWithValue(normalizeApiError(error));
    }
  },
);

const bookingSubmitSlice = createSlice({
  name: 'bookingSubmit',
  initialState,
  reducers: {
    resetBookingSubmit() {
      return initialState;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(submitBookingAndPrepareCheckout.pending, state => {
        state.submitStatus = 'loading';
        state.checkoutStatus = 'loading';
        state.error = null;
      })
      .addCase(submitBookingAndPrepareCheckout.fulfilled, (state, action) => {
        state.submitStatus = 'succeeded';
        state.checkoutStatus = action.payload.checkoutResponse
          ? 'succeeded'
          : 'idle';
        state.error = null;
        state.result = action.payload;
      })
      .addCase(submitBookingAndPrepareCheckout.rejected, (state, action) => {
        state.submitStatus = 'failed';
        state.checkoutStatus = 'failed';
        state.error = action.payload ?? null;
      });
  },
});

export const { resetBookingSubmit } = bookingSubmitSlice.actions;
export default bookingSubmitSlice.reducer;
