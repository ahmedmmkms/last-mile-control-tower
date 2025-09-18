# PWA Installation Troubleshooting Guide

## Common Installation Issues and Solutions

### 1. "Site Cannot Be Installed" Error

#### Symptoms:
- Browser shows "Site cannot be installed" message
- No install prompt appears
- Install option is grayed out in browser menu

#### Solutions:

##### Check HTTPS Connection
```javascript
// Verify secure connection
if (location.protocol !== 'https:' && 
    location.hostname !== 'localhost' && 
    location.hostname !== '127.0.0.1') {
  console.error('PWA requires HTTPS in production');
}
```

##### Verify Service Worker Registration
```javascript
// Check if service worker is registered
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistration().then(registration => {
    if (!registration) {
      console.error('Service worker not registered');
    }
  });
}
```

##### Check Web App Manifest
```javascript
// Verify manifest exists and is valid
const manifestLink = document.querySelector('link[rel="manifest"]');
if (!manifestLink) {
  console.error('Missing manifest link tag');
}

fetch(manifestLink.href)
  .then(response => response.json())
  .then(manifest => {
    const requiredFields = ['name', 'short_name', 'start_url', 'display'];
    const missingFields = requiredFields.filter(field => !manifest[field]);
    if (missingFields.length > 0) {
      console.error('Missing manifest fields:', missingFields);
    }
  });
```

### 2. Install Prompt Not Appearing

#### Symptoms:
- No install banner appears automatically
- "Install App" option missing from browser menu
- BeforeInstallPrompt event not firing

#### Solutions:

##### Implement BeforeInstallPrompt Handler
```javascript
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  
  // Show install button or UI element
  showInstallButton();
});

function showInstallButton() {
  // Show your custom install button
  document.getElementById('install-button').style.display = 'block';
}

function installApp() {
  if (deferredPrompt) {
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      // We've used the prompt, so clear it
      deferredPrompt = null;
    });
  }
}
```

##### Check Browser Support
```javascript
// Check if PWA installation is supported
function isInstallSupported() {
  return 'BeforeInstallPromptEvent' in window || 
         'onbeforeinstallprompt' in window;
}
```

### 3. Offline Functionality Not Working

#### Symptoms:
- App doesn't work when offline
- Cached content not loading
- Data not syncing when connection restored

#### Solutions:

##### Verify Cache API Usage
```javascript
// Check if Cache API is supported
if ('caches' in window) {
  console.log('Cache API supported');
} else {
  console.error('Cache API not supported');
}

// Test cache operations
async function testCache() {
  try {
    const cache = await caches.open('test-cache');
    await cache.put('/test', new Response('test'));
    const response = await cache.match('/test');
    if (response) {
      console.log('Cache working correctly');
    }
  } catch (error) {
    console.error('Cache error:', error);
  }
}
```

##### Check IndexedDB for Offline Storage
```javascript
// Check IndexedDB support
if ('indexedDB' in window) {
  console.log('IndexedDB supported');
} else {
  console.error('IndexedDB not supported');
}

// Test IndexedDB operations
function testIndexedDB() {
  const request = indexedDB.open('test-db', 1);
  
  request.onsuccess = () => {
    console.log('IndexedDB working correctly');
  };
  
  request.onerror = (event) => {
    console.error('IndexedDB error:', event.target.error);
  };
}
```

### 4. Icons Not Displaying Correctly

#### Symptoms:
- Blank or default icons during installation
- Wrong icon sizes shown
- Icons not appearing on home screen

#### Solutions:

##### Verify Icon Sizes and Formats
```json
{
  "icons": [
    {
      "src": "/logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "/logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ]
}
```

##### Check Icon File Accessibility
```javascript
// Test if icon files are accessible
async function testIcons() {
  const icons = [
    '/logo192.png',
    '/logo512.png'
  ];
  
  for (const icon of icons) {
    try {
      const response = await fetch(icon, { method: 'HEAD' });
      if (!response.ok) {
        console.error(`Icon not accessible: ${icon}`);
      }
    } catch (error) {
      console.error(`Icon access error for ${icon}:`, error);
    }
  }
}
```

### 5. Push Notifications Not Working

#### Symptoms:
- No notification permission prompt
- Subscriptions failing
- Notifications not displaying

#### Solutions:

##### Check Push API Support
```javascript
// Check if Push API is supported
if ('PushManager' in window) {
  console.log('Push API supported');
} else {
  console.error('Push API not supported');
}

// Check Notification API support
if ('Notification' in window) {
  console.log('Notification API supported');
} else {
  console.error('Notification API not supported');
}
```

