# Big Walk Field Guide

An SEO-first, community-made guide for Big Walk with spoiler-controlled puzzle pages and a no-registration Find Players board.

## Included

- Next.js 15, Tailwind CSS 4 and MDX/Contentlayer2
- Structured puzzle, multiplayer and troubleshooting pages
- Local full-text content search
- Anonymous LFG listings with filters and expiring Join Codes
- Private management links for listing owners
- Reports, rate limits and optional Cloudflare Turnstile
- Password-protected moderation dashboard at `/admin`
- Supabase migration for posts, reports and administrator actions
- Sitemap, robots, Open Graph metadata and responsive dark mode

## Local development

1. Install dependencies with `corepack yarn install`.
2. Copy `.env.example` to `.env.local` and fill the values you need.
3. Run `corepack yarn dev`.
4. Open `http://localhost:3000`.

Without Supabase environment variables, Find Players runs in clearly labelled preview mode. Static guides and the rest of the site remain fully functional.

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/migrations/0001_lfg.sql` in the SQL editor.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to the deployment environment.
4. Never expose the service-role key in browser code.

## Administrator

Set strong random values for `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, and `SOURCE_HASH_SALT`. The admin password is validated only on the server and creates an HTTP-only, same-site session cookie.

## Cloudflare Turnstile

Create a Turnstile widget for the production hostname and add `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`. If the secret is absent, server verification is disabled for local development.

## Deploy

The app is designed for Vercel. Add the variables from `.env.example`, deploy the GitHub repository, then point a Cloudflare-managed custom domain to Vercel. Keep Cloudflare SSL/TLS mode on **Full (strict)**.

## Content

Guides live under `data/blog/`. Frontmatter controls the title, search aliases, quick answer, player count, location and update date. New files automatically enter local search and the sitemap.

## License

MIT. This project began from Tailwind Nextjs Starter Blog; its copyright notice is retained in `LICENSE`.
