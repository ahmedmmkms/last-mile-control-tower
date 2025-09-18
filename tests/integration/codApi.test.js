// COD API Integration Tests
const request = require('supertest');
const { app } = require('../../index');
const { query } = require('../../src/database/db');

// Mock the database query function
jest.mock('../../src/database/db', () => ({
  query: jest.fn(),
  connect: jest.fn().mockResolvedValue(),
  disconnect: jest.fn().mockResolvedValue()
}));

describe('COD API Integration Tests', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('POST /api/cod', () => {
    it('should create a new COD payment', async () => {
      const mockShipment = {
        rows: [{
          id: '123e4567-e89b-12d3-a456-426614174000',
          tracking_number: 'TRK001'
        }]
      };
      
      const mockCodPayment = {
        rows: [{
          id: '123e4567-e89b-12d3-a456-426614174001',
          shipment_id: '123e4567-e89b-12d3-a456-426614174000',
          amount: 100.50,
          currency: 'EGP',
          status: 'pending',
          created_at: new Date(),
          updated_at: new Date()
        }]
      };

      query
        .mockResolvedValueOnce(mockShipment) // For shipment check
        .mockResolvedValueOnce(mockCodPayment) // For COD creation
        .mockResolvedValueOnce({ rows: [{ id: '123e4567-e89b-12d3-a456-426614174000', cod_status: 'pending' }] }); // For shipment update

      const response = await request(app)
        .post('/api/cod')
        .send({
          shipment_id: '123e4567-e89b-12d3-a456-426614174000',
          amount: 100.50
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.amount).toBe(100.50);
      expect(response.body.status).toBe('pending');
    });

    it('should return 400 if shipment_id is missing', async () => {
      const response = await request(app)
        .post('/api/cod')
        .send({
          amount: 100.50
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('shipment_id and amount are required');
    });

    it('should return 400 if amount is missing', async () => {
      const response = await request(app)
        .post('/api/cod')
        .send({
          shipment_id: '123e4567-e89b-12d3-a456-426614174000'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('shipment_id and amount are required');
    });

    it('should return 400 if shipment_id is invalid', async () => {
      const response = await request(app)
        .post('/api/cod')
        .send({
          shipment_id: 'invalid-id',
          amount: 100.50
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Invalid shipment ID format');
    });

    it('should return 404 if shipment not found', async () => {
      query.mockResolvedValueOnce({ rows: [] }); // For shipment check

      const response = await request(app)
        .post('/api/cod')
        .send({
          shipment_id: '123e4567-e89b-12d3-a456-426614174000',
          amount: 100.50
        })
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Shipment not found');
    });
  });

  describe('GET /api/cod/:id', () => {
    it('should retrieve a COD payment by ID', async () => {
      const mockCodPayment = {
        rows: [{
          id: '123e4567-e89b-12d3-a456-426614174000',
          shipment_id: '123e4567-e89b-12d3-a456-426614174001',
          amount: 100.50,
          currency: 'EGP',
          status: 'pending',
          created_at: new Date(),
          updated_at: new Date()
        }]
      };

      query.mockResolvedValueOnce(mockCodPayment);

      const response = await request(app)
        .get('/api/cod/123e4567-e89b-12d3-a456-426614174000')
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.amount).toBe(100.50);
      expect(response.body.status).toBe('pending');
    });

    it('should return 400 if ID is invalid', async () => {
      const response = await request(app)
        .get('/api/cod/invalid-id')
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Invalid COD payment ID format');
    });

    it('should return 404 if COD payment not found', async () => {
      query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/api/cod/123e4567-e89b-12d3-a456-426614174000')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('COD payment not found');
    });
  });

  describe('GET /api/cod/shipment/:shipmentId', () => {
    it('should retrieve a COD payment by shipment ID', async () => {
      const mockCodPayment = {
        rows: [{
          id: '123e4567-e89b-12d3-a456-426614174000',
          shipment_id: '123e4567-e89b-12d3-a456-426614174001',
          amount: 100.50,
          currency: 'EGP',
          status: 'pending',
          created_at: new Date(),
          updated_at: new Date()
        }]
      };

      query.mockResolvedValueOnce(mockCodPayment);

      const response = await request(app)
        .get('/api/cod/shipment/123e4567-e89b-12d3-a456-426614174001')
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.shipment_id).toBe('123e4567-e89b-12d3-a456-426614174001');
      expect(response.body.amount).toBe(100.50);
    });

    it('should return 400 if shipment ID is invalid', async () => {
      const response = await request(app)
        .get('/api/cod/shipment/invalid-id')
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Invalid shipment ID format');
    });

    it('should return 404 if COD payment not found for shipment', async () => {
      query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/api/cod/shipment/123e4567-e89b-12d3-a456-426614174001')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('COD payment not found for this shipment');
    });
  });

  describe('GET /api/cod', () => {
    it('should retrieve all COD payments', async () => {
      const mockCodPayments = {
        rows: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            shipment_id: '123e4567-e89b-12d3-a456-426614174001',
            amount: 100.50,
            currency: 'EGP',
            status: 'pending',
            created_at: new Date(),
            updated_at: new Date()
          }
        ]
      };

      query.mockResolvedValueOnce(mockCodPayments);

      const response = await request(app)
        .get('/api/cod')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].amount).toBe(100.50);
    });

    it('should filter COD payments by status', async () => {
      const mockCodPayments = {
        rows: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            shipment_id: '123e4567-e89b-12d3-a456-426614174001',
            amount: 100.50,
            currency: 'EGP',
            status: 'collected',
            created_at: new Date(),
            updated_at: new Date()
          }
        ]
      };

      query.mockResolvedValueOnce(mockCodPayments);

      const response = await request(app)
        .get('/api/cod?status=collected')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0].status).toBe('collected');
    });
  });

  describe('PUT /api/cod/:id/status', () => {
    it('should update COD payment status', async () => {
      // Mock the existing COD payment
      query.mockResolvedValueOnce({
        rows: [{
          id: '123e4567-e89b-12d3-a456-426614174000',
          shipment_id: '123e4567-e89b-12d3-a456-426614174001',
          amount: 100.50,
          status: 'pending'
        }]
      });
      
      // Mock the updated COD payment
      const mockUpdatedCodPayment = {
        rows: [{
          id: '123e4567-e89b-12d3-a456-426614174000',
          shipment_id: '123e4567-e89b-12d3-a456-426614174001',
          amount: 100.50,
          status: 'collected',
          updated_at: new Date()
        }]
      };
      
      query
        .mockResolvedValueOnce({ rows: [{ id: '123e4567-e89b-12d3-a456-426614174000', shipment_id: '123e4567-e89b-12d3-a456-426614174001' }] }) // For COD payment check
        .mockResolvedValueOnce(mockUpdatedCodPayment) // For COD payment update
        .mockResolvedValueOnce({ rows: [{ id: '123e4567-e89b-12d3-a456-426614174001', cod_status: 'collected' }] }); // For shipment update

      const response = await request(app)
        .put('/api/cod/123e4567-e89b-12d3-a456-426614174000/status')
        .send({ status: 'collected' })
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.status).toBe('collected');
    });

    it('should return 400 if ID is invalid', async () => {
      const response = await request(app)
        .put('/api/cod/invalid-id/status')
        .send({ status: 'collected' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Invalid COD payment ID format');
    });

    it('should return 400 if status is invalid', async () => {
      // Mock the existing COD payment
      query.mockResolvedValueOnce({
        rows: [{
          id: '123e4567-e89b-12d3-a456-426614174000',
          shipment_id: '123e4567-e89b-12d3-a456-426614174001',
          amount: 100.50,
          status: 'pending'
        }]
      });

      const response = await request(app)
        .put('/api/cod/123e4567-e89b-12d3-a456-426614174000/status')
        .send({ status: 'invalid-status' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Invalid status. Must be one of: pending, collected, reconciled, failed');
    });

    it('should return 404 if COD payment not found', async () => {
      query.mockResolvedValueOnce({ rows: [] }); // For COD payment check

      const response = await request(app)
        .put('/api/cod/123e4567-e89b-12d3-a456-426614174000/status')
        .send({ status: 'collected' })
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('COD payment not found');
    });
  });

  describe('GET /api/cod/summary', () => {
    it('should retrieve COD summary statistics', async () => {
      const mockSummary = {
        rows: [{
          total_payments: '2',
          total_amount: '301.25',
          collected_count: '1',
          collected_amount: '200.75',
          reconciled_count: '0',
          reconciled_amount: '0.00',
          pending_count: '1',
          pending_amount: '100.50'
        }]
      };

      query.mockResolvedValueOnce(mockSummary);

      const response = await request(app)
        .get('/api/cod/summary')
        .expect(200);

      expect(response.body).toHaveProperty('total_payments');
      expect(response.body).toHaveProperty('total_amount');
      expect(response.body).toHaveProperty('collected_count');
      expect(response.body).toHaveProperty('collected_amount');
    });
  });

  describe('GET /api/cod/driver/:driverId', () => {
    it('should retrieve COD payments by driver', async () => {
      const mockCodPayments = {
        rows: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            shipment_id: '123e4567-e89b-12d3-a456-426614174001',
            amount: 100.50,
            currency: 'EGP',
            status: 'pending',
            tracking_number: 'TRK001',
            destination: { address: '123 Main St' }
          }
        ]
      };

      query.mockResolvedValueOnce(mockCodPayments);

      const response = await request(app)
        .get('/api/cod/driver/123e4567-e89b-12d3-a456-426614174002')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0]).toHaveProperty('tracking_number');
      expect(response.body[0]).toHaveProperty('destination');
    });

    it('should return 400 if driver ID is invalid', async () => {
      const response = await request(app)
        .get('/api/cod/driver/invalid-id')
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Invalid driver ID format');
    });
  });
});}