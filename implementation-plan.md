# The Trash Panda Implementation Plan

## Technology Stack Overview

This document outlines the detailed implementation plan for The Trash Panda using React Native with Expo for cross-platform development and Supabase as the backend solution.

**Core Technologies:**
- **Frontend:** React Native with Expo
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Language:** TypeScript

## 1. Expo SDK Version Selection

**Recommended Version: Expo SDK 50**

**Justification:**
- Latest stable release with long-term support
- Improved performance with Hermes JavaScript engine enabled by default
- Enhanced support for native modules via Expo Config Plugins
- Improved TypeScript integration and type definitions
- Optimized build process with EAS (Expo Application Services)
- Supports the latest React Native version (0.73.x)
- Improved web support for potential future expansion

## 2. Required Expo Plugins for MVP Features

| Feature | Expo Package | Purpose |
|---------|--------------|---------|
| **Camera Access** | `expo-camera` | For farm/product image capture |
| **Image Picker** | `expo-image-picker` | Allow users to select images from gallery |
| **Location Services** | `expo-location` | For farm discovery and proximity search |
| **Maps Integration** | `react-native-maps` | Display farm locations and pickup points |
| **Push Notifications** | `expo-notifications` | Order updates, messages, inventory alerts |
| **Secure Storage** | `expo-secure-store` | Store authentication tokens securely |
| **File System** | `expo-file-system` | Handle local file operations for offline support |
| **SQLite** | `expo-sqlite` | Local database for offline data persistence |
| **Network Status** | `@react-native-community/netinfo` | Monitor network connectivity |
| **Deep Linking** | `expo-linking` | Handle app links for sharing and notifications |
| **Permissions** | `expo-permissions` | Manage user permissions for camera, location, etc. |
| **Sharing** | `expo-sharing` | Allow users to share farm/product information |
| **Web Browser** | `expo-web-browser` | Open external links within the app |
| **Device Info** | `expo-device` | Get device information for analytics |
| **Splash Screen** | `expo-splash-screen` | Customize app loading experience |
| **Status Bar** | `expo-status-bar` | Control status bar appearance |

## 3. Expo Configuration Approach

### app.json / app.config.js Configuration

```javascript
// app.config.js
export default {
  name: "The Trash Panda",
  slug: "thetrashpanda",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic", // Support both light and dark mode
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  updates: {
    fallbackToCacheTimeout: 0,
    url: "https://u.expo.dev/your-project-id" // For EAS Update
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.thetrashpanda.app",
    buildNumber: "1.0.0",
    infoPlist: {
      NSCameraUsageDescription: "The Trash Panda uses your camera to take photos of products and scan QR codes.",
      NSLocationWhenInUseUsageDescription: "The Trash Panda uses your location to find nearby farms and pickup points.",
      NSPhotoLibraryUsageDescription: "The Trash Panda needs access to your photo library to upload product images."
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#FFFFFF"
    },
    package: "com.thetrashpanda.app",
    versionCode: 1,
    permissions: [
      "CAMERA",
      "ACCESS_FINE_LOCATION",
      "ACCESS_COARSE_LOCATION",
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE"
    ]
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  plugins: [
    "expo-camera",
    "expo-image-picker",
    "expo-location",
    "expo-notifications",
    [
      "expo-build-properties",
      {
        ios: {
          useFrameworks: "static"
        }
      }
    ]
  ],
  extra: {
    eas: {
      projectId: "your-eas-project-id"
    }
  }
};
```

### Config Plugins Approach

For more complex native configurations, we'll use Expo Config Plugins:

```javascript
// plugins/withCustomSplashScreen.js
const { withSplashScreen } = require('expo-splash-screen');

module.exports = function withCustomSplashScreen(config) {
  return withSplashScreen(config, {
    imageResizeMode: 'contain',
    backgroundColor: '#4CAF50', // Brand green color
    image: './assets/splash.png',
  });
};

// app.config.js
const withCustomSplashScreen = require('./plugins/withCustomSplashScreen');

module.exports = ({ config }) => {
  return withCustomSplashScreen({
    ...config,
    // other configuration
  });
};
```

