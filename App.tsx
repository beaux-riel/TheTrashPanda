import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { RootNavigator } from '@/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const { isAuthenticated } = useAuthStore();

  // Load your fonts
  const [fontsLoaded] = useFonts({
    Inter: require('./assets/fonts/Inter-VariableFont.ttf'),
    ...Ionicons.font,
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Load any other resources here
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Only set app ready if fonts are also loaded
        if (fontsLoaded) {
          setAppIsReady(true);
        }
      }
    }

    if (fontsLoaded) {
      prepare();
    }
  }, [fontsLoaded]);

  const onLayoutRootView = React.useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <RootNavigator />
      <StatusBar style={isAuthenticated ? 'light' : 'dark'} />
    </SafeAreaProvider>
  );
}
