// RememberMe Service Worker

const CACHE_NAME = 'rememberme-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/home.html',
  '/signin.html',
  '/signup.html',
  '/medicine.html',
  '/profile.html',
  '/sos.html',
  '/ai-chat.html',
  '/add-medicine.html',
  '/remember.css',
  '/output.css',
  '/home.js',
  '/ai-assistant.js',
  '/icons.html',
  '/icons/icon.svg',
  '/icons/basic-icon.css',
  '/icons/fallback-icon.html'
];

// Install service worker and cache resources
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Cache failed to open:', error);
      })
  );
});

// Activate and clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Serve cached content when offline
self.addEventListener('fetch', event => {
  // Handle icon requests specifically
  if (event.request.url.includes('/icons/icon-') && event.request.url.endsWith('.png')) {
    event.respondWith(
      fetch('/icons/icon.svg')
        .catch(() => {
          return caches.match('/icons/fallback-icon.html');
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request for the fetch call
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest)
          .then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response for the cache and for the browser
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                // Only cache same-origin requests
                if (event.request.url.startsWith(self.location.origin)) {
                  cache.put(event.request, responseToCache);
                }
              });
              
            return response;
          })
          .catch(error => {
            console.log('Fetch failed; returning offline page instead.', error);
            // You could return a custom offline page here
          });
      })
  );
});

// Handle push notifications
self.addEventListener('push', event => {
  const title = 'RememberMe';
  const options = {
    body: event.data ? event.data.text() : 'Waktunya minum obat!',
    icon: '/icons/icon.svg',
    badge: '/icons/icon.svg'
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});

// Generate placeholder images for icons when missing
// This is just a placeholder and would need to be implemented
// with actual canvas-based icon generation in production
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'GENERATE_PLACEHOLDER_ICONS') {
    console.log('Generating placeholder icons...');
    // Here you would actually generate the icons
  }
});

console.log('Service Worker loaded'); 