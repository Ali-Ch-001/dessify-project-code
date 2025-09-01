self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  self.clients.claim();
});

// Basic fetch passthrough; extend for caching strategy later
self.addEventListener("fetch", () => {});
