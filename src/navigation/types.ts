export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  Verification: { email: string };
  forgot: { email?: string };
  MagicLinkCheck: { email: string };
};

export type BookingStackParamList = {
  SelectService: undefined;
  SelectStaff: undefined;
  SelectSlot: undefined;
  CustomerDetails: undefined;
  BookingReview: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  BookingFlow: undefined; // Connected directly upon login/auth bypass
};