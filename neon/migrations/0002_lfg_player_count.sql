alter table lfg_posts
  drop constraint if exists lfg_posts_players_needed_check;

alter table lfg_posts
  add constraint lfg_posts_players_needed_check
  check (players_needed between 1 and 11);
