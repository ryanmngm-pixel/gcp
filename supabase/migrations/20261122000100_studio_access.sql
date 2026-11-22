begin;

create table public.gcp_studio_access (
  email text primary key,
  manages_access boolean not null default false
);
alter table public.gcp_studio_access enable row level security;
revoke all on public.gcp_studio_access from public, anon, authenticated;

create function public.gcp_claim_studio_access()
returns boolean
language plpgsql security definer set search_path = ''
as $$
declare
  caller_id uuid := auth.uid();
  caller_email text;
  is_manager boolean;
begin
  select lower(email) into caller_email from auth.users
  where id = caller_id and email_confirmed_at is not null;
  if caller_email is null then return false; end if;

  select manages_access into is_manager from public.gcp_studio_access where email = caller_email;
  if found then
    insert into public.gcp_editors (user_id) values (caller_id)
    on conflict do nothing;
  end if;
  return coalesce(is_manager, false);
end
$$;

create function public.gcp_add_studio_email(p_email text)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  target_email text := lower(trim(coalesce(p_email, '')));
begin
  if not exists (
    select 1 from auth.users u join public.gcp_studio_access a on a.email = lower(u.email)
    where u.id = auth.uid() and u.email_confirmed_at is not null and a.manages_access
  ) then
    raise exception 'Only the Studio owner can approve email addresses.' using errcode = '42501';
  end if;
  if length(target_email) > 254 or target_email !~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$' then
    raise exception 'Enter a valid email address.' using errcode = '22023';
  end if;
  insert into public.gcp_studio_access (email) values (target_email)
  on conflict do nothing;
end
$$;

revoke all on function public.gcp_claim_studio_access() from public, anon;
revoke all on function public.gcp_add_studio_email(text) from public, anon;
grant execute on function public.gcp_claim_studio_access() to authenticated;
grant execute on function public.gcp_add_studio_email(text) to authenticated;

commit;
