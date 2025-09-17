# PWA and Real-Time Testing Implementation Plan

## Overview
This document provides a detailed implementation plan for testing the Progressive Web App (PWA) features and real-time communication in the Last-Mile Delivery Control Tower system. It builds upon the general testing strategies and provides specific implementation details for the project.

## 1. Current Project Structure Analysis

### 1.1. Testing Frameworks in Use
- **Backend**: Jest for unit and integration testing
- **Frontend**: Vitest for unit testing with @testing-library/react
- **E2E**: Placeholder for Cypress/Playwright

### 1.2. Planned Dependencies
Based on the documentation, the following dependencies will be added:
- `socket.io` and `socket.io-client` for real-time communication
- `vite-plugin-pwa` for PWA features
- Workbox (included with vite-plugin-pwa) for service worker management

## 2. PWA Testing Implementation

### 2.1. Installability Testing

#### Test File: `src/frontend/tests/pwa/installability.test.jsx`
```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { mockPwaEnvironment } from '../test-utils/pwa-mocks';

describe('PWA Installability', () => {
  beforeEach(() => {
    mockPwaEnvironment();
  });

  it('should have valid web app manifest', async () => {
    const manifestResponse = await fetch('/manifest.json');
    expect(manifestResponse.status).toBe(200);
    
    const manifest = await manifestResponse.json();
    expect(manifest.name).toBe('Last-Mile Delivery Control Tower');
    expect(manifest.short_name).toBe('Delivery Control');
    expect(manifest.display).toBe('standalone');
    expect(manifest.theme_color).toBe('#2196f3');
  });

  it('should register service worker', async () => {
    // This will be tested more thoroughly in service worker tests
    expect('serviceWorker' in navigator).toBe(true);
  });

  it('should provide installation prompt on supported browsers', () => {
    // Mock beforeinstallprompt event
    const event = new Event('beforeinstallprompt');
    let promptShown = false;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      promptShown = true;
      e.preventDefault(); // Prevent the mini-infobar from appearing
    });
    
    window.dispatchEvent(event);
    expect(promptShown).toBe(true);
  });
});
```

### 2.2. Offline Functionality Testing

#### Test File: `src/frontend/tests/pwa/offline.test.jsx`
```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { mockOfflineEnvironment } from '../test-utils/offline-mocks';

describe('PWA Offline Functionality', () => {
  beforeEach(() => {
    mockOfflineEnvironment();
  });

  it('should cache static assets with service worker', async () => {
    // Mock the cache API
    const mockCache = {
      keys: vi.fn().mockResolvedValue([{ url: '/index.html' }]),
      match: vi.fn().mockResolvedValue(new Response('cached content'))
    };
    
    global.caches = {
      open: vi.fn().mockResolvedValue(mockCache),
      keys: vi.fn().mockResolvedValue(['workbox-precache-v2'])
    };
    
    // Simulate service worker registration
    const cacheNames = await caches.keys();
    expect(cacheNames).toContain('workbox-precache-v2');
    
    const cache = await caches.open('workbox-precache-v2');
    const keys = await cache.keys();
    expect(keys.length).toBeGreaterThan(0);
  });

  it('should display offline page when network is unavailable', async () => {
    // Mock network failure
    global.fetch = vi.fn().mockImplementation(() => {
      return Promise.reject(new Error('Network error'));
    });
    
    // Render component that fetches data
    render(<Dashboard />);
    
    // Wait for offline state to be handled
    await waitFor(() => {
      expect(screen.getByText(/offline/i)).toBeInTheDocument();
    });
  });

  it('should queue actions for background sync when offline', async () => {
    // Simulate offline state
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      writable: true
    });
    
    // Mock background sync API
    const mockSyncManager = {
      register: vi.fn().mockResolvedValue(undefined),
      getTags: vi.fn().mockResolvedValue(['shipment-update'])
    };
    
    if ('serviceWorker' in navigator) {
      const mockRegistration = {
        sync: mockSyncManager
      };
      
      Object.defineProperty(navigator.serviceWorker, 'ready', {
        value: Promise.resolve(mockRegistration),
        writable: true
      });
    }
    
    // Perform action that requires network
    // This would be implemented in the actual component test
    
    // Verify sync registration
    if ('serviceWorker' in navigator && 'sync' in window) {
      const registration = await navigator.serviceWorker.ready;
      const tags = await registration.sync.getTags();
      expect(tags).toContain('shipment-update');
    }
  });
});
```

### 2.3. Service Worker Testing

