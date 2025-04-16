import { supabase } from './client';
import { apiClient } from './client';

export interface Farm {
  id: string;
  name: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  ownerId: string;
  coverImage?: string;
  profileImage?: string;
  tags: string[];
  rating: number;
  ratingCount: number;
  farmingPractices: string[];
  farmSize: string;
  establishedYear: number;
  certifications: string[];
  distance?: number; // Calculated field
}

export interface FarmListParams {
  search?: string;
  tags?: string[];
  maxDistance?: number;
  latitude?: number;
  longitude?: number;
  limit?: number;
  offset?: number;
}

export const farmsApi = {
  // Get all farms with optional filtering
  getFarms: async (params?: FarmListParams): Promise<Farm[]> => {
    // If location is provided, use the REST API for geospatial queries
    if (params?.latitude && params?.longitude) {
      return apiClient.get<Farm[]>('/farms', {
        ...(params.search ? { search: params.search } : {}),
        ...(params.tags ? { tags: params.tags.join(',') } : {}),
        ...(params.maxDistance ? { maxDistance: params.maxDistance.toString() } : {}),
        latitude: params.latitude.toString(),
        longitude: params.longitude.toString(),
        ...(params.limit ? { limit: params.limit.toString() } : {}),
        ...(params.offset ? { offset: params.offset.toString() } : {}),
      });
    }
    
    // Otherwise use Supabase directly
    let query = supabase
      .from('farms')
      .select('*, farm_tags(tag)');
    
    if (params?.search) {
      query = query.ilike('name', `%${params.search}%`);
    }
    
    if (params?.tags && params.tags.length > 0) {
      query = query.contains('tags', params.tags);
    }
    
    if (params?.limit) {
      query = query.limit(params.limit);
    }
    
    if (params?.offset) {
      query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data.map(farm => ({
      id: farm.id,
      name: farm.name,
      description: farm.description,
      location: {
        latitude: farm.latitude,
        longitude: farm.longitude,
        address: farm.address,
        city: farm.city,
        state: farm.state,
        zipCode: farm.zip_code,
      },
      ownerId: farm.owner_id,
      coverImage: farm.cover_image,
      profileImage: farm.profile_image,
      tags: farm.tags,
      rating: farm.rating,
      ratingCount: farm.rating_count,
      farmingPractices: farm.farming_practices,
      farmSize: farm.farm_size,
      establishedYear: farm.established_year,
      certifications: farm.certifications,
    }));
  },
  
  // Get a single farm by ID
  getFarm: async (id: string): Promise<Farm> => {
    const { data, error } = await supabase
      .from('farms')
      .select('*, farm_tags(tag)')
      .eq('id', id)
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      location: {
        latitude: data.latitude,
        longitude: data.longitude,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zip_code,
      },
      ownerId: data.owner_id,
      coverImage: data.cover_image,
      profileImage: data.profile_image,
      tags: data.tags,
      rating: data.rating,
      ratingCount: data.rating_count,
      farmingPractices: data.farming_practices,
      farmSize: data.farm_size,
      establishedYear: data.established_year,
      certifications: data.certifications,
    };
  },
  
  // Create a new farm (for producers)
  createFarm: async (farmData: Omit<Farm, 'id' | 'rating' | 'ratingCount'>): Promise<Farm> => {
    const { data, error } = await supabase
      .from('farms')
      .insert([
        {
          name: farmData.name,
          description: farmData.description,
          latitude: farmData.location.latitude,
          longitude: farmData.location.longitude,
          address: farmData.location.address,
          city: farmData.location.city,
          state: farmData.location.state,
          zip_code: farmData.location.zipCode,
          owner_id: farmData.ownerId,
          cover_image: farmData.coverImage,
          profile_image: farmData.profileImage,
          tags: farmData.tags,
          farming_practices: farmData.farmingPractices,
          farm_size: farmData.farmSize,
          established_year: farmData.establishedYear,
          certifications: farmData.certifications,
        },
      ])
      .select()
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      location: {
        latitude: data.latitude,
        longitude: data.longitude,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zip_code,
      },
      ownerId: data.owner_id,
      coverImage: data.cover_image,
      profileImage: data.profile_image,
      tags: data.tags,
      rating: data.rating,
      ratingCount: data.rating_count,
      farmingPractices: data.farming_practices,
      farmSize: data.farm_size,
      establishedYear: data.established_year,
      certifications: data.certifications,
    };
  },
  
  // Update an existing farm (for producers)
  updateFarm: async (id: string, farmData: Partial<Farm>): Promise<Farm> => {
    const updateData: any = {};
    
    if (farmData.name) updateData.name = farmData.name;
    if (farmData.description) updateData.description = farmData.description;
    if (farmData.location) {
      if (farmData.location.latitude) updateData.latitude = farmData.location.latitude;
      if (farmData.location.longitude) updateData.longitude = farmData.location.longitude;
      if (farmData.location.address) updateData.address = farmData.location.address;
      if (farmData.location.city) updateData.city = farmData.location.city;
      if (farmData.location.state) updateData.state = farmData.location.state;
      if (farmData.location.zipCode) updateData.zip_code = farmData.location.zipCode;
    }
    if (farmData.coverImage) updateData.cover_image = farmData.coverImage;
    if (farmData.profileImage) updateData.profile_image = farmData.profileImage;
    if (farmData.tags) updateData.tags = farmData.tags;
    if (farmData.farmingPractices) updateData.farming_practices = farmData.farmingPractices;
    if (farmData.farmSize) updateData.farm_size = farmData.farmSize;
    if (farmData.establishedYear) updateData.established_year = farmData.establishedYear;
    if (farmData.certifications) updateData.certifications = farmData.certifications;
    
    const { data, error } = await supabase
      .from('farms')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      location: {
        latitude: data.latitude,
        longitude: data.longitude,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zip_code,
      },
      ownerId: data.owner_id,
      coverImage: data.cover_image,
      profileImage: data.profile_image,
      tags: data.tags,
      rating: data.rating,
      ratingCount: data.rating_count,
      farmingPractices: data.farming_practices,
      farmSize: data.farm_size,
      establishedYear: data.established_year,
      certifications: data.certifications,
    };
  },
};