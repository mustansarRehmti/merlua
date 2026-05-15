import { useState } from 'react';

export interface BookingState {
  businessId: string;
  selectedServices: Array<{ id: string; price: number; duration: number }>;
  selectedStaffId: string | 'any';
  selectedDate: string; // YYYY-MM-DD
  selectedSlot: string; // HH:MM
  customerNotes: string;
}

export function useBookingWizard(initialBusinessId: string) {
  const [step, setStep] = useState<number>(1);
  const [booking, setBooking] = useState<BookingState>({
    businessId: initialBusinessId,
    selectedServices: [],
    selectedStaffId: 'any',
    selectedDate: '',
    selectedSlot: '',
    customerNotes: '',
  });

  const nextStep = () => setStep((s) => Math.min(s + 1, 5));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const updateBooking = (updates: Partial<BookingState>) => {
    setBooking((prev) => ({ ...prev, ...updates }));
  };

  return { step, booking, nextStep, prevStep, updateBooking, setStep };
}