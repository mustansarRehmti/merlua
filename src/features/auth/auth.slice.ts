import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  clearCustomerSession,
  readCustomerSession,
  saveCustomerSession,
} from '../../lib/storage/secure-storage';
import { normalizeApiError } from '../../lib/api/api-error';
import * as authService from './auth.service';
import type {
  ConfirmCustomerOtpPayload,
  CustomerAuthState,
  RequestCustomerOtpPayload,
  StoredCustomerSession,
} from './auth.types';

const initialState: CustomerAuthState = {
  bootstrapStatus: 'idle',
  otpRequestStatus: 'idle',
  otpVerificationStatus: 'idle',
  logoutStatus: 'idle',
  isAuthenticated: false,
  pendingEmail: null,
  pendingSession: null,
  currentSession: null,
  error: null,
};

export const bootstrapCustomerAuth = createAsyncThunk<
  StoredCustomerSession | null,
  void,
  { rejectValue: ReturnType<typeof normalizeApiError> }
>('customerAuth/bootstrap', async (_, { rejectWithValue }) => {
  try {
    return await readCustomerSession();
  } catch (error: unknown) {
    return rejectWithValue(normalizeApiError(error));
  }
});

export const requestCustomerOtp = createAsyncThunk<
  { email: string; session: string },
  RequestCustomerOtpPayload,
  { rejectValue: ReturnType<typeof normalizeApiError> }
>('customerAuth/requestOtp', async ({ email }, { rejectWithValue }) => {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const response = await authService.requestCustomerOtp({
      email: normalizedEmail,
    });

    return {
      email: normalizedEmail,
      session: response.session,
    };
  } catch (error: unknown) {
    return rejectWithValue(normalizeApiError(error));
  }
});

export const confirmCustomerOtp = createAsyncThunk<
  StoredCustomerSession,
  ConfirmCustomerOtpPayload,
  { rejectValue: ReturnType<typeof normalizeApiError> }
>('customerAuth/confirmOtp', async (payload, { rejectWithValue }) => {
  try {
    const normalizedPayload = {
      ...payload,
      email: payload.email.trim().toLowerCase(),
      code: payload.code.trim(),
      slug: payload.slug.trim().toLowerCase(),
    };

    const response = await authService.confirmCustomerOtp(normalizedPayload);

    const storedSession: StoredCustomerSession = {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      email: normalizedPayload.email,
      slug: normalizedPayload.slug,
    };

    await saveCustomerSession(storedSession);
    return storedSession;
  } catch (error: unknown) {
    return rejectWithValue(normalizeApiError(error));
  }
});

export const logoutCustomer = createAsyncThunk<
  void,
  void,
  { rejectValue: ReturnType<typeof normalizeApiError> }
>('customerAuth/logout', async (_, { rejectWithValue }) => {
  try {
    await clearCustomerSession();
  } catch (error: unknown) {
    return rejectWithValue(normalizeApiError(error));
  }
});

const customerAuthSlice = createSlice({
  name: 'customerAuth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },

    clearPendingOtp(state) {
      state.pendingEmail = null;
      state.pendingSession = null;
      state.otpRequestStatus = 'idle';
      state.otpVerificationStatus = 'idle';
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(bootstrapCustomerAuth.pending, state => {
        state.bootstrapStatus = 'loading';
        state.error = null;
      })
      .addCase(bootstrapCustomerAuth.fulfilled, (state, action) => {
        state.bootstrapStatus = 'succeeded';
        state.currentSession = action.payload;
        state.isAuthenticated = Boolean(action.payload);
      })
      .addCase(bootstrapCustomerAuth.rejected, (state, action) => {
        state.bootstrapStatus = 'failed';
        state.currentSession = null;
        state.isAuthenticated = false;
        state.error = action.payload ?? null;
      })
      .addCase(requestCustomerOtp.pending, state => {
        state.otpRequestStatus = 'loading';
        state.error = null;
      })
      .addCase(requestCustomerOtp.fulfilled, (state, action) => {
        state.otpRequestStatus = 'succeeded';
        state.pendingEmail = action.payload.email;
        state.pendingSession = action.payload.session;
      })
      .addCase(requestCustomerOtp.rejected, (state, action) => {
        state.otpRequestStatus = 'failed';
        state.error = action.payload ?? null;
      })
      .addCase(confirmCustomerOtp.pending, state => {
        state.otpVerificationStatus = 'loading';
        state.error = null;
      })
      .addCase(confirmCustomerOtp.fulfilled, (state, action) => {
        state.otpVerificationStatus = 'succeeded';
        state.currentSession = action.payload;
        state.isAuthenticated = true;
        state.pendingEmail = null;
        state.pendingSession = null;
      })
      .addCase(confirmCustomerOtp.rejected, (state, action) => {
        state.otpVerificationStatus = 'failed';
        state.error = action.payload ?? null;
      })
      .addCase(logoutCustomer.pending, state => {
        state.logoutStatus = 'loading';
        state.error = null;
      })
      .addCase(logoutCustomer.fulfilled, state => {
        state.logoutStatus = 'succeeded';
        state.isAuthenticated = false;
        state.currentSession = null;
        state.pendingEmail = null;
        state.pendingSession = null;
      })
      .addCase(logoutCustomer.rejected, (state, action) => {
        state.logoutStatus = 'failed';
        state.error = action.payload ?? null;
      });
  },
});

export const { clearAuthError, clearPendingOtp } = customerAuthSlice.actions;
export default customerAuthSlice.reducer;
