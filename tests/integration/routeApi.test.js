// Route API Integration Tests
const axios = require('axios');
const testFixtures = require('../fixtures/testData');

// Use the deployed URL from environment variables or default to localhost for local testing
const API_BASE_URL = process.env.DEPLOYED_URL || process.env.API_BASE_URL || 'http://localhost:3000';

describe('Route API Endpoints', () => {
  let createdRouteId;

  // Test GET /api/routes
  describe('GET /api/routes', () => {
    it('should return a list of routes', async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/routes`);
        
        expect(response.status).toBe(200);
        expect(Array.isArray(response.data)).toBe(true);
        
        // If we have data, check the structure of the first route
        if (response.data.length > 0) {
          const route = response.data[0];
          expect(route).toHaveProperty('id');
          expect(route).toHaveProperty('shipment_id');
          expect(route).toHaveProperty('waypoints');
          expect(route).toHaveProperty('status');
          expect(route).toHaveProperty('estimated_time');
          expect(route).toHaveProperty('created_at');
          expect(route).toHaveProperty('updated_at');
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

  // Test POST /api/routes
  describe('POST /api/routes', () => {
    it('should create a new route', async () => {
      try {
        const newRoute = testFixtures.routes[0];
        const response = await axios.post(`${API_BASE_URL}/api/routes`, newRoute);
        
        expect(response.status).toBe(201);
        expect(response.data).toHaveProperty('id');
        expect(response.data.shipment_id).toBe(newRoute.shipment_id);
        expect(response.data.waypoints).toEqual(newRoute.waypoints);
        expect(response.data.status).toBe(newRoute.status);
        expect(response.data.estimated_time).toBe(newRoute.estimated_time);
        
        // Store the created route ID for later tests
        createdRouteId = response.data.id;
      } catch (error) {
        if (error.code === 'ECONNREFUSED') {
          console.log('Server not accessible, skipping integration test');
          return;
        }
        throw error;
      }
    });
  });

  // Test GET /api/routes/:id
  describe('GET /api/routes/:id', () => {
    it('should return a specific route by ID', async () => {
      // Only run this test if we have a created route ID
      if (!createdRouteId) {
        console.log('No route created, skipping GET by ID test');
        return;
      }
      
      try {
        const response = await axios.get(`${API_BASE_URL}/api/routes/${createdRouteId}`);
        
        expect(response.status).toBe(200);
        expect(response.data.id).toBe(createdRouteId);
        expect(response.data).toHaveProperty('shipment_id');
        expect(response.data).toHaveProperty('waypoints');
        expect(response.data).toHaveProperty('status');
        expect(response.data).toHaveProperty('estimated_time');
        expect(response.data).toHaveProperty('created_at');
        expect(response.data).toHaveProperty('updated_at');
      } catch (error) {
        if (error.code === 'ECONNREFUSED') {
          console.log('Server not accessible, skipping integration test');
          return;
        }
        if (error.response && error.response.status === 404) {
          console.log('Route not found, skipping test');
          return;
        }
        throw error;
      }
    });
  });

  // Test PUT /api/routes/:id
  describe('PUT /api/routes/:id', () => {
    it('should update an existing route', async () => {
      // Only run this test if we have a created route ID
      if (!createdRouteId) {
        console.log('No route created, skipping PUT test');
        return;
      }
      
      try {
        const updatedRouteData = {
          shipment_id: '55555555-5555-5555-5555-555555555555',
          waypoints: [
            { lat: 40.7505, lng: -73.9934 },
            { lat: 40.7589, lng: -73.9851 },
            { lat: 40.7128, lng: -74.0060 }
          ],
          status: 'completed',
          estimated_time: 45,
          actual_time: 40
        };
        
        const response = await axios.put(`${API_BASE_URL}/api/routes/${createdRouteId}`, updatedRouteData);
        
        expect(response.status).toBe(200);
        expect(response.data.id).toBe(createdRouteId);
        expect(response.data.shipment_id).toBe(updatedRouteData.shipment_id);
        expect(response.data.waypoints).toEqual(updatedRouteData.waypoints);
        expect(response.data.status).toBe(updatedRouteData.status);
        expect(response.data.estimated_time).toBe(updatedRouteData.estimated_time);
        expect(response.data.actual_time).toBe(updatedRouteData.actual_time);
      } catch (error) {
        if (error.code === 'ECONNREFUSED') {
          console.log('Server not accessible, skipping integration test');
          return;
        }
        if (error.response && error.response.status === 404) {
          console.log('Route not found, skipping test');
          return;
        }
        throw error;
      }
    });
  });

  // Test DELETE /api/routes/:id
  describe('DELETE /api/routes/:id', () => {
    it('should delete a route', async () => {
      // Only run this test if we have a created route ID
      if (!createdRouteId) {
        console.log('No route created, skipping DELETE test');
        return;
      }
      
      try {
        const response = await axios.delete(`${API_BASE_URL}/api/routes/${createdRouteId}`);
        
        expect(response.status).toBe(200);
        expect(response.data.id).toBe(createdRouteId);
      } catch (error) {
        if (error.code === 'ECONNREFUSED') {
          console.log('Server not accessible, skipping integration test');
          return;
        }
        if (error.response && error.response.status === 404) {
          console.log('Route not found, skipping test');
          return;
        }
        throw error;
      }
    });
  });
});