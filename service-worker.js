self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("toolkit-cache").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/style.css",
        "/home.js",
        "/router.js",
        "/supabaseClient.js",
        "/assets/icon.png"
      ]);
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});