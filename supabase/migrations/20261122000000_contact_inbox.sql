begin;

create table public.gcp_inquiries (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  kind text not null check (kind in ('contact', 'volunteer')),
  name text not null check (length(name) between 1 and 120),
  email text not null check (length(email) between 3 and 254),
  phone text not null check (length(phone) <= 40),
  reply_via text not null check (reply_via in ('Email', 'Text', 'Phone')),
  message text not null check (length(message) between 10 and 4000)
);

alter table public.gcp_inquiries enable row level security;
revoke all on public.gcp_inquiries from public, anon, authenticated;
grant select on public.gcp_inquiries to authenticated;
create index gcp_inquiries_email_time on public.gcp_inquiries (email, created_at desc);
create policy editor_reads_inquiries on public.gcp_inquiries
  for select to authenticated
  using (exists (select 1 from public.gcp_editors where user_id = (select auth.uid())));

create function public.gcp_submit_inquiry(
  p_kind text, p_name text, p_email text, p_phone text,
  p_reply_via text, p_message text, p_website text
) returns void
language plpgsql security definer set search_path = ''
as $$
declare
  sender_email text := lower(btrim(coalesce(p_email, '')));
begin
  if coalesce(p_website, '') <> '' then return; end if;
  if sender_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
     or (p_reply_via in ('Phone', 'Text') and btrim(coalesce(p_phone, '')) = '') then
    raise exception 'Invalid contact details' using errcode = '22023';
  end if;

  perform pg_advisory_xact_lock(hashtextextended('gcp-inquiry:' || sender_email, 0));
  if (select count(*) from public.gcp_inquiries
      where email = sender_email and created_at > now() - interval '1 hour') >= 3 then
    raise exception 'Too many submissions' using errcode = 'P0001';
  end if;

  insert into public.gcp_inquiries (kind, name, email, phone, reply_via, message)
  values (p_kind, btrim(p_name), sender_email, btrim(coalesce(p_phone, '')),
          p_reply_via, btrim(p_message));
end
$$;

revoke all on function public.gcp_submit_inquiry(text,text,text,text,text,text,text) from public;
grant execute on function public.gcp_submit_inquiry(text,text,text,text,text,text,text) to anon, authenticated;

commit;
