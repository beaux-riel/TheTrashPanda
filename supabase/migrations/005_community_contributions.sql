-- HarvestLink v2 — community contributions (Wikipedia model)
-- Adds contribution audit log, producer claims, freshness votes,
-- and trust tiers. Producers are profiles with is_producer=true;
-- there is no separate producers table.

-- =============================================================
-- profiles — trust tier tracking
-- =============================================================
alter table public.profiles
  add column if not exists trust_tier text not null default 'new'
    check (trust_tier in ('new', 'trusted', 'verified')),
  add column if not exists contribution_count integer not null default 0,
  add column if not exists first_contribution_at timestamptz,
  add column if not exists is_community_maintained boolean not null default false,
  add column if not exists contributed_by uuid references public.profiles (id);

create index if not exists profiles_trust_tier_idx
  on public.profiles (trust_tier);
create index if not exists profiles_community_maintained_idx
  on public.profiles (is_community_maintained)
  where is_community_maintained = true;

-- =============================================================
-- listings — contributor attribution + freshness
-- =============================================================
alter table public.listings
  add column if not exists contributed_by uuid references public.profiles (id),
  add column if not exists freshness_confirmed_at timestamptz,
  add column if not exists stale_flag_count integer not null default 0;

create index if not exists listings_contributed_by_idx
  on public.listings (contributed_by)
  where contributed_by is not null;
create index if not exists listings_stale_flag_idx
  on public.listings (stale_flag_count)
  where stale_flag_count > 0;

-- =============================================================
-- contributions — audit log of every proposed change
-- producer_id refs profiles (producers are profiles with is_producer=true).
-- =============================================================
create table if not exists public.contributions (
  id             uuid primary key default uuid_generate_v4(),
  contributor_id uuid not null references public.profiles (id) on delete cascade,
  producer_id    uuid references public.profiles (id) on delete cascade,
  listing_id     uuid references public.listings (id) on delete cascade,
  type           text not null check (type in (
    'profile_create', 'profile_edit',
    'listing_create', 'listing_edit',
    'availability_update', 'flag_stale', 'confirm_fresh'
  )),
  status         text not null default 'pending' check (status in (
    'pending', 'approved', 'rejected', 'auto_approved', 'reverted'
  )),
  payload        jsonb not null,
  reviewed_by    uuid references public.profiles (id),
  reviewed_at    timestamptz,
  reverted_by    uuid references public.profiles (id),
  reverted_at    timestamptz,
  created_at     timestamptz not null default now()
);

create index if not exists idx_contributions_producer
  on public.contributions (producer_id)
  where producer_id is not null;
create index if not exists idx_contributions_contributor
  on public.contributions (contributor_id);
create index if not exists idx_contributions_status
  on public.contributions (status)
  where status = 'pending';
create index if not exists idx_contributions_type
  on public.contributions (type);
create index if not exists idx_contributions_created_at
  on public.contributions (created_at desc);

-- =============================================================
-- producer_claims — profile ownership verification
-- =============================================================
create table if not exists public.producer_claims (
  id                  uuid primary key default uuid_generate_v4(),
  producer_id         uuid not null unique references public.profiles (id) on delete cascade,
  claimed_by          uuid not null references public.profiles (id) on delete cascade,
  verification_method text not null check (verification_method in (
    'email', 'phone', 'admin', 'in_person'
  )),
  verified_at         timestamptz not null default now(),
  created_at          timestamptz not null default now()
);

create index if not exists producer_claims_claimed_by_idx
  on public.producer_claims (claimed_by);

