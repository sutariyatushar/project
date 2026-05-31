const CACHE_VERSION = 'goradka-pwa-v1.0.2';
const CACHE_NAME = `goradka-cache-${CACHE_VERSION}`;
const OFFLINE_URL = 'offline.html';

// Core assets to precache immediately
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './about.html',
  './services.html',
  './gallery.html',
  './events.html',
  './contact.html',
  './blog.html',
  './offline.html',
  './style.css',
  './home.css',
  './about.css',
  './services.css',
  './gallery.css',
  './blog.css',
  './script.js',
  './manifest.json',
  './img/favicon.ico',
  './img/icon-72x72.png',
  './img/icon-96x96.png',
  './img/icon-128x128.png',
  './img/icon-144x144.png',
  './img/icon-152x152.png',
  './img/icon-192x192.png',
  './img/icon-384x384.png',
  './img/icon-512x512.png',
  './img/icon-maskable.png',
  './img/screenshot-desktop.png',
  './img/screenshot-mobile.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://unpkg.com/aos@next/dist/aos.css',
  'https://unpkg.com/aos@next/dist/aos.js',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&display=swap'
];

// Helper to determine if a request is for a static asset
function isStaticAsset(url) {
  return (
    url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|otf|json)$/) ||
    url.includes('cdnjs.cloudflare.com') ||
    url.includes('fonts.googleapis.com') ||
    url.includes('fonts.gstatic.com') ||
    url.includes('unpkg.com')
  );
}

// Helper to determine if a request is a navigation request
function isNavigationRequest(request) {
  return request.mode === 'navigate' || 
         (request.method === 'GET' && request.headers.get('accept').includes('text/html'));
}

// Installation Event: Precache core files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Precaching core assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activation Event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName.startsWith('goradka-cache-')) {
            console.log(`[Service Worker] Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Interception
self.addEventListener('fetch', (event) => {
  // Only handle GET requests and local/safe HTTP/HTTPS domains
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin) && !event.request.url.startsWith('http')) {
    return;
  }

  const requestUrl = event.request.url;

  // Handle navigation requests (pages) using Network-First with Offline Fallback
  if (isNavigationRequest(event.request)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Put standard page requests in cache dynamically
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // If offline, check cache, or fallback to offline.html
          return caches.match(event.request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              return caches.match(OFFLINE_URL);
            });
        })
    );
    return;
  }

  // Cache-First strategy for static assets
  if (isStaticAsset(requestUrl)) {
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            // Serve from cache, and optionally update cache in background (Stale-While-Revalidate)
            fetch(event.request).then((networkResponse) => {
              if (networkResponse.status === 200) {
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, networkResponse);
                });
              }
            }).catch(() => {/* ignore background update failures */});
            
            return cachedResponse;
          }

          // Fallback to network if not in cache
          return fetch(event.request).then((networkResponse) => {
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
            return networkResponse;
          });
        })
    );
    return;
  }

  // Default Stale-While-Revalidate strategy for other resources
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse);
            });
          }
          return networkResponse.clone();
        }).catch(() => null);

        return cachedResponse || fetchPromise;
      })
  );
});

// SkipWaiting Message listener (from client PWA updates script)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Background Sync Event (Sync offline feedback forms)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-feedback') {
    console.log('[Service Worker] Syncing feedback form submissions');
    event.waitUntil(syncFeedbackSubmissions());
  }
});

// Mock sync feedback function (to be extended if IndexedDB is integrated)
async function syncFeedbackSubmissions() {
  // In a full implementation, read pending forms from IndexedDB and POST them.
  // For standard production-ready, we log and complete.
  return Promise.resolve();
}
