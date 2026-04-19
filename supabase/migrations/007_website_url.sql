-- Add website_url column to profiles
-- Allows producers to link to their external website

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS website_url text;

-- Index for non-null URLs (useful for filtering "has website")
CREATE INDEX IF NOT EXISTS profiles_website_url_idx 
  ON public.profiles (website_url) WHERE website_url IS NOT NULL;
