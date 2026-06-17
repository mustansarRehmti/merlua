import type { ApiErrorResponse } from '../../lib/api/api.types';
import type { CatalogItem } from '../catalog/catalog.types';

export type BookingAsyncStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface BookingStaffOption {
  id: string;
  name: string;
  imageUrl: string | null;
}

export type BookingStaffSelection =
  | {
      mode: 'any';
      id: null;
      name: string;
      imageUrl: null;
    }
  | {
      mode: 'specific';
      id: string;
      name: string;
      imageUrl: string | null;
    };

export interface BookingAvailabilityDay {
  date: string;
  dayOfWeek?: number;
  status: 'AVAILABLE' | 'CLOSED' | 'OFF' | 'UNAVAILABLE' | string;
  reason: string | null;
}

export interface BookingAvailabilityCalendar {
  rangeStart: string | null;
  rangeEnd: string | null;
  capableStaff?: number;
  days: BookingAvailabilityDay[];
}

export interface BookingSlot {
  id: string;
  time: string;
  available: boolean;
  label: string;
  startDateTime: string;
  staffId?: string | null;
  raw?: unknown;
}

export interface BookingCustomerDetails {
  name: string;
  email: string;
  phone: string;
}

export interface BookingSignedConsent {
  templateId: string;
  signatureText: string;
}

export interface BookingDraftState {
  selectedItem: CatalogItem | null;
  selectedAddOnIds: string[];

  selectedStaff: BookingStaffSelection | null;
  selectedDate: string | null;
  selectedSlot: BookingSlot | null;

  customerDetails: BookingCustomerDetails;
  notes: string;
  promoCodeName: string;
  isPaymentComplete: boolean;
  signedConsents: BookingSignedConsent[];

  staffOptions: BookingStaffOption[];
  staffStatus: BookingAsyncStatus;
  staffError: ApiErrorResponse | null;

  availability: BookingAvailabilityCalendar | null;
  availabilityStatus: BookingAsyncStatus;
  availabilityError: ApiErrorResponse | null;

  slots: BookingSlot[];
  slotsStatus: BookingAsyncStatus;
  slotsError: ApiErrorResponse | null;
}
