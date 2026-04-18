-- HarvestLink v2 — abuse prevention: user reports
-- Authenticated users flag profiles/listings/contributions for moderator review.
-- Triggers auto-hide when 3+ open reports accumulate for a target.

create table if not exists public.reports (
  id          uuid primary key default uuid_generate_v4(),
  reporter_id uuid not null references public.profiles (id) on delete cascade,
  target_type text not null check (target_type in ('profile', 'listing', 'contribution')),
  target_id   uuid not null,
  reason      text not null,
  status      text not null default 'open'
    check (status in ('open', 'resolved', 'dismissed')),
  created_at  timestamptz not null default now()
);

create index if not exists reports_target_idx
  on public.reports (target_type, target_id);
create index if not exists reports_status_idx
  on public.reports (status)
  where status = 'open';
create index if not exists reports_reporter_idx
  on public.reports (reporter_id);

-- One open report per user per target — stops one grudge-holder from padding counts.
create unique index if not exists reports_unique_open
  on public.reports (reporter_id, target_type, target_id)
  where status = 'open';

alter table public.reports enable row level security;

-- Reporters can see their own reports; authenticated users can create.
drop policy if exists "reports read own" on public.reports;
create policy "reports read own"
  on public.reports for select
  using (auth.uid() = reporter_id);

drop policy if exists "reports insert own" on public.reports;
create policy "reports insert own"
  on public.reports for insert
  with check (auth.uid() = reporter_id);

-- Status updates reserved for service role — no RLS policy on update means
-- authenticated users can't modify anything; service-role bypasses RLS.
