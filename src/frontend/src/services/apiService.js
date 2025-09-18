// API service to connect frontend to backend
import offlineDataService from './offlineDataService';

const API_BASE_URL = '/api';

class ApiService {
  // Shipments API
  static async getShipments() {
    try {
      const response = await fetch(`${API_BASE_URL}/shipments`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching shipments:', error);
      // Try to get cached data if offline
      if (!navigator.onLine) {
        try {
          const cached = await offlineDataService.getAllCachedAssignments();
          if (cached && cached.length > 0) {
            return cached;
          }
        } catch (cacheError) {
          console.error('Error fetching cached shipments:', cacheError);
        }
      }
      throw error;
    }
  }

  static async getShipmentById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/shipments/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Cache the data for offline use
      await offlineDataService.cacheAssignment(data);
      return data;
    } catch (error) {
      console.error(`Error fetching shipment ${id}:`, error);
      // Try to get cached data if offline
      if (!navigator.onLine) {
        try {
          const cached = await offlineDataService.getCachedAssignment(id);
          if (cached) {
            return cached;
          }
        } catch (cacheError) {
          console.error('Error fetching cached shipment:', cacheError);
        }
      }
      throw error;
    }
  }

  static async createShipment(shipmentData) {
    try {
      const response = await fetch(`${API_BASE_URL}/shipments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shipmentData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating shipment:', error);
      // Save for background sync if offline
      if (!navigator.onLine) {
        try {
          await offlineDataService.saveForSync(`${API_BASE_URL}/shipments`, 'POST', shipmentData);
          return { id: 'offline-' + Date.now(), ...shipmentData, offline: true };
        } catch (syncError) {
          console.error('Error saving shipment for sync:', syncError);
        }
      }
      throw error;
    }
  }

  static async updateShipment(id, shipmentData) {
    try {
      const response = await fetch(`${API_BASE_URL}/shipments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shipmentData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Update cached data
      await offlineDataService.cacheAssignment(data);
      return data;
    } catch (error) {
      console.error(`Error updating shipment ${id}:`, error);
      // Save for background sync if offline
      if (!navigator.onLine) {
        try {
          await offlineDataService.saveForSync(`${API_BASE_URL}/shipments/${id}`, 'PUT', shipmentData);
          return { id, ...shipmentData, offline: true };
        } catch (syncError) {
          console.error('Error saving shipment update for sync:', syncError);
        }
      }
      throw error;
    }
  }

  static async deleteShipment(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/shipments/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error deleting shipment ${id}:`, error);
      // Save for background sync if offline
      if (!navigator.onLine) {
        try {
          await offlineDataService.saveForSync(`${API_BASE_URL}/shipments/${id}`, 'DELETE');
          return { id, deleted: true, offline: true };
        } catch (syncError) {
          console.error('Error saving shipment deletion for sync:', syncError);
        }
      }
      throw error;
    }
  }

  // Drivers API
  static async getDrivers() {
    try {
      const response = await fetch(`${API_BASE_URL}/drivers`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching drivers:', error);
      throw error;
    }
  }

  static async getDriverById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/drivers/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Cache driver data
      await offlineDataService.cacheDriverData(`driver-${id}`, data);
      return data;
    } catch (error) {
      console.error(`Error fetching driver ${id}:`, error);
      // Try to get cached data if offline
      if (!navigator.onLine) {
        try {
          const cached = await offlineDataService.getCachedDriverData(`driver-${id}`);
          if (cached) {
            return cached;
          }
        } catch (cacheError) {
          console.error('Error fetching cached driver:', cacheError);
        }
      }
      throw error;
    }
  }

  static async createDriver(driverData) {
    try {
      const response = await fetch(`${API_BASE_URL}/drivers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(driverData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating driver:', error);
      // Save for background sync if offline
      if (!navigator.onLine) {
        try {
          await offlineDataService.saveForSync(`${API_BASE_URL}/drivers`, 'POST', driverData);
          return { id: 'offline-' + Date.now(), ...driverData, offline: true };
        } catch (syncError) {
          console.error('Error saving driver creation for sync:', syncError);
        }
      }
      throw error;
    }
  }

  static async updateDriver(id, driverData) {
    try {
      const response = await fetch(`${API_BASE_URL}/drivers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(driverData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Update cached data
      await offlineDataService.cacheDriverData(`driver-${id}`, data);
      return data;
    } catch (error) {
      console.error(`Error updating driver ${id}:`, error);
      // Save for background sync if offline
      if (!navigator.onLine) {
        try {
          await offlineDataService.saveForSync(`${API_BASE_URL}/drivers/${id}`, 'PUT', driverData);
          return { id, ...driverData, offline: true };
        } catch (syncError) {
          console.error('Error saving driver update for sync:', syncError);
        }
      }
      throw error;
    }
  }

  static async deleteDriver(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/drivers/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error deleting driver ${id}:`, error);
      // Save for background sync if offline
      if (!navigator.onLine) {
        try {
          await offlineDataService.saveForSync(`${API_BASE_URL}/drivers/${id}`, 'DELETE');
          return { id, deleted: true, offline: true };
        } catch (syncError) {
          console.error('Error saving driver deletion for sync:', syncError);
        }
      }
      throw error;
    }
  }

  // Routes API
  static async getRoutes() {
    try {
      const response = await fetch(`${API_BASE_URL}/routes`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching routes:', error);
      throw error;
    }
  }

  static async getRouteById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/routes/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching route ${id}:`, error);
      throw error;
    }
  }

  static async createRoute(routeData) {
    try {
      const response = await fetch(`${API_BASE_URL}/routes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(routeData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating route:', error);
      // Save for background sync if offline
      if (!navigator.onLine) {
        try {
          await offlineDataService.saveForSync(`${API_BASE_URL}/routes`, 'POST', routeData);
          return { id: 'offline-' + Date.now(), ...routeData, offline: true };
        } catch (syncError) {
          console.error('Error saving route creation for sync:', syncError);
        }
      }
      throw error;
    }
  }

  static async updateRoute(id, routeData) {
    try {
      const response = await fetch(`${API_BASE_URL}/routes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(routeData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error updating route ${id}:`, error);
      // Save for background sync if offline
      if (!navigator.onLine) {
        try {
          await offlineDataService.saveForSync(`${API_BASE_URL}/routes/${id}`, 'PUT', routeData);
          return { id, ...routeData, offline: true };
        } catch (syncError) {
          console.error('Error saving route update for sync:', syncError);
        }
      }
      throw error;
    }
  }

  static async deleteRoute(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/routes/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error deleting route ${id}:`, error);
      // Save for background sync if offline
      if (!navigator.onLine) {
        try {
          await offlineDataService.saveForSync(`${API_BASE_URL}/routes/${id}`, 'DELETE');
          return { id, deleted: true, offline: true };
        } catch (syncError) {
          console.error('Error saving route deletion for sync:', syncError);
        }
      }
      throw error;
    }
  }
}

export default ApiService;