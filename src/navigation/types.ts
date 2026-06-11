import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  TenantGateway: undefined;
  CustomerLogin: undefined;
  CustomerOtpVerification: {
    email: string;
    session: string;
  };
};

export type BookingStackParamList = {
  SelectService: undefined;
  SelectStaff: undefined;
  SelectSlot: undefined;
  BookingReview: undefined;
  CustomerDetails: { remarks?: string } | undefined;
  AppointmentsDashboard:
    | {
        customerData?: {
          fullName: string;
          email: string;
          phone: string;
          historicalRemarks?: string;
        };
      }
    | undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList> | undefined;
  BookingFlow: NavigatorScreenParams<BookingStackParamList> | undefined;
};
