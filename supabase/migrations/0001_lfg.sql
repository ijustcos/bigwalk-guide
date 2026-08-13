create extension if not exists pgcrypto;

create table if not exists public.lfg_posts (
  id uuid primary key default gen_random_uuid(),
  display_name text not null check (char_length(display_name) between 2 and 24),
  platform text not null,
  region text not null,
  language text not null,
  group_type text not null,
  availability text not null,
  players_needed smallint not null check (players_needed between 1 and 3),
  microphone text not null,
  experience text not null,
  goal text not null check (char_length(goal) between 2 and 80),
  message text not null default '' check (char_length(message) <= 160),
  join_code text not null default '' check (char_length(join_code) <= 24),
  status text not null default 'Active' check (status in ('Active','Group Full','Expired','Hidden','Deleted')),
  expires_at timestamptz not null,
  manage_token_hash text not null,
  source_hash text not null,
  report_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lfg_posts_active_idx on public.lfg_posts (status, expires_at desc);
create index if not exists lfg_posts_source_idx on public.lfg_posts (source_hash, status);

create table if not exists public.lfg_reports (
  id bigint generated always as identity primary key,
  post_id uuid not null references public.lfg_posts(id) on delete cascade,
  reason text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_actions (
  id bigint generated always as identity primary key,
  action text not null,
  target_id uuid,
  note text,
  created_at timestamptz not null default now()
);

alter table public.lfg_posts enable row level security;
alter table public.lfg_reports enable row level security;
alter table public.admin_actions enable row level security;

-- Public access is intentionally routed through server-side API handlers.
-- The service-role key bypasses RLS and must never be exposed to the browser.