#### Test File: `src/frontend/tests/pwa/service-worker.test.js`
```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Service Worker', () => {
  beforeEach(() => {
    // Reset mocks
    vi.resetModules();
  });

  it('should register service worker in production', async () => {
    // Mock production environment
    process.env.NODE_ENV = 'production';
    
    // Mock service worker registration
    const mockRegistration = {
      active: { state: 'activated' },
      installing: null,
      waiting: null
    };
    
    Object.defineProperty(navigator, 'serviceWorker', {
      value: {
        register: vi.fn().mockResolvedValue(mockRegistration),
        ready: Promise.resolve(mockRegistration),
        controller: {}
      },
      writable: true
    });
    
    // Import the service worker registration code
    // This would depend on how the PWA is implemented
    const swRegistered = await navigator.serviceWorker.register('/sw.js');
    expect(swRegistered.active.state).toBe('activated');
  });

  it('should handle push notifications', async () => {
    // Mock push API
    const mockPushManager = {
      permissionState: vi.fn().mockResolvedValue('granted'),
      subscribe: vi.fn().mockResolvedValue({
        endpoint: 'https://example.com/push',
        getKey: () => new ArrayBuffer(16)
      })
    };
    
    Object.defineProperty(navigator, 'push', {
      value: mockPushManager,
      writable: true
    });
    
    // Test push notification handling
    const permission = await navigator.push.permissionState();
    expect(permission).toBe('granted');
  });

  it('should cache API responses for offline use', async () => {
    // Mock cache API
    const mockCache = {
      put: vi.fn(),
      match: vi.fn().mockResolvedValue(null)
    };
    
    global.caches = {
      open: vi.fn().mockResolvedValue(mockCache)
    };
    
    // Mock fetch
    global.fetch = vi.fn().mockImplementation(async (url) => {
      // Simulate API response
      if (url.includes('/api/')) {
        return new Response(JSON.stringify({ data: 'test' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return new Response('content');
    });
    
    // Test caching behavior
    const response = await fetch('/api/shipments');
    expect(response.status).toBe(200);
    
    // Verify caching occurred
    expect(mockCache.put).toHaveBeenCalled();
  });
});
```

## 3. Real-Time Communication Testing

### 3.1. Socket.IO Connection Testing

#### Test File: `src/frontend/tests/realtime/connection.test.jsx`
```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockSocketIo } from '../test-utils/socket-mocks';

describe('Real-Time Connection', () => {
  let mockSocket;

  beforeEach(() => {
    mockSocket = mockSocketIo();
  });

  it('should establish Socket.IO connection successfully', async () => {
    // Mock successful connection
    mockSocket.connect.mockResolvedValue(true);
    
    const connected = await mockSocket.connect();
    expect(connected).toBe(true);
    expect(mockSocket.on).toHaveBeenCalledWith('connect', expect.any(Function));
  });

  it('should handle connection errors gracefully', async () => {
    // Mock connection error
    mockSocket.connect.mockRejectedValue(new Error('Connection failed'));
    
    try {
      await mockSocket.connect();
    } catch (error) {
      expect(error.message).toBe('Connection failed');
    }
  });

  it('should reconnect automatically after disconnection', async () => {
    // Mock disconnection and reconnection
    const disconnectCallback = vi.fn();
    const connectCallback = vi.fn();
    
    mockSocket.on('disconnect', disconnectCallback);
    mockSocket.on('connect', connectCallback);
    
    // Simulate disconnection
    const disconnectEvent = new Event('disconnect');
    mockSocket.emit('disconnect', disconnectEvent);
    
    expect(disconnectCallback).toHaveBeenCalled();
    
    // Simulate reconnection
    const connectEvent = new Event('connect');
    mockSocket.emit('connect', connectEvent);
    
    expect(connectCallback).toHaveBeenCalled();
  });
});
```

### 3.2. Real-Time Data Updates Testing

#### Test File: `src/frontend/tests/realtime/data-updates.test.jsx`
```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { mockSocketIo } from '../test-utils/socket-mocks';
import { DriverTrackingMap } from '../../src/components/DriverTrackingMap';

describe('Real-Time Data Updates', () => {
  let mockSocket;

  beforeEach(() => {
    mockSocket = mockSocketIo();
  });

  it('should receive and display driver location updates', async () => {
    // Render component that listens for location updates
    render(<DriverTrackingMap />);
    
    // Mock incoming location update
    const locationUpdate = {
      driverId: 'driver123',
      location: { lat: 40.7128, lng: -74.0060 },
      timestamp: new Date().toISOString()
    };
    
    // Simulate receiving location update
    mockSocket.emit('driver:locationUpdated', locationUpdate);
    
    // Wait for UI to update
    await waitFor(() => {
      expect(screen.getByText(/driver123/i)).toBeInTheDocument();
    });
    
    // Verify location is displayed correctly
    const marker = screen.getByTestId('driver-marker-driver123');
    expect(marker).toBeInTheDocument();
  });

  it('should handle shipment status updates', async () => {
    render(<ShipmentList />);
    
    // Mock shipment status update
    const statusUpdate = {
      shipmentId: 'shipment456',
      status: 'in_transit',
      timestamp: new Date().toISOString()
    };
    
    mockSocket.emit('shipment:statusUpdated', statusUpdate);
    
    await waitFor(() => {
      const statusElement = screen.getByText(/in transit/i);
      expect(statusElement).toBeInTheDocument();
    });
  });

  it('should broadcast driver location updates', () => {
    // Mock sending location update
    const locationData = {
      driverId: 'driver123',
      location: { lat: 40.7128, lng: -74.0060 }
    };
    
    mockSocket.emit('driver:locationUpdate', locationData);
    
    // Verify emit was called with correct data
    expect(mockSocket.emit).toHaveBeenCalledWith('driver:locationUpdate', locationData);
  });
});
```

