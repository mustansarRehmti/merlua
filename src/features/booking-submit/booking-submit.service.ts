import { apiClient } from '../../lib/api/api-client';
import type {
  CheckoutPayload,
  CreateCustomerAppointmentPayload,
} from './booking-submit.types';

export async function createCustomerAppointment(params: {
  slug: string;
  accessToken?: string | null;
  payload: CreateCustomerAppointmentPayload;
}): Promise<unknown> {
  const encodedSlug = encodeURIComponent(params.slug);

  const response = await apiClient.post<unknown>(
    `/appointments/${encodedSlug}/customer`,
    params.payload,
    {
      accessToken: params.accessToken,
    },
  );

  return response.data;
}

export async function createCustomerCheckout(params: {
  slug: string;
  accessToken?: string | null;
  payload: CheckoutPayload;
}): Promise<unknown> {
  const encodedSlug = encodeURIComponent(params.slug);
  const encodedBookingGroupId = encodeURIComponent(params.payload.bookingGroupId);

  const response = await apiClient.post<unknown>(
    `/appointments/${encodedSlug}/customer/${encodedBookingGroupId}/checkout?isPaymentComplete=${params.payload.isPaymentComplete ? 'true' : 'false'}`,
    undefined,
    {
      accessToken: params.accessToken,
    },
  );

  return response.data;
}
