const CACHE_NAME = 'rezero-cache-v2';

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
  '/Other_Files/bg-tv.webp',
  '/Other_Files/next.png',
  '/Other_Files/previous.png',
  '/Other_Files/Re_ZERO icon.png',
  '/Other_Files/subaru cheering.webp',
  '/Other_Files/black.png'
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

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const isMediaFile = MEDIA_URLS.some(mediaPath => url.pathname.includes(mediaPath));

  if (isMediaFile) {
    console.log('[SW] Video request, passing through to server:', url.pathname);
    return;  // Let the browser handle it normally
  } else {
    // For non-video requests, use cache-first strategy
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Not in cache, get from network
        return fetch(event.request).then(response => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200) {
            return response;
          }
          
          // Cache the successful response
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          
          return response;
        });
      })
    );
  }
})