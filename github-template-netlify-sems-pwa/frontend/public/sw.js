
const CACHE_VERSION = 'v1';
const APP_SHELL = ['/', '/index.html'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('app-shell-' + CACHE_VERSION).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => !k.endsWith(CACHE_VERSION)).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const isAPI = url.pathname.startsWith('/api/') || url.pathname.startsWith('/.netlify/functions/');
  const isNavigate = event.request.mode === 'navigate';
  const sameOrigin = url.origin === self.location.origin;

  if (isNavigate && sameOrigin) {
    event.respondWith((async () => {
      try {
        const net = await fetch(event.request);
        const cache = await caches.open('pages-' + CACHE_VERSION);
        cache.put(event.request, net.clone());
        return net;
      } catch {
        const cache = await caches.open('app-shell-' + CACHE_VERSION);
        const cached = await cache.match('/index.html');
        return cached || Response.error();
      }
    })());
    return;
  }

  if (isAPI) {
    event.respondWith((async () => {
      try {
        const net = await fetch(event.request);
        const cache = await caches.open('api-' + CACHE_VERSION);
        cache.put(event.request, net.clone());
        return net;
      } catch {
        const cache = await caches.open('api-' + CACHE_VERSION);
        const cached = await cache.match(event.request);
        return cached || Response.error();
      }
    })());
    return;
  }

  if (sameOrigin) {
    event.respondWith((async () => {
      const cache = await caches.open('static-' + CACHE_VERSION);
      const cached = await cache.match(event.request);
      const fetchPromise = fetch(event.request).then((net) => {
        cache.put(event.request, net.clone());
        return net;
      }).catch(() => null);
      return cached || fetchPromise || Response.error();
    })());
  }
});
