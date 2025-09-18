// Custom service worker for enhanced PWA functionality
self.addEventListener('install', (event) => {
  console.log('Custom service worker installing...');
  // Perform install steps
  event.waitUntil(
    caches.open('driver-pwa-v1')
      .then((cache) => {
        console.log('Opened cache');
        // Cache essential assets
        return cache.addAll([
          '/',
          '/index.html',
          '/manifest.json',
          '/logo192.png',
          '/logo512.png'
        ]);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Custom service worker activating...');
  // Clean up old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== 'driver-pwa-v1') {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Handle fetch events with network-first strategy for API calls
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response to put in cache
          const responseToCache = response.clone();
          
          // Cache the response
          caches.open('driver-pwa-v1')
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
            
          return response;
        })
        .catch(() => {
          // If fetch fails, try to get from cache
          return caches.match(event.request);
        })
    );
  } else {
    // For non-API requests, use cache-first strategy
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Return cached version or fetch from network
          return response || fetch(event.request);
        })
    );
  }
});

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('Push event received:', event);
  
  let title = 'New Notification';
  let options = {
    body: 'You have a new notification',
    icon: '/logo192.png',
    badge: '/logo192.png'
  };
  
  if (event.data) {
    const data = event.data.json();
    title = data.title || title;
    options.body = data.body || options.body;
    options.icon = data.icon || options.icon;
    options.badge = data.badge || options.badge;
    options.data = data.data || {};
  }
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  event.notification.close();
  
  // Handle navigation or other actions based on notification data
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});

// Handle background sync
self.addEventListener('sync', (event) => {
  console.log('Background sync event:', event);
  
  if (event.tag === 'sync-pending-data') {
    event.waitUntil(syncPendingData());
  }
});

// Function to sync pending data
async function syncPendingData() {
  // This would typically communicate with the main app to trigger sync
  // For now, we'll just log that sync was triggered
  console.log('Triggering background sync of pending data');
  
  // Send a message to all clients to trigger sync
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage({
      type: 'BACKGROUND_SYNC',
      tag: 'sync-pending-data'
    });
  });
}