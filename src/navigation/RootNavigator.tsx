import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { RootStackParamList } from './types';
import AuthNavigator from './AuthNavigator';
import ConsumerStackNavigator from './ConsumerStackNavigator';
import ProducerStackNavigator from './ProducerStackNavigator';
import NotFoundScreen from '@/screens/shared/NotFoundScreen';
import { useAuthStore } from '@/stores/authStore';
import { linking } from './linking';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { isAuthenticated, userType } = useAuthStore();

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : userType === 'consumer' ? (
          <Stack.Screen name="ConsumerRoot" component={ConsumerStackNavigator} />
        ) : (
          <Stack.Screen name="ProducerRoot" component={ProducerStackNavigator} />
        )}
        <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}