import { supabase } from '../config/supabaseClient';
import * as FileSystem from 'expo-file-system';

// Define storage buckets
export const STORAGE_BUCKETS = {
  FARM_LOGOS: 'farm-logos',
  FARM_BANNERS: 'farm-banners',
  FARM_IMAGES: 'farm-images',
  PRODUCT_IMAGES: 'product-images',
  USER_AVATARS: 'user-avatars',
  VERIFICATION_DOCS: 'verification-docs',
};

// Upload farm logo
export const uploadFarmLogo = async (farmId: string, uri: string) => {
  return uploadImage(STORAGE_BUCKETS.FARM_LOGOS, `${farmId}/logo`, uri);
};

// Upload farm banner
export const uploadFarmBanner = async (farmId: string, uri: string) => {
  return uploadImage(STORAGE_BUCKETS.FARM_BANNERS, `${farmId}/banner`, uri);
};

// Upload farm image
export const uploadFarmImage = async (farmId: string, uri: string) => {
  const timestamp = new Date().getTime();
  return uploadImage(STORAGE_BUCKETS.FARM_IMAGES, `${farmId}/${timestamp}`, uri);
};

// Upload product image
export const uploadProductImage = async (productId: string, uri: string) => {
  const timestamp = new Date().getTime();
  return uploadImage(STORAGE_BUCKETS.PRODUCT_IMAGES, `${productId}/${timestamp}`, uri);
};

// Upload user avatar
export const uploadUserAvatar = async (userId: string, uri: string) => {
  return uploadImage(STORAGE_BUCKETS.USER_AVATARS, userId, uri);
};

// Generic image upload function
const uploadImage = async (bucket: string, path: string, uri: string) => {
  try {
    const fileExt = uri.substring(uri.lastIndexOf('.') + 1);
    const filePath = `${path}.${fileExt}`;
    
    // Read file as base64
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, decode(base64), {
        contentType: `image/${fileExt}`,
        upsert: true,
      });
    
    if (error) throw error;
    
    // Get public URL
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