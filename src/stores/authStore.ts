import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// User types
export type UserType = 'consumer' | 'producer';

// User interface
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: UserType;
  profileImage?: string;
}

// Auth store state interface
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  userType: UserType | null;
  token: string | null;
  
  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  setUserType: (userType: UserType) => void;
}

// Create the auth store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      userType: null,
      token: null,
      
      // Login action
      login: (user, token) => set({
        isAuthenticated: true,
        user,
        userType: user.userType,
        token,
      }),
      
      // Logout action
      logout: () => set({
        isAuthenticated: false,
        user: null,
        userType: null,
        token: null,
      }),
      
      // Update user action
      updateUser: (userData) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null,
      })),
      
      // Set user type action
      setUserType: (userType) => set({ userType }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);