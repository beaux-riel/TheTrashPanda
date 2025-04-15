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

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    status?: number;
  };
}