## 4. Supabase Implementation Strategy

### Database Table Structure

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  email TEXT,
  user_type TEXT CHECK (user_type IN ('consumer', 'producer', 'admin')),
  is_verified BOOLEAN DEFAULT false,
  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

-- Farms table
CREATE TABLE public.farms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  owner_id UUID REFERENCES public.profiles NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  banner_url TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'USA',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  website TEXT,
  phone TEXT,
  email TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  growing_practices TEXT[],
  average_rating DECIMAL(3, 2) DEFAULT 0
);

-- Farm images table
CREATE TABLE public.farm_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  farm_id UUID REFERENCES public.farms NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  is_primary BOOLEAN DEFAULT false
);

-- Products table
CREATE TABLE public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  farm_id UUID REFERENCES public.farms NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  price DECIMAL(10, 2) NOT NULL,
  unit TEXT NOT NULL,
  quantity_available INTEGER NOT NULL,
  is_organic BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  harvest_date DATE,
  available_until DATE
);

-- Product images table
CREATE TABLE public.product_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  product_id UUID REFERENCES public.products NOT NULL,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false
);

-- Orders table
CREATE TABLE public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  consumer_id UUID REFERENCES public.profiles NOT NULL,
  farm_id UUID REFERENCES public.farms NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'ready', 'completed', 'cancelled')) DEFAULT 'pending',
  total_amount DECIMAL(10, 2) NOT NULL,
  pickup_date TIMESTAMP WITH TIME ZONE,
  pickup_location_id UUID REFERENCES public.pickup_locations,
  notes TEXT
);

-- Order items table
CREATE TABLE public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  order_id UUID REFERENCES public.orders NOT NULL,
  product_id UUID REFERENCES public.products NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL
);

-- Pickup locations table
CREATE TABLE public.pickup_locations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  farm_id UUID REFERENCES public.farms NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_active BOOLEAN DEFAULT true,
  available_days TEXT[],
  available_hours JSONB
);

-- Reviews table
CREATE TABLE public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  consumer_id UUID REFERENCES public.profiles NOT NULL,
  farm_id UUID REFERENCES public.farms NOT NULL,
  order_id UUID REFERENCES public.orders,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  is_verified BOOLEAN DEFAULT false
);

-- Messages table
CREATE TABLE public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  sender_id UUID REFERENCES public.profiles NOT NULL,
  recipient_id UUID REFERENCES public.profiles NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  related_order_id UUID REFERENCES public.orders,
  related_product_id UUID REFERENCES public.products
);

-- Favorites table
CREATE TABLE public.favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  consumer_id UUID REFERENCES public.profiles NOT NULL,
  farm_id UUID REFERENCES public.farms NOT NULL,
  UNIQUE(consumer_id, farm_id)
);
```

### Authentication Setup

We'll implement a comprehensive authentication system using Supabase Auth:

```typescript
// src/services/auth.ts
import { supabase } from '../config/supabaseClient';
import { User } from '@supabase/supabase-js';

// Email/Password Authentication
export const signUpWithEmail = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: userData.fullName,
        user_type: userData.userType, // 'consumer' or 'producer'
      },
    },
  });
  
  if (error) throw error;
  
  // Create profile record if signup successful
  if (data?.user) {
    await createProfile(data.user, userData);
  }
  
  return data;
};

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

// Social Login Authentication
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'thetrashpanda://auth/callback',
    },
  });
  
  if (error) throw error;
  return data;
};

export const signInWithApple = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: {
      redirectTo: 'thetrashpanda://auth/callback',
    },
  });
  
  if (error) throw error;
  return data;
};

// Profile Management
const createProfile = async (user: User, userData: any) => {
  const { error } = await supabase.from('profiles').insert({
    id: user.id,
    username: userData.username,
    full_name: userData.fullName,
    email: user.email,
    user_type: userData.userType,
  });
  
  if (error) throw error;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'thetrashpanda://auth/reset-password',
  });
  
  if (error) throw error;
};

