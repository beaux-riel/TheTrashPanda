-- The Trash Panda — Real Powell River producer seed data
-- 10 real producers + ~28 listings from actual local businesses
-- Run: psql "$DB_URL" -f supabase/seed-real.sql

-- =====================================================
-- CLEANUP old synthetic seed data
-- =====================================================
DELETE FROM public.listings WHERE producer_id IN (
  'a1111111-1111-1111-1111-111111111111',
  'a2222222-2222-2222-2222-222222222222',
  'a3333333-3333-3333-3333-333333333333',
  'a4444444-4444-4444-4444-444444444444',
  'a5555555-5555-5555-5555-555555555555'
);
DELETE FROM public.follows WHERE follower_id IN (
  'a1111111-1111-1111-1111-111111111111',
  'a2222222-2222-2222-2222-222222222222',
  'a3333333-3333-3333-3333-333333333333',
  'a4444444-4444-4444-4444-444444444444',
  'a5555555-5555-5555-5555-555555555555'
) OR producer_id IN (
  'a1111111-1111-1111-1111-111111111111',
  'a2222222-2222-2222-2222-222222222222',
  'a3333333-3333-3333-3333-333333333333',
  'a4444444-4444-4444-4444-444444444444',
  'a5555555-5555-5555-5555-555555555555'
);
DELETE FROM public.profiles WHERE id IN (
  'a1111111-1111-1111-1111-111111111111',
  'a2222222-2222-2222-2222-222222222222',
  'a3333333-3333-3333-3333-333333333333',
  'a4444444-4444-4444-4444-444444444444',
  'a5555555-5555-5555-5555-555555555555'
);
DELETE FROM auth.identities WHERE user_id IN (
  'a1111111-1111-1111-1111-111111111111',
  'a2222222-2222-2222-2222-222222222222',
  'a3333333-3333-3333-3333-333333333333',
  'a4444444-4444-4444-4444-444444444444',
  'a5555555-5555-5555-5555-555555555555'
);
DELETE FROM auth.users WHERE id IN (
  'a1111111-1111-1111-1111-111111111111',
  'a2222222-2222-2222-2222-222222222222',
  'a3333333-3333-3333-3333-333333333333',
  'a4444444-4444-4444-4444-444444444444',
  'a5555555-5555-5555-5555-555555555555'
);

-- =====================================================
-- STEP 0: Bandit — the mascot system profile
-- Every piece of seeded content is attributed to Bandit.
-- =====================================================
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, aud, role)
VALUES
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '00000000-0000-0000-0000-000000000000',
   'bandit@thetrashpanda.local', crypt('banditseedpass', gen_salt('bf')), now(),
   '{"display_name": "Bandit"}'::jsonb, now(), now(), 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
VALUES
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
   '{"sub": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb", "email": "bandit@thetrashpanda.local"}'::jsonb, 'email', now(), now())
ON CONFLICT DO NOTHING;

UPDATE public.profiles SET
  display_name = 'Bandit',
  bio = 'The Trash Panda mascot. First to spot everything. 🦝',
  is_producer = false,
  trust_tier = 'verified',
  is_community_maintained = false,
  avatar_url = '/images/bandit/bandit-default.webp'
WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

