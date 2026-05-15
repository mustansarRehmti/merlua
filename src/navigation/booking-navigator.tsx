import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SelectServiceScreen } from '../screens/select-service-screen';
import { SelectStaffScreen } from '../screens/select-staff-screen';
import { SelectSlotScreen } from '../screens/select-slot-screen';
import { CustomerDetailsScreen } from '../screens/customer-details-screen';
import { BookingReviewScreen } from '../screens/booking-review-screen';
import { BookingStackParamList } from './types';

const Stack = createNativeStackNavigator<BookingStackParamList>();

export function BookingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="SelectService" component={SelectServiceScreen} />
      <Stack.Screen name="SelectStaff" component={SelectStaffScreen} />
      <Stack.Screen name="SelectSlot" component={SelectSlotScreen} />
      <Stack.Screen name="CustomerDetails" component={CustomerDetailsScreen} />
      <Stack.Screen name="BookingReview" component={BookingReviewScreen} />
    </Stack.Navigator>
  );
}