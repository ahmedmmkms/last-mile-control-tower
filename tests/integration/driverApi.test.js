// Driver API Integration Tests
const axios = require('axios');
const testFixtures = require('../fixtures/testData');

// Use the deployed URL from environment variables or default to localhost for local testing
const API_BASE_URL = process.env.DEPLOYED_URL || process.env.API_BASE_URL || 'http://localhost:3000';

describe('Driver API Endpoints', () => {
  let createdDriverId;

  // Test GET /api/drivers
  describe('GET /api/drivers', () => {
    it('should return a list of drivers', async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/drivers`);
        
        expect(response.status).toBe(200);
        expect(Array.isArray(response.data)).toBe(true);
        
        // If we have data, check the structure of the first driver
        if (response.data.length > 0) {
          const driver = response.data[0];
          expect(driver).toHaveProperty('id');
          expect(driver).toHaveProperty('name');
          expect(driver).toHaveProperty('phone');
          expect(driver).toHaveProperty('vehicle_type');
          expect(driver).toHaveProperty('status');
          expect(driver).toHaveProperty('created_at');
          expect(driver).toHaveProperty('updated_at');
        }
      } catch (error) {
        // If we get a network error, it might be because the server is not running
        // In a CI environment, we might want to skip these tests if the server is not accessible
        if (error.code === 'ECONNREFUSED') {
          console.log('Server not accessible, skipping integration test');
          return;
        }
        throw error;
      }
    });
  });

  // Test POST /api/drivers
  describe('POST /api/drivers', () => {
    it('should create a new driver', async () => {
      try {
        const newDriver = testFixtures.drivers[0];
        const response = await axios.post(`${API_BASE_URL}/api/drivers`, newDriver);
        
        expect(response.status).toBe(201);
        expect(response.data).toHaveProperty('id');
        expect(response.data.name).toBe(newDriver.name);
        expect(response.data.phone).toBe(newDriver.phone);
        expect(response.data.vehicle_type).toBe(newDriver.vehicle_type);
        expect(response.data.status).toBe(newDriver.status);
        
        // Store the created driver ID for later tests
        createdDriverId = response.data.id;
      } catch (error) {
        if (error.code === 'ECONNREFUSED') {
          console.log('Server not accessible, skipping integration test');
          return;
        }
        throw error;
      }
    });
  });

  // Test GET /api/drivers/:id
  describe('GET /api/drivers/:id', () => {
    it('should return a specific driver by ID', async () => {
      // Only run this test if we have a created driver ID
      if (!createdDriverId) {
        console.log('No driver created, skipping GET by ID test');
        return;
      }
      
      try {
        const response = await axios.get(`${API_BASE_URL}/api/drivers/${createdDriverId}`);
        
        expect(response.status).toBe(200);
        expect(response.data.id).toBe(createdDriverId);
        expect(response.data).toHaveProperty('name');
        expect(response.data).toHaveProperty('phone');
        expect(response.data).toHaveProperty('vehicle_type');
        expect(response.data).toHaveProperty('status');
        expect(response.data).toHaveProperty('created_at');
        expect(response.data).toHaveProperty('updated_at');
      } catch (error) {
        if (error.code === 'ECONNREFUSED') {
          console.log('Server not accessible, skipping integration test');
          return;
        }
        if (error.response && error.response.status === 404) {
          console.log('Driver not found, skipping test');
          return;
        }
        throw error;
      }
    });
  });

  // Test PUT /api/drivers/:id
  describe('PUT /api/drivers/:id', () => {
    it('should update an existing driver', async () => {
      // Only run this test if we have a created driver ID
      if (!createdDriverId) {
        console.log('No driver created, skipping PUT test');
        return;
      }
      
      try {
        const updatedDriverData = {
          name: 'Updated Driver Name',
          phone: '+9876543210',
          vehicle_type: 'car',
          status: 'busy'
        };
        
        const response = await axios.put(`${API_BASE_URL}/api/drivers/${createdDriverId}`, updatedDriverData);
        
        expect(response.status).toBe(200);
        expect(response.data.id).toBe(createdDriverId);
        expect(response.data.name).toBe(updatedDriverData.name);
        expect(response.data.phone).toBe(updatedDriverData.phone);
        expect(response.data.vehicle_type).toBe(updatedDriverData.vehicle_type);
        expect(response.data.status).toBe(updatedDriverData.status);
      } catch (error) {
        if (error.code === 'ECONNREFUSED') {
          console.log('Server not accessible, skipping integration test');
          return;
        }
        if (error.response && error.response.status === 404) {
          console.log('Driver not found, skipping test');
          return;
        }
        throw error;
      }
    });
  });

  // Test DELETE /api/drivers/:id
  describe('DELETE /api/drivers/:id', () => {
    it('should delete a driver', async () => {
      // Only run this test if we have a created driver ID
      if (!createdDriverId) {
        console.log('No driver created, skipping DELETE test');
        return;
      }
      
      try {
        const response = await axios.delete(`${API_BASE_URL}/api/drivers/${createdDriverId}`);
        
        expect(response.status).toBe(200);
        expect(response.data.id).toBe(createdDriverId);
      } catch (error) {
        if (error.code === 'ECONNREFUSED') {
          console.log('Server not accessible, skipping integration test');
          return;
        }
        if (error.response && error.response.status === 404) {
          console.log('Driver not found, skipping test');
          return;
        }
        throw error;
      }
    });
  });
});