export const updatePassword = async (newPassword: string) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  
  if (error) throw error;
};
```

### Storage Buckets Organization

```typescript
// src/config/storageBuckets.ts
export const STORAGE_BUCKETS = {
  FARM_LOGOS: 'farm-logos',
  FARM_BANNERS: 'farm-banners',
  FARM_IMAGES: 'farm-images',
  PRODUCT_IMAGES: 'product-images',
  USER_AVATARS: 'user-avatars',
  VERIFICATION_DOCS: 'verification-docs',
};

// src/services/storage.ts
import { supabase } from '../config/supabaseClient';
import { STORAGE_BUCKETS } from '../config/storageBuckets';
import * as FileSystem from 'expo-file-system';

export const uploadFarmLogo = async (farmId: string, uri: string) => {
  return uploadImage(STORAGE_BUCKETS.FARM_LOGOS, `${farmId}/logo`, uri);
};

export const uploadFarmBanner = async (farmId: string, uri: string) => {
  return uploadImage(STORAGE_BUCKETS.FARM_BANNERS, `${farmId}/banner`, uri);
};

export const uploadFarmImage = async (farmId: string, uri: string) => {
  const timestamp = new Date().getTime();
  return uploadImage(STORAGE_BUCKETS.FARM_IMAGES, `${farmId}/${timestamp}`, uri);
};

export const uploadProductImage = async (productId: string, uri: string) => {
  const timestamp = new Date().getTime();
  return uploadImage(STORAGE_BUCKETS.PRODUCT_IMAGES, `${productId}/${timestamp}`, uri);
};

export const uploadUserAvatar = async (userId: string, uri: string) => {
  return uploadImage(STORAGE_BUCKETS.USER_AVATARS, userId, uri);
};

const uploadImage = async (bucket: string, path: string, uri: string) => {
  try {
    const fileExt = uri.substring(uri.lastIndexOf('.') + 1);
    const filePath = `${path}.${fileExt}`;
    
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, decode(base64), {
        contentType: `image/${fileExt}`,
        upsert: true,
      });
    
    if (error) throw error;
    
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Helper function to decode base64
function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
```

### Row-Level Security Policies

```sql
-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Farms policies
CREATE POLICY "Farms are viewable by everyone" 
ON public.farms FOR SELECT USING (is_active = true);

CREATE POLICY "Farm owners can update their farms" 
ON public.farms FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Farm owners can insert their farms" 
ON public.farms FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Farm owners can delete their farms" 
ON public.farms FOR DELETE USING (auth.uid() = owner_id);

-- Products policies
CREATE POLICY "Active products are viewable by everyone" 
ON public.products FOR SELECT USING (is_active = true);

CREATE POLICY "Farm owners can manage their products" 
ON public.products FOR ALL USING (
  auth.uid() IN (
    SELECT owner_id FROM public.farms WHERE id = farm_id
  )
);

-- Orders policies
CREATE POLICY "Consumers can view their own orders" 
ON public.orders FOR SELECT USING (auth.uid() = consumer_id);

CREATE POLICY "Producers can view orders for their farms" 
ON public.orders FOR SELECT USING (
  auth.uid() IN (
    SELECT owner_id FROM public.farms WHERE id = farm_id
  )
);

CREATE POLICY "Consumers can create orders" 
ON public.orders FOR INSERT WITH CHECK (auth.uid() = consumer_id);

CREATE POLICY "Consumers can update their pending orders" 
ON public.orders FOR UPDATE USING (
  auth.uid() = consumer_id AND status = 'pending'
);

CREATE POLICY "Producers can update order status" 
ON public.orders FOR UPDATE USING (
  auth.uid() IN (
    SELECT owner_id FROM public.farms WHERE id = farm_id
  )
) WITH CHECK (
  -- Only allow updating specific fields
  (OLD.status IS DISTINCT FROM NEW.status) AND
  (OLD.consumer_id = NEW.consumer_id) AND
  (OLD.farm_id = NEW.farm_id) AND
  (OLD.total_amount = NEW.total_amount)
);

-- Messages policies
CREATE POLICY "Users can view messages they sent or received" 
ON public.messages FOR SELECT USING (
  auth.uid() = sender_id OR auth.uid() = recipient_id
);

CREATE POLICY "Users can send messages" 
ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Recipients can mark messages as read" 
ON public.messages FOR UPDATE USING (
  auth.uid() = recipient_id AND 
  (OLD.is_read IS DISTINCT FROM NEW.is_read) AND
  (OLD.content = NEW.content) AND
  (OLD.sender_id = NEW.sender_id) AND
  (OLD.recipient_id = NEW.recipient_id)
);
```

### Realtime Subscriptions

```typescript
// src/services/realtime.ts
import { supabase } from '../config/supabaseClient';
import { RealtimeChannel } from '@supabase/supabase-js';

// Subscribe to order status changes
export const subscribeToOrderUpdates = (orderId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`order-${orderId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${orderId}`,
      },
      (payload) => callback(payload)
    )
    .subscribe();
};

