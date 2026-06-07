-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_progress table
create table public.user_progress (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  course_slug text not null,
  topic_slug text not null,
  completed boolean default true not null,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, course_slug, topic_slug)
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;

-- Profiles Policies
create policy "Users can view own profile" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);

create policy "Users can update own profile" on public.profiles
  for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- User Progress Policies
create policy "Users can view own progress" on public.user_progress
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "Users can insert own progress" on public.user_progress
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "Users can update own progress" on public.user_progress
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "Users can delete own progress" on public.user_progress
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Profile Sync Trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Revoke default execute privilege from public to protect security definer function
revoke execute on function public.handle_new_user() from public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
