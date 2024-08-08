const cacheName = 'v1';
const cacheAssets = [
    '/',
    '/index.html',
    '/styles.css',
    '/main.js',
    // Add other assets and pages you want to cache
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                return cache.addAll(cacheAssets);
            })
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
