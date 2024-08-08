const cacheName = 'v1';

// Install event - This event triggers when the service worker is installed
self.addEventListener('install', event => {
    event.waitUntil(self.skipWaiting()); // Immediately activate the service worker upon installation
});

// Fetch event - This event triggers for every network request made by the page
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            // If the request is already in the cache, return it
            if (response) {
                return response;
            }

            // If the request is not in the cache, fetch it from the network
            return fetch(event.request).then(fetchResponse => {
                // Cache the new request/response pair for future use
                return caches.open(cacheName).then(cache => {
                    cache.put(event.request, fetchResponse.clone());
                    return fetchResponse;
                });
            });
        }).catch(() => {
            // Optional: Serve a fallback page if the network request fails and the request is not in the cache
            return caches.match('/fallback.html'); 
        })
    );
});

// Activate event - Clean up old caches if the cache name changes
self.addEventListener('activate', event => {
    const cacheWhitelist = [cacheName];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (!cacheWhitelist.includes(cache)) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});