-- =============================================================
-- freshness_votes — crowdsourced accuracy signals
-- =============================================================
create table if not exists public.freshness_votes (
  id         uuid primary key default uuid_generate_v4(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  voter_id   uuid not null references public.profiles (id) on delete cascade,
  is_fresh   boolean not null,
  created_at timestamptz not null default now(),
  unique (listing_id, voter_id)
);

create index if not exists idx_freshness_listing
  on public.freshness_votes (listing_id);
create index if not exists idx_freshness_voter
  on public.freshness_votes (voter_id);

-- =============================================================
-- events — extend event_type with contribution lifecycle events
-- =============================================================
alter table public.events
  drop constraint if exists events_event_type_check;

alter table public.events
  add constraint events_event_type_check check (event_type in (
    'listing.created', 'listing.updated', 'listing.gone', 'listing.expired',
    'demand.search', 'demand.filter', 'demand.view', 'demand.follow',
    'follow.created', 'follow.removed',
    'contribution.created', 'contribution.approved', 'contribution.rejected',
    'contribution.reverted', 'profile.claimed',
    'freshness.voted', 'freshness.stale_flagged'
  ));

-- =============================================================
-- contribution_count trigger — auto-increment on new contribution
-- and stamp first_contribution_at on the contributor's profile.
-- =============================================================
create or replace function public.on_contribution_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
    set contribution_count = contribution_count + 1,
        first_contribution_at = coalesce(first_contribution_at, now())
  where id = new.contributor_id;
  return new;
end;
$$;

drop trigger if exists contributions_increment_count on public.contributions;
create trigger contributions_increment_count
  after insert on public.contributions
  for each row execute function public.on_contribution_insert();

-- =============================================================
-- Trust tier promotion — New → Trusted after 5 contributions + 30 days.
-- Verified is only granted via producer_claims (see claim flow).
-- Callable from API after approval or on a scheduled job.
-- =============================================================
create or replace function public.promote_trust_tier(target_user uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  current_tier text;
  cc           integer;
  first_at     timestamptz;
begin
  select trust_tier, contribution_count, first_contribution_at
    into current_tier, cc, first_at
  from public.profiles
  where id = target_user;

  if current_tier is null then
    return null;
  end if;

  if current_tier = 'new'
     and cc >= 5
     and first_at is not null
     and first_at <= now() - interval '30 days'
  then
    update public.profiles
      set trust_tier = 'trusted'
    where id = target_user;
    return 'trusted';
  end if;

  return current_tier;
end;
$$;

-- When a claim is verified, the claimant is promoted to 'verified'.
create or replace function public.on_producer_claim_verified()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
    set trust_tier = 'verified',
        is_community_maintained = false
  where id = new.claimed_by;

  -- also clear community-maintained on the claimed profile
  update public.profiles
    set is_community_maintained = false
  where id = new.producer_id;

  return new;
end;
$$;

drop trigger if exists producer_claims_promote_verified on public.producer_claims;
create trigger producer_claims_promote_verified
  after insert on public.producer_claims
  for each row execute function public.on_producer_claim_verified();

-- =============================================================
-- Row Level Security
-- =============================================================
alter table public.contributions    enable row level security;
alter table public.producer_claims  enable row level security;
alter table public.freshness_votes  enable row level security;

-- contributions: approved/auto_approved readable publicly;
-- contributor can read their own pending submissions;
-- Trusted+ reviewers can read all pending.
drop policy if exists "contributions read approved" on public.contributions;
create policy "contributions read approved"
  on public.contributions for select
  using (status in ('approved', 'auto_approved'));

drop policy if exists "contributions read own" on public.contributions;
create policy "contributions read own"
  on public.contributions for select
  using (auth.uid() = contributor_id);

drop policy if exists "contributions read as reviewer" on public.contributions;
create policy "contributions read as reviewer"
  on public.contributions for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
        and trust_tier in ('trusted', 'verified')
    )
  );

drop policy if exists "contributions insert own" on public.contributions;
create policy "contributions insert own"
  on public.contributions for insert
  with check (auth.uid() = contributor_id);

drop policy if exists "contributions review as trusted" on public.contributions;
create policy "contributions review as trusted"
  on public.contributions for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
        and trust_tier in ('trusted', 'verified')
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
        and trust_tier in ('trusted', 'verified')
    )
  );

drop policy if exists "contributions review as producer" on public.contributions;
create policy "contributions review as producer"
  on public.contributions for update
  using (
    exists (
      select 1 from public.producer_claims
      where producer_id = contributions.producer_id
        and claimed_by = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.producer_claims
      where producer_id = contributions.producer_id
        and claimed_by = auth.uid()
    )
  );

-- producer_claims: public read (so UI can show verified badges);
-- authenticated users can submit a claim for themselves.
drop policy if exists "claims are public" on public.producer_claims;
create policy "claims are public"
  on public.producer_claims for select
  using (true);

drop policy if exists "claims insert own" on public.producer_claims;
create policy "claims insert own"
  on public.producer_claims for insert
  with check (auth.uid() = claimed_by);

-- freshness_votes: public read for summaries; authenticated voters only.
drop policy if exists "freshness read public" on public.freshness_votes;
create policy "freshness read public"
  on public.freshness_votes for select
  using (true);

drop policy if exists "freshness insert own" on public.freshness_votes;
create policy "freshness insert own"
  on public.freshness_votes for insert
  with check (auth.uid() = voter_id);

drop policy if exists "freshness update own" on public.freshness_votes;
create policy "freshness update own"
  on public.freshness_votes for update
  using (auth.uid() = voter_id)
  with check (auth.uid() = voter_id);

drop policy if exists "freshness delete own" on public.freshness_votes;
create policy "freshness delete own"
  on public.freshness_votes for delete
  using (auth.uid() = voter_id);

-- =============================================================
-- Extend listings RLS: community-maintained producer listings.
-- A listing may be contributed by someone other than producer_id
-- when the producer profile is community-maintained (unclaimed).
-- =============================================================
drop policy if exists "contributors insert community listings" on public.listings;
create policy "contributors insert community listings"
  on public.listings for insert
  with check (
    auth.uid() = contributed_by
    and exists (
      select 1 from public.profiles
      where id = listings.producer_id
        and is_community_maintained = true
    )
  );

-- =============================================================
-- Extend profiles RLS: trusted users can create community-maintained
-- profiles for producers who haven't signed up yet.
-- (The profile row's id still references auth.users, so this only
-- applies when an admin/service creates a shell auth user first, or
-- when we later add a non-auth "stub profile" mechanism. For Phase 1
-- we only allow updates to community-maintained profiles by trusted
-- contributors via the contributions API, never direct inserts.)
-- =============================================================
drop policy if exists "trusted update community profiles" on public.profiles;
create policy "trusted update community profiles"
  on public.profiles for update
  using (
    is_community_maintained = true
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.trust_tier in ('trusted', 'verified')
    )
  )
  with check (
    is_community_maintained = true
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.trust_tier in ('trusted', 'verified')
    )
  );
