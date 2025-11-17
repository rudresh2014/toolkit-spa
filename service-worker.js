self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  clients.claim();
});

// REQUIRED for PWA install prompt
self.addEventListener("fetch", (event) => {
  return; // minimal handler
});