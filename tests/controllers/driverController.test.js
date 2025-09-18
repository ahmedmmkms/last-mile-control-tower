// Driver Controller Tests
const request = require('supertest');
const { app } = require('../../index');
const Driver = require('../../src/backend/models/driverModel');

// Mock the database functions
jest.mock('../../src/database/db', () => ({
  client: {
    query: jest.fn()
  }
}));

describe('Driver Controller', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('should create a new driver', async () => {
    const mockDriver = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'John Doe',
      phone: '+1234567890',
      vehicle_type: 'car',
      status: 'available',
      current_location: { latitude: 40.7128, longitude: -74.0060 }
    };

    // Mock the database response
    require('../../src/database/db').client.query.mockResolvedValue({
      rows: [mockDriver]
    });

    const response = await request(app)
      .post('/api/drivers')
      .send({
        name: 'John Doe',
        phone: '+1234567890',
        vehicle_type: 'car',
        status: 'available',
        current_location: { latitude: 40.7128, longitude: -74.0060 }
      })
      .expect(201);

    expect(response.body.name).toBe('John Doe');
    expect(response.body.phone).toBe('+1234567890');
  });

  test('should update driver location', async () => {
    const mockDriver = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'John Doe',
      phone: '+1234567890',
      vehicle_type: 'car',
      status: 'available',
      current_location: { latitude: 40.7128, longitude: -74.0060 }
    };

    // Mock the database responses
    require('../../src/database/db').client.query
      .mockResolvedValueOnce({ rows: [mockDriver] }) // Get driver by ID
      .mockResolvedValueOnce({ rows: [mockDriver] }) // Update driver location
      .mockResolvedValueOnce({ rows: [[]] }) // Store driver location history
      .mockResolvedValueOnce({ rows: [{}] }); // Store tracking data

    const response = await request(app)
      .put('/api/drivers/123e4567-e89b-12d3-a456-426614174000/location')
      .send({
        current_location: { latitude: 40.7128, longitude: -74.0060 }
      })
      .expect(200);

    expect(response.body.current_location.latitude).toBe(40.7128);
    expect(response.body.current_location.longitude).toBe(-74.0060);
  });

  test('should reject invalid location data', async () => {
    const response = await request(app)
      .put('/api/drivers/123e4567-e89b-12d3-a456-426614174000/location')
      .send({
        current_location: { latitude: 95, longitude: -74.0060 } // Invalid latitude
      })
      .expect(400);

    expect(response.body.error).toBe('Latitude must be between -90 and 90');
  });

  test('should update driver status', async () => {
    const mockDriver = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'John Doe',
      phone: '+1234567890',
      vehicle_type: 'car',
      status: 'busy',
      current_location: { latitude: 40.7128, longitude: -74.0060 }
    };

    // Mock the database responses
    require('../../src/database/db').client.query
      .mockResolvedValueOnce({ rows: [mockDriver] }) // Get driver by ID
      .mockResolvedValueOnce({ rows: [mockDriver] }); // Update driver status

    const response = await request(app)
      .put('/api/drivers/123e4567-e89b-12d3-a456-426614174000/status')
      .send({
        status: 'busy'
      })
      .expect(200);

    expect(response.body.status).toBe('busy');
  });

  test('should reject invalid status', async () => {
    const response = await request(app)
      .put('/api/drivers/123e4567-e89b-12d3-a456-426614174000/status')
      .send({
        status: 'invalid-status'
      })
      .expect(400);

    expect(response.body.error).toBe('Invalid status. Must be one of: available, busy, offline');
  });
});