-- =====================================================
-- STEP 0b: Beaux (admin)
-- Magic-link auth can't be faked in SQL, so the real user must sign up via the
-- app. This seed row lets local dev reference the same id. In live, call:
--   select * from promote_to_admin('hello@heybeaux.dev');
-- =====================================================
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, aud, role)
VALUES
  ('a0000000-0000-0000-0000-00000000ad01', '00000000-0000-0000-0000-000000000000',
   'hello@heybeaux.dev', crypt('seedadminpass', gen_salt('bf')), now(),
   '{"display_name": "Beaux"}'::jsonb, now(), now(), 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
VALUES
  ('a0000000-0000-0000-0000-00000000ad01', 'a0000000-0000-0000-0000-00000000ad01', 'a0000000-0000-0000-0000-00000000ad01',
   '{"sub": "a0000000-0000-0000-0000-00000000ad01", "email": "hello@heybeaux.dev"}'::jsonb, 'email', now(), now())
ON CONFLICT DO NOTHING;

UPDATE public.profiles SET
  display_name = 'Beaux',
  is_producer = false,
  trust_tier = 'verified'
WHERE id = 'a0000000-0000-0000-0000-00000000ad01';

-- =====================================================
-- STEP 1: Auth users (triggers auto-create profiles)
-- =====================================================
-- UUIDs: b1 = Terra Nostra, b2 = Farmers Market, b3 = Andtbaka,
-- b4 = Myrtle Point, b5 = GGs Good Greens, b6 = Coast Berry,
-- b7 = Primal Pastures, b8 = Seed to Soul, b9 = Hammill Hill,
-- ba = Blueberry Commons

INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, aud, role)
VALUES
  ('b1111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000',
   'terranostra@thetrashpanda.local', crypt('seedpass123', gen_salt('bf')), now(),
   '{"display_name": "Terra Nostra Farm"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),

  ('b2222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000',
   'farmersmarket@thetrashpanda.local', crypt('seedpass123', gen_salt('bf')), now(),
   '{"display_name": "Powell River Farmers'' Market"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),

  ('b3333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000',
   'andtbaka@thetrashpanda.local', crypt('seedpass123', gen_salt('bf')), now(),
   '{"display_name": "Andtbaka Farm"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),

  ('b4444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000',
   'myrtlepoint@thetrashpanda.local', crypt('seedpass123', gen_salt('bf')), now(),
   '{"display_name": "Myrtle Point Heritage Farm"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),

  ('b5555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000000',
   'ggsgreens@thetrashpanda.local', crypt('seedpass123', gen_salt('bf')), now(),
   '{"display_name": "GG''s Good Greens"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),

  ('b6666666-6666-6666-6666-666666666666', '00000000-0000-0000-0000-000000000000',
   'coastberry@thetrashpanda.local', crypt('seedpass123', gen_salt('bf')), now(),
   '{"display_name": "Coast Berry Company"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),

  ('b7777777-7777-7777-7777-777777777777', '00000000-0000-0000-0000-000000000000',
   'primalpastures@thetrashpanda.local', crypt('seedpass123', gen_salt('bf')), now(),
   '{"display_name": "Primal Pastures"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),

  ('b8888888-8888-8888-8888-888888888888', '00000000-0000-0000-0000-000000000000',
   'seedtosoul@thetrashpanda.local', crypt('seedpass123', gen_salt('bf')), now(),
   '{"display_name": "Seed to Soul Farm"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),

  ('b9999999-9999-9999-9999-999999999999', '00000000-0000-0000-0000-000000000000',
   'hammillhill@thetrashpanda.local', crypt('seedpass123', gen_salt('bf')), now(),
   '{"display_name": "Hammill Hill Farm"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),

  ('baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '00000000-0000-0000-0000-000000000000',
   'blueberrycommons@thetrashpanda.local', crypt('seedpass123', gen_salt('bf')), now(),
   '{"display_name": "Blueberry Commons"}'::jsonb, now(), now(), 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

-- Identities (required for Supabase Auth)
INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
VALUES
  ('b1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111',
   '{"sub": "b1111111-1111-1111-1111-111111111111", "email": "terranostra@thetrashpanda.local"}'::jsonb, 'email', now(), now()),
  ('b2222222-2222-2222-2222-222222222222', 'b2222222-2222-2222-2222-222222222222', 'b2222222-2222-2222-2222-222222222222',
   '{"sub": "b2222222-2222-2222-2222-222222222222", "email": "farmersmarket@thetrashpanda.local"}'::jsonb, 'email', now(), now()),
  ('b3333333-3333-3333-3333-333333333333', 'b3333333-3333-3333-3333-333333333333', 'b3333333-3333-3333-3333-333333333333',
   '{"sub": "b3333333-3333-3333-3333-333333333333", "email": "andtbaka@thetrashpanda.local"}'::jsonb, 'email', now(), now()),
  ('b4444444-4444-4444-4444-444444444444', 'b4444444-4444-4444-4444-444444444444', 'b4444444-4444-4444-4444-444444444444',
   '{"sub": "b4444444-4444-4444-4444-444444444444", "email": "myrtlepoint@thetrashpanda.local"}'::jsonb, 'email', now(), now()),
  ('b5555555-5555-5555-5555-555555555555', 'b5555555-5555-5555-5555-555555555555', 'b5555555-5555-5555-5555-555555555555',
   '{"sub": "b5555555-5555-5555-5555-555555555555", "email": "ggsgreens@thetrashpanda.local"}'::jsonb, 'email', now(), now()),
  ('b6666666-6666-6666-6666-666666666666', 'b6666666-6666-6666-6666-666666666666', 'b6666666-6666-6666-6666-666666666666',
   '{"sub": "b6666666-6666-6666-6666-666666666666", "email": "coastberry@thetrashpanda.local"}'::jsonb, 'email', now(), now()),
  ('b7777777-7777-7777-7777-777777777777', 'b7777777-7777-7777-7777-777777777777', 'b7777777-7777-7777-7777-777777777777',
   '{"sub": "b7777777-7777-7777-7777-777777777777", "email": "primalpastures@thetrashpanda.local"}'::jsonb, 'email', now(), now()),
  ('b8888888-8888-8888-8888-888888888888', 'b8888888-8888-8888-8888-888888888888', 'b8888888-8888-8888-8888-888888888888',
   '{"sub": "b8888888-8888-8888-8888-888888888888", "email": "seedtosoul@thetrashpanda.local"}'::jsonb, 'email', now(), now()),
  ('b9999999-9999-9999-9999-999999999999', 'b9999999-9999-9999-9999-999999999999', 'b9999999-9999-9999-9999-999999999999',
   '{"sub": "b9999999-9999-9999-9999-999999999999", "email": "hammillhill@thetrashpanda.local"}'::jsonb, 'email', now(), now()),
  ('baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   '{"sub": "baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", "email": "blueberrycommons@thetrashpanda.local"}'::jsonb, 'email', now(), now())
ON CONFLICT DO NOTHING;


-- =====================================================
-- STEP 2: Enrich profiles with real producer details
-- =====================================================

-- Terra Nostra Farm — 3244 Byron Road (Cranberry area)
UPDATE public.profiles SET
  bio = 'Certified organic farm growing vegetables the way they should be grown — in actual dirt, by actual people. Weekly CSA boxes mid-June through October with free delivery to Westview, Townsite, and Cranberry. Farm-fresh eggs too.',
  is_producer = true,
  categories = ARRAY['Produce', 'Eggs'],
  location = ST_SetSRID(ST_MakePoint(-124.490, 49.855), 4326)::geography,
  location_label = 'Byron Road, Powell River',
  pickup_details = 'Farm store pickup Tue 12-5pm & Thu 12-6pm at 3244 Byron Road, or free delivery Tue/Thu afternoons.',
  schedule_summary = 'CSA Season: mid-June to mid-October · Farm Store: Tue & Thu',
  website_url = 'https://terranostrafarm.com'
WHERE id = 'b1111111-1111-1111-1111-111111111111';

-- Powell River Farmers' Market — 4365 McLeod Road (Paradise Exhibition Grounds)
UPDATE public.profiles SET
  bio = 'The longest-running farmers'' market in the qathet region, going strong since 1987. Over 65 vendors who make it, bake it, grow it, or wild-harvest it. No imports, no resellers, no nonsense.',
  is_producer = true,
  categories = ARRAY['Market'],
  location = ST_SetSRID(ST_MakePoint(-124.530, 49.836), 4326)::geography,
  location_label = 'Paradise Exhibition Grounds, McLeod Road',
  pickup_details = '4365 McLeod Road. Past the airport, stay right, follow the signs. Tons of parking.',
  schedule_summary = 'Summer: Sat 10:30am-12:30pm + Sun 12:30-2:30pm · Winter: Sun 12:30-2:30pm (Quonset hut)',
  website_url = 'https://powellriverfarmersmarket.blogspot.com'
WHERE id = 'b2222222-2222-2222-2222-222222222222';

-- Andtbaka Farm
UPDATE public.profiles SET
  bio = 'First greens of the season, free-range eggs, and the kind of storage crops (potatoes, beets, onions) that got your grandma through February. Frozen meats year-round. Regular at the Sunday market.',
  is_producer = true,
  categories = ARRAY['Produce', 'Eggs', 'Meat & Fish'],
  location = ST_SetSRID(ST_MakePoint(-124.520, 49.870), 4326)::geography,
  location_label = 'Powell River',
  pickup_details = 'Find us at the Powell River Farmers'' Market most Sundays.',
  schedule_summary = 'Sundays at the Farmers'' Market'
WHERE id = 'b3333333-3333-3333-3333-333333333333';

-- Myrtle Point Heritage Farm
UPDATE public.profiles SET
  bio = 'Heritage farm up in the Myrtle Point area. Fresh greens, raw honey from our own hives, pasture-raised frozen meats, and goat''s milk soap in scents you didn''t know you needed. The bees and goats do the real work.',
  is_producer = true,
  categories = ARRAY['Produce', 'Honey', 'Meat & Fish', 'Other'],
  location = ST_SetSRID(ST_MakePoint(-124.540, 49.895), 4326)::geography,
  location_label = 'Myrtle Point, Powell River',
  pickup_details = 'Farmers'' Market on Sundays, or message us for farm pickup.',
  schedule_summary = 'Sundays at the Farmers'' Market · Farm pickup by arrangement'
WHERE id = 'b4444444-4444-4444-4444-444444444444';

-- GG's Good Greens
UPDATE public.profiles SET
  bio = 'Sprouts, microgreens, and wheatgrass flats. High in nutrients, crunch, and the kind of flavour that makes salads worth eating. Locally grown indoors year-round by Lori.',
  is_producer = true,
  categories = ARRAY['Produce'],
  location = ST_SetSRID(ST_MakePoint(-124.525, 49.840), 4326)::geography,
  location_label = 'Westview, Powell River',
  pickup_details = 'Farmers'' Market on Sundays, or reach out for midweek orders.',
  schedule_summary = 'Year-round · Sundays at the Farmers'' Market'
WHERE id = 'b5555555-5555-5555-5555-555555555555';

-- Coast Berry Company
UPDATE public.profiles SET
  bio = 'Locally grown frozen blueberries and strawberries — the kind that remind you what berries are supposed to taste like. Perfect for smoothies, baking, or barely thawed on morning cereal.',
  is_producer = true,
  categories = ARRAY['Produce', 'Preserved'],
  location = ST_SetSRID(ST_MakePoint(-124.515, 49.850), 4326)::geography,
  location_label = 'Powell River',
  pickup_details = 'Available at the Farmers'' Market year-round.',
  schedule_summary = 'Year-round · Saturdays & Sundays at the Farmers'' Market'
WHERE id = 'b6666666-6666-6666-6666-666666666666';

-- Primal Pastures
UPDATE public.profiles SET
  bio = 'Pasture-raised meats from animals that actually saw the sun. Frozen cuts and specialty products. Committed to ethical farming in the qathet region.',
  is_producer = true,
  categories = ARRAY['Meat & Fish'],
  location = ST_SetSRID(ST_MakePoint(-124.530, 49.860), 4326)::geography,
  location_label = 'Powell River',
  pickup_details = 'Farmers'' Market or message for bulk orders.',
  schedule_summary = 'Sundays at the Farmers'' Market'
WHERE id = 'b7777777-7777-7777-7777-777777777777';

-- Seed to Soul Farm
UPDATE public.profiles SET
  bio = 'Pushing the seasons in Powell River — winter produce so you can eat local even when it''s raining sideways. Extending the growing calendar one stubborn vegetable at a time.',
  is_producer = true,
  categories = ARRAY['Produce'],
  location = ST_SetSRID(ST_MakePoint(-124.510, 49.845), 4326)::geography,
  location_label = 'Powell River',
  pickup_details = 'Farmers'' Market through the fall and winter season.',
  schedule_summary = 'Fall & Winter · Sundays at the Farmers'' Market'
WHERE id = 'b8888888-8888-8888-8888-888888888888';

-- Hammill Hill Farm
UPDATE public.profiles SET
  bio = 'Raw, unpasteurized honey from happy bees in the hills above Powell River. We don''t rush them and they don''t rush us. Available at the market through fall and winter.',
  is_producer = true,
  categories = ARRAY['Honey'],
  location = ST_SetSRID(ST_MakePoint(-124.550, 49.880), 4326)::geography,
  location_label = 'Hammil Lake area, Powell River',
  pickup_details = 'Farmers'' Market on Sundays.',
  schedule_summary = 'Fall & Winter · Sundays at the Farmers'' Market'
WHERE id = 'b9999999-9999-9999-9999-999999999999';

-- Blueberry Commons
UPDATE public.profiles SET
  bio = 'Community self-serve farm store with rotating local produce. The kind of place you stumble into while running errands and leave with the best green onions of your life. Open daily — honour system.',
  is_producer = true,
  categories = ARRAY['Produce', 'Preserved'],
  location = ST_SetSRID(ST_MakePoint(-124.525, 49.845), 4326)::geography,
  location_label = 'Cranberry / Westview, Powell River',
  pickup_details = 'Self-serve farm store — open daily, honour system.',
  schedule_summary = 'Daily · Self-serve'
WHERE id = 'baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';


-- =====================================================
-- STEP 3: Real listings (spring season — April 2026)
-- =====================================================

INSERT INTO public.listings (id, producer_id, title, description, category, quantity, price_label, location, location_label, status, available_until, created_at)
VALUES

  -- Terra Nostra Farm (3 listings)
  (uuid_generate_v4(), 'b1111111-1111-1111-1111-111111111111',
   'CSA Harvest Box — Weekly Subscription',
   'Eight to ten different organic veggies every week for 18 weeks. Carrots, lettuce, peppers, tomatoes, peas, chard, squash, potatoes, cucumber, melons, corn, and always salad fixings. Feeds a family or a couple who takes vegetables seriously. Free delivery to Westview, Townsite, and Cranberry.',
   'Produce', 'some', '$55/week ($990 season)',
   ST_SetSRID(ST_MakePoint(-124.490, 49.855), 4326)::geography,
   'Byron Road farm store', 'active',
   '2026-06-15'::timestamptz,
   now() - interval '3 days'),

  (uuid_generate_v4(), 'b1111111-1111-1111-1111-111111111111',
   'CSA Garden Box — Weekly Subscription',
   'The smaller box for singles and couples. Seven to nine items including spring mix, arugula, carrots, beets, radish, peas, cucumber, tomatoes, and whatever else is in season. Free delivery or farm pickup.',
   'Produce', 'some', '$38/week ($684 season)',
   ST_SetSRID(ST_MakePoint(-124.490, 49.855), 4326)::geography,
   'Byron Road farm store', 'active',
   '2026-06-15'::timestamptz,
   now() - interval '3 days'),

  (uuid_generate_v4(), 'b1111111-1111-1111-1111-111111111111',
   'Organic Free-Range Eggs (add-on)',
   'A dozen organic-fed chicken eggs each week, added to your CSA box. The yolks are that deep orange that makes grocery store eggs look sad.',
   'Eggs', 'some', '$10/week',
   ST_SetSRID(ST_MakePoint(-124.490, 49.855), 4326)::geography,
   'Byron Road farm store', 'active',
   '2026-06-15'::timestamptz,
   now() - interval '3 days'),

  -- Powell River Farmers' Market (2 listings — it's a venue, not a producer)
  (uuid_generate_v4(), 'b2222222-2222-2222-2222-222222222222',
   'Sunday Winter Market',
   'Local produce, frozen berries, meats, honey, baked goods, and more. 65+ vendors under the Quonset hut. The kind of Sunday morning that makes you forget about the rain.',
   'Market', 'plenty', 'Free entry',
   ST_SetSRID(ST_MakePoint(-124.530, 49.836), 4326)::geography,
   'Paradise Exhibition Grounds, McLeod Road', 'active',
   '2026-04-30'::timestamptz,
   now() - interval '1 day'),

  (uuid_generate_v4(), 'b2222222-2222-2222-2222-222222222222',
   'Summer Outdoor Market — Opens May 3',
   'The big one. Saturdays 10:30-12:30 and Sundays 12:30-2:30, outdoors with train rides on Sundays. Over 65 registered vendors before we even open. Make It, Bake It, Grow It, or Wild Harvest It — nothing else.',
   'Market', 'plenty', 'Free entry',
   ST_SetSRID(ST_MakePoint(-124.530, 49.836), 4326)::geography,
   'Paradise Exhibition Grounds, McLeod Road', 'active',
   '2026-09-30'::timestamptz,
   now() - interval '5 days'),

  -- Andtbaka Farm (3 listings)
  (uuid_generate_v4(), 'b3333333-3333-3333-3333-333333333333',
   'Spring Greens Mix',
   'First greens of the season. The stuff your body''s been craving since November.',
   'Produce', 'some', '$5/bag',
   ST_SetSRID(ST_MakePoint(-124.520, 49.870), 4326)::geography,
   'Farmers'' Market', 'active',
   now() + interval '5 days',
   now() - interval '2 days'),

  (uuid_generate_v4(), 'b3333333-3333-3333-3333-333333333333',
   'Free-Range Eggs',
   'From chickens who know what grass looks like. Brown, blue, and every shade in between.',
   'Eggs', 'plenty', '$7/dozen',
   ST_SetSRID(ST_MakePoint(-124.520, 49.870), 4326)::geography,
   'Farmers'' Market', 'active',
   now() + interval '7 days',
   now() - interval '1 day'),

  (uuid_generate_v4(), 'b3333333-3333-3333-3333-333333333333',
   'Storage Potatoes (Yukon Gold)',
   'Overwintered and still firm. These have been waiting patiently in the root cellar since October.',
   'Produce', 'some', '$4/lb',
   ST_SetSRID(ST_MakePoint(-124.520, 49.870), 4326)::geography,
   'Farmers'' Market', 'active',
   now() + interval '14 days',
   now() - interval '4 days'),

  -- Myrtle Point Heritage Farm (3 listings)
  (uuid_generate_v4(), 'b4444444-4444-4444-4444-444444444444',
   'Raw Wildflower Honey',
   'From our own hives overlooking the forest. Floral, complex, and tastes like Powell River smells in July.',
   'Honey', 'some', '$14/jar',
   ST_SetSRID(ST_MakePoint(-124.540, 49.895), 4326)::geography,
   'Farmers'' Market or farm pickup', 'active',
   now() + interval '30 days',
   now() - interval '6 days'),

  (uuid_generate_v4(), 'b4444444-4444-4444-4444-444444444444',
   'Frozen Pasture-Raised Chicken',
   'Whole birds, raised on pasture the way your great-grandparents would approve of. Vacuum-sealed and frozen.',
   'Meat & Fish', 'last_few', '$28/bird',
   ST_SetSRID(ST_MakePoint(-124.540, 49.895), 4326)::geography,
   'Farmers'' Market or farm pickup', 'active',
   now() + interval '21 days',
   now() - interval '3 days'),

  (uuid_generate_v4(), 'b4444444-4444-4444-4444-444444444444',
   'Goat''s Milk Soap — Lavender',
   'Handmade from our own goats'' milk. Available in every scent imaginable, but lavender is why people come back.',
   'Other', 'plenty', '$8/bar',
   ST_SetSRID(ST_MakePoint(-124.540, 49.895), 4326)::geography,
   'Farmers'' Market or farm pickup', 'active',
   now() + interval '60 days',
   now() - interval '1 day'),

  -- GG's Good Greens (3 listings)
  (uuid_generate_v4(), 'b5555555-5555-5555-5555-555555555555',
   'Mixed Sprout Tray',
   'Broccoli, radish, and alfalfa sprouts. Crunchy, nutrient-dense, and the easiest way to make any sandwich feel fancy.',
   'Produce', 'plenty', '$6/tray',
   ST_SetSRID(ST_MakePoint(-124.525, 49.840), 4326)::geography,
   'Farmers'' Market', 'active',
   now() + interval '7 days',
   now() - interval '2 days'),

  (uuid_generate_v4(), 'b5555555-5555-5555-5555-555555555555',
   'Sunflower Microgreens',
   'Nutty, tender, and photogenic enough for your most pretentious salad. Grown indoors, available year-round.',
   'Produce', 'some', '$5/clamshell',
   ST_SetSRID(ST_MakePoint(-124.525, 49.840), 4326)::geography,
   'Farmers'' Market', 'active',
   now() + interval '7 days',
   now() - interval '3 days'),

  (uuid_generate_v4(), 'b5555555-5555-5555-5555-555555555555',
   'Wheatgrass Flat',
   'Grow your own juice supply. One flat keeps you in green shots for a couple weeks. Your blender will thank you.',
   'Produce', 'some', '$12/flat',
   ST_SetSRID(ST_MakePoint(-124.525, 49.840), 4326)::geography,
   'Farmers'' Market', 'active',
   now() + interval '7 days',
   now() - interval '5 days'),

  -- Coast Berry Company (2 listings)
  (uuid_generate_v4(), 'b6666666-6666-6666-6666-666666666666',
   'Frozen Blueberries (2lb bag)',
   'Locally grown, flash-frozen at peak ripeness. These are the ones your smoothie has been missing.',
   'Produce', 'plenty', '$12/bag',
   ST_SetSRID(ST_MakePoint(-124.515, 49.850), 4326)::geography,
   'Farmers'' Market', 'active',
   now() + interval '30 days',
   now() - interval '4 days'),

  (uuid_generate_v4(), 'b6666666-6666-6666-6666-666666666666',
   'Frozen Strawberries (2lb bag)',
   'Summer in a bag, available in April. Slightly thawed on cereal is the move. Trust us.',
   'Produce', 'some', '$14/bag',
   ST_SetSRID(ST_MakePoint(-124.515, 49.850), 4326)::geography,
   'Farmers'' Market', 'active',
   now() + interval '30 days',
   now() - interval '4 days'),

  -- Primal Pastures (2 listings)
  (uuid_generate_v4(), 'b7777777-7777-7777-7777-777777777777',
   'Frozen Ground Beef (1lb packs)',
   'Pasture-raised, no hormones, no antibiotics. The kind of ground beef that makes you wonder why you ever bought the other stuff.',
   'Meat & Fish', 'some', '$12/lb',
   ST_SetSRID(ST_MakePoint(-124.530, 49.860), 4326)::geography,
   'Farmers'' Market', 'active',
   now() + interval '21 days',
   now() - interval '2 days'),

  (uuid_generate_v4(), 'b7777777-7777-7777-7777-777777777777',
   'Beef Liver Capsules',
   'For the nutrition nerds. Freeze-dried pasture-raised beef liver in capsule form. All the nutrients, none of the taste.',
   'Other', 'plenty', '$35/bottle',
   ST_SetSRID(ST_MakePoint(-124.530, 49.860), 4326)::geography,
   'Farmers'' Market', 'active',
   now() + interval '60 days',
   now() - interval '7 days'),

  -- Seed to Soul Farm (2 listings)
  (uuid_generate_v4(), 'b8888888-8888-8888-8888-888888888888',
   'Overwintered Kale',
   'Survived the Powell River winter and came out sweeter for it. Frost-kissed lacinato and curly varieties.',
   'Produce', 'some', '$4/bunch',
   ST_SetSRID(ST_MakePoint(-124.510, 49.845), 4326)::geography,
   'Farmers'' Market', 'active',
   now() + interval '10 days',
   now() - interval '2 days'),

  (uuid_generate_v4(), 'b8888888-8888-8888-8888-888888888888',
   'Spring Lettuce Starts',
   'Ready-to-plant lettuce seedlings for your garden. Get a head start on the season before the slugs figure out what you''re doing.',
   'Plants', 'last_few', '$3/pot',
   ST_SetSRID(ST_MakePoint(-124.510, 49.845), 4326)::geography,
   'Farmers'' Market', 'active',
   now() + interval '14 days',
   now() - interval '1 day'),

  -- Hammill Hill Farm (2 listings)
  (uuid_generate_v4(), 'b9999999-9999-9999-9999-999999999999',
   'Raw Unpasteurized Honey',
   'From bees who forage the wildflowers above Hammil Lake. Thick, golden, and completely unprocessed. This is honey the way honey is supposed to be.',
   'Honey', 'some', '$16/jar (500g)',
   ST_SetSRID(ST_MakePoint(-124.550, 49.880), 4326)::geography,
   'Farmers'' Market', 'active',
   now() + interval '30 days',
   now() - interval '5 days'),

  (uuid_generate_v4(), 'b9999999-9999-9999-9999-999999999999',
   'Creamed Honey',
   'Same great honey, whipped into a spreadable texture. Dangerously good on toast. You''ve been warned.',
   'Honey', 'last_few', '$18/jar (500g)',
   ST_SetSRID(ST_MakePoint(-124.550, 49.880), 4326)::geography,
   'Farmers'' Market', 'active',
   now() + interval '30 days',
   now() - interval '5 days'),

  -- Blueberry Commons (3 listings)
  (uuid_generate_v4(), 'baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   'Green Onion Bunches',
   'The ones that started it all. You''ll come for the green onions and leave wondering why you don''t shop here every day.',
   'Produce', 'plenty', '$3/bunch',
   ST_SetSRID(ST_MakePoint(-124.525, 49.845), 4326)::geography,
   'Self-serve farm store', 'active',
   now() + interval '5 days',
   now() - interval '1 day'),

  (uuid_generate_v4(), 'baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   'Mixed Salad Greens',
   'Freshly picked, gently washed, ready for your bowl. Rotating varieties depending on what''s growing this week.',
   'Produce', 'some', '$5/bag',
   ST_SetSRID(ST_MakePoint(-124.525, 49.845), 4326)::geography,
   'Self-serve farm store', 'active',
   now() + interval '4 days',
   now() - interval '12 hours'),

  (uuid_generate_v4(), 'baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   'Rhubarb Stalks',
   'It''s rhubarb season and these stalks are thick, tart, and ready for pie. Or crumble. Or that thing where you just dip it in sugar.',
   'Produce', 'plenty', '$4/lb',
   ST_SetSRID(ST_MakePoint(-124.525, 49.845), 4326)::geography,
   'Self-serve farm store', 'active',
   now() + interval '14 days',
   now() - interval '2 days');


-- =====================================================
-- STEP 4: Attribute everything to Bandit
-- Every seeded producer is community-maintained, spotted by Bandit.
-- =====================================================
UPDATE public.profiles SET
  contributed_by = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  is_community_maintained = true
WHERE is_producer = true
  AND id <> 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

UPDATE public.listings SET
  contributed_by = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
WHERE contributed_by IS NULL;

-- =====================================================
-- Verify
-- =====================================================
SELECT 'Producers: ' || count(*) FROM public.profiles WHERE is_producer = true;
SELECT 'Listings: ' || count(*) FROM public.listings WHERE status = 'active';
SELECT 'Bandit-attributed producers: ' || count(*) FROM public.profiles WHERE contributed_by = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' AND is_producer = true;
SELECT 'Bandit-attributed listings: ' || count(*) FROM public.listings WHERE contributed_by = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