// Subscribe to new messages
export const subscribeToMessages = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`messages-${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `recipient_id=eq.${userId}`,
      },
      (payload) => callback(payload)
    )
    .subscribe();
};

// Subscribe to product inventory changes
export const subscribeToProductUpdates = (productIds: string[], callback: (payload: any) => void) => {
  return supabase
    .channel('product-updates')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'products',
        filter: `id=in.(${productIds.join(',')})`,
      },
      (payload) => callback(payload)
    )
    .subscribe();
};

// Unsubscribe from a channel
export const unsubscribe = (channel: RealtimeChannel) => {
  supabase.removeChannel(channel);
};
```

## 5. State Management Approach

For The Trash Panda, we'll use a combination of **React Context API** for global state and **Zustand** for more complex state management needs:

### Context API for Authentication and Theme

```typescript
// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../config/supabaseClient';
import { User, Session } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  // Other auth methods...
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Auth methods implementation...

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    // Other auth methods...
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### Zustand for Complex State Management

```typescript
// src/stores/cartStore.ts
import create from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CartItem = {
  id: string;
  productId: string;
  farmId: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
  imageUrl?: string;
};

type CartStore = {
  items: CartItem[];
  farmId: string | null; // Only allow items from one farm at a time
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      farmId: null,
      
      addItem: (item) => {
        const { items, farmId } = get();
        
        // If cart has items from a different farm, don't add
        if (farmId && item.farmId !== farmId) {
          throw new Error('Cannot add items from different farms to cart');
        }
        
        // Check if item already exists
        const existingItem = items.find((i) => i.productId === item.productId);
        
        if (existingItem) {
          // Update quantity if item exists
          set({
            items: items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          // Add new item
          set({
            items: [...items, { ...item, id: Date.now().toString() }],
            farmId: farmId || item.farmId,
          });
        }
      },
      
      removeItem: (productId) => {
        const { items } = get();
        const newItems = items.filter((i) => i.productId !== productId);
        
        set({
          items: newItems,
          farmId: newItems.length > 0 ? get().farmId : null,
        });
      },
      
      updateQuantity: (productId, quantity) => {
        const { items } = get();
        
        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          get().removeItem(productId);
          return;
        }
        
        set({
          items: items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        });
      },
      
      clearCart: () => {
        set({ items: [], farmId: null });
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'thetrashpanda-cart',
      getStorage: () => AsyncStorage,
    }
  )
);
```

## 6. TypeScript Configuration and Type Safety Approach

### tsconfig.json

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "jsx": "react-native",
    "lib": ["es2017", "dom"],
    "moduleResolution": "node",
    "noEmit": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "target": "esnext",
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src", "custom.d.ts"],
  "exclude": ["node_modules", "babel.config.js", "metro.config.js"]
}
```

### Type Definitions

