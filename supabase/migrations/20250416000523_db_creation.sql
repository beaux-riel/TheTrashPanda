-- HarvestLink Database Schema
-- This SQL file contains the complete database schema for the HarvestLink MVP

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN ('consumer', 'producer', 'admin')),
  email_verified BOOLEAN DEFAULT false NOT NULL,
  phone_verified BOOLEAN DEFAULT false NOT NULL,
  last_sign_in TIMESTAMP WITH TIME ZONE,
  metadata JSONB
);

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES public.users,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  preferences JSONB,
  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

-- Farms table
CREATE TABLE public.farms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  owner_id UUID REFERENCES public.users NOT NULL,
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
  average_rating DECIMAL(3, 2) DEFAULT 0,
  verification_date TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES public.users
);

-- Farm images table
CREATE TABLE public.farm_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  farm_id UUID REFERENCES public.farms NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0
);

-- Categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  icon_url TEXT,
  display_order INTEGER DEFAULT 0,
  parent_id UUID REFERENCES public.categories
);

-- Products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  farm_id UUID REFERENCES public.farms NOT NULL,
  category_id UUID REFERENCES public.categories NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT,
  price DECIMAL(10, 2) NOT NULL,
  unit TEXT NOT NULL,
  is_organic BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  harvest_date DATE,
  available_until DATE,
  tags TEXT[],
  nutrition_info JSONB,
  storage_instructions TEXT
);

-- Product images table
CREATE TABLE public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  product_id UUID REFERENCES public.products NOT NULL,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0
);

-- Inventory table
CREATE TABLE public.inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  product_id UUID REFERENCES public.products NOT NULL UNIQUE,
  quantity_available INTEGER NOT NULL DEFAULT 0,
  quantity_reserved INTEGER NOT NULL DEFAULT 0,
  lot_number TEXT,
  expiration_date DATE,
  storage_location TEXT,
  last_inventory_update TIMESTAMP WITH TIME ZONE
);

-- Pickup locations table
CREATE TABLE public.pickup_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
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
  available_hours JSONB,
  instructions TEXT,
  max_orders_per_day INTEGER
);

-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  consumer_id UUID REFERENCES public.users NOT NULL,
  farm_id UUID REFERENCES public.farms NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'ready', 'completed', 'cancelled')) DEFAULT 'pending',
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  pickup_date TIMESTAMP WITH TIME ZONE,
  pickup_location_id UUID REFERENCES public.pickup_locations,
  notes TEXT,
  payment_status TEXT CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  payment_method TEXT,
  payment_intent_id TEXT,
  payment_processed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT
);

-- Order items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  order_id UUID REFERENCES public.orders NOT NULL,
  product_id UUID REFERENCES public.products NOT NULL,
  inventory_id UUID REFERENCES public.inventory NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  notes TEXT
);

-- Reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  consumer_id UUID REFERENCES public.users NOT NULL,
  farm_id UUID REFERENCES public.farms NOT NULL,
  order_id UUID REFERENCES public.orders,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT true,
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES public.users,
  helpful_tags TEXT[]
);

-- Messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  sender_id UUID REFERENCES public.users NOT NULL,
  recipient_id UUID REFERENCES public.users NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  related_order_id UUID REFERENCES public.orders,
  related_product_id UUID REFERENCES public.products,
  message_type TEXT CHECK (message_type IN ('text', 'system', 'order_update'))
);

-- Favorites table
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  user_id UUID REFERENCES public.users NOT NULL,
  farm_id UUID REFERENCES public.farms,
  product_id UUID REFERENCES public.products,
  CONSTRAINT favorites_target_check CHECK (farm_id IS NOT NULL OR product_id IS NOT NULL),
  CONSTRAINT favorites_unique UNIQUE(user_id, farm_id, product_id)
);

-- Notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  user_id UUID REFERENCES public.users NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  data JSONB,
  action_url TEXT
);

-- Create indexes for performance optimization

-- Users and Profiles
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_user_type ON public.users(user_type);
CREATE INDEX idx_profiles_username ON public.profiles(username);

-- Farms
CREATE INDEX idx_farms_owner_id ON public.farms(owner_id);
CREATE INDEX idx_farms_location ON public.farms(city, state, country);
CREATE INDEX idx_farms_is_active ON public.farms(is_active);
CREATE INDEX idx_farms_is_verified ON public.farms(is_verified);
CREATE INDEX idx_farms_growing_practices ON public.farms USING GIN(growing_practices);
CREATE INDEX idx_farms_geolocation ON public.farms(latitude, longitude);

