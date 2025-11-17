
/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = "video-prefetch-cache-v2";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

async function cacheURL(url: string) {
  try {
    const cache = await caches.open(CACHE_NAME);
    // We use 'no-cors' for YouTube's opaque responses
    const res = await fetch(url, { mode: "no-cors" }); 
    await cache.put(url, res.clone());
  } catch (e) {
    console.error("Prefetch failed:", url, e);
  }
}

self.addEventListener("message", async (event) => {
  const { type, urls } = event.data || {};
  if (type === "PREFETCH_VIDEO" && Array.isArray(urls)) {
    urls.forEach((u: string) => cacheURL(u));
  }
});

self.addEventListener("fetch", (event) => {
  // We only cache video/image content from YouTube/Picsum.
  // The rest is handled by next-pwa's default caching.
  const isVideoAsset =
    event.request.url.includes("googlevideo.com") ||
    event.request.url.includes("i.ytimg.com") ||
    event.request.url.includes("picsum.photos");

  if (isVideoAsset) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) {
          return cached;
        }
        // For video assets, we perform a cache-and-network strategy.
        return fetch(event.request).then((fetched) => {
          const cache = caches.open(CACHE_NAME);
          cache.then(c => c.put(event.request, fetched.clone()));
          return fetched;
        });
      })
    );
  }
  // For other requests, let next-pwa's default handler do its job.
  // This is implicit as we don't call event.respondWith for them.
});
