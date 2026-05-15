export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: { email?: string };
};

export type RootStackParamList = {
  Auth: undefined;
  MainApp: undefined; // We will build this in Phase 2
};