import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { VerificationScreen } from '../screens/Verification';
import { ForgotPasswordScreen } from '../screens/ForgotPassword';
import { MagicLinkCheckScreen } from '../screens/MagicLinkCheckScreen';
import { AuthStackParamList } from './types';
import { TenantGatewayScreen } from '../screens/tenant-gateway-screen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="TenantGateway" component={TenantGatewayScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Verification" component={VerificationScreen} />
      <Stack.Screen name="forgot" component={ForgotPasswordScreen} />
      <Stack.Screen name="MagicLinkCheck" component={MagicLinkCheckScreen} />
    </Stack.Navigator>
  );
}