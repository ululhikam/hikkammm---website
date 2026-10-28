-- Hikkammm portfolio schema
-- Jalankan lewat Supabase SQL Editor atau `supabase db push`.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Projects
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  tech text[] not null default '{}',
  year text not null,
  status text not null default 'in-progress'
    check (status in ('live', 'in-progress', 'concept', 'archived')),
  description text not null,
  full_description text not null default '',
  image_url text not null default '',
  repo_url text,
  live_url text,
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_status_idx on public.projects (status);
create index if not exists projects_category_idx on public.projects (category);
create index if not exists projects_sort_order_idx on public.projects (sort_order);

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Buildings
-- ---------------------------------------------------------------------------
create table if not exists public.buildings (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  tagline text not null default '',
  description text not null default '',
  detail text not null default '',
  link_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists buildings_sort_order_idx on public.buildings (sort_order);

drop trigger if exists buildings_set_updated_at on public.buildings;
create trigger buildings_set_updated_at
before update on public.buildings
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Experiences
-- ---------------------------------------------------------------------------
create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  organization text not null,
  title text not null,
  description text not null default '',
  start_year integer,
  end_year integer,
  type text not null default 'organization'
    check (type in ('work', 'organization', 'education', 'volunteer')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists experiences_sort_order_idx on public.experiences (sort_order);

-- ---------------------------------------------------------------------------
-- Awards
-- ---------------------------------------------------------------------------
create table if not exists public.awards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text,
  year text,
  description text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists awards_sort_order_idx on public.awards (sort_order);

-- ---------------------------------------------------------------------------
-- Profile (single row, id = 1)
-- ---------------------------------------------------------------------------
create table if not exists public.profile (
  id integer primary key check (id = 1),
  name text not null,
  headline text not null default '',
  bio jsonb not null default '[]'::jsonb
    check (jsonb_typeof(bio) = 'array'),
  location text not null default '',
  email text not null default '',
  avatar_url text,
  socials jsonb not null default '[]'::jsonb
    check (jsonb_typeof(socials) = 'array'),
  updated_at timestamptz not null default now()
);

drop trigger if exists profile_set_updated_at on public.profile;
create trigger profile_set_updated_at
before update on public.profile
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Contact messages
-- ---------------------------------------------------------------------------
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) between 3 and 200),
  subject text not null check (char_length(subject) between 3 and 150),
  message text not null check (char_length(message) between 10 and 5000),
  status text not null default 'new'
    check (status in ('new', 'read', 'archived')),
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_status_idx on public.contact_messages (status);
create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.projects enable row level security;
alter table public.buildings enable row level security;
alter table public.experiences enable row level security;
alter table public.awards enable row level security;
alter table public.profile enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists "projects_public_read" on public.projects;
create policy "projects_public_read"
on public.projects for select
using (true);

drop policy if exists "buildings_public_read" on public.buildings;
create policy "buildings_public_read"
on public.buildings for select
using (true);

drop policy if exists "experiences_public_read" on public.experiences;
create policy "experiences_public_read"
on public.experiences for select
using (true);

drop policy if exists "awards_public_read" on public.awards;
create policy "awards_public_read"
on public.awards for select
using (true);

drop policy if exists "profile_public_read" on public.profile;
create policy "profile_public_read"
on public.profile for select
using (true);

-- contact_messages sengaja tidak punya policy SELECT/INSERT untuk anon:
-- semua penulisan lewat API (service role, bypass RLS) supaya honeypot dan
-- validasi tetap jalan. Hanya backend yang bisa membaca pesan.

-- Grant ini berguna kalau nanti frontend membaca konten langsung dari
-- Supabase memakai anon key.
grant select on public.projects to anon, authenticated;
grant select on public.buildings to anon, authenticated;
grant select on public.experiences to anon, authenticated;
grant select on public.awards to anon, authenticated;
grant select on public.profile to anon, authenticated;
