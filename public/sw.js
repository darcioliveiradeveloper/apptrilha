/* Trilha PWA - service worker.
   Estrategia: cache-first (stale-while-revalidate) para o proprio app e
   assets; API (/api/*) nunca entra no cache; requests de navegacao usam
   o shell cacheado p/ abrir na hora e revalidam em segundo plano. */
const CACHE = "trilha-v1";
const PRECACHE = ["/", "/index.html", "/manifest.webmanifest", "/icon-192.png", "/icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (e) => {
  if (e.data && e.data.type === "SKIP_WAITING") self.skipWaiting();
});

async function refreshInCache(request) {
  try {
    const res = await fetch(request);
    if (res && (res.ok || res.type === "opaque")) {
      const cache = await caches.open(CACHE);
      cache.put(request, res.clone());
    }
    return res;
  } catch {
    return undefined;
  }
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url, self.location.origin);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  e.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      if (req.mode === "navigate") {
        const cached = await cache.match("/index.html");
        if (cached) {
          refreshInCache(req);
          return cached;
        }
        const fresh = await refreshInCache(req);
        return fresh || (await cache.match("/index.html"));
      }
      const hit = await cache.match(req);
      if (hit) {
        refreshInCache(req);
        return hit;
      }
      const fresh = await refreshInCache(req);
      return fresh || hit;
    })(),
  );
});