-- Products
CREATE INDEX idx_products_farm_id ON public.products(farm_id);
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_is_active ON public.products(is_active);
CREATE INDEX idx_products_is_featured ON public.products(is_featured);
CREATE INDEX idx_products_tags ON public.products USING GIN(tags);
CREATE INDEX idx_products_available_until ON public.products(available_until);

-- Inventory
CREATE INDEX idx_inventory_product_id ON public.inventory(product_id);
CREATE INDEX idx_inventory_quantity ON public.inventory(quantity_available);
CREATE INDEX idx_inventory_expiration ON public.inventory(expiration_date);

-- Orders
CREATE INDEX idx_orders_consumer_id ON public.orders(consumer_id);
CREATE INDEX idx_orders_farm_id ON public.orders(farm_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_pickup_date ON public.orders(pickup_date);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);

-- Order Items
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_product_id ON public.order_items(product_id);

-- Reviews
CREATE INDEX idx_reviews_farm_id ON public.reviews(farm_id);
CREATE INDEX idx_reviews_consumer_id ON public.reviews(consumer_id);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);
CREATE INDEX idx_reviews_is_verified ON public.reviews(is_verified);

-- Messages
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON public.messages(recipient_id);
CREATE INDEX idx_messages_is_read ON public.messages(is_read);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);

-- Favorites
CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX idx_favorites_farm_id ON public.favorites(farm_id);
CREATE INDEX idx_favorites_product_id ON public.favorites(product_id);

-- Notifications
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at);

-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create Row Level Security Policies

-- Users policies
CREATE POLICY "Users can view their own data" 
ON public.users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" 
ON public.users FOR UPDATE USING (auth.uid() = id);

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

-- Farm images policies
CREATE POLICY "Farm images are viewable by everyone" 
ON public.farm_images FOR SELECT USING (true);

CREATE POLICY "Farm owners can manage their farm images" 
ON public.farm_images FOR ALL USING (
  auth.uid() IN (
    SELECT owner_id FROM public.farms WHERE id = farm_id
  )
);

-- Categories policies
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories FOR SELECT USING (true);

CREATE POLICY "Only admins can manage categories" 
ON public.categories FOR ALL USING (
  auth.uid() IN (
    SELECT id FROM public.users WHERE user_type = 'admin'
  )
);

-- Products policies
CREATE POLICY "Active products are viewable by everyone" 
ON public.products FOR SELECT USING (is_active = true);

CREATE POLICY "Farm owners can manage their products" 
ON public.products FOR ALL USING (
  auth.uid() IN (
    SELECT owner_id FROM public.farms WHERE id = farm_id
  )
);

-- Product images policies
CREATE POLICY "Product images are viewable by everyone" 
ON public.product_images FOR SELECT USING (true);

CREATE POLICY "Farm owners can manage their product images" 
ON public.product_images FOR ALL USING (
  auth.uid() IN (
    SELECT owner_id FROM public.farms WHERE id = (
      SELECT farm_id FROM public.products WHERE id = product_id
    )
  )
);

-- Inventory policies
CREATE POLICY "Inventory is viewable by product owners" 
ON public.inventory FOR SELECT USING (
  auth.uid() IN (
    SELECT owner_id FROM public.farms WHERE id = (
      SELECT farm_id FROM public.products WHERE id = product_id
    )
  )
);

CREATE POLICY "Farm owners can manage their inventory" 
ON public.inventory FOR ALL USING (
  auth.uid() IN (
    SELECT owner_id FROM public.farms WHERE id = (
      SELECT farm_id FROM public.products WHERE id = product_id
    )
  )
);

-- Pickup locations policies
CREATE POLICY "Pickup locations are viewable by everyone" 
ON public.pickup_locations FOR SELECT USING (is_active = true);

CREATE POLICY "Farm owners can manage their pickup locations" 
ON public.pickup_locations FOR ALL USING (
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
);

-- Order items policies
CREATE POLICY "Consumers can view their own order items" 
ON public.order_items FOR SELECT USING (
  auth.uid() IN (
    SELECT consumer_id FROM public.orders WHERE id = order_id
  )
);

CREATE POLICY "Producers can view order items for their farms" 
ON public.order_items FOR SELECT USING (
  auth.uid() IN (
    SELECT owner_id FROM public.farms WHERE id = (
      SELECT farm_id FROM public.orders WHERE id = order_id
    )
  )
);

CREATE POLICY "Consumers can create order items" 
ON public.order_items FOR INSERT WITH CHECK (
  auth.uid() IN (
    SELECT consumer_id FROM public.orders WHERE id = order_id
  )
);

