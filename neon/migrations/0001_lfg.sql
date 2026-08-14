create extension if not exists pgcrypto;

create table if not exists lfg_posts (
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

create index if not exists lfg_posts_active_idx on lfg_posts (status, expires_at desc);
create index if not exists lfg_posts_source_idx on lfg_posts (source_hash, status);

create table if not exists lfg_reports (
  id bigint generated always as identity primary key,
  post_id uuid not null references lfg_posts(id) on delete cascade,
  reason text not null,
  source_hash text,
  created_at timestamptz not null default now()
);

create unique index if not exists lfg_reports_source_unique_idx
  on lfg_reports (post_id, source_hash)
  where source_hash is not null;

create index if not exists lfg_reports_source_created_idx
  on lfg_reports (source_hash, created_at desc);

create table if not exists admin_login_attempts (
  id bigint generated always as identity primary key,
  source_hash text not null,
  attempted_at timestamptz not null default now()
);

create index if not exists admin_login_attempts_source_idx
  on admin_login_attempts (source_hash, attempted_at desc);

create table if not exists admin_actions (
  id bigint generated always as identity primary key,
  action text not null,
  target_id uuid,
  note text,
  created_at timestamptz not null default now()
);

-- The database connection string is server-only. Public access is routed
-- through validated Next.js API handlers; no database credential reaches the browser.
