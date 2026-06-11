import { apiClient } from '../../lib/api/api-client';
import type {
  ConfirmCustomerOtpPayload,
  ConfirmCustomerOtpResponse,
  RequestCustomerOtpPayload,
  RequestCustomerOtpResponse,
} from './auth.types';

export async function requestCustomerOtp(
  payload: RequestCustomerOtpPayload,
): Promise<RequestCustomerOtpResponse> {
  const response = await apiClient.post<RequestCustomerOtpResponse>(
    '/auth/customer/login',
    payload,
  );

  return response.data;
}

export async function confirmCustomerOtp(
  payload: ConfirmCustomerOtpPayload,
): Promise<ConfirmCustomerOtpResponse> {
  const response = await apiClient.post<ConfirmCustomerOtpResponse>(
    '/auth/customer/confirm',
    payload,
  );

  return response.data;
}
