import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AuthStackParamList } from './types';
import { TenantGatewayScreen } from '../screens/tenant-gateway-screen';
import { CustomerLoginScreen } from '../screens/customer-login-screen';
import { CustomerOtpVerificationScreen } from '../screens/customer-otp-verification-screen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="TenantGateway"
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name="TenantGateway" component={TenantGatewayScreen} />
      <Stack.Screen name="CustomerLogin" component={CustomerLoginScreen} />
      <Stack.Screen
        name="CustomerOtpVerification"
        component={CustomerOtpVerificationScreen}
      />
    </Stack.Navigator>
  );
}
