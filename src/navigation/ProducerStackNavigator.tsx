import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { ProducerStackParamList } from './types';
import ProducerTabNavigator from './ProducerTabNavigator';

// Import screens
import AddProductScreen from '@/screens/producer/AddProductScreen';
import EditProductScreen from '@/screens/producer/EditProductScreen';
import OrderDetailsScreen from '@/screens/producer/OrderDetailsScreen';
import PickupScheduleScreen from '@/screens/producer/PickupScheduleScreen';
import SettingsScreen from '@/screens/producer/SettingsScreen';

const Stack = createNativeStackNavigator<ProducerStackParamList>();

export default function ProducerStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="ProducerTabs" component={ProducerTabNavigator} />
      <Stack.Screen name="AddProduct" component={AddProductScreen} />
      <Stack.Screen name="EditProduct" component={EditProductScreen} />
      <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
      <Stack.Screen name="PickupSchedule" component={PickupScheduleScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}