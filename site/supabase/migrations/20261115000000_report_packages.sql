-- Safe, additive migration for an existing Robustly Supabase project.
-- It does not delete historical payment, profile, or waitlist rows.
alter table public.payments alter column provider_payment_id drop not null;
alter table public.payments add column if not exists provider_order_id text;
alter table public.payments add column if not exists user_id uuid references auth.users(id) on delete set null;
alter table public.payments add column if not exists report_id text;
alter table public.payments add column if not exists package text;
alter table public.payments add constraint payments_package_check check (package is null or package in ('basic','pro')) not valid;
create unique index if not exists payments_provider_order_id_uidx on public.payments(provider_order_id) where provider_order_id is not null;

create table if not exists public.report_access (
  user_id uuid not null references auth.users(id) on delete cascade,
  report_id text not null,
  package text not null check (package in ('basic','pro')),
  payment_id uuid not null references public.payments(id) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (user_id, report_id)
);
alter table public.report_access enable row level security;
drop policy if exists "read own report access" on public.report_access;
create policy "read own report access" on public.report_access for select to authenticated using (auth.uid() = user_id);

-- Stop applying the old monthly/30-day Pro entitlement to new accounts.
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, plan, plan_until)
  values (new.id, lower(new.email), 'free', null);
  return new;
end $$;

-- Stop new waitlist signups while preserving any existing rows for account history.
drop policy if exists "anyone can join the waitlist" on public.waitlist;
