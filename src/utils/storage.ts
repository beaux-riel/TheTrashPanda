import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'harvestlink:auth:token',
  USER_DATA: 'harvestlink:auth:user',
  CART_ITEMS: 'harvestlink:cart:items',
  RECENT_SEARCHES: 'harvestlink:recent:searches',
  FAVORITE_FARMS: 'harvestlink:favorites:farms',
  FAVORITE_PRODUCTS: 'harvestlink:favorites:products',
  ONBOARDING_COMPLETED: 'harvestlink:onboarding:completed',
  LOCATION_PERMISSION: 'harvestlink:permission:location',
  NOTIFICATION_PERMISSION: 'harvestlink:permission:notification',
  THEME_PREFERENCE: 'harvestlink:settings:theme',
  LANGUAGE_PREFERENCE: 'harvestlink:settings:language',
};

// Generic storage functions
export const storage = {
  // Store data
  storeData: async <T>(key: string, value: T): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error storing data:', error);
      throw error;
    }
  },
  
  // Get data
  getData: async <T>(key: string): Promise<T | null> => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error retrieving data:', error);
      throw error;
    }
  },
  
  // Remove data
  removeData: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data:', error);
      throw error;
    }
  },
  
  // Clear all data
  clearAll: async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  },
  
  // Get multiple items
  getMultiple: async (keys: string[]): Promise<Record<string, any>> => {
    try {
      const results = await AsyncStorage.multiGet(keys);
      return results.reduce((acc, [key, value]) => {
        if (value) {
          acc[key] = JSON.parse(value);
        }
        return acc;
      }, {} as Record<string, any>);
    } catch (error) {
      console.error('Error retrieving multiple items:', error);
      throw error;
    }
  },
  
  // Store multiple items
  storeMultiple: async (items: [string, any][]): Promise<void> => {
    try {
      const pairs = items.map(([key, value]) => [key, JSON.stringify(value)]);
      await AsyncStorage.multiSet(pairs as [string, string][]);
    } catch (error) {
      console.error('Error storing multiple items:', error);
      throw error;
    }
  },
};

// Specific storage functions
export const userStorage = {
  // Store user data
  storeUserData: async (userData: any): Promise<void> => {
    await storage.storeData(STORAGE_KEYS.USER_DATA, userData);
  },
  
  // Get user data
  getUserData: async (): Promise<any | null> => {
    return storage.getData(STORAGE_KEYS.USER_DATA);
  },
  
  // Store auth token
  storeAuthToken: async (token: string): Promise<void> => {
    await storage.storeData(STORAGE_KEYS.AUTH_TOKEN, token);
  },
  
  // Get auth token
  getAuthToken: async (): Promise<string | null> => {
    return storage.getData(STORAGE_KEYS.AUTH_TOKEN);
  },
  
  // Clear auth data
  clearAuthData: async (): Promise<void> => {
    await storage.removeData(STORAGE_KEYS.AUTH_TOKEN);
    await storage.removeData(STORAGE_KEYS.USER_DATA);
  },
};

// Favorites storage
export const favoritesStorage = {
  // Add farm to favorites
  addFavoriteFarm: async (farmId: string): Promise<string[]> => {
    const favorites = await storage.getData<string[]>(STORAGE_KEYS.FAVORITE_FARMS) || [];
    if (!favorites.includes(farmId)) {
      favorites.push(farmId);
      await storage.storeData(STORAGE_KEYS.FAVORITE_FARMS, favorites);
    }
    return favorites;
  },
  
  // Remove farm from favorites
  removeFavoriteFarm: async (farmId: string): Promise<string[]> => {
    const favorites = await storage.getData<string[]>(STORAGE_KEYS.FAVORITE_FARMS) || [];
    const updatedFavorites = favorites.filter(id => id !== farmId);
    await storage.storeData(STORAGE_KEYS.FAVORITE_FARMS, updatedFavorites);
    return updatedFavorites;
  },
  
  // Get favorite farms
  getFavoriteFarms: async (): Promise<string[]> => {
    return (await storage.getData<string[]>(STORAGE_KEYS.FAVORITE_FARMS)) || [];
  },
  
  // Check if farm is favorite
  isFarmFavorite: async (farmId: string): Promise<boolean> => {
    const favorites = await storage.getData<string[]>(STORAGE_KEYS.FAVORITE_FARMS) || [];
    return favorites.includes(farmId);
  },
  
  // Add product to favorites
  addFavoriteProduct: async (productId: string): Promise<string[]> => {
    const favorites = await storage.getData<string[]>(STORAGE_KEYS.FAVORITE_PRODUCTS) || [];
    if (!favorites.includes(productId)) {
      favorites.push(productId);
      await storage.storeData(STORAGE_KEYS.FAVORITE_PRODUCTS, favorites);
    }
    return favorites;
  },
  
  // Remove product from favorites
  removeFavoriteProduct: async (productId: string): Promise<string[]> => {
    const favorites = await storage.getData<string[]>(STORAGE_KEYS.FAVORITE_PRODUCTS) || [];
    const updatedFavorites = favorites.filter(id => id !== productId);
    await storage.storeData(STORAGE_KEYS.FAVORITE_PRODUCTS, updatedFavorites);
    return updatedFavorites;
  },
  
  // Get favorite products
  getFavoriteProducts: async (): Promise<string[]> => {
    return (await storage.getData<string[]>(STORAGE_KEYS.FAVORITE_PRODUCTS)) || [];
  },
  
  // Check if product is favorite
  isProductFavorite: async (productId: string): Promise<boolean> => {
    const favorites = await storage.getData<string[]>(STORAGE_KEYS.FAVORITE_PRODUCTS) || [];
    return favorites.includes(productId);
  },
};

// Recent searches storage
export const searchStorage = {
  // Add recent search
  addRecentSearch: async (searchTerm: string): Promise<string[]> => {
    const searches = await storage.getData<string[]>(STORAGE_KEYS.RECENT_SEARCHES) || [];
    
    // Remove if already exists (to move it to the top)
    const filteredSearches = searches.filter(term => term !== searchTerm);
    
    // Add to the beginning of the array
    filteredSearches.unshift(searchTerm);
    
    // Keep only the most recent 10 searches
    const trimmedSearches = filteredSearches.slice(0, 10);
    
    await storage.storeData(STORAGE_KEYS.RECENT_SEARCHES, trimmedSearches);
    return trimmedSearches;
  },
  
  // Get recent searches
  getRecentSearches: async (): Promise<string[]> => {
    return (await storage.getData<string[]>(STORAGE_KEYS.RECENT_SEARCHES)) || [];
  },
  
  // Clear recent searches
  clearRecentSearches: async (): Promise<void> => {
    await storage.removeData(STORAGE_KEYS.RECENT_SEARCHES);
  },
};