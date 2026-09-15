/*
 * AvatarForge service worker — offline shell + static asset caching.
 *
 * Strategy:
 *  - Navigations (the SPA shell at `/`): network-first, fall back to the
 *    cached shell so the app still opens offline.
 *  - Images and fonts: stale-while-revalidate for fast repeat loads.
 *  - JS/CSS and everything else: network-first (code stays fresh while
 *    online; cache only serves as the offline fallback).
 *  - API calls (starting with /api/): never cached — generation must always
 *    hit the network and stay honest.
 */
const VERSION = 'af-v2';
const SHELL_CACHE = `${VERSION}-shell`;
const STATIC_CACHE = `${VERSION}-static`;
const ASSET_CACHE = `${VERSION}-assets`;

const PRECACHE = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/favicon.png',
  '/apple-icon.png',
  '/logo.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => !key.startsWith(VERSION)).map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

function isDevAsset(pathname) {
  return (
    pathname.startsWith('/_next/webpack-hmr') ||
    pathname.includes('hot-update') ||
    pathname.startsWith('/__nextjs') ||
    pathname.includes('_rsc')
  );
}

/** Images and fonts are effectively immutable — safe to serve cache-first. */
function isImmutableAsset(pathname) {
  return (
    pathname.startsWith('/images/') ||
    pathname.startsWith('/icon-') ||
    pathname === '/favicon.png' ||
    pathname === '/apple-icon.png' ||
    pathname === '/logo.svg' ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.webp') ||
    pathname.endsWith('.woff2') ||
    pathname.endsWith('.woff')
  );
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return; // generation/results stay network-only
  if (isDevAsset(url.pathname)) return;

  // App shell: network-first with offline fallback.
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request);
          const cache = await caches.open(SHELL_CACHE);
          cache.put('/', fresh.clone());
          return fresh;
        } catch {
          const cache = await caches.open(SHELL_CACHE);
          const shell = (await cache.match('/')) || (await cache.match(request));
          if (shell) return shell;
          return new Response(
            '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Offline — AvatarForge</title><style>body{font-family:system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0;background:#faf9fe;color:#1f1a2b}main{text-align:center;padding:2rem}h1{font-size:1.4rem;margin:0 0 .5rem}p{color:#6b647f;margin:0 0 1.5rem}a{display:inline-block;padding:.6rem 1.2rem;border-radius:.75rem;background:#8b2fd6;color:#fff;text-decoration:none;font-weight:600}</style></head><body><main><h1>You are offline</h1><p>AvatarForge could not be reached. Check your connection and try again.</p><a href="/">Retry</a></main></body></html>',
            { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        }
      })()
    );
    return;
  }

  // Immutable binaries (images/fonts): stale-while-revalidate — fast repeats.
  if (isImmutableAsset(url.pathname)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(ASSET_CACHE);
        const cached = await cache.match(request);
        const network = fetch(request)
          .then((response) => {
            if (response && response.status === 200 && response.type === 'basic') {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => undefined);
        return cached || (await network) || Response.error();
      })()
    );
    return;
  }

  // Everything else (JS/CSS chunks, misc): network-first so code is always
  // fresh while online, cache provides the offline fallback.
  event.respondWith(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      try {
        const fresh = await fetch(request);
        if (fresh && fresh.status === 200 && fresh.type === 'basic') {
          cache.put(request, fresh.clone());
        }
        return fresh;
      } catch {
        const cached = await cache.match(request);
        if (cached) return cached;
        return Response.error();
      }
    })()
  );
});
