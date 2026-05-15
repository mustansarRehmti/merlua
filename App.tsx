import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthNavigator } from './src/navigation/auth-navigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {/* For now, we only show Auth. In Phase 2, we will add the Logged-In state toggle */}
        <AuthNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}