```typescript
// src/types/index.ts

// User Types
export type UserType = 'consumer' | 'producer' | 'admin';

export interface Profile {
  id: string;
  created_at: string;
  updated_at: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  email: string;
  user_type: UserType;
  is_verified: boolean;
}

// Farm Types
export interface Farm {
  id: string;
  created_at: string;
  updated_at: string;
  owner_id: string;
  name: string;
  description?: string;
  logo_url?: string;
  banner_url?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country: string;
  latitude?: number;
  longitude?: number;
  website?: string;
  phone?: string;
  email?: string;
  is_verified: boolean;
  is_active: boolean;
  growing_practices: string[];
  average_rating: number;
}

export interface FarmImage {
  id: string;
  created_at: string;
  farm_id: string;
  image_url: string;
  caption?: string;
  is_primary: boolean;
}

// Product Types
export interface Product {
  id: string;
  created_at: string;
  updated_at: string;
  farm_id: string;
  name: string;
  description?: string;
  category: string;
  subcategory?: string;
  price: number;
  unit: string;
  quantity_available: number;
  is_organic: boolean;
  is_featured: boolean;
  is_active: boolean;
  harvest_date?: string;
  available_until?: string;
}

export interface ProductImage {
  id: string;
  created_at: string;
  product_id: string;
  image_url: string;
  is_primary: boolean;
}

// Order Types
export type OrderStatus = 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  created_at: string;
  updated_at: string;
  consumer_id: string;
  farm_id: string;
  status: OrderStatus;
  total_amount: number;
  pickup_date?: string;
  pickup_location_id?: string;
  notes?: string;
}

export interface OrderItem {
  id: string;
  created_at: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

// Location Types
export interface PickupLocation {
  id: string;
  created_at: string;
  updated_at: string;
  farm_id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  latitude?: number;
  longitude?: number;
  is_active: boolean;
  available_days: string[];
  available_hours: {
    [day: string]: {
      open: string;
      close: string;
    };
  };
}

// Review Types
export interface Review {
  id: string;
  created_at: string;
  updated_at: string;
  consumer_id: string;
  farm_id: string;
  order_id?: string;
  rating: number;
  comment?: string;
  is_verified: boolean;
}

// Message Types
export interface Message {
  id: string;
  created_at: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  is_read: boolean;
  related_order_id?: string;
  related_product_id?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    status?: number;
  };
}
```

## 7. Offline Functionality Strategy

### Offline-First Architecture

