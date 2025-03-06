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

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const isMediaFile = MEDIA_URLS.some(mediaPath => url.pathname.includes(mediaPath));

  if (isMediaFile) {
    event.respondWith(handleMediaRequest(event.request));
  } else {
    event.respondWith(handleNonMediaRequest(event.request));
  }
});

async function handleMediaRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    console.log('Serving from cache:', request.url);
    return cachedResponse;
  }
  
  try {
    // Accept and cache 206 responses
    const response = await fetch(request);
    console.log('Video response status:', response.status);
    
    if (response.status === 206 || response.ok) {
      console.log('Caching partial content:', request.url);
      const clonedResponse = response.clone();
      await cache.put(request, clonedResponse);
    }
    
    return response;
  } catch (error) {
    console.error('Video fetch failed:', error);
    throw error;
  }
}