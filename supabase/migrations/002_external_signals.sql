-- HarvestLink v2 — external signals
-- Environmental data that affects local food infrastructure.
-- Fuel prices, ferry cancellations, weather, grocery prices, supply alerts.

create table if not exists public.external_signals (
  id              uuid primary key default uuid_generate_v4(),
  signal_type     text not null check (signal_type in (
    'fuel_price',
    'ferry_status',
    'weather',
    'grocery_price',
    'supply_alert',
    'seasonal_marker'
  )),
  source          text,
  area_label      text,
  value_numeric   numeric,
  value_text      text,
  unit            text,
  metadata        jsonb not null default '{}',
  recorded_at     timestamptz not null default now(),
  created_at      timestamptz not null default now()
);

create index if not exists external_signals_type_idx
  on public.external_signals (signal_type);
create index if not exists external_signals_recorded_at_idx
  on public.external_signals (recorded_at desc);
create index if not exists external_signals_area_idx
  on public.external_signals (area_label);
create index if not exists external_signals_type_recorded_idx
  on public.external_signals (signal_type, recorded_at desc);

alter table public.external_signals enable row level security;

create policy "Anyone can read signals"
  on public.external_signals for select using (true);

create policy "Service role inserts signals"
  on public.external_signals for insert
  with check (auth.role() = 'service_role');
