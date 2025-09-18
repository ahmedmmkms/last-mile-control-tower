// Shipment Controller Tests
const request = require('supertest');
const { app } = require('../../index');

// Mock the database functions
jest.mock('../../src/database/db', () => ({
  client: {
    query: jest.fn()
  }
}));

describe('Shipment Controller', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('should update shipment status with PoD', async () => {
    const mockShipment = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      tracking_number: 'TRK001',
      status: 'delivered',
      origin: { address: '123 Main St' },
      destination: { address: '456 Oak Ave' },
      assigned_driver_id: '123e4567-e89b-12d3-a456-426614174001',
      pod_image: 'https://example.com/pod.jpg',
      pod_timestamp: '2025-09-18T10:00:00Z',
      pod_location: { latitude: 40.7128, longitude: -74.0060 }
    };

    // Mock the database responses
    require('../../src/database/db').client.query
      .mockResolvedValueOnce({ rows: [mockShipment] }) // Get shipment by ID
      .mockResolvedValueOnce({ rows: [mockShipment] }) // Update shipment status
      .mockResolvedValueOnce({ rows: [{}] }); // Store tracking data

    const response = await request(app)
      .put('/api/shipments/123e4567-e89b-12d3-a456-426614174000/status')
      .send({
        status: 'delivered',
        pod_image: 'https://example.com/pod.jpg',
        pod_timestamp: '2025-09-18T10:00:00Z',
        pod_location: { latitude: 40.7128, longitude: -74.0060 }
      })
      .expect(200);

    expect(response.body.status).toBe('delivered');
    expect(response.body.pod_image).toBe('https://example.com/pod.jpg');
  });

  test('should submit Proof of Delivery', async () => {
    const mockShipment = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      tracking_number: 'TRK001',
      status: 'delivered',
      origin: { address: '123 Main St' },
      destination: { address: '456 Oak Ave' },
      assigned_driver_id: '123e4567-e89b-12d3-a456-426614174001',
      pod_image: 'https://example.com/pod.jpg',
      pod_timestamp: '2025-09-18T10:00:00Z',
      pod_location: { latitude: 40.7128, longitude: -74.0060 }
    };

    // Mock the database responses
    require('../../src/database/db').client.query
      .mockResolvedValueOnce({ rows: [mockShipment] }) // Get shipment by ID
      .mockResolvedValueOnce({ rows: [mockShipment] }) // Submit PoD
      .mockResolvedValueOnce({ rows: [{}] }); // Store tracking data

    const response = await request(app)
      .post('/api/shipments/123e4567-e89b-12d3-a456-426614174000/pod')
      .send({
        pod_image: 'https://example.com/pod.jpg',
        pod_timestamp: '2025-09-18T10:00:00Z',
        pod_location: { latitude: 40.7128, longitude: -74.0060 }
      })
      .expect(200);

    expect(response.body.status).toBe('delivered');
    expect(response.body.pod_image).toBe('https://example.com/pod.jpg');
  });

  test('should reject PoD submission without required fields', async () => {
    const response = await request(app)
      .post('/api/shipments/123e4567-e89b-12d3-a456-426614174000/pod')
      .send({
        pod_image: 'https://example.com/pod.jpg'
        // Missing pod_timestamp
      })
      .expect(400);

    expect(response.body.error).toBe('pod_image and pod_timestamp are required');
  });

  test('should reject invalid status', async () => {
    const response = await request(app)
      .put('/api/shipments/123e4567-e89b-12d3-a456-426614174000/status')
      .send({
        status: 'invalid-status'
      })
      .expect(400);

    expect(response.body.error).toBe('Invalid status. Must be one of: pending, assigned, in_transit, delivered, failed');
  });
});