```typescript
// src/services/offlineSync.ts
import * as SQLite from 'expo-sqlite';
import NetInfo from '@react-native-community/netinfo';
import { supabase } from '../config/supabaseClient';

// Open SQLite database
const db = SQLite.openDatabase('thetrashpanda.db');

// Initialize database tables
export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        // Create tables for offline data
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS offline_farms (
            id TEXT PRIMARY KEY,
            data TEXT NOT NULL,
            last_updated INTEGER NOT NULL
          );`
        );
        
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS offline_products (
            id TEXT PRIMARY KEY,
            farm_id TEXT NOT NULL,
            data TEXT NOT NULL,
            last_updated INTEGER NOT NULL
          );`
        );
        
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS offline_orders (
            id TEXT PRIMARY KEY,
            data TEXT NOT NULL,
            synced INTEGER NOT NULL DEFAULT 0,
            created_at INTEGER NOT NULL
          );`
        );
        
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS sync_queue (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            table_name TEXT NOT NULL,
            record_id TEXT NOT NULL,
            operation TEXT NOT NULL,
            data TEXT,
            created_at INTEGER NOT NULL
          );`
        );
      },
      (error) => {
        console.error('Error initializing database:', error);
        reject(error);
      },
      () => {
        resolve();
      }
    );
  });
};

// Cache data for offline use
export const cacheData = async (tableName: string, id: string, data: any) => {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    const jsonData = JSON.stringify(data);
    
    db.transaction(
      (tx) => {
        tx.executeSql(
          `INSERT OR REPLACE INTO offline_${tableName} (id, data, last_updated) 
           VALUES (?, ?, ?)`,
          [id, jsonData, timestamp],
          (_, result) => {
            resolve(result);
          }
        );
      },
      (error) => {
        console.error(`Error caching ${tableName} data:`, error);
        reject(error);
      }
    );
  });
};

// Get cached data
export const getCachedData = async (tableName: string, id: string) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `SELECT data FROM offline_${tableName} WHERE id = ?`,
          [id],
          (_, { rows }) => {
            if (rows.length > 0) {
              resolve(JSON.parse(rows.item(0).data));
            } else {
              resolve(null);
            }
          }
        );
      },
      (error) => {
        console.error(`Error getting cached ${tableName} data:`, error);
        reject(error);
      }
    );
  });
};

// Queue operations for sync
export const queueForSync = async (
  tableName: string,
  recordId: string,
  operation: 'INSERT' | 'UPDATE' | 'DELETE',
  data?: any
) => {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    const jsonData = data ? JSON.stringify(data) : null;
    
    db.transaction(
      (tx) => {
        tx.executeSql(
          `INSERT INTO sync_queue (table_name, record_id, operation, data, created_at)
           VALUES (?, ?, ?, ?, ?)`,
          [tableName, recordId, operation, jsonData, timestamp],
          (_, result) => {
            resolve(result);
          }
        );
      },
      (error) => {
        console.error('Error queuing operation for sync:', error);
        reject(error);
      }
    );
  });
};

// Sync queued operations when online
export const syncQueuedOperations = async () => {
  const netInfo = await NetInfo.fetch();
  
  if (!netInfo.isConnected) {
    console.log('No internet connection, skipping sync');
    return;
  }
  
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `SELECT * FROM sync_queue ORDER BY created_at ASC`,
          [],
          async (_, { rows }) => {
            const operations = rows._array;
            
            for (const op of operations) {
              try {
                await processOperation(op);
                
                // Remove from queue after successful sync
                tx.executeSql(
                  `DELETE FROM sync_queue WHERE id = ?`,
                  [op.id]
                );
              } catch (error) {
                console.error('Error processing operation:', error);
                // Keep in queue to retry later
              }
            }
            
            resolve(operations.length);
          }
        );
      },
      (error) => {
        console.error('Error syncing queued operations:', error);
        reject(error);
      }
    );
  });
};

// Process a single operation
const processOperation = async (operation: any) => {
  const { table_name, record_id, operation: op, data } = operation;
  const parsedData = data ? JSON.parse(data) : null;
  
  switch (op) {
    case 'INSERT':
      await supabase.from(table_name).insert(parsedData);
      break;
    case 'UPDATE':
      await supabase.from(table_name).update(parsedData).eq('id', record_id);
      break;
    case 'DELETE':
      await supabase.from(table_name).delete().eq('id', record_id);
      break;
    default:
      throw new Error(`Unknown operation: ${op}`);
  }
};

// Listen for network changes and sync when online
export const setupNetworkListener = () => {
  return NetInfo.addEventListener((state) => {
    if (state.isConnected) {
      console.log('Connected to the internet, syncing data...');
      syncQueuedOperations()
        .then((count) => {
          console.log(`Synced ${count} operations`);
        })
        .catch((error) => {
          console.error('Error during sync:', error);
        });
    }
  });
};
```

