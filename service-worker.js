const CACHE_NAME = 'rezero-cache-echidna-approved-v6';
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
  '/Other_Files/black.png',
  '/Other_Files/angry beako v2.gif',
  '/Other_Files/spinning beako.gif',
  '/Other_Files/beako super surprised (gif).gif',
  '/Other_Files/Puck clapping.gif',
  '/Other_Files/fuck you leave me alone (gif).gif',
  '/Other_Files/angry beatrice gif.gif',
  // Add other critical assets
];

// Cache media files when they're first accessed
const MEDIA_URLS = [
  '/Openings_and_Endings/',
  '/Insert_Songs/'
];

// Install event - cache initial assets
self.addEventListener('install', event => {
  self.skipWaiting();
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
    Promise.all([
      // Clear old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Force this service worker to become active
      self.clients.claim()
    ])
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const isMediaFile = MEDIA_URLS.some(mediaPath => url.pathname.includes(mediaPath));
  const isMainScript = url.pathname.includes('script.min.js');  // Only main script
  const isMainHTML = url.pathname.endsWith('index.html') || url.pathname === '/'; // Only index.html

  if (isMediaFile) {
    console.log('[SW] Video request, passing through to server:', url.pathname);
    return;  // Let the browser handle it normally
  } else if (isMainScript || isMainHTML) {
    // Network-first strategy
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache the fresh response
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(event.request);
        })
    );
  } 
  else {
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