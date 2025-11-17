/// <reference lib="webworker" />

const CACHE_NAME = "video-prefetch-cache-v2";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

async function cacheURL(url) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const res = await fetch(url, { mode: "no-cors" });
    if (res.ok || res.type === 'opaque') {
      await cache.put(url, res.clone());
    } else {
      console.error("Prefetch failed: Bad response for", url, res.status);
    }
  } catch (e) {
    console.error("Prefetch failed:", url, e);
  }
}

self.addEventListener("message", async (event) => {
  const { type, urls } = event.data || {};
  if (type === "PREFETCH_VIDEO" && Array.isArray(urls)) {
    urls.forEach((u) => cacheURL(u));
  }
});

self.addEventListener("fetch", (event) => {
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

        return fetch(event.request).then((fetched) => {
          const fetchedClone = fetched.clone();
          caches.open(CACHE_NAME).then((c) => c.put(event.request, fetchedClone));
          return fetched;
        }).catch(err => {
          console.error('Fetch failed, could not cache:', event.request.url, err);
          // Potentially return a fallback response here if needed
        });
      })
    );
  }
});
