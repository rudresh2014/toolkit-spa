self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  console.log("Service worker active");
});

self.addEventListener("fetch", (event) => {
  // Allow normal network fetch
});