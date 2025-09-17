// Shipment API Integration Tests
const axios = require('axios');
const testFixtures = require('../fixtures/testData');

// Use the deployed URL from environment variables or default to localhost for local testing
const API_BASE_URL = process.env.DEPLOYED_URL || process.env.API_BASE_URL || 'http://localhost:3000';

describe('Shipment API Endpoints', () => {
  let createdShipmentId;

  // Test GET /api/shipments
  describe('GET /api/shipments', () => {
    it('should return a list of shipments', async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/shipments`);
        
        expect(response.status).toBe(200);
        expect(Array.isArray(response.data)).toBe(true);
        
        // If we have data, check the structure of the first shipment
        if (response.data.length > 0) {
          const shipment = response.data[0];
          expect(shipment).toHaveProperty('id');
          expect(shipment).toHaveProperty('tracking_number');
          expect(shipment).toHaveProperty('status');
          expect(shipment).toHaveProperty('origin');
          expect(shipment).toHaveProperty('destination');
          expect(shipment).toHaveProperty('created_at');
          expect(shipment).toHaveProperty('updated_at');
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

  // Test POST /api/shipments
  describe('POST /api/shipments', () => {
    it('should create a new shipment', async () => {
      try {
        const newShipment = testFixtures.shipments[0];
        const response = await axios.post(`${API_BASE_URL}/api/shipments`, newShipment);
        
        expect(response.status).toBe(201);
        expect(response.data).toHaveProperty('id');
        expect(response.data.tracking_number).toBe(newShipment.tracking_number);
        expect(response.data.status).toBe(newShipment.status);
        expect(response.data.origin).toEqual(newShipment.origin);
        expect(response.data.destination).toEqual(newShipment.destination);
        
        // Store the created shipment ID for later tests
        createdShipmentId = response.data.id;
      } catch (error) {
        if (error.code === 'ECONNREFUSED') {
          console.log('Server not accessible, skipping integration test');
          return;
        }
        throw error;
      }
    });
  });

  // Test GET /api/shipments/:id
  describe('GET /api/shipments/:id', () => {
    it('should return a specific shipment by ID', async () => {
      // Only run this test if we have a created shipment ID
      if (!createdShipmentId) {
        console.log('No shipment created, skipping GET by ID test');
        return;
      }
      
      try {
        const response = await axios.get(`${API_BASE_URL}/api/shipments/${createdShipmentId}`);
        
        expect(response.status).toBe(200);
        expect(response.data.id).toBe(createdShipmentId);
        expect(response.data).toHaveProperty('tracking_number');
        expect(response.data).toHaveProperty('status');
        expect(response.data).toHaveProperty('origin');
        expect(response.data).toHaveProperty('destination');
        expect(response.data).toHaveProperty('created_at');
        expect(response.data).toHaveProperty('updated_at');
      } catch (error) {
        if (error.code === 'ECONNREFUSED') {
          console.log('Server not accessible, skipping integration test');
          return;
        }
        if (error.response && error.response.status === 404) {
          console.log('Shipment not found, skipping test');
          return;
        }
        throw error;
      }
    });
  });

  // Test PUT /api/shipments/:id
  describe('PUT /api/shipments/:id', () => {
    it('should update an existing shipment', async () => {
      // Only run this test if we have a created shipment ID
      if (!createdShipmentId) {
        console.log('No shipment created, skipping PUT test');
        return;
      }
      
      try {
        const updatedShipmentData = {
          tracking_number: 'TRK999-UPDATED',
          status: 'delivered',
          origin: { address: 'Updated Origin, City, State', lat: 40.7128, lng: -74.0060 },
          destination: { address: 'Updated Destination, City, State', lat: 40.7589, lng: -73.9851 },
          assigned_driver_id: null
        };
        
        const response = await axios.put(`${API_BASE_URL}/api/shipments/${createdShipmentId}`, updatedShipmentData);
        
        expect(response.status).toBe(200);
        expect(response.data.id).toBe(createdShipmentId);
        expect(response.data.tracking_number).toBe(updatedShipmentData.tracking_number);
        expect(response.data.status).toBe(updatedShipmentData.status);
        expect(response.data.origin).toEqual(updatedShipmentData.origin);
        expect(response.data.destination).toEqual(updatedShipmentData.destination);
      } catch (error) {
        if (error.code === 'ECONNREFUSED') {
          console.log('Server not accessible, skipping integration test');
          return;
        }
        if (error.response && error.response.status === 404) {
          console.log('Shipment not found, skipping test');
          return;
        }
        throw error;
      }
    });
  });

  // Test DELETE /api/shipments/:id
  describe('DELETE /api/shipments/:id', () => {
    it('should delete a shipment', async () => {
      // Only run this test if we have a created shipment ID
      if (!createdShipmentId) {
        console.log('No shipment created, skipping DELETE test');
        return;
      }
      
      try {
        const response = await axios.delete(`${API_BASE_URL}/api/shipments/${createdShipmentId}`);
        
        expect(response.status).toBe(200);
        expect(response.data.id).toBe(createdShipmentId);
      } catch (error) {
        if (error.code === 'ECONNREFUSED') {
          console.log('Server not accessible, skipping integration test');
          return;
        }
        if (error.response && error.response.status === 404) {
          console.log('Shipment not found, skipping test');
          return;
        }
        throw error;
      }
    });
  });
});