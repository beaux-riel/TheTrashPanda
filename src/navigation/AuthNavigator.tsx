import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { AuthStackParamList } from './types';

// Import screens
import WelcomeScreen from '@/screens/shared/WelcomeScreen';
import LoginScreen from '@/screens/shared/LoginScreen';
import RegisterScreen from '@/screens/shared/RegisterScreen';
import ForgotPasswordScreen from '@/screens/shared/ForgotPasswordScreen';
import UserTypeScreen from '@/screens/shared/UserTypeScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="UserType" component={UserTypeScreen} />
    </Stack.Navigator>
  );
}