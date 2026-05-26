import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './src/navigation/app-navigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TenantProvider } from './src/context/tenant-context';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <NavigationContainer>
    <TenantProvider>
      <SafeAreaProvider>
      <AppNavigator />
     </SafeAreaProvider>
    </TenantProvider>
    </NavigationContainer>
  );
}