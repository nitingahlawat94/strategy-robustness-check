-- Robustly backend schema for Supabase (Postgres). Run once in the Supabase SQL Editor.
-- Row Level Security is on for every table. Visitors can only do what the policies below allow.

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text check (full_name is null or length(full_name) <= 100),
  phone text check (phone is null or length(phone) <= 32),
  plan text not null default 'free' check (plan in ('free','pro')),
  plan_until timestamptz,
  created_at timestamptz not null default now()
);
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  provider_payment_id text unique,
  provider_order_id text unique,
  user_id uuid references auth.users(id) on delete set null,
  report_id text,
  package text check (package is null or package in ('basic','pro')),
  email text,
  amount integer not null,
  currency text not null,
  status text not null,
  created_at timestamptz not null default now()
);
create table public.report_access (
  user_id uuid not null references auth.users(id) on delete cascade,
  report_id text not null,
  package text not null check (package in ('basic','pro')),
  payment_id uuid not null references public.payments(id) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (user_id, report_id)
);
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  rid text not null,
  score integer not null check (score between 0 and 100),
  headline text,
  n integer not null,
  source text,
  created_at timestamptz not null default now(),
  unique (user_id, rid)
);
create table public.certificate_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  rid text not null,
  score integer,
  n integer,
  holder text check (holder is null or length(holder) <= 60),
  status text not null default 'pending' check (status in ('pending','approved','declined')),
  created_at timestamptz not null default now()
);
create table public.certificates (
  rid text primary key,
  data jsonb not null,
  sig text not null,
  issued_at timestamptz not null default now()
);
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  rating integer not null check (rating between 1 and 5),
  body text not null check (length(body) between 3 and 400),
  name text check (name is null or length(name) <= 30),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);


alter table public.profiles enable row level security;
alter table public.payments enable row level security;
alter table public.report_access enable row level security;
alter table public.reports enable row level security;
alter table public.certificate_requests enable row level security;
alter table public.certificates enable row level security;
alter table public.reviews enable row level security;

-- profiles: a user can read only their own row. Nobody can change a plan from the browser.
create policy "read own profile" on public.profiles for select to authenticated using (auth.uid() = id);
revoke update on public.profiles from anon, authenticated;
grant update (full_name, phone) on public.profiles to authenticated;
create policy "update own profile details" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
-- payments: no policies, so only the server (service role) can read or write them.
-- Report access is issued only by server-side payment verification.
create policy "read own report access" on public.report_access for select to authenticated using (auth.uid() = user_id);
-- reports: a user fully manages their own saved report summaries.
create policy "read own reports" on public.reports for select to authenticated using (auth.uid() = user_id);
create policy "add own reports" on public.reports for insert to authenticated with check (auth.uid() = user_id);
create policy "update own reports" on public.reports for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "delete own reports" on public.reports for delete to authenticated using (auth.uid() = user_id);
-- certificate requests: a user can create (pending only) and read their own. You approve them yourself in the dashboard.
create policy "read own requests" on public.certificate_requests for select to authenticated using (auth.uid() = user_id);
create policy "add own requests" on public.certificate_requests for insert to authenticated with check (auth.uid() = user_id and status = 'pending');
-- certificates: public to read (that is the point). Only you can insert, from the dashboard.
create policy "anyone can verify" on public.certificates for select to anon, authenticated using (true);
-- reviews: anyone can submit (unapproved). Only approved reviews are visible.
create policy "anyone can submit a review" on public.reviews for insert to anon, authenticated with check (approved = false);
create policy "public reads approved reviews" on public.reviews for select to anon, authenticated using (approved = true);

-- Create an account profile on sign-up. Per-report access is recorded separately in report_access.
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, plan, plan_until)
  values (new.id, lower(new.email), 'free', null);
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
