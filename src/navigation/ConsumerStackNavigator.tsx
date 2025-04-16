import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { ConsumerStackParamList } from './types';
import ConsumerTabNavigator from './ConsumerTabNavigator';

// Import screens
import FarmProfileScreen from '@/screens/consumer/FarmProfileScreen';
import ProductDetailsScreen from '@/screens/consumer/ProductDetailsScreen';
import CheckoutScreen from '@/screens/consumer/CheckoutScreen';
import OrderConfirmationScreen from '@/screens/consumer/OrderConfirmationScreen';
import SettingsScreen from '@/screens/consumer/SettingsScreen';

const Stack = createNativeStackNavigator<ConsumerStackParamList>();

export default function ConsumerStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="ConsumerTabs" component={ConsumerTabNavigator} />
      <Stack.Screen name="FarmProfile" component={FarmProfileScreen} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}