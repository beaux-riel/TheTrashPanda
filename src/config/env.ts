import Constants from 'expo-constants';

// Environment types
export type Environment = 'development' | 'staging' | 'production';

// Environment-specific configuration
interface EnvironmentConfig {
  apiUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  googleMapsApiKey: string;
}

// Configuration for each environment
const ENV: Record<Environment, EnvironmentConfig> = {
  development: {
    apiUrl: 'https://dev-api.harvestlink.com',
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
  },
  staging: {
    apiUrl: 'https://staging-api.harvestlink.com',
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
  },
  production: {
    apiUrl: 'https://api.harvestlink.com',
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
  },
};

// Get the current environment from app.json extra or default to development
const getEnvironment = (): Environment => {
  const appEnv = process.env.APP_ENV as Environment;
  if (appEnv && ['development', 'staging', 'production'].includes(appEnv)) {
    return appEnv;
  }
  
  // Fallback to development if not specified
  return 'development';
};

// Export the configuration for the current environment
export const getEnvConfig = (): EnvironmentConfig => {
  const env = getEnvironment();
  return ENV[env];
};

// Export individual config values for convenience
export const apiUrl = getEnvConfig().apiUrl;
export const supabaseUrl = getEnvConfig().supabaseUrl;
export const supabaseAnonKey = getEnvConfig().supabaseAnonKey;
export const googleMapsApiKey = getEnvConfig().googleMapsApiKey;

// Export the current environment
export const currentEnvironment = getEnvironment();

// Helper to check if we're in development
export const isDevelopment = currentEnvironment === 'development';

// Helper to check if we're in production
export const isProduction = currentEnvironment === 'production';