# Last-Mile Delivery Driver PWA

## Overview

This is a Progressive Web App (PWA) for last-mile delivery drivers with full offline capabilities. The app allows drivers to manage deliveries, update statuses, and communicate with dispatchers even when offline.

## Features

### Core PWA Features
- **Installable**: Can be installed to device home screen
- **Offline Support**: Full functionality when offline
- **Responsive Design**: Works on mobile devices
- **Push Notifications**: Real-time alerts and updates
- **Background Sync**: Automatically syncs data when connection is restored
- **Fast Loading**: Cached resources for instant startup

### Driver Features
- Driver login and authentication
- Real-time shipment tracking
- GPS location sharing
- Proof of Delivery (PoD) submission
- Status updates (pending, in-transit, delivered, failed)
- Assignment management
- Offline data persistence

## Technical Architecture

### Service Worker
The PWA uses a service worker for:
- Caching static assets for offline access
- Intercepting network requests for API data caching
- Background synchronization of offline data
- Push notification handling

### IndexedDB
Offline data is stored using IndexedDB:
- Pending API requests
- Cached shipment and driver data
- Location history
- Assignment information

### WebSocket Integration
Real-time communication with the backend:
- Live location tracking
- Instant assignment notifications
- Status updates
- Automatic reconnection

### Offline-First Design
The app follows an offline-first approach:
- All data is cached locally
- API requests are queued when offline
- Automatic sync when connection is restored
- Graceful degradation of features

## Installation

### Prerequisites
- Node.js 16+
- npm or yarn

### Setup
```bash
# Clone the repository
git clone <repository-url>

# Navigate to frontend directory
cd src/frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Testing

### PWA Compliance Testing
```bash
# Run PWA compliance tests
npm run test:pwa
```

### Unit Tests
```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage
```

### Manual Testing
1. Open Chrome DevTools
2. Go to Application tab
3. Check Manifest and Service Workers sections
4. Test offline functionality using Network tab
5. Verify installability using Lighthouse

## Deployment

### Vercel Deployment
The app is configured for easy deployment to Vercel:
1. Connect repository to Vercel
2. Set environment variables
3. Deploy automatically on push

### Environment Variables
```env
# Database configuration (if needed for local development)
DB_HOST=your-database-host
DB_PORT=5432
DB_NAME=your-database-name
DB_USER=your-database-user
DB_PASSWORD=your-database-password

# API configuration
API_BASE_URL=https://your-api-domain.com/api
```

## PWA Features Checklist

### ✅ Core Web Vitals
- Largest Contentful Paint (LCP) < 2.5s
- First Input Delay (FID) < 100ms
- Cumulative Layout Shift (CLS) < 0.1

### ✅ PWA Requirements
- [x] Web App Manifest
- [x] Service Worker
- [x] Installability
- [x] Static Resources Caching
- [x] HTTPS
- [x] Responsive Design
- [x] Offline Functionality
- [x] Safe-to-Reinstall
- [x] Cross-browser Compatibility

### ✅ Advanced Features
- [x] Background Sync
- [x] Push Notifications
- [x] IndexedDB Storage
- [x] Geolocation API
- [x] Device Orientation
- [x] Camera Access (for PoD photos)

## Troubleshooting

### Common Issues

#### Service Worker Not Registering
1. Check browser console for errors
2. Ensure HTTPS is used in production
3. Verify `sw.js` file exists in build output

#### Offline Data Not Syncing
1. Check network connectivity
2. Verify IndexedDB permissions
3. Check browser console for sync errors

#### Push Notifications Not Working
1. Verify VAPID keys are configured
2. Check browser notification permissions
3. Ensure service worker is properly registered

### Debugging Tools

#### Chrome DevTools
1. Application Tab → Service Workers
2. Application Tab → IndexedDB
3. Application Tab → Manifest
4. Lighthouse Tab → PWA Audit

#### Console Commands
```javascript
// Check service worker status
navigator.serviceWorker.controller

// Check IndexedDB databases
indexedDB.databases()

// Force sync pending data
offlineDataService.syncPendingData()

// Test notification service
notificationService.showNotification('Test', { body: 'This is a test notification' })
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License

## Support

For support, please contact the development team or open an issue on GitHub.