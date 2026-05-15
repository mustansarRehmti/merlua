import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthNavigator } from './auth-navigator';
import { BookingNavigator } from './booking-navigator';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* 1. Authentication Flow Entry Portal */}
      <Stack.Screen name="Auth" component={AuthNavigator} />
      
      {/* 2. Main Application Booking Wizard Flow */}
      <Stack.Screen name="BookingFlow" component={BookingNavigator} />
    </Stack.Navigator>
  );
}