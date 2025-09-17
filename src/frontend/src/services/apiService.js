// API service to connect frontend to backend
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
      throw error;
    }
  }

  static async getShipmentById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/shipments/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching shipment ${id}:`, error);
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
      return await response.json();
    } catch (error) {
      console.error(`Error updating shipment ${id}:`, error);
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
      return await response.json();
    } catch (error) {
      console.error(`Error fetching driver ${id}:`, error);
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
      return await response.json();
    } catch (error) {
      console.error(`Error updating driver ${id}:`, error);
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
      throw error;
    }
  }
}

export default ApiService;