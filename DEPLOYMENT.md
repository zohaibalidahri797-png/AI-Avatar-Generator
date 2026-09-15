# AvatarForge — Netlify Deployment Guide

AvatarForge is a **full-stack Next.js 16 (App Router) application**: a marketing +
SEO frontend **and** a real server-side AI endpoint (`POST /api/generate-avatar`).
It is **not** a static website. Netlify builds the Next.js application and
automatically provisions the server-side runtime required by the AI route.

## Netlify deployment

The repository includes `netlify.toml`, which runs the standard Next.js build
and publishes `.next`. Netlify's Next.js adapter handles App Router pages,
route handlers, image optimization, and server-side rendering.

```
npm install
npm run build
npm run deploy
```

The standard Next.js workflow also works locally and on Node hosts:

```
npm install
npm run dev        # development (:3000)
npm run build      # production build
npm run start      # production server
```

## Before you deploy

Add the server-side secrets in **Netlify > Project configuration > Environment
variables**. Never prefix secrets with `NEXT_PUBLIC_`:

- `ZAI_API_KEY`
- `ZAI_BASE_URL`
- `ZAI_TOKEN`, `ZAI_CHAT_ID`, and `ZAI_USER_ID` when required by the provider

Also configure the public build-time variables:

1. **Public build-time variables** (baked into the bundle — set them in the
   environment when running the build, exactly like `NEXT_PUBLIC_*` in Next.js):
   - `NEXT_PUBLIC_SITE_URL` — canonical production origin, e.g. `https://yourdomain.com`
     (no trailing slash). Drives canonical tags, OG/Twitter URLs, sitemap.xml,
     robots.txt, feed.xml and all JSON-LD. **Never ship a build without it.**
   - `NEXT_PUBLIC_SUPPORT_EMAIL` — optional. When unset, the site honestly says
     "use the contact page" instead of inventing an address.

   ```bash
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com \
   NEXT_PUBLIC_SUPPORT_EMAIL=support@yourdomain.com \
   npm run build
   ```

## Environment variable reference

| Variable                  | Scope            | When it is read     | Secret? |
| ------------------------- | ---------------- | ------------------- | ------- |
| `ZAI_API_KEY`             | server only      | runtime (per request) | **SECRET** |
| `ZAI_BASE_URL`            | server only      | runtime (per request) | **SECRET** |
| `ZAI_TOKEN` / `ZAI_CHAT_ID` / `ZAI_USER_ID` | server only | runtime | **SECRET** (optional) |
| `NEXT_PUBLIC_SITE_URL`    | build-time       | build               | public  |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | build-time     | build               | public  |

Secrets are never referenced in client components and are never inlined into
the client bundle. `NEXT_PUBLIC_*` variables are, by definition, public.

## Which script does what

| Script             | Purpose                                          |
| ------------------ | ------------------------------------------------ |
| `dev`              | Next.js dev server (:3000)                       |
| `build` / `start`  | Next.js production build / Node server           |
| `deploy`           | Build and deploy the production site to Netlify  |
| `lint` / `typecheck` | ESLint / `tsc --noEmit` (0 errors required)    |

## Deployment anti-patterns (do not do)

- Do **not** upload the repo as a static site / use `output: "export"` — the AI
  endpoint is server-side and would be missing.
- Do **not** commit `.dev.vars`, `.z-ai-config`, or any real credentials.
- Do **not** deploy a build made without `NEXT_PUBLIC_SITE_URL` — SEO files and
  metadata would fall back to `http://localhost:3000` (dev-only fallback).
- Do **not** configure `npx wrangler deploy` as the deploy command. Wrangler is
  for Cloudflare Workers and does not deploy this project to Netlify.
