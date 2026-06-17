import type { ApiErrorResponse } from '../../lib/api/api.types';

export type BookingSubmitStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface CustomerAppointmentItemPayload {
  startDateTime: string;
  staffId?: string;
  packageId?: string;
  serviceId?: string;
  notes?: string;
  addonIds?: string[];
}

export interface CreateCustomerAppointmentPayload {
  customerName: string;
  customerPhone: string;
  promoCodeName?: string;
  isPaymentComplete: boolean;
  signedConsents?: {
    templateId: string;
    signatureText: string;
  }[];
  appointments: CustomerAppointmentItemPayload[];
}

export interface CheckoutPayload {
  bookingGroupId: string;
  isPaymentComplete: boolean;
}

export interface BookingCheckoutResult {
  bookingGroupId: string | null;
  appointmentIds: string[];
  appointmentResponse: unknown;
  checkoutResponse: unknown | null;
  checkoutUrl: string | null;
  clientSecret: string | null;
  sessionId: string | null;
}

export interface BookingSubmitState {
  submitStatus: BookingSubmitStatus;
  checkoutStatus: BookingSubmitStatus;
  error: ApiErrorResponse | null;
  result: BookingCheckoutResult | null;
}
