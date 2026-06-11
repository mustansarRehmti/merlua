import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { AuthNavigator } from './auth-navigator';
import { BookingNavigator } from './booking-navigator';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { bootstrapCustomerAuth } from '../features/auth/auth.slice';
import {
  selectAuthBootstrapStatus,
  selectCurrentCustomerSession,
  selectIsCustomerAuthenticated,
} from '../features/auth/auth.selectors';
import { selectActiveTenantSlug } from '../features/tenant/tenant.selectors';
import { setTenant } from '../features/tenant/tenant.slice';
import { Theme } from '../theme/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const dispatch = useAppDispatch();
  const bootstrapStatus = useAppSelector(selectAuthBootstrapStatus);
  const isAuthenticated = useAppSelector(selectIsCustomerAuthenticated);
  const currentSession = useAppSelector(selectCurrentCustomerSession);
  const activeSlug = useAppSelector(selectActiveTenantSlug);

  useEffect(() => {
    if (bootstrapStatus === 'idle') {
      dispatch(bootstrapCustomerAuth());
    }
  }, [bootstrapStatus, dispatch]);

  useEffect(() => {
    if (currentSession?.slug && !activeSlug) {
      dispatch(setTenant({ slug: currentSession.slug }));
    }
  }, [activeSlug, currentSession?.slug, dispatch]);

  if (bootstrapStatus === 'idle' || bootstrapStatus === 'loading') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Theme.colors.luxuryBlack} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="BookingFlow" component={BookingNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.softIvory,
  },
});
