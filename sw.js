const CACHE_NAME = 'balatro-v1';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(['./', './index.html', './manifest.json', './game.js'])));
});
self.addEventListener('fetch', e => {
  if (!e.request.url.startsWith('http')) return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
