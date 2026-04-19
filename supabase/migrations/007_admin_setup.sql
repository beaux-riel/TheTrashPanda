-- The Trash Panda — admin setup
-- Magic-link auth users can't be created from SQL, so admin promotion runs after
-- the user signs up. This migration adds a helper to flip their profile to the
-- verified trust tier by email lookup.

create or replace function public.promote_to_admin(admin_email text)
returns table (
  profile_id uuid,
  display_name text,
  trust_tier text
)
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  return query
  update public.profiles p
  set trust_tier = 'verified'
  from auth.users u
  where u.id = p.id
    and lower(u.email) = lower(admin_email)
  returning p.id, p.display_name, p.trust_tier;

  if not found then
    raise notice 'No profile found for email %. User must sign up first.', admin_email;
  end if;
end;
$$;

revoke all on function public.promote_to_admin(text) from public;
grant execute on function public.promote_to_admin(text) to service_role;

comment on function public.promote_to_admin(text) is
  'Promote a profile to verified trust tier by auth email. Call after the user signs up via magic link. Example: select * from promote_to_admin(''hello@heybeaux.dev'');';