## 8. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           The Trash Panda App                               │
│                                                                         │
│  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐   │
│  │   Presentation  │     │     Domain      │     │      Data       │   │
│  │      Layer      │     │      Layer      │     │      Layer      │   │
│  │                 │     │                 │     │                 │   │
│  │  ┌───────────┐  │     │  ┌───────────┐  │     │  ┌───────────┐  │   │
│  │  │  Screens  │  │     │  │  Services │  │     │  │ Supabase  │  │   │
│  │  └───────────┘  │     │  └───────────┘  │     │  │   API     │  │   │
│  │        │        │     │        │        │     │  └───────────┘  │   │
│  │        ▼        │     │        ▼        │     │        ▲        │   │
│  │  ┌───────────┐  │     │  ┌───────────┐  │     │        │        │   │
│  │  │ Components│◄─┼─────┼─►│   Stores  │◄─┼─────┼─►┌───────────┐  │   │
│  │  └───────────┘  │     │  └───────────┘  │     │  │  SQLite   │  │   │
│  │        │        │     │        │        │     │  │  (Offline)│  │   │
│  │        ▼        │     │        ▼        │     │  └───────────┘  │   │
│  │  ┌───────────┐  │     │  ┌───────────┐  │     │        ▲        │   │
│  │  │   Hooks   │◄─┼─────┼─►│  Context  │◄─┼─────┼─►┌───────────┐  │   │
│  │  └───────────┘  │     │  └───────────┘  │     │  │ Sync Queue│  │   │
│  │                 │     │                 │     │  └───────────┘  │   │
│  └─────────────────┘     └─────────────────┘     └─────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                             Supabase Backend                            │
│                                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌──────────┐ │
│  │ PostgreSQL  │    │     Auth    │    │   Storage   │    │ Realtime │ │
│  │  Database   │    │             │    │   Buckets   │    │          │ │
│  └─────────────┘    └─────────────┘    └─────────────┘    └──────────┘ │
│         │                  │                  │                 │       │
│         └──────────────────┴──────────────────┴─────────────────┘       │
│                                    │                                    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          External Services                              │
│                                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌──────────┐ │
│  │   Google    │    │    Apple    │    │   Expo      │    │  Maps    │ │
│  │    Auth     │    │    Auth     │    │ Notifications│    │   API    │ │
│  └─────────────┘    └─────────────┘    └─────────────┘    └──────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 9. Initial Setup Code Snippets

### Supabase Client Setup

```typescript
// src/config/supabaseClient.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

const supabaseUrl = SUPABASE_URL;
const supabaseAnonKey = SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

### App Entry Point

```typescript
// App.tsx
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { AuthProvider } from './src/contexts/AuthContext';
import Navigation from './src/navigation';
import { initDatabase, setupNetworkListener } from './src/services/offlineSync';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Initialize offline database
        await initDatabase();
        
        // Setup network listener for offline sync
        const unsubscribe = setupNetworkListener();
        
        // Pre-load fonts
        await Font.loadAsync({
          'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
          'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
          'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
        });
        
        // Pre-load images
        await Asset.loadAsync([
          require('./assets/images/logo.png'),
          require('./assets/images/splash.png'),
          require('./assets/images/default-farm.png'),
          require('./assets/images/default-product.png'),
        ]);
        
        // Artificial delay for a smoother splash screen experience
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

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
      <ThemeProvider>
        <AuthProvider>
          <NavigationContainer>
            <Navigation />
            <StatusBar style="auto" />
          </NavigationContainer>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
```

### Navigation Setup

```typescript
// src/navigation/index.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

// Auth Screens
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Consumer Screens
import ExploreScreen from '../screens/consumer/ExploreScreen';
import FarmDetailsScreen from '../screens/consumer/FarmDetailsScreen';
import ProductDetailsScreen from '../screens/consumer/ProductDetailsScreen';
import CartScreen from '../screens/consumer/CartScreen';
import CheckoutScreen from '../screens/consumer/CheckoutScreen';
import OrdersScreen from '../screens/consumer/OrdersScreen';
import OrderDetailsScreen from '../screens/consumer/OrderDetailsScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';
import SettingsScreen from '../screens/shared/SettingsScreen';

