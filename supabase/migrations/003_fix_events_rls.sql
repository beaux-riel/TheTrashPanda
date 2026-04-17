-- Restrict events insert to authenticated clients.
-- Previously both anon and authenticated could insert with WITH CHECK (true),
-- which let any anonymous visitor spam the table.

drop policy if exists "events authenticated insert" on public.events;

create policy "events authenticated insert"
  on public.events for insert
  to authenticated
  with check (true);
