-- Add optional name and mobile fields to the private account profile. Safe for existing accounts.
alter table public.profiles add column if not exists full_name text check (full_name is null or length(full_name) <= 100);
alter table public.profiles add column if not exists phone text check (phone is null or length(phone) <= 32);

-- Allow each signed-in user to change only their own name and phone, never email or plan.
revoke update on public.profiles from anon, authenticated;
grant update (full_name, phone) on public.profiles to authenticated;
drop policy if exists "update own profile details" on public.profiles;
create policy "update own profile details" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
