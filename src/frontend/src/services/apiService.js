// API service to connect frontend to backend with offline support
import offlineDataService from './offlineDataService';

const API_BASE_URL = '/api';

class ApiService {
  static API_BASE_URL = API_BASE_URL;
  // Utility function to check if we're online
  static isOnline() {
    return navigator.onLine;
  }

  // Utility function to make HTTP requests with offline support
  static async makeRequest(url, options = {}) {
    // Set default headers
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    const requestOptions = {
      ...options,
      headers: defaultHeaders
    };

    try {
      // Try to make the request
      const response = await fetch(url, requestOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error making request to ${url}:`, error);
      
      // If we're offline, save the request for background sync
      if (!this.isOnline()) {
        try {
          const offlineId = await offlineDataService.saveForSync(url, options.method || 'GET', options.body ? JSON.parse(options.body) : null);
          console.log(`Request saved for background sync with ID: ${offlineId}`);
          
          // Return a special offline response
          return {
            id: `offline-${Date.now()}`,
            offline: true,
            message: 'Request saved for background sync',
            offlineId
          };
        } catch (syncError) {
          console.error('Error saving request for sync:', syncError);
        }
      }
      
      throw error;
    }
  }

  // Shipments API
  static async getShipments() {
    try {
      const url = `${API_BASE_URL}/shipments`;
      const data = await this.makeRequest(url, { method: 'GET' });
      
      // Cache the data for offline use
      if (Array.isArray(data) && data.length > 0) {
        for (const shipment of data) {
          await offlineDataService.cacheAssignment(shipment);
        }
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching shipments:', error);
      
      // Try to get cached data if offline
      if (!this.isOnline()) {
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
      const url = `${API_BASE_URL}/shipments/${id}`;
      const data = await this.makeRequest(url, { method: 'GET' });
      
      // Cache the data for offline use
      await offlineDataService.cacheAssignment(data);
      
      return data;
    } catch (error) {
      console.error(`Error fetching shipment ${id}:`, error);
      
      // Try to get cached data if offline
      if (!this.isOnline()) {
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
      const url = `${API_BASE_URL}/shipments`;
      const data = await this.makeRequest(url, {
        method: 'POST',
        body: JSON.stringify(shipmentData)
      });
      
      return data;
    } catch (error) {
      console.error('Error creating shipment:', error);
      throw error;
    }
  }

  static async updateShipment(id, shipmentData) {
    try {
      const url = `${API_BASE_URL}/shipments/${id}`;
      const data = await this.makeRequest(url, {
        method: 'PUT',
        body: JSON.stringify(shipmentData)
      });
      
      // Update cached data
      await offlineDataService.cacheAssignment(data);
      
      return data;
    } catch (error) {
      console.error(`Error updating shipment ${id}:`, error);
      throw error;
    }
  }

  static async deleteShipment(id) {
    try {
      const url = `${API_BASE_URL}/shipments/${id}`;
      const data = await this.makeRequest(url, { method: 'DELETE' });
      return data;
    } catch (error) {
      console.error(`Error deleting shipment ${id}:`, error);
      throw error;
    }
  }

  // Drivers API
  static async getDrivers() {
    try {
      const url = `${API_BASE_URL}/drivers`;
      const data = await this.makeRequest(url, { method: 'GET' });
      return data;
    } catch (error) {
      console.error('Error fetching drivers:', error);
      throw error;
    }
  }

  static async getDriverById(id) {
    try {
      const url = `${API_BASE_URL}/drivers/${id}`;
      const data = await this.makeRequest(url, { method: 'GET' });
      
      // Cache driver data
      await offlineDataService.cacheDriverData(`driver-${id}`, data);
      
      return data;
    } catch (error) {
      console.error(`Error fetching driver ${id}:`, error);
      
      // Try to get cached data if offline
      if (!this.isOnline()) {
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
      const url = `${API_BASE_URL}/drivers`;
      const data = await this.makeRequest(url, {
        method: 'POST',
        body: JSON.stringify(driverData)
      });
      return data;
    } catch (error) {
      console.error('Error creating driver:', error);
      throw error;
    }
  }

  static async updateDriver(id, driverData) {
    try {
      const url = `${API_BASE_URL}/drivers/${id}`;
      const data = await this.makeRequest(url, {
        method: 'PUT',
        body: JSON.stringify(driverData)
      });
      
      // Update cached data
      await offlineDataService.cacheDriverData(`driver-${id}`, data);
      
      return data;
    } catch (error) {
      console.error(`Error updating driver ${id}:`, error);
      throw error;
    }
  }

  static async deleteDriver(id) {
    try {
      const url = `${API_BASE_URL}/drivers/${id}`;
      const data = await this.makeRequest(url, { method: 'DELETE' });
      return data;
    } catch (error) {
      console.error(`Error deleting driver ${id}:`, error);
      throw error;
    }
  }

  // Routes API
  static async getRoutes() {
    try {
      const url = `${API_BASE_URL}/routes`;
      const data = await this.makeRequest(url, { method: 'GET' });
      return data;
    } catch (error) {
      console.error('Error fetching routes:', error);
      throw error;
    }
  }

  static async getRouteById(id) {
    try {
      const url = `${API_BASE_URL}/routes/${id}`;
      const data = await this.makeRequest(url, { method: 'GET' });
      return data;
    } catch (error) {
      console.error(`Error fetching route ${id}:`, error);
      throw error;
    }
  }

  static async createRoute(routeData) {
    try {
      const url = `${API_BASE_URL}/routes`;
      const data = await this.makeRequest(url, {
        method: 'POST',
        body: JSON.stringify(routeData)
      });
      return data;
    } catch (error) {
      console.error('Error creating route:', error);
      throw error;
    }
  }

  static async updateRoute(id, routeData) {
    try {
      const url = `${API_BASE_URL}/routes/${id}`;
      const data = await this.makeRequest(url, {
        method: 'PUT',
        body: JSON.stringify(routeData)
      });
      return data;
    } catch (error) {
      console.error(`Error updating route ${id}:`, error);
      throw error;
    }
  }

  static async deleteRoute(id) {
    try {
      const url = `${API_BASE_URL}/routes/${id}`;
      const data = await this.makeRequest(url, { method: 'DELETE' });
      return data;
    } catch (error) {
      console.error(`Error deleting route ${id}:`, error);
      throw error;
    }
  }

  // Update shipment status with PoD
  static async updateShipmentStatus(id, statusData) {
    try {
      const url = `${API_BASE_URL}/shipments/${id}/status`;
      const data = await this.makeRequest(url, {
        method: 'PUT',
        body: JSON.stringify(statusData)
      });
      
      // Update cached data
      await offlineDataService.cacheAssignment(data);
      
      return data;
    } catch (error) {
      console.error(`Error updating shipment status ${id}:`, error);
      throw error;
    }
  }

  // Submit Proof of Delivery
  static async submitPod(id, podData) {
    try {
      const url = `${API_BASE_URL}/shipments/${id}/pod`;
      const data = await this.makeRequest(url, {
        method: 'POST',
        body: JSON.stringify(podData)
      });
      
      // Update cached data
      await offlineDataService.cacheAssignment(data);
      
      return data;
    } catch (error) {
      console.error(`Error submitting PoD for shipment ${id}:`, error);
      throw error;
    }
  }

  // Update driver location
  static async updateDriverLocation(id, locationData) {
    try {
      const url = `${API_BASE_URL}/drivers/${id}/location`;
      const data = await this.makeRequest(url, {
        method: 'PUT',
        body: JSON.stringify(locationData)
      });
      
      // Store location history
      await offlineDataService.storeLocationHistory(id, locationData.current_location);
      
      return data;
    } catch (error) {
      console.error(`Error updating driver location ${id}:`, error);
      throw error;
    }
  }

  // Update driver status
  static async updateDriverStatus(id, status) {
    try {
      const url = `${API_BASE_URL}/drivers/${id}/status`;
      const data = await this.makeRequest(url, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      
      // Update cached data
      const driverData = await offlineDataService.getCachedDriverData(`driver-${id}`);
      if (driverData) {
        driverData.status = status;
        await offlineDataService.cacheDriverData(`driver-${id}`, driverData);
      }
      
      return data;
    } catch (error) {
      console.error(`Error updating driver status ${id}:`, error);
      throw error;
    }
  }

  // Get driver assignments
  static async getDriverAssignments(id) {
    try {
      const url = `${API_BASE_URL}/drivers/${id}/assignments`;
      const data = await this.makeRequest(url, { method: 'GET' });
      return data;
    } catch (error) {
      console.error(`Error fetching driver assignments ${id}:`, error);
      throw error;
    }
  }
}

export default ApiService;