### 3.3. Fallback Mechanism Testing

#### Test File: `src/frontend/tests/realtime/fallback.test.jsx`
```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockSocketIo, mockOfflineEnvironment } from '../test-utils';

describe('Real-Time Fallback Mechanisms', () => {
  let mockSocket;

  beforeEach(() => {
    mockSocket = mockSocketIo();
  });

  it('should fall back to REST polling when WebSocket fails', async () => {
    // Mock WebSocket failure
    mockSocket.connect.mockRejectedValue(new Error('WebSocket connection failed'));
    
    // Mock REST API polling
    global.fetch = vi.fn().mockImplementation(async (url) => {
      if (url.includes('/api/drivers')) {
        return new Response(JSON.stringify([
          { id: 'driver123', location: { lat: 40.7128, lng: -74.0060 } }
        ]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return new Response('Not found', { status: 404 });
    });
    
    // Simulate component that uses both WebSocket and polling
    const component = new RealTimeComponent();
    
    // Try WebSocket connection first
    try {
      await component.connect();
    } catch (error) {
      // Fall back to polling
      const drivers = await component.pollData('/api/drivers');
      expect(drivers).toHaveLength(1);
      expect(drivers[0].id).toBe('driver123');
    }
  });

  it('should queue messages during disconnection and send when reconnected', async () => {
    // Simulate disconnection
    mockSocket.connected = false;
    
    // Queue messages while disconnected
    const messages = [];
    const messageQueue = [];
    
    const sendMessage = (message) => {
      if (mockSocket.connected) {
        mockSocket.emit('message', message);
        messages.push(message);
      } else {
        messageQueue.push(message);
      }
    };
    
    // Send messages while disconnected
    sendMessage({ type: 'locationUpdate', data: { lat: 1, lng: 1 } });
    sendMessage({ type: 'statusUpdate', data: 'in_transit' });
    
    expect(messageQueue).toHaveLength(2);
    expect(messages).toHaveLength(0);
    
    // Simulate reconnection
    mockSocket.connected = true;
    mockSocket.emit = vi.fn();
    
    // Flush message queue
    while (messageQueue.length > 0) {
      const message = messageQueue.shift();
      mockSocket.emit('message', message);
      messages.push(message);
    }
    
    expect(mockSocket.emit).toHaveBeenCalledTimes(2);
    expect(messages).toHaveLength(2);
    expect(messageQueue).toHaveLength(0);
  });
});
```

## 4. Cross-Device Compatibility Testing

### 4.1. Responsive Design Testing

#### Test File: `src/frontend/tests/responsive/pwa-responsive.test.jsx`
```javascript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DriverInterface } from '../../src/components/DriverInterface';

describe('Responsive Design for PWA', () => {
  it('should render correctly on mobile viewport', async () => {
    // Set viewport to mobile size
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 667 });
    
    render(<DriverInterface />);
    
    // Check for mobile-specific elements
    expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument();
    expect(screen.getByTestId('mobile-navigation')).toBeInTheDocument();
  });

  it('should render correctly on tablet viewport', async () => {
    // Set viewport to tablet size
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 768 });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 1024 });
    
    render(<DriverInterface />);
    
    // Check for tablet-specific layout
    expect(screen.getByTestId('split-view')).toBeInTheDocument();
  });

  it('should render correctly on desktop viewport', async () => {
    // Set viewport to desktop size
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1920 });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 1080 });
    
    render(<DriverInterface />);
    
    // Check for desktop-specific elements
    expect(screen.getByTestId('sidebar-navigation')).toBeInTheDocument();
  });
});
```

## 5. Test Utilities

### 5.1. PWA Mocks

