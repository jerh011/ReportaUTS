/// <reference lib="webworker" />

const swSelf = self as unknown as ServiceWorkerGlobalScope;

const CACHE_NAME = "pwa-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/inmigracion-192.png",
  "/icons/inmigracion-512.png",
  "/index.css",
];

// Instalación: cache de recursos estáticos
swSelf.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  swSelf.skipWaiting();
});

// Fetch: intenta cache primero, luego red
swSelf.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) return cachedResponse;

      try {
        return await fetch(event.request);
      } catch (err) {
        // Fallback offline si no hay cache ni red
        const fallback = await caches.match("/index.html");
        return (
          fallback ??
          new Response("Offline", { status: 503, statusText: "Offline" })
        );
      }
    })()
  );
});

// Activación: limpia caches viejos si quieres
swSelf.addEventListener("activate", (event) => {
  console.log("Service Worker activado ✅");
  event.waitUntil(swSelf.clients.claim());
});
