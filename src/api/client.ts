import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiUrl, supabaseUrl, supabaseAnonKey } from '@/config/env';

// Create a custom fetch implementation with timeout
const customFetch = (url: RequestInfo, options?: RequestInit) => {
  const timeout = 30000; // 30 seconds timeout
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  return fetch(url, {
    ...options,
    signal: controller.signal,
  }).finally(() => clearTimeout(timeoutId));
};

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    fetch: customFetch,
  },
});

// Base API client for REST endpoints
export const apiClient = {
  get: async <T>(endpoint: string, params?: Record<string, string>) => {
    const url = new URL(`${apiUrl}${endpoint}`);
    
    if (params) {
      Object.keys(params).forEach(key => 
        url.searchParams.append(key, params[key])
      );
    }
    
    const token = (await supabase.auth.getSession()).data.session?.access_token;
    
    const response = await customFetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return response.json() as Promise<T>;
  },
  
  post: async <T>(endpoint: string, data: any) => {
    const token = (await supabase.auth.getSession()).data.session?.access_token;
    
    const response = await customFetch(`${apiUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return response.json() as Promise<T>;
  },
  
  put: async <T>(endpoint: string, data: any) => {
    const token = (await supabase.auth.getSession()).data.session?.access_token;
    
    const response = await customFetch(`${apiUrl}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return response.json() as Promise<T>;
  },
  
  delete: async <T>(endpoint: string) => {
    const token = (await supabase.auth.getSession()).data.session?.access_token;
    
    const response = await customFetch(`${apiUrl}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return response.json() as Promise<T>;
  },
};