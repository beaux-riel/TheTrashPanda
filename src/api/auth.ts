import { supabase } from './client';
import { User, UserType } from '@/stores/authStore';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: UserType;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  // Login with email and password
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    if (!data.session || !data.user) {
      throw new Error('Login failed');
    }
    
    // Fetch user profile data from profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    if (profileError) {
      throw new Error(profileError.message);
    }
    
    return {
      user: {
        id: data.user.id,
        email: data.user.email || '',
        firstName: profileData.first_name,
        lastName: profileData.last_name,
        userType: profileData.user_type,
        profileImage: profileData.profile_image,
      },
      token: data.session.access_token,
    };
  },
  
  // Register a new user
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    // Register user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    if (!data.session || !data.user) {
      throw new Error('Registration failed');
    }
    
    // Create user profile in profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: data.user.id,
          first_name: userData.firstName,
          last_name: userData.lastName,
          user_type: userData.userType,
          email: userData.email,
        },
      ]);
    
    if (profileError) {
      throw new Error(profileError.message);
    }
    
    return {
      user: {
        id: data.user.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        userType: userData.userType,
      },
      token: data.session.access_token,
    };
  },
  
  // Logout the current user
  logout: async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw new Error(error.message);
    }
  },
  
  // Request password reset
  forgotPassword: async (email: string): Promise<void> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    
    if (error) {
      throw new Error(error.message);
    }
  },
  
  // Reset password with token
  resetPassword: async (password: string): Promise<void> => {
    const { error } = await supabase.auth.updateUser({
      password,
    });
    
    if (error) {
      throw new Error(error.message);
    }
  },
  
  // Get current session
  getCurrentSession: async (): Promise<AuthResponse | null> => {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      throw new Error(error.message);
    }
    
    if (!data.session || !data.session.user) {
      return null;
    }
    
    // Fetch user profile data
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.session.user.id)
      .single();
    
    if (profileError) {
      throw new Error(profileError.message);
    }
    
    return {
      user: {
        id: data.session.user.id,
        email: data.session.user.email || '',
        firstName: profileData.first_name,
        lastName: profileData.last_name,
        userType: profileData.user_type,
        profileImage: profileData.profile_image,
      },
      token: data.session.access_token,
    };
  },
};