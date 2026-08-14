alter table lfg_reports
  add column if not exists source_hash text;

create unique index if not exists lfg_reports_source_unique_idx
  on lfg_reports (post_id, source_hash)
  where source_hash is not null;

create index if not exists lfg_reports_source_created_idx
  on lfg_reports (source_hash, created_at desc);

create index if not exists lfg_posts_source_created_idx
  on lfg_posts (source_hash, created_at desc);

create table if not exists admin_login_attempts (
  id bigint generated always as identity primary key,
  source_hash text not null,
  attempted_at timestamptz not null default now()
);

create index if not exists admin_login_attempts_source_idx
  on admin_login_attempts (source_hash, attempted_at desc);
