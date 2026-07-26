/* 胖达数字乐园 离线缓存 */
const CACHE = 'panda-math-v1';
const ASSETS = [
  './', './index.html', './manifest.webmanifest',
  './assets/bg_meadow.png', './assets/panda.png', './assets/panda_cheer.png',
  './assets/duck.png', './assets/fish.png', './assets/apple.png',
  './assets/cookie.png', './assets/strawberry.png', './assets/monkey.png',
  './assets/cake.png', './assets/candle_lit.png', './assets/candle_out.png',
  './assets/box.png', './assets/star.png', './assets/icon.png', './assets/icon-192.png',
  './assets/fredoka.woff2'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit =>
      hit || fetch(e.request).then(r => {
        if (r.ok && new URL(e.request.url).origin === location.origin) {
          const cp = r.clone();
          caches.open(CACHE).then(c => c.put(e.request, cp));
        }
        return r;
      }).catch(() => e.request.mode === 'navigate' ? caches.match('./index.html') : undefined)
    )
  );
});
