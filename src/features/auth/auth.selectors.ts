import type { RootState } from '../../app/store';

export const selectAuthBootstrapStatus = (state: RootState) =>
  state.customerAuth.bootstrapStatus;

export const selectIsCustomerAuthenticated = (state: RootState) =>
  state.customerAuth.isAuthenticated;

export const selectCurrentCustomerSession = (state: RootState) =>
  state.customerAuth.currentSession;

export const selectOtpRequestStatus = (state: RootState) =>
  state.customerAuth.otpRequestStatus;

export const selectOtpVerificationStatus = (state: RootState) =>
  state.customerAuth.otpVerificationStatus;

export const selectPendingOtpEmail = (state: RootState) =>
  state.customerAuth.pendingEmail;

export const selectPendingOtpSession = (state: RootState) =>
  state.customerAuth.pendingSession;

export const selectCustomerAuthError = (state: RootState) =>
  state.customerAuth.error;
