const CACHE_NAME = 'story-app-v1';
const APP_SHELL = [
  '/',
  '/index.html',
  '/app.bundle.js',
  '/manifest.json',
  '/favicon.png',
  '/images/logo.png',
  '/offline.html', // <-- Add this line
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  // Add other static assets if needed
];

// Install event: cache App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// Activate event: cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

// Fetch event: serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request)
          .then((response) => response)
          .catch(() => {
            // Serve offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
          })
      );
    })
  );
});

// Push notification handler (keep your existing code)
self.addEventListener('push', function(event) {
  let data = {};
  if (event.data) {
    data = event.data.json();
  }
  const title = data.title || 'Story Notification';
  const options = data.options || {
    body: 'You have a new notification!',
    icon: '/images/logo.png',
  };
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});