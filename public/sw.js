// Vista Industrial Truth Platform - Service Worker for Critical Document Offline Caching
// Enables field workers to access technical manuals, SOPs, and P&ID diagrams without network connectivity.

const CACHE_NAME = 'vista-technical-docs-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/#/offline-docs',
  '/#/proposals-contracts',
  '/#/guide'
];

// Precache fundamental assets upon installation
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Vista SW] Precaching offline shell and critical documents');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[Vista SW] Initial precache warning (benign in dev):', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Clean up old caches upon activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[Vista SW] Clearing obsolete cache:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Network-First with Cache Fallback for documents and assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests and WebSocket connections
  if (event.request.method !== 'GET') return;
  if (url.protocol === 'ws:' || url.protocol === 'wss:') return;

  // For document API routes and static manuals, use Stale-While-Revalidate / Cache-First
  const isDocRequest = url.pathname.startsWith('/api/document') ||
                       url.pathname.includes('/manuals/') ||
                       url.pathname.endsWith('.pdf') ||
                       url.pathname.endsWith('.json');

  if (isDocRequest) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        } catch (networkError) {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Return synthetic offline response if both fail
          return new Response(
            JSON.stringify({
              offline: true,
              message: 'دسترسی آفلاین: این سند قبلاً در حافظه محلی ذخیره شده است.',
              timestamp: new Date().toISOString()
            }),
            { headers: { 'Content-Type': 'application/json' } }
          );
        }
      })
    );
    return;
  }

  // Standard network with fallback
  event.respondWith(
    fetch(event.request).catch(async () => {
      const match = await caches.match(event.request);
      if (match) return match;
      if (event.request.mode === 'navigate') {
        return caches.match('/index.html') || caches.match('/');
      }
      return new Response('Offline - Document unavailable', { status: 503, statusText: 'Offline' });
    })
  );
});

// Handle custom messages from client UI
self.addEventListener('message', (event) => {
  const { type, payload } = event.data || {};

  if (type === 'CACHE_DOCUMENT') {
    caches.open(CACHE_NAME).then((cache) => {
      const response = new Response(JSON.stringify(payload.data), {
        headers: { 'Content-Type': 'application/json' }
      });
      cache.put(new Request(`/offline-manuals/${payload.docId}`), response).then(() => {
        event.ports[0]?.postMessage({ success: true, docId: payload.docId });
      });
    });
  } else if (type === 'GET_CACHED_STATS') {
    caches.open(CACHE_NAME).then(async (cache) => {
      const keys = await cache.keys();
      event.ports[0]?.postMessage({
        cacheName: CACHE_NAME,
        itemCount: keys.length,
        urls: keys.map((k) => k.url)
      });
    });
  } else if (type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME).then(() => {
      event.ports[0]?.postMessage({ success: true });
    });
  }
});
