// Offline data service for handling background sync and offline storage
class OfflineDataService {
  constructor() {
    this.dbName = 'DriverPWA';
    this.dbVersion = 1;
    this.db = null;
    this.syncInterval = null;
    this.isOnline = navigator.onLine;
  }

  // Initialize IndexedDB
  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => {
        console.error('Failed to open IndexedDB');
        reject(request.error);
      };
      
      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB initialized successfully');
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create object stores if they don't exist
        if (!db.objectStoreNames.contains('pendingUpdates')) {
          const store = db.createObjectStore('pendingUpdates', { keyPath: 'id', autoIncrement: true });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('assignments')) {
          const store = db.createObjectStore('assignments', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('driverData')) {
          const store = db.createObjectStore('driverData', { keyPath: 'key' });
        }
        
        if (!db.objectStoreNames.contains('locationHistory')) {
          const store = db.createObjectStore('locationHistory', { keyPath: 'id', autoIncrement: true });
          store.createIndex('driverId', 'driverId', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  // Save data locally for background sync
  async saveForSync(endpoint, method, data) {
    if (!this.db) {
      await this.initDB();
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['pendingUpdates'], 'readwrite');
      const store = transaction.objectStore('pendingUpdates');
      
      const syncData = {
        endpoint,
        method,
        data,
        timestamp: Date.now(),
        attempts: 0
      };
      
      const request = store.add(syncData);
      
      request.onsuccess = () => {
        console.log('Data saved for sync:', syncData);
        resolve(request.result);
        
        // Trigger immediate sync if online
        if (this.isOnline) {
          this.syncPendingData();
        }
      };
      
      request.onerror = () => {
        console.error('Failed to save data for sync:', request.error);
        reject(request.error);
      };
    });
  }

  // Get all pending sync data
  async getPendingSyncData() {
    if (!this.db) {
      await this.initDB();
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['pendingUpdates'], 'readonly');
      const store = transaction.objectStore('pendingUpdates');
      const request = store.getAll();
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // Remove synced data
  async removeSyncedData(id) {
    if (!this.db) {
      await this.initDB();
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['pendingUpdates'], 'readwrite');
      const store = transaction.objectStore('pendingUpdates');
      const request = store.delete(id);
      
      request.onsuccess = () => {
        resolve();
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // Update sync attempt count
  async updateSyncAttempt(id, attempts) {
    if (!this.db) {
      await this.initDB();
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['pendingUpdates'], 'readwrite');
      const store = transaction.objectStore('pendingUpdates');
      
      const request = store.get(id);
      
      request.onsuccess = () => {
        const data = request.result;
        if (data) {
          data.attempts = attempts;
          const updateRequest = store.put(data);
          
          updateRequest.onsuccess = () => {
            resolve();
          };
          
          updateRequest.onerror = () => {
            reject(updateRequest.error);
          };
        } else {
          reject(new Error('Data not found'));
        }
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // Attempt to sync pending data
  async syncPendingData() {
    // Don't sync if offline
    if (!this.isOnline) {
      console.log('Device is offline, skipping sync');
      return;
    }
    
    try {
      const pendingData = await this.getPendingSyncData();
      
      if (pendingData.length === 0) {
        console.log('No pending data to sync');
        return;
      }
      
      console.log(`Attempting to sync ${pendingData.length} items`);
      
      for (const item of pendingData) {
        // Skip items that have failed too many times
        if (item.attempts >= 3) {
          console.warn('Skipping sync item after 3 failed attempts:', item.id);
          continue;
        }
        
        try {
          const response = await fetch(item.endpoint, {
            method: item.method,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(item.data)
          });
          
          if (response.ok) {
            // Successfully synced, remove from pending
            await this.removeSyncedData(item.id);
            console.log('Successfully synced item:', item.id);
          } else {
            // Increment attempt count
            await this.updateSyncAttempt(item.id, item.attempts + 1);
            console.warn('Failed to sync item:', item.id, response.status);
          }
        } catch (error) {
          // Network error, increment attempt count
          await this.updateSyncAttempt(item.id, item.attempts + 1);
          console.error('Network error syncing item:', item.id, error);
        }
      }
    } catch (error) {
      console.error('Error during sync:', error);
    }
  }

  // Start background sync interval
  startBackgroundSync(interval = 30000) { // Default 30 seconds
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    
    this.syncInterval = setInterval(() => {
      // Only sync if online
      if (this.isOnline) {
        this.syncPendingData();
      }
    }, interval);
    
    console.log(`Background sync started with interval: ${interval}ms`);
    
    // Set up online/offline event listeners
    window.addEventListener('online', () => {
      console.log('Connection restored, syncing pending data');
      this.isOnline = true;
      this.syncPendingData();
    });
    
    window.addEventListener('offline', () => {
      console.log('Connection lost, pausing sync');
      this.isOnline = false;
    });
  }

  // Stop background sync
  stopBackgroundSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('Background sync stopped');
    }
  }

  // Cache assignment data locally
  async cacheAssignment(assignment) {
    if (!this.db) {
      await this.initDB();
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['assignments'], 'readwrite');
      const store = transaction.objectStore('assignments');
      const request = store.put(assignment);
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // Get cached assignment by ID
  async getCachedAssignment(id) {
    if (!this.db) {
      await this.initDB();
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['assignments'], 'readonly');
      const store = transaction.objectStore('assignments');
      const request = store.get(id);
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // Get all cached assignments
  async getAllCachedAssignments() {
    if (!this.db) {
      await this.initDB();
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['assignments'], 'readonly');
      const store = transaction.objectStore('assignments');
      const request = store.getAll();
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // Cache driver data locally
  async cacheDriverData(key, data) {
    if (!this.db) {
      await this.initDB();
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['driverData'], 'readwrite');
      const store = transaction.objectStore('driverData');
      const request = store.put({ key, data, timestamp: Date.now() });
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // Get cached driver data by key
  async getCachedDriverData(key) {
    if (!this.db) {
      await this.initDB();
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['driverData'], 'readonly');
      const store = transaction.objectStore('driverData');
      const request = store.get(key);
      
      request.onsuccess = () => {
        resolve(request.result ? request.result.data : null);
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // Store driver location history
  async storeLocationHistory(driverId, locationData) {
    if (!this.db) {
      await this.initDB();
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['locationHistory'], 'readwrite');
      const store = transaction.objectStore('locationHistory');
      const locationEntry = {
        driverId,
        location: locationData,
        timestamp: Date.now()
      };
      const request = store.add(locationEntry);
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // Get driver location history
  async getLocationHistory(driverId, limit = 50) {
    if (!this.db) {
      await this.initDB();
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['locationHistory'], 'readonly');
      const store = transaction.objectStore('locationHistory');
      const index = store.index('driverId');
      const request = index.getAll(IDBKeyRange.only(driverId));
      
      request.onsuccess = () => {
        // Sort by timestamp and limit results
        const results = request.result
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, limit);
        resolve(results);
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // Clear old location history
  async clearOldLocationHistory(maxAgeHours = 24) {
    if (!this.db) {
      await this.initDB();
    }
    
    const cutoffTime = Date.now() - (maxAgeHours * 60 * 60 * 1000);
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['locationHistory'], 'readwrite');
      const store = transaction.objectStore('locationHistory');
      const index = store.index('timestamp');
      
      // Open cursor to delete old entries
      const request = index.openCursor(IDBKeyRange.upperBound(cutoffTime));
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // Export all cached data (for backup/debugging)
  async exportAllData() {
    if (!this.db) {
      await this.initDB();
    }
    
    const exportData = {
      assignments: await this.getAllCachedAssignments(),
      driverData: [],
      locationHistory: [],
      pendingUpdates: await this.getPendingSyncData()
    };
    
    // Get all driver data
    const driverTransaction = this.db.transaction(['driverData'], 'readonly');
    const driverStore = driverTransaction.objectStore('driverData');
    const driverRequest = driverStore.getAll();
    
    await new Promise((resolve, reject) => {
      driverRequest.onsuccess = () => {
        exportData.driverData = driverRequest.result;
        resolve();
      };
      driverRequest.onerror = () => reject(driverRequest.error);
    });
    
    // Get all location history
    const locationTransaction = this.db.transaction(['locationHistory'], 'readonly');
    const locationStore = locationTransaction.objectStore('locationHistory');
    const locationRequest = locationStore.getAll();
    
    await new Promise((resolve, reject) => {
      locationRequest.onsuccess = () => {
        exportData.locationHistory = locationRequest.result;
        resolve();
      };
      locationRequest.onerror = () => reject(locationRequest.error);
    });
    
    return exportData;
  }

  // Import data (for restore/testing)
  async importData(data) {
    if (!this.db) {
      await this.initDB();
    }
    
    // Import assignments
    for (const assignment of data.assignments || []) {
      await this.cacheAssignment(assignment);
    }
    
    // Import driver data
    for (const driverData of data.driverData || []) {
      await this.cacheDriverData(driverData.key, driverData.data);
    }
    
    // Import location history
    for (const location of data.locationHistory || []) {
      await this.storeLocationHistory(location.driverId, location.location);
    }
    
    // Import pending updates
    for (const update of data.pendingUpdates || []) {
      await this.saveForSync(update.endpoint, update.method, update.data);
    }
    
    console.log('Data imported successfully');
  }
}

// Create a singleton instance
const offlineDataService = new OfflineDataService();

export default offlineDataService;