// Producer Screens
import DashboardScreen from '../screens/producer/DashboardScreen';
import InventoryScreen from '../screens/producer/InventoryScreen';
import AddProductScreen from '../screens/producer/AddProductScreen';
import EditProductScreen from '../screens/producer/EditProductScreen';
import FarmProfileScreen from '../screens/producer/FarmProfileScreen';
import EditFarmScreen from '../screens/producer/EditFarmScreen';
import OrderManagementScreen from '../screens/producer/OrderManagementScreen';
import MessagesScreen from '../screens/shared/MessagesScreen';
import ConversationScreen from '../screens/shared/ConversationScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Consumer Bottom Tabs
function ConsumerTabs() {
  const { colors } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="search" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="shopping-bag" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="comment" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Producer Bottom Tabs
function ProducerTabs() {
  const { colors } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="warehouse" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrderManagementScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="clipboard-list" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="comment" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  const { user, loading } = useAuth();
  const userType = user?.user_metadata?.user_type;
  
  // Show loading screen while checking authentication
  if (loading) {
    return null; // Or a loading component
  }
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        // Auth Stack
        <Stack.Group>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </Stack.Group>
      ) : userType === 'consumer' ? (
        // Consumer Stack
        <Stack.Group>
          <Stack.Screen name="ConsumerTabs" component={ConsumerTabs} />
          <Stack.Screen 
            name="FarmDetails" 
            component={FarmDetailsScreen}
            options={{ headerShown: true, title: '' }}
          />
          <Stack.Screen 
            name="ProductDetails" 
            component={ProductDetailsScreen}
            options={{ headerShown: true, title: '' }}
          />
          <Stack.Screen 
            name="Cart" 
            component={CartScreen}
            options={{ headerShown: true, title: 'Your Cart' }}
          />
          <Stack.Screen 
            name="Checkout" 
            component={CheckoutScreen}
            options={{ headerShown: true, title: 'Checkout' }}
          />
          <Stack.Screen 
            name="OrderDetails" 
            component={OrderDetailsScreen}
            options={{ headerShown: true, title: 'Order Details' }}
          />
          <Stack.Screen 
            name="Conversation" 
            component={ConversationScreen}
            options={{ headerShown: true, title: '' }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{ headerShown: true, title: 'Settings' }}
          />
        </Stack.Group>
      ) : (
        // Producer Stack
        <Stack.Group>
          <Stack.Screen name="ProducerTabs" component={ProducerTabs} />
          <Stack.Screen 
            name="AddProduct" 
            component={AddProductScreen}
            options={{ headerShown: true, title: 'Add Product' }}
          />
          <Stack.Screen 
            name="EditProduct" 
            component={EditProductScreen}
            options={{ headerShown: true, title: 'Edit Product' }}
          />
          <Stack.Screen 
            name="FarmProfile" 
            component={FarmProfileScreen}
            options={{ headerShown: true, title: 'Farm Profile' }}
          />
          <Stack.Screen 
            name="EditFarm" 
            component={EditFarmScreen}
            options={{ headerShown: true, title: 'Edit Farm' }}
          />
          <Stack.Screen 
            name="Conversation" 
            component={ConversationScreen}
            options={{ headerShown: true, title: '' }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{ headerShown: true, title: 'Settings' }}
          />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}
```

## Quality Control Checkpoint

### Cross-Platform Consistency
- Using Expo SDK 50 ensures consistent behavior across iOS and Android
- Implementing a unified design system with ThemeProvider
- Using platform-agnostic components from React Native and Expo
- Handling platform-specific differences with conditional rendering where needed

### Optimal Expo Configuration
- Comprehensive app.config.js with proper permissions and settings
- Using Config Plugins for advanced native configurations
- Implementing EAS Build and EAS Update for streamlined deployment
- Proper asset management with pre-loading for optimal performance

### Comprehensive Supabase Security
- Row-Level Security policies for all database tables
- Proper authentication flow with secure token storage
- Data validation at both client and server levels
- Encrypted storage for sensitive information
- Regular security audits and updates

### Appropriate State Management
- Context API for global state (auth, theme)
- Zustand for complex state with persistence
- Local component state for UI-specific state
- Optimized re-renders with memoization

### Offline-First Capabilities
- SQLite for local data persistence
- Sync queue for offline operations
- Network status monitoring
- Automatic synchronization when online
- Conflict resolution strategies

### Type Safety
- Strict TypeScript configuration
- Comprehensive type definitions for all data models
- Type-safe API calls and database operations
- Runtime type checking for external data
- Proper error handling with typed errors