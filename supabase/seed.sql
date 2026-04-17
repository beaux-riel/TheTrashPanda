-- HarvestLink seed data — Powell River producers + listings
-- Run via: psql "postgresql://postgres:...@db.xxx.supabase.co:5432/postgres" -f supabase/seed.sql

-- Use fixed UUIDs so we can reference them across tables
-- These go into auth.users (which triggers handle_new_user → auto-creates profile)

-- Step 1: Create auth users (the trigger creates profiles automatically)
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, aud, role)
VALUES
  ('a1111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'cedar@harvestlink.local', crypt('testpass123', gen_salt('bf')), now(), '{"display_name": "Cedar Bloom Homestead"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),
  ('a2222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'sourdough@harvestlink.local', crypt('testpass123', gen_salt('bf')), now(), '{"display_name": "Shoreline Sourdough"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),
  ('a3333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', 'townsite@harvestlink.local', crypt('testpass123', gen_salt('bf')), now(), '{"display_name": "Townsite Garden Collective"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),
  ('a4444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000', 'honey@harvestlink.local', crypt('testpass123', gen_salt('bf')), now(), '{"display_name": "Coastal Honey Co"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),
  ('a5555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000000', 'lund@harvestlink.local', crypt('testpass123', gen_salt('bf')), now(), '{"display_name": "Lund Seafood"}'::jsonb, now(), now(), 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

-- Also need identities for Supabase Auth to work
INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
VALUES
  ('a1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', '{"sub": "a1111111-1111-1111-1111-111111111111", "email": "cedar@harvestlink.local"}'::jsonb, 'email', now(), now()),
  ('a2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', '{"sub": "a2222222-2222-2222-2222-222222222222", "email": "sourdough@harvestlink.local"}'::jsonb, 'email', now(), now()),
  ('a3333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', '{"sub": "a3333333-3333-3333-3333-333333333333", "email": "townsite@harvestlink.local"}'::jsonb, 'email', now(), now()),
  ('a4444444-4444-4444-4444-444444444444', 'a4444444-4444-4444-4444-444444444444', 'a4444444-4444-4444-4444-444444444444', '{"sub": "a4444444-4444-4444-4444-444444444444", "email": "honey@harvestlink.local"}'::jsonb, 'email', now(), now()),
  ('a5555555-5555-5555-5555-555555555555', 'a5555555-5555-5555-5555-555555555555', 'a5555555-5555-5555-5555-555555555555', '{"sub": "a5555555-5555-5555-5555-555555555555", "email": "lund@harvestlink.local"}'::jsonb, 'email', now(), now())
ON CONFLICT DO NOTHING;

-- Step 2: Enrich profiles with producer details, locations, bios
-- (The trigger already created bare profiles from display_name)
UPDATE public.profiles SET
  bio = 'Eggs, greens, and a suspicious amount of dill from the upper end of Cranberry.',
  is_producer = true,
  categories = ARRAY['Eggs', 'Produce', 'Plants'],
  location = ST_SetSRID(ST_MakePoint(-124.51, 49.868), 4326)::geography,
  location_label = 'Cranberry, Powell River',
  pickup_details = 'Porch cooler by the red gate. If Bandit beats you there, be polite.',
  schedule_summary = 'Tue, Thu, Sat · 8am to noon'
WHERE id = 'a1111111-1111-1111-1111-111111111111';

UPDATE public.profiles SET
  bio = 'Small-batch bread near Willingdon Beach. Sourdough first, gossip second.',
  is_producer = true,
  categories = ARRAY['Baked Goods'],
  location = ST_SetSRID(ST_MakePoint(-124.5265, 49.8445), 4326)::geography,
  location_label = 'Willingdon Beach, Powell River',
  pickup_details = 'Saturday table by the blue van.',
  schedule_summary = 'Wed to Sat · 7am to 1pm'
WHERE id = 'a2222222-2222-2222-2222-222222222222';

UPDATE public.profiles SET
  bio = 'Neighbour-grown jars, herbs, and honey from the Townsite side, where everyone knows who forgot their basket.',
  is_producer = true,
  categories = ARRAY['Honey', 'Preserved', 'Produce'],
  location = ST_SetSRID(ST_MakePoint(-124.543, 49.837), 4326)::geography,
  location_label = 'Townsite, Powell River',
  pickup_details = 'Text the gate bell and give the bees a respectful wave.',
  schedule_summary = 'Fri & Sat · 10am to 4pm'
WHERE id = 'a3333333-3333-3333-3333-333333333333';

UPDATE public.profiles SET
  bio = 'Raw wildflower honey and beeswax from hives overlooking the Salish Sea. The bees do the work, we take the credit.',
  is_producer = true,
  categories = ARRAY['Honey'],
  location = ST_SetSRID(ST_MakePoint(-124.52, 49.855), 4326)::geography,
  location_label = 'Westview, Powell River',
  pickup_details = 'Garage side door. Cash or e-transfer. The dog is friendly, the cat is not.',
  schedule_summary = 'Mon, Wed, Fri · 9am to 3pm'
WHERE id = 'a4444444-4444-4444-4444-444444444444';

UPDATE public.profiles SET
  bio = 'Prawns, rockfish, and whatever else the ocean felt like sharing. Straight off the boat in Lund.',
  is_producer = true,
  categories = ARRAY['Meat & Fish'],
  location = ST_SetSRID(ST_MakePoint(-124.765, 49.975), 4326)::geography,
  location_label = 'Lund, Powell River',
  pickup_details = 'Dock B, slip 7. Text when you arrive. Bring a cooler.',
  schedule_summary = 'Tue, Thu, Sat · depends on the catch'
WHERE id = 'a5555555-5555-5555-5555-555555555555';

-- Step 3: Listings
INSERT INTO public.listings (id, producer_id, title, description, category, quantity, price_label, location, location_label, status, available_until, created_at)
VALUES
  -- Cedar Bloom
  (uuid_generate_v4(), 'a1111111-1111-1111-1111-111111111111',
   'Farm fresh eggs',
   'Brown and blue eggs. Neighbours keep calling them the fancy breakfast marbles.',
   'Eggs', 'plenty', '$6 / dozen',
   ST_SetSRID(ST_MakePoint(-124.5094, 49.8682), 4326)::geography,
   'Cranberry pickup porch', 'active',
   now() + interval '3 days',
   now() - interval '28 minutes'),

  (uuid_generate_v4(), 'a1111111-1111-1111-1111-111111111111',
   'Curly kale bundles',
   'Still crisp, still not winning any popularity contests with children.',
   'Produce', 'some', 'Honour system jar',
   ST_SetSRID(ST_MakePoint(-124.5111, 49.8675), 4326)::geography,
   'Cranberry pickup porch', 'active',
   now() + interval '1 day',
   now() - interval '2 hours'),

  (uuid_generate_v4(), 'a1111111-1111-1111-1111-111111111111',
   'Tomato seedlings',
   'Sturdy little things. Already plotting world domination from their trays.',
   'Plants', 'last_few', '$4 each',
   ST_SetSRID(ST_MakePoint(-124.5123, 49.8691), 4326)::geography,
   'Cranberry pickup porch', 'active',
   now() + interval '2 days',
   now() - interval '1 day'),

  -- Shoreline Sourdough
  (uuid_generate_v4(), 'a2222222-2222-2222-2222-222222222222',
   'Crackly sourdough loaves',
   'Still warm if the ferry gods are kind and the oven behaved.',
   'Baked Goods', 'some', '$8 loaf',
   ST_SetSRID(ST_MakePoint(-124.5258, 49.8449), 4326)::geography,
   'Willingdon Beach table', 'active',
   now() + interval '6 hours',
   now() - interval '45 minutes'),

  (uuid_generate_v4(), 'a2222222-2222-2222-2222-222222222222',
   'Cinnamon raisin boules',
   'Like regular sourdough but with enough cinnamon to make you feel something.',
   'Baked Goods', 'last_few', '$9 each',
   ST_SetSRID(ST_MakePoint(-124.5258, 49.8449), 4326)::geography,
   'Willingdon Beach table', 'active',
   now() + interval '4 hours',
   now() - interval '1 hour'),

  -- Townsite Garden Collective
  (uuid_generate_v4(), 'a3333333-3333-3333-3333-333333333333',
   'Spring wildflower honey',
   'Sunny, floral, and absolutely not for the impatient tea stirrer.',
   'Honey', 'last_few', '$14 jar',
   ST_SetSRID(ST_MakePoint(-124.5422, 49.8375), 4326)::geography,
   'Townsite garden gate', 'active',
   now() + interval '4 days',
   now() - interval '3 hours'),

  (uuid_generate_v4(), 'a3333333-3333-3333-3333-333333333333',
   'Pickled beet relish',
   'Last year''s beets, this year''s conversation starter. Bold magenta energy.',
   'Preserved', 'plenty', '$7 jar',
   ST_SetSRID(ST_MakePoint(-124.5422, 49.8375), 4326)::geography,
   'Townsite garden gate', 'active',
   now() + interval '30 days',
   now() - interval '5 hours'),

  -- Coastal Honey Co
  (uuid_generate_v4(), 'a4444444-4444-4444-4444-444444444444',
   'Raw creamed honey',
   'Spreadable, subtle, and dangerously addictive on toast.',
   'Honey', 'some', '$16 jar',
   ST_SetSRID(ST_MakePoint(-124.52, 49.855), 4326)::geography,
   'Westview garage side door', 'active',
   now() + interval '14 days',
   now() - interval '6 hours'),

  (uuid_generate_v4(), 'a4444444-4444-4444-4444-444444444444',
   'Beeswax wraps (3-pack)',
   'Quit using cling wrap. The bees judged you and made these instead.',
   'Other', 'plenty', '$12 pack',
   ST_SetSRID(ST_MakePoint(-124.52, 49.855), 4326)::geography,
   'Westview garage side door', 'active',
   now() + interval '30 days',
   now() - interval '2 days'),

  -- Lund Seafood
  (uuid_generate_v4(), 'a5555555-5555-5555-5555-555555555555',
   'Spot prawns (fresh off the boat)',
   'Caught this morning. Bring a cooler and some respect for the ocean.',
   'Meat & Fish', 'some', '$18 / lb',
   ST_SetSRID(ST_MakePoint(-124.765, 49.975), 4326)::geography,
   'Lund dock B, slip 7', 'active',
   now() + interval '1 day',
   now() - interval '90 minutes'),

  (uuid_generate_v4(), 'a5555555-5555-5555-5555-555555555555',
   'Smoked rockfish fillets',
   'Alder-smoked, vacuum-sealed, and better than anything in a grocery store cooler.',
   'Meat & Fish', 'last_few', '$22 / pack',
   ST_SetSRID(ST_MakePoint(-124.765, 49.975), 4326)::geography,
   'Lund dock B, slip 7', 'active',
   now() + interval '3 days',
   now() - interval '4 hours');

-- Verify
SELECT 'Profiles: ' || count(*) FROM public.profiles WHERE is_producer = true;
SELECT 'Listings: ' || count(*) FROM public.listings WHERE status = 'active';
