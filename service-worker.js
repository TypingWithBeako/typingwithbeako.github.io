const CACHE_NAME = 'rezero-cache-v1';

// Assets to cache initially
const INITIAL_ASSETS = [
  '/',
  '/index.html',
  '/Assets/styles/style.min.css',
  '/Assets/script/script.min.js',
  '/Assets/script/jquery.min.js',
  '/Assets/script/loader.min.js',
  '/Assets/script/micromodal.min.js',
  '/Assets/script/flowbite.min.js',
  '/Assets/styles/flowbite.min.css',
  '/Assets/styles/tailwind.min.css',
  '/Font/fontawesome/css/all.min.css',
  '/Assets/styles/micromodal.min.css',
  // Add other critical assets
];

// Cache media files when they're first accessed
const MEDIA_URLS = [
  '/Openings_and_Endings/',
  '/Insert_Songs/'
];

// Install event - cache initial assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching initial assets');
        return cache.addAll(INITIAL_ASSETS);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache if available
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // For media files - cache only when accessed
  const isMediaFile = MEDIA_URLS.some(mediaPath => url.pathname.includes(mediaPath));
  
  if (isMediaFile) {
    event.respondWith(
      caches.match(event.request).then(response => {
        // Return from cache if present
        if (response) {
          return response;
        }
        
        // Otherwise fetch from network and cache for future
        return fetch(event.request).then(networkResponse => {
          const clonedResponse = networkResponse.clone();
          
          // Cache media files for future use
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, clonedResponse);
          });
          
          return networkResponse;
        });
      })
    );
  } else {
    // For non-media files - cache first, network fallback
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});