-- Reviews policies
CREATE POLICY "Public reviews are viewable by everyone" 
ON public.reviews FOR SELECT USING (is_public = true);

CREATE POLICY "Consumers can create reviews for their orders" 
ON public.reviews FOR INSERT WITH CHECK (
  auth.uid() = consumer_id AND
  (order_id IS NULL OR auth.uid() IN (
    SELECT consumer_id FROM public.orders WHERE id = order_id
  ))
);

CREATE POLICY "Consumers can update their own reviews" 
ON public.reviews FOR UPDATE USING (
  auth.uid() = consumer_id
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
  auth.uid() = recipient_id
)
WITH CHECK (
  auth.uid() = recipient_id AND 
  is_read = true AND
  (SELECT content FROM public.messages WHERE id = id) = content AND
  (SELECT sender_id FROM public.messages WHERE id = id) = sender_id AND
  (SELECT recipient_id FROM public.messages WHERE id = id) = recipient_id
);

-- Favorites policies
CREATE POLICY "Users can view their own favorites" 
ON public.favorites FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own favorites" 
ON public.favorites FOR ALL USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" 
ON public.notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can mark their notifications as read" 
ON public.notifications FOR UPDATE USING (
  auth.uid() = user_id
)
WITH CHECK (
  auth.uid() = user_id AND
  is_read = true
);

-- Create functions for common operations

-- Function to update farm average rating when a review is added or updated
CREATE OR REPLACE FUNCTION update_farm_average_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.farms
  SET average_rating = (
    SELECT COALESCE(AVG(rating), 0)
    FROM public.reviews
    WHERE farm_id = NEW.farm_id AND is_verified = true
  )
  WHERE id = NEW.farm_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update farm average rating
CREATE TRIGGER update_farm_rating_on_review
AFTER INSERT OR UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION update_farm_average_rating();

-- Function to update inventory when an order is placed
CREATE OR REPLACE FUNCTION update_inventory_on_order()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.inventory
  SET quantity_reserved = quantity_reserved + NEW.quantity
  WHERE id = NEW.inventory_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update inventory when an order item is added
CREATE TRIGGER update_inventory_on_order_item
AFTER INSERT ON public.order_items
FOR EACH ROW
EXECUTE FUNCTION update_inventory_on_order();

-- Function to update inventory when an order is completed or cancelled
CREATE OR REPLACE FUNCTION update_inventory_on_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' THEN
    -- Order completed, remove reserved quantities from available
    UPDATE public.inventory i
    SET 
      quantity_reserved = quantity_reserved - oi.quantity,
      quantity_available = quantity_available - oi.quantity
    FROM public.order_items oi
    WHERE oi.order_id = NEW.id AND i.id = oi.inventory_id;
  ELSIF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
    -- Order cancelled, return reserved quantities
    UPDATE public.inventory i
    SET quantity_reserved = quantity_reserved - oi.quantity
    FROM public.order_items oi
    WHERE oi.order_id = NEW.id AND i.id = oi.inventory_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update inventory when an order status changes
CREATE TRIGGER update_inventory_on_order_status
AFTER UPDATE ON public.orders
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION update_inventory_on_order_status_change();

-- Function to create a notification when an order status changes
CREATE OR REPLACE FUNCTION create_order_status_notification()
RETURNS TRIGGER AS $$
DECLARE
  notification_title TEXT;
  notification_content TEXT;