##### Implement Proper Subscription Flow
```javascript
async function subscribeToPush() {
  // Check service worker support
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service workers not supported');
  }
  
  // Get service worker registration
  const registration = await navigator.serviceWorker.ready;
  
  // Subscribe to push notifications
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array('YOUR_PUBLIC_VAPID_KEY')
  });
  
  return subscription;
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
    
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
```

## Browser-Specific Issues

### Chrome/Chromium
- Clear browser cache and data
- Check chrome://flags for PWA-related settings
- Ensure no extensions are blocking installation

### Safari (iOS/macOS)
- Check Settings > Safari > Block All Cookies (should be disabled)
- Verify website is not in Never Allow list
- Try Private Browsing mode

### Firefox
- Check about:config for PWA settings
- Ensure dom.serviceWorkers.enabled is true
- Verify dom.push.enabled is true

### Edge
- Check edge://flags for PWA enhancements
- Ensure service workers are enabled
- Clear browsing data

## Development Environment Issues

### Localhost Development
```javascript
// For localhost development, ensure proper configuration
const isDevelopment = process.env.NODE_ENV === 'development';
const isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

if (isDevelopment && isLocalhost) {
  console.log('Running in development mode on localhost');
  // Special handling for development environment
}
```

### Self-Signed Certificates
```javascript
// For development with HTTPS, you may need to:
// 1. Add certificate exception in browser
// 2. Use mkcert for proper localhost certificates
// 3. Configure browser to trust self-signed certificates
```

## Testing Installation

### Manual Testing Steps
1. Open Chrome DevTools
2. Go to Application tab
3. Check Manifest section for errors
4. Check Service Workers section
5. Use Lighthouse audit for PWA compliance
6. Test offline functionality using Network tab

### Automated Testing
```javascript
// Run PWA compliance tests
async function runPWATests() {
  const tests = [
    testServiceWorker,
    testManifest,
    testHTTPS,
    testInstallability,
    testOfflineSupport
  ];
  
  for (const test of tests) {
    try {
      await test();
    } catch (error) {
      console.error(`Test failed: ${test.name}`, error);
    }
  }
}
```

## Performance Optimization

### Service Worker Optimization
```javascript
// Optimize service worker caching strategy
self.addEventListener('fetch', (event) => {
  if (event.request.destination === 'document') {
    // Use network-first for HTML documents
    event.respondWith(networkFirstStrategy(event.request));
  } else if (event.request.destination === 'image') {
    // Use cache-first for images
    event.respondWith(cacheFirstStrategy(event.request));
  } else {
    // Use stale-while-revalidate for other assets
    event.respondWith(staleWhileRevalidateStrategy(event.request));
  }
});
```

### Asset Optimization
```javascript
// Pre-cache essential assets
const CACHE_VERSION = 'v1';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(`precache-${CACHE_VERSION}`)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
});
```

## Advanced Debugging

### Service Worker Debugging
```javascript
// Debug service worker lifecycle
navigator.serviceWorker.addEventListener('controllerchange', () => {
  console.log('Service worker controller changed');
});

navigator.serviceWorker.addEventListener('message', (event) => {
  console.log('Message from service worker:', event.data);
});
```

### IndexedDB Debugging
```javascript
// Debug IndexedDB operations
function debugIndexedDB() {
  const request = indexedDB.open('DriverPWA', 1);
  
  request.onupgradeneeded = (event) => {
    console.log('IndexedDB upgrade needed');
    const db = event.target.result;
    
    // Log object stores
    for (let i = 0; i < db.objectStoreNames.length; i++) {
      console.log('Object store:', db.objectStoreNames[i]);
    }
  };
  
  request.onsuccess = (event) => {
    console.log('IndexedDB opened successfully');
    const db = event.target.result;
    
    // Log database info
    console.log('Database name:', db.name);
    console.log('Database version:', db.version);
  };
}
```

## Prevention Best Practices

### Regular Maintenance
1. Monitor service worker updates
2. Check manifest validity regularly
3. Test installation on different browsers
4. Verify offline functionality periodically
5. Update icons and assets as needed

### Monitoring and Analytics
```javascript
// Track PWA installation events
window.addEventListener('appinstalled', (event) => {
  console.log('PWA installed successfully');
  // Send analytics event
  gtag('event', 'pwa_install', {
    event_category: 'engagement',
    event_label: 'PWA Installed'
  });
});

// Track beforeinstallprompt events
window.addEventListener('beforeinstallprompt', (event) => {
  console.log('Install prompt available');
  // Send analytics event
  gtag('event', 'pwa_prompt', {
    event_category: 'engagement',
    event_label: 'Install Prompt Shown'
  });
});
```

By following this troubleshooting guide, you should be able to identify and resolve most PWA installation issues. Remember to test across different browsers and devices to ensure consistent behavior.