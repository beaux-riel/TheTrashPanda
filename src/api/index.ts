/**
 * API client for HarvestLink
 * 
 * This file exports the API client and related utilities for making
 * API requests to the HarvestLink backend.
 */

import { apiUrl } from '@/config/env';

// API response types
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// API error type
export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

// Base API client
class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  // Set authorization token
  setAuthToken(token: string | null) {
    if (token) {
      this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.defaultHeaders['Authorization'];
    }
  }

  // Generic request method
  async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const requestOptions: RequestInit = {
      method,
      headers: {
        ...this.defaultHeaders,
        ...headers,
      },
    };

    if (data) {
      requestOptions.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, requestOptions);
      const responseData = await response.json();
      
      if (!response.ok) {
        throw {
          status: response.status,
          message: responseData.message || 'An error occurred',
          errors: responseData.errors,
        };
      }
      
      return {
        data: responseData.data,
        status: response.status,
        message: responseData.message || 'Success',
      };
    } catch (error) {
      if (error instanceof Error) {
        throw {
          status: 500,
          message: error.message,
        };
      }
      throw error;
    }
  }

  // Convenience methods for different HTTP verbs
  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, undefined, headers);
  }

  async post<T>(endpoint: string, data: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, data, headers);
  }

  async put<T>(endpoint: string, data: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, data, headers);
  }

  async patch<T>(endpoint: string, data: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', endpoint, data, headers);
  }

  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint, undefined, headers);
  }
}

// Create and export the API client instance
export const api = new ApiClient(apiUrl);

// Export API modules
export * from './auth';
export * from './products';
export * from './orders';
export * from './farms';