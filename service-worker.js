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
    // Handle range requests for video files
    if (event.request.headers.get('range')) {
      event.respondWith(handleRangeRequest(event.request));
    } else {
      event.respondWith(handleMediaRequest(event.request));
    }
  } else {
    event.respondWith(handleNonMediaRequest(event.request));
  }
});

// Media request handler
async function handleRangeRequest(request) {
  const pos = Number(/^bytes\=(\d+)\-$/g.exec(request.headers.get('range'))[1]);
  console.log('Range request for', request.url, ', starting position:', pos);

  try {
    const cache = await caches.open(CACHE_NAME);
    let response = await cache.match(request.url);
    
    let ab;
    if (!response) {
      // Fetch from network if not in cache
      response = await fetch(request);
      ab = await response.arrayBuffer();
      // Cache the full response
      await cache.put(request.url, new Response(ab));
    } else {
      ab = await response.arrayBuffer();
    }

    return new Response(
      ab.slice(pos),
      {
        status: 206,
        statusText: 'Partial Content',
        headers: [
          ['Content-Range', 'bytes ' + pos + '-' + 
            (ab.byteLength - 1) + '/' + ab.byteLength]
        ]
      }
    );
  } catch (error) {
    console.error('Range request failed:', error);
    return fetch(request);
  }
}

async function handleMediaRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  if (cachedResponse) return cachedResponse;
  
  const response = await fetch(request);
  if (response && response.status === 200) {
    await cache.put(request, response.clone());
  }
  return response;
}

// Non-media request handler
async function handleNonMediaRequest(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  return fetch(request);
}