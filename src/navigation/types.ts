import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Auth Stack Parameter List
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  UserType: undefined;
};

// Consumer Tab Navigator Parameter List
export type ConsumerTabParamList = {
  Home: undefined;
  Explore: undefined;
  Cart: undefined;
  Orders: undefined;
  Profile: undefined;
};

// Producer Tab Navigator Parameter List
export type ProducerTabParamList = {
  Dashboard: undefined;
  Products: undefined;
  Orders: undefined;
  Schedule: undefined;
  Profile: undefined;
};

// Consumer Stack Parameter List
export type ConsumerStackParamList = {
  ConsumerTabs: NavigatorScreenParams<ConsumerTabParamList>;
  FarmProfile: { farmId: string };
  ProductDetails: { productId: string };
  Checkout: undefined;
  OrderConfirmation: { orderId: string };
  Settings: undefined;
};

// Producer Stack Parameter List
export type ProducerStackParamList = {
  ProducerTabs: NavigatorScreenParams<ProducerTabParamList>;
  AddProduct: undefined;
  EditProduct: { productId: string };
  OrderDetails: { orderId: string };
  PickupSchedule: undefined;
  Settings: undefined;
};

// Root Stack Parameter List
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  ConsumerRoot: NavigatorScreenParams<ConsumerStackParamList>;
  ProducerRoot: NavigatorScreenParams<ProducerStackParamList>;
  NotFound: undefined;
};

// Navigation Types
export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList, T>,
  RootStackScreenProps<keyof RootStackParamList>
>;

export type ConsumerStackScreenProps<T extends keyof ConsumerStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<ConsumerStackParamList, T>,
  RootStackScreenProps<keyof RootStackParamList>
>;

export type ProducerStackScreenProps<T extends keyof ProducerStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<ProducerStackParamList, T>,
  RootStackScreenProps<keyof RootStackParamList>
>;

export type ConsumerTabScreenProps<T extends keyof ConsumerTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<ConsumerTabParamList, T>,
  ConsumerStackScreenProps<keyof ConsumerStackParamList>
>;

export type ProducerTabScreenProps<T extends keyof ProducerTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<ProducerTabParamList, T>,
  ProducerStackScreenProps<keyof ProducerStackParamList>
>;

// Helper type to make navigation prop available globally
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}