BEGIN
  -- Set notification content based on new status
  CASE NEW.status
    WHEN 'confirmed' THEN
      notification_title := 'Order Confirmed';
      notification_content := 'Your order has been confirmed by the farm.';
    WHEN 'ready' THEN
      notification_title := 'Order Ready for Pickup';
      notification_content := 'Your order is ready for pickup.';
    WHEN 'completed' THEN
      notification_title := 'Order Completed';
      notification_content := 'Your order has been completed. Thank you for your purchase!';
    WHEN 'cancelled' THEN
      notification_title := 'Order Cancelled';
      notification_content := 'Your order has been cancelled.';
    ELSE
      RETURN NEW;
  END CASE;
  
  -- Create notification for consumer
  INSERT INTO public.notifications (
    user_id, type, title, content, data, action_url
  ) VALUES (
    NEW.consumer_id,
    'order_update',
    notification_title,
    notification_content,
    jsonb_build_object('order_id', NEW.id, 'status', NEW.status),
    '/orders/' || NEW.id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create notification when order status changes
CREATE TRIGGER create_notification_on_order_status
AFTER UPDATE ON public.orders
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION create_order_status_notification();

-- Function to create a notification when a new message is received
CREATE OR REPLACE FUNCTION create_message_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Create notification for recipient
  INSERT INTO public.notifications (
    user_id, type, title, content, data, action_url
  ) VALUES (
    NEW.recipient_id,
    'new_message',
    'New Message',
    substring(NEW.content from 1 for 50) || CASE WHEN length(NEW.content) > 50 THEN '...' ELSE '' END,
    jsonb_build_object('message_id', NEW.id, 'sender_id', NEW.sender_id),
    '/messages/' || NEW.sender_id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create notification when new message is sent
CREATE TRIGGER create_notification_on_message
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION create_message_notification();

-- Function to update timestamps on record update
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create update timestamp triggers for all tables with updated_at column
CREATE TRIGGER update_users_modtime
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_profiles_modtime
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_farms_modtime
BEFORE UPDATE ON public.farms
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_categories_modtime
BEFORE UPDATE ON public.categories
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_products_modtime
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_inventory_modtime
BEFORE UPDATE ON public.inventory
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_pickup_locations_modtime
BEFORE UPDATE ON public.pickup_locations
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_orders_modtime
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_reviews_modtime
BEFORE UPDATE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Insert initial categories
INSERT INTO public.categories (name, description, display_order) VALUES
('Vegetables', 'Fresh vegetables from local farms', 10),
('Fruits', 'Fresh fruits from local farms', 20),
('Dairy', 'Fresh dairy products from local farms', 30),
('Meat', 'Fresh meat from local farms', 40),
('Eggs', 'Fresh eggs from local farms', 50),
('Honey', 'Local honey and bee products', 60),
('Herbs', 'Fresh and dried herbs', 70),
('Baked Goods', 'Freshly baked goods', 80),
('Preserves', 'Jams, jellies, and preserves', 90),
('Specialty Items', 'Specialty and artisanal products', 100);

-- Insert subcategories
DO $$
DECLARE
  vegetables_id UUID;
  fruits_id UUID;
  dairy_id UUID;
  meat_id UUID;
BEGIN
  -- Get parent category IDs
  SELECT id INTO vegetables_id FROM public.categories WHERE name = 'Vegetables';
  SELECT id INTO fruits_id FROM public.categories WHERE name = 'Fruits';
  SELECT id INTO dairy_id FROM public.categories WHERE name = 'Dairy';
  SELECT id INTO meat_id FROM public.categories WHERE name = 'Meat';
  
  -- Insert vegetable subcategories
  INSERT INTO public.categories (name, description, parent_id, display_order) VALUES
  ('Leafy Greens', 'Lettuce, spinach, kale, and other leafy greens', vegetables_id, 11),
  ('Root Vegetables', 'Carrots, potatoes, beets, and other root vegetables', vegetables_id, 12),
  ('Tomatoes', 'Various tomato varieties', vegetables_id, 13),
  ('Squash', 'Summer and winter squash varieties', vegetables_id, 14),
  ('Peppers', 'Sweet and hot peppers', vegetables_id, 15),
  ('Onions & Garlic', 'Onions, garlic, leeks, and shallots', vegetables_id, 16);
  
  -- Insert fruit subcategories
  INSERT INTO public.categories (name, description, parent_id, display_order) VALUES
  ('Berries', 'Strawberries, blueberries, raspberries, and other berries', fruits_id, 21),
  ('Tree Fruits', 'Apples, pears, peaches, and other tree fruits', fruits_id, 22),
  ('Melons', 'Watermelons, cantaloupes, and other melons', fruits_id, 23);
  
  -- Insert dairy subcategories
  INSERT INTO public.categories (name, description, parent_id, display_order) VALUES
  ('Milk', 'Fresh milk products', dairy_id, 31),
  ('Cheese', 'Artisanal and farmstead cheeses', dairy_id, 32),
  ('Yogurt', 'Yogurt and cultured dairy products', dairy_id, 33),
  ('Butter', 'Fresh butter and cream', dairy_id, 34);
  
  -- Insert meat subcategories
  INSERT INTO public.categories (name, description, parent_id, display_order) VALUES
  ('Beef', 'Grass-fed and pasture-raised beef', meat_id, 41),
  ('Pork', 'Pasture-raised pork', meat_id, 42),
  ('Poultry', 'Free-range chicken, turkey, and other poultry', meat_id, 43),
  ('Lamb', 'Pasture-raised lamb', meat_id, 44);
END $$;