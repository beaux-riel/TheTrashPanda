-- HarvestLink v2 — initial schema
-- Community food network for Powell River, BC
-- PostGIS-backed geo, append-only Le-WM event pipeline, owner-scoped RLS.

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists postgis;

-- =============================================================
-- profiles — extends auth.users
-- =============================================================
create table if not exists public.profiles (
  id              uuid primary key references auth.users (id) on delete cascade,
  display_name    text,
  bio             text,
  avatar_url      text,
  location        geography(point, 4326),
  location_label  text,
  is_producer     boolean not null default false,
  categories      text[] not null default '{}',
  pickup_details  text,
  schedule_summary text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists profiles_location_gix on public.profiles using gist (location);
create index if not exists profiles_is_producer_idx on public.profiles (is_producer) where is_producer = true;
create index if not exists profiles_categories_gin on public.profiles using gin (categories);

-- =============================================================
-- listings
-- =============================================================
create table if not exists public.listings (
  id               uuid primary key default uuid_generate_v4(),
  producer_id      uuid not null references public.profiles (id) on delete cascade,
  title            text not null,
  description      text,
  category         text not null,
  quantity         text not null check (quantity in ('plenty', 'some', 'last_few')),
  price_label      text,
  location         geography(point, 4326),
  location_label   text,
  photos           text[] not null default '{}',
  status           text not null default 'active' check (status in ('active', 'gone', 'expired')),
  available_until  timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists listings_producer_id_idx on public.listings (producer_id);
create index if not exists listings_status_idx on public.listings (status) where status = 'active';
create index if not exists listings_category_idx on public.listings (category);
create index if not exists listings_location_gix on public.listings using gist (location);
create index if not exists listings_available_until_idx on public.listings (available_until);
create index if not exists listings_created_at_idx on public.listings (created_at desc);

-- =============================================================
-- follows — producer | category | area
-- =============================================================
create table if not exists public.follows (
  id               uuid primary key default uuid_generate_v4(),
  follower_id      uuid not null references public.profiles (id) on delete cascade,
  follow_type      text not null check (follow_type in ('producer', 'category', 'area')),
  producer_id      uuid references public.profiles (id) on delete cascade,
  category         text,
  area_center      geography(point, 4326),
  area_radius_km   numeric(8, 2),
  frequency        text not null default 'immediate' check (frequency in ('immediate', 'daily', 'off')),
  muted            boolean not null default false,
  created_at       timestamptz not null default now(),

  -- shape guards: right columns populated per follow_type
  constraint follows_producer_shape check (
    follow_type <> 'producer' or producer_id is not null
  ),
  constraint follows_category_shape check (
    follow_type <> 'category' or (category is not null and length(category) > 0)
  ),
  constraint follows_area_shape check (
    follow_type <> 'area' or (area_center is not null and area_radius_km is not null and area_radius_km > 0)
  )
);

create unique index if not exists follows_unique_producer
  on public.follows (follower_id, producer_id)
  where follow_type = 'producer';

create unique index if not exists follows_unique_category
  on public.follows (follower_id, category)
  where follow_type = 'category';

create index if not exists follows_follower_id_idx on public.follows (follower_id);
create index if not exists follows_producer_id_idx on public.follows (producer_id) where producer_id is not null;
create index if not exists follows_area_center_gix on public.follows using gist (area_center) where area_center is not null;

-- =============================================================
-- notifications
-- =============================================================
create table if not exists public.notifications (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  title       text not null,
  body        text,
  href        text,
  kind        text not null check (kind in ('producer', 'category', 'area', 'system')),
  unread      boolean not null default true,
  created_at  timestamptz not null default now()
);

create index if not exists notifications_user_id_idx on public.notifications (user_id, created_at desc);
create index if not exists notifications_unread_idx on public.notifications (user_id) where unread = true;

-- =============================================================
-- events — Le-WM pipeline (append-only, anonymized)
-- No client reads, no updates, no deletes. Service role only for reads.
-- =============================================================
create table if not exists public.events (
  id          uuid primary key default uuid_generate_v4(),
  event_type  text not null check (event_type in (
    'listing.created', 'listing.updated', 'listing.gone', 'listing.expired',
    'demand.search', 'demand.filter', 'demand.view', 'demand.follow',
    'follow.created', 'follow.removed'
  )),
  area_hash   text,
  category    text,
  metadata    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists events_event_type_idx on public.events (event_type, created_at desc);
create index if not exists events_area_hash_idx on public.events (area_hash) where area_hash is not null;
create index if not exists events_category_idx on public.events (category) where category is not null;
create index if not exists events_created_at_idx on public.events (created_at desc);

-- =============================================================
-- Timestamp trigger
-- =============================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists listings_set_updated_at on public.listings;
create trigger listings_set_updated_at before update on public.listings
  for each row execute function public.set_updated_at();

-- =============================================================
-- handle_new_user — auto-create profile row when auth.users inserts
-- =============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================
-- Row Level Security
-- =============================================================
alter table public.profiles      enable row level security;
alter table public.listings      enable row level security;
alter table public.follows       enable row level security;
alter table public.notifications enable row level security;
alter table public.events        enable row level security;

-- profiles: public read, owner update
drop policy if exists "profiles are public" on public.profiles;
create policy "profiles are public"
  on public.profiles for select
  using (true);

drop policy if exists "owners update profile" on public.profiles;
create policy "owners update profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "owners insert profile" on public.profiles;
create policy "owners insert profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- listings: public read, producer owns writes
drop policy if exists "listings are public" on public.listings;
create policy "listings are public"
  on public.listings for select
  using (true);

drop policy if exists "producers insert own listings" on public.listings;
create policy "producers insert own listings"
  on public.listings for insert
  with check (auth.uid() = producer_id);

drop policy if exists "producers update own listings" on public.listings;
create policy "producers update own listings"
  on public.listings for update
  using (auth.uid() = producer_id)
  with check (auth.uid() = producer_id);

drop policy if exists "producers delete own listings" on public.listings;
create policy "producers delete own listings"
  on public.listings for delete
  using (auth.uid() = producer_id);

-- follows: owner-only
drop policy if exists "follows owner read" on public.follows;
create policy "follows owner read"
  on public.follows for select
  using (auth.uid() = follower_id);

drop policy if exists "follows owner insert" on public.follows;
create policy "follows owner insert"
  on public.follows for insert
  with check (auth.uid() = follower_id);

drop policy if exists "follows owner delete" on public.follows;
create policy "follows owner delete"
  on public.follows for delete
  using (auth.uid() = follower_id);

drop policy if exists "follows owner update" on public.follows;
create policy "follows owner update"
  on public.follows for update
  using (auth.uid() = follower_id)
  with check (auth.uid() = follower_id);

-- notifications: owner read/update (creation is service-role via server)
drop policy if exists "notifications owner read" on public.notifications;
create policy "notifications owner read"
  on public.notifications for select
  using (auth.uid() = user_id);

drop policy if exists "notifications owner update" on public.notifications;
create policy "notifications owner update"
  on public.notifications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- events: append-only for authenticated clients. No select/update/delete.
drop policy if exists "events authenticated insert" on public.events;
create policy "events authenticated insert"
  on public.events for insert
  to authenticated, anon
  with check (true);

-- Intentionally no SELECT policy on events — client reads are blocked.
-- Service role bypasses RLS entirely for server-side analytics.
