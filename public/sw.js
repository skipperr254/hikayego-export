/* eslint-disable */
/**
 * hikayego service worker (safe version)
 * Goals:
 * - Never interfere with Supabase/auth/rest/storage (prevents auth/loader lockups)
 * - Never mask network failures with fake success (NO 204 empty responses)
 * - Avoid "new deploy not reflected" by NOT precaching "/" or "/index.html"
 * - Keep caching limited to same-origin static assets
 * - Use Network-First for navigations (index.html) to avoid mixed old/new bundles
 */

const CACHE_NAME = 'hikayego-cache-v6';

// Only cache truly static assets you control.
// IMPORTANT: Do NOT cache "/" or "/index.html" here.
const PRECACHE_URLS = [
  '/manifest.json',
  '/favicon.ico',
];

// Hostnames to never intercept
const BYPASS_HOSTNAMES = [
  'supabase.co',
  'supabase.io', // auth callback redirect domain
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(PRECACHE_URLS);
      } catch (err) {
        // Never fail installation due to precache issues
        console.warn('[SW] Precache failed:', err);
      }
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Delete old caches
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : undefined)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Ignore browser-specific schemes
  if (url.protocol === 'chrome-extension:' || url.protocol === 'data:') return;

  // Never intercept Supabase (or related auth domains)
  if (BYPASS_HOSTNAMES.some((h) => url.hostname.includes(h))) return;

  const isSameOrigin = url.origin === self.location.origin;

  // Do not cache cross-origin; let browser handle it (and let errors propagate normally)
  if (!isSameOrigin) return;

  // NAVIGATION (SPA): Network-first for fresh deploys, fallback to cached index if offline
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Always try network first for index/navigation
          const networkResponse = await fetch(request);
          // Keep a cached copy for offline fallback — use fixed key for consistency
          const cache = await caches.open(CACHE_NAME);
          const offlineKey = new Request('/index.html');
          cache.put(offlineKey, networkResponse.clone()).catch(() => { });
          return networkResponse;
        } catch (err) {
          // Offline fallback
          const cache = await caches.open(CACHE_NAME);
          const offlineIndex = await cache.match(new Request('/index.html'));
          if (offlineIndex) return offlineIndex;
          // If we don't have it cached, rethrow (do not fake success)
          throw err;
        }
      })()
    );
    return;
  }

  // STATIC ASSETS (same-origin): Stale-while-revalidate
  // Cache only typical static file types to avoid caching API-like routes
  // NOTE: .map files excluded intentionally (source maps, no caching benefit)
  const path = url.pathname.toLowerCase();
  const isStaticAsset =
    path.startsWith('/assets/') ||
    path.endsWith('.js') ||
    path.endsWith('.css') ||
    path.endsWith('.png') ||
    path.endsWith('.jpg') ||
    path.endsWith('.jpeg') ||
    path.endsWith('.webp') ||
    path.endsWith('.gif') ||
    path.endsWith('.svg') ||
    path.endsWith('.ico') ||
    path.endsWith('.woff') ||
    path.endsWith('.woff2') ||
    path.endsWith('.ttf');

  if (!isStaticAsset) {
    // For non-static same-origin requests, don't cache; just fetch normally
    // (prevents caching HTML/routes unexpectedly)
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);

      const fetchAndUpdate = fetch(request)
        .then((res) => {
          if (res && res.ok) {
            cache.put(request, res.clone()).catch(() => { });
          }
          return res;
        })
        .catch((err) => {
          // Let errors propagate; do NOT return fake 204/empty responses
          throw err;
        });

      // If cached exists, return it immediately and update in background
      if (cached) {
        fetchAndUpdate.catch(() => { });
        return cached;
      }

      // Otherwise wait for network
      return fetchAndUpdate;
    })()
  );
});