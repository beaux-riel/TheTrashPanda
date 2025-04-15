import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define theme colors
const lightTheme = {
  primary: '#4CAF50',
  secondary: '#FF9800',
  background: '#FFFFFF',
  card: '#F5F5F5',
  text: '#212121',
  border: '#E0E0E0',
  notification: '#F44336',
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#2196F3',
};

const darkTheme = {
  primary: '#4CAF50',
  secondary: '#FF9800',
  background: '#121212',
  card: '#1E1E1E',
  text: '#FFFFFF',
  border: '#333333',
  notification: '#F44336',
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#2196F3',
};

// Define theme type
type Theme = {
  dark: boolean;
  colors: typeof lightTheme;
};

// Define context type
type ThemeContextType = {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
};

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const [isDark, setIsDark] = useState<boolean>(colorScheme === 'dark');

  // Load theme preference from storage
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const themePreference = await AsyncStorage.getItem('themePreference');
        if (themePreference !== null) {
          setIsDark(themePreference === 'dark');
        } else {
          setIsDark(colorScheme === 'dark');
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      }
    };

    loadThemePreference();
  }, [colorScheme]);

  // Toggle theme function
  const toggleTheme = async () => {
    try {
      const newTheme = !isDark ? 'dark' : 'light';
      await AsyncStorage.setItem('themePreference', newTheme);
      setIsDark(!isDark);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  // Create theme object
  const theme: Theme = {
    dark: isDark,
    colors: isDark ? darkTheme : lightTheme,
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context.theme;
};

// Custom hook to use theme functions
export const useThemeActions = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeActions must be used within a ThemeProvider');
  }
  return {
    isDark: context.isDark,
    toggleTheme: context.toggleTheme,
  };
};