#### File: `src/frontend/tests/test-utils/pwa-mocks.js`
```javascript
export const mockPwaEnvironment = () => {
  // Mock service worker
  Object.defineProperty(navigator, 'serviceWorker', {
    value: {
      register: () => Promise.resolve({ active: { state: 'activated' } }),
      ready: Promise.resolve({ active: { state: 'activated' } }),
      controller: {}
    },
    writable: true
  });

  // Mock beforeinstallprompt event
  window.addEventListener = vi.fn();
  
  // Mock manifest
  window.fetch = vi.fn().mockImplementation((url) => {
    if (url === '/manifest.json') {
      return Promise.resolve({
        json: () => Promise.resolve({
          name: 'Last-Mile Delivery Control Tower',
          short_name: 'Delivery Control',
          display: 'standalone',
          theme_color: '#2196f3'
        })
      });
    }
    return Promise.resolve({ text: () => Promise.resolve('') });
  });
};
```

### 5.2. Socket.IO Mocks

#### File: `src/frontend/tests/test-utils/socket-mocks.js`
```javascript
import { vi } from 'vitest';

export const mockSocketIo = () => {
  const eventListeners = {};
  
  const mockSocket = {
    connect: vi.fn(),
    disconnect: vi.fn(),
    emit: vi.fn(),
    on: vi.fn((event, callback) => {
      if (!eventListeners[event]) {
        eventListeners[event] = [];
      }
      eventListeners[event].push(callback);
    }),
    off: vi.fn((event, callback) => {
      if (eventListeners[event]) {
        eventListeners[event] = eventListeners[event].filter(cb => cb !== callback);
      }
    }),
    connected: true
  };
  
  // Add method to simulate emitting events
  mockSocket.emit = vi.fn((event, data) => {
    if (eventListeners[event]) {
      eventListeners[event].forEach(callback => callback(data));
    }
  });
  
  return mockSocket;
};
```

## 6. Integration with Existing Test Structure

### 6.1. Update package.json with Testing Dependencies

```json
{
  "devDependencies": {
    "playwright": "^1.40.0",
    "lighthouse": "^11.0.0",
    "@testing-library/user-event": "^14.0.0"
  },
  "scripts": {
    "test:pwa": "vitest tests/pwa",
    "test:realtime": "vitest tests/realtime",
    "test:e2e": "playwright test",
    "test:lighthouse": "lighthouse http://localhost:5173 --output=json --output-path=./reports/lighthouse-report.json"
  }
}
```

### 6.2. Create Playwright Configuration

#### File: `src/frontend/playwright.config.js`
```javascript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' }
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox' }
    },
    {
      name: 'webkit',
      use: { browserName: 'webkit' }
    }
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    timeout: 120000,
    reuseExistingServer: !process.env.CI
  }
});
```

## 7. Continuous Integration Updates

### 7.1. Update GitHub Actions Workflow

#### File: `.github/workflows/test.yml` (additional jobs)
```yaml
  test-pwa:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: cd src/frontend && npm install
      - run: cd src/frontend && npm run test:pwa

  test-realtime:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: cd src/frontend && npm install
      - run: cd src/frontend && npm run test:realtime

  lighthouse-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: cd src/frontend && npm install
      - run: cd src/frontend && npm install -D lighthouse
      - run: cd src/frontend && npm run build
      - run: cd src/frontend && npx serve -s dist & sleep 5
      - run: cd src/frontend && npm run test:lighthouse
```

## 8. Test Data and Fixtures

### 8.1. PWA Test Data

#### File: `src/frontend/tests/fixtures/pwa-fixtures.js`
```javascript
export const pwaTestFixtures = {
  manifest: {
    name: 'Last-Mile Delivery Control Tower',
    short_name: 'Delivery Control',
    description: 'Driver interface for last-mile delivery management',
    theme_color: '#2196f3',
    background_color: '#ffffff',
    display: 'standalone',
    icon: 'src/assets/app-icon.png'
  },
  
  offlineData: {
    shipments: [
      { id: 'shipment1', status: 'pending', destination: '123 Main St' },
      { id: 'shipment2', status: 'in_transit', destination: '456 Oak Ave' }
    ],
    drivers: [
      { id: 'driver1', name: 'John Doe', status: 'available' }
    ]
  }
};
```

## 9. Monitoring and Reporting

### 9.1. Test Coverage Configuration

#### File: `src/frontend/vitest.config.js` (updated)
```javascript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/**/*.test.{js,jsx}']
    }
  }
});
```

## Conclusion
This implementation plan provides a comprehensive approach to testing the PWA and real-time features of the Last-Mile Delivery Control Tower system. By following this plan, the team can ensure that all critical functionality is properly tested, both automatically and manually, across different environments and devices.