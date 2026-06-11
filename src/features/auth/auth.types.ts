import type { ApiErrorResponse } from '../../lib/api/api.types';

export interface RequestCustomerOtpPayload {
  email: string;
}

export interface RequestCustomerOtpResponse {
  session: string;
}

export interface ConfirmCustomerOtpPayload {
  email: string;
  session: string;
  code: string;
  slug: string;
}

export interface ConfirmCustomerOtpResponse {
  accessToken: string;
  refreshToken: string;
}

export interface StoredCustomerSession {
  accessToken: string;
  refreshToken: string;
  email: string;
  slug: string;
}

export type AsyncStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface CustomerAuthState {
  bootstrapStatus: AsyncStatus;
  otpRequestStatus: AsyncStatus;
  otpVerificationStatus: AsyncStatus;
  logoutStatus: AsyncStatus;
  isAuthenticated: boolean;
  pendingEmail: string | null;
  pendingSession: string | null;
  currentSession: StoredCustomerSession | null;
  error: ApiErrorResponse | null;
}
