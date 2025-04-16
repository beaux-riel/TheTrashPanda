import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { RootStackParamList } from './types';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Auth: {
        screens: {
          Welcome: 'welcome',
          Login: 'login',
          Register: 'register',
          ForgotPassword: 'forgot-password',
          UserType: 'user-type',
        },
      },
      ConsumerRoot: {
        screens: {
          ConsumerTabs: {
            screens: {
              Home: 'home',
              Explore: 'explore',
              Cart: 'cart',
              Orders: 'orders',
              Profile: 'profile',
            },
          },
          FarmProfile: 'farm/:farmId',
          ProductDetails: 'product/:productId',
          Checkout: 'checkout',
          OrderConfirmation: 'order-confirmation/:orderId',
          Settings: 'settings',
        },
      },
      ProducerRoot: {
        screens: {
          ProducerTabs: {
            screens: {
              Dashboard: 'dashboard',
              Products: 'products',
              Orders: 'orders',
              Schedule: 'schedule',
              Profile: 'profile',
            },
          },
          AddProduct: 'add-product',
          EditProduct: 'edit-product/:productId',
          OrderDetails: 'order/:orderId',
          PickupSchedule: 'pickup-schedule',
          Settings: 'settings',
        },
      },
      NotFound: '*',
    },
  },
};