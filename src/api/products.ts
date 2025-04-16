import { supabase } from './client';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  subcategory?: string;
  farmId: string;
  farmName: string;
  images: string[];
  available: boolean;
  stock: number;
  organic: boolean;
  featured: boolean;
  seasonal: boolean;
  harvestDate?: string;
  tags: string[];
}

export interface ProductListParams {
  search?: string;
  farmId?: string;
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  organic?: boolean;
  seasonal?: boolean;
  available?: boolean;
  featured?: boolean;
  tags?: string[];
  limit?: number;
  offset?: number;
}

export const productsApi = {
  // Get all products with optional filtering
  getProducts: async (params?: ProductListParams): Promise<Product[]> => {
    let query = supabase
      .from('products')
      .select('*, farms(name)');
    
    if (params?.search) {
      query = query.ilike('name', `%${params.search}%`);
    }
    
    if (params?.farmId) {
      query = query.eq('farm_id', params.farmId);
    }
    
    if (params?.category) {
      query = query.eq('category', params.category);
    }
    
    if (params?.subcategory) {
      query = query.eq('subcategory', params.subcategory);
    }
    
    if (params?.minPrice !== undefined) {
      query = query.gte('price', params.minPrice);
    }
    
    if (params?.maxPrice !== undefined) {
      query = query.lte('price', params.maxPrice);
    }
    
    if (params?.organic !== undefined) {
      query = query.eq('organic', params.organic);
    }
    
    if (params?.seasonal !== undefined) {
      query = query.eq('seasonal', params.seasonal);
    }
    
    if (params?.available !== undefined) {
      query = query.eq('available', params.available);
    }
    
    if (params?.featured !== undefined) {
      query = query.eq('featured', params.featured);
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
    
    return data.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      unit: product.unit,
      category: product.category,
      subcategory: product.subcategory,
      farmId: product.farm_id,
      farmName: product.farms.name,
      images: product.images,
      available: product.available,
      stock: product.stock,
      organic: product.organic,
      featured: product.featured,
      seasonal: product.seasonal,
      harvestDate: product.harvest_date,
      tags: product.tags,
    }));
  },
  
  // Get a single product by ID
  getProduct: async (id: string): Promise<Product> => {
    const { data, error } = await supabase
      .from('products')
      .select('*, farms(name)')
      .eq('id', id)
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      unit: data.unit,
      category: data.category,
      subcategory: data.subcategory,
      farmId: data.farm_id,
      farmName: data.farms.name,
      images: data.images,
      available: data.available,
      stock: data.stock,
      organic: data.organic,
      featured: data.featured,
      seasonal: data.seasonal,
      harvestDate: data.harvest_date,
      tags: data.tags,
    };
  },
  
  // Create a new product (for producers)
  createProduct: async (productData: Omit<Product, 'id' | 'farmName'>): Promise<Product> => {
    const { data: farmData, error: farmError } = await supabase
      .from('farms')
      .select('name')
      .eq('id', productData.farmId)
      .single();
    
    if (farmError) {
      throw new Error(farmError.message);
    }
    
    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          unit: productData.unit,
          category: productData.category,
          subcategory: productData.subcategory,
          farm_id: productData.farmId,
          images: productData.images,
          available: productData.available,
          stock: productData.stock,
          organic: productData.organic,
          featured: productData.featured,
          seasonal: productData.seasonal,
          harvest_date: productData.harvestDate,
          tags: productData.tags,
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
      price: data.price,
      unit: data.unit,
      category: data.category,
      subcategory: data.subcategory,
      farmId: data.farm_id,
      farmName: farmData.name,
      images: data.images,
      available: data.available,
      stock: data.stock,
      organic: data.organic,
      featured: data.featured,
      seasonal: data.seasonal,
      harvestDate: data.harvest_date,
      tags: data.tags,
    };
  },
  
  // Update an existing product (for producers)
  updateProduct: async (id: string, productData: Partial<Product>): Promise<Product> => {
    const updateData: any = {};
    
    if (productData.name) updateData.name = productData.name;
    if (productData.description) updateData.description = productData.description;
    if (productData.price !== undefined) updateData.price = productData.price;
    if (productData.unit) updateData.unit = productData.unit;
    if (productData.category) updateData.category = productData.category;
    if (productData.subcategory) updateData.subcategory = productData.subcategory;
    if (productData.images) updateData.images = productData.images;
    if (productData.available !== undefined) updateData.available = productData.available;
    if (productData.stock !== undefined) updateData.stock = productData.stock;
    if (productData.organic !== undefined) updateData.organic = productData.organic;
    if (productData.featured !== undefined) updateData.featured = productData.featured;
    if (productData.seasonal !== undefined) updateData.seasonal = productData.seasonal;
    if (productData.harvestDate) updateData.harvest_date = productData.harvestDate;
    if (productData.tags) updateData.tags = productData.tags;
    
    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select('*, farms(name)')
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      unit: data.unit,
      category: data.category,
      subcategory: data.subcategory,
      farmId: data.farm_id,
      farmName: data.farms.name,
      images: data.images,
      available: data.available,
      stock: data.stock,
      organic: data.organic,
      featured: data.featured,
      seasonal: data.seasonal,
      harvestDate: data.harvest_date,
      tags: data.tags,
    };
  },
  
  // Delete a product (for producers)
  deleteProduct: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw new Error(error.message);
    }
  },
};