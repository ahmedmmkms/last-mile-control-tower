// COD Model Unit Tests
const COD = require('../src/backend/models/codModel');
const { query } = require('../src/database/db');

// Mock the database query function
jest.mock('../src/database/db', () => ({
  query: jest.fn()
}));

describe('COD Model', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('createCodPayment', () => {
    it('should create a new COD payment', async () => {
      const mockCodData = {
        shipment_id: '123e4567-e89b-12d3-a456-426614174000',
        driver_id: '123e4567-e89b-12d3-a456-426614174001',
        amount: 100.50,
        currency: 'EGP',
        status: 'pending'
      };

      const mockResult = {
        rows: [{
          id: '123e4567-e89b-12d3-a456-426614174002',
          ...mockCodData,
          created_at: new Date(),
          updated_at: new Date()
        }]
      };

      query.mockResolvedValue(mockResult);

      const result = await COD.createCodPayment(mockCodData);

      expect(query).toHaveBeenCalledWith(expect.any(String), [
        mockCodData.shipment_id,
        mockCodData.driver_id,
        mockCodData.amount,
        mockCodData.currency,
        mockCodData.status,
        undefined,
        undefined,
        undefined
      ]);
      expect(result).toEqual(mockResult.rows[0]);
    });
  });

  describe('getCodPaymentById', () => {
    it('should retrieve a COD payment by ID', async () => {
      const mockId = '123e4567-e89b-12d3-a456-426614174000';
      const mockResult = {
        rows: [{
          id: mockId,
          shipment_id: '123e4567-e89b-12d3-a456-426614174001',
          amount: 100.50,
          currency: 'EGP',
          status: 'pending'
        }]
      };

      query.mockResolvedValue(mockResult);

      const result = await COD.getCodPaymentById(mockId);

      expect(query).toHaveBeenCalledWith(expect.any(String), [mockId]);
      expect(result).toEqual(mockResult.rows[0]);
    });

    it('should return undefined if COD payment not found', async () => {
      const mockId = '123e4567-e89b-12d3-a456-426614174000';
      const mockResult = { rows: [] };

      query.mockResolvedValue(mockResult);

      const result = await COD.getCodPaymentById(mockId);

      expect(result).toBeUndefined();
    });
  });

  describe('getCodPaymentByShipmentId', () => {
    it('should retrieve a COD payment by shipment ID', async () => {
      const mockShipmentId = '123e4567-e89b-12d3-a456-426614174000';
      const mockResult = {
        rows: [{
          id: '123e4567-e89b-12d3-a456-426614174001',
          shipment_id: mockShipmentId,
          amount: 100.50,
          currency: 'EGP',
          status: 'pending'
        }]
      };

      query.mockResolvedValue(mockResult);

      const result = await COD.getCodPaymentByShipmentId(mockShipmentId);

      expect(query).toHaveBeenCalledWith(expect.any(String), [mockShipmentId]);
      expect(result).toEqual(mockResult.rows[0]);
    });
  });

  describe('getAllCodPayments', () => {
    it('should retrieve all COD payments', async () => {
      const mockResult = {
        rows: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            shipment_id: '123e4567-e89b-12d3-a456-426614174001',
            amount: 100.50,
            currency: 'EGP',
            status: 'pending'
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174002',
            shipment_id: '123e4567-e89b-12d3-a456-426614174003',
            amount: 200.75,
            currency: 'EGP',
            status: 'collected'
          }
        ]
      };

      query.mockResolvedValue(mockResult);

      const result = await COD.getAllCodPayments();

      expect(query).toHaveBeenCalledWith(expect.any(String), []);
      expect(result).toEqual(mockResult.rows);
    });

    it('should filter COD payments by status', async () => {
      const mockResult = {
        rows: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            shipment_id: '123e4567-e89b-12d3-a456-426614174001',
            amount: 100.50,
            currency: 'EGP',
            status: 'collected'
          }
        ]
      };

      query.mockResolvedValue(mockResult);

      const result = await COD.getAllCodPayments({ status: 'collected' });

      expect(query).toHaveBeenCalledWith(expect.any(String), ['collected']);
      expect(result).toEqual(mockResult.rows);
    });
  });

  describe('updateCodPaymentStatus', () => {
    it('should update COD payment status', async () => {
      const mockId = '123e4567-e89b-12d3-a456-426614174000';
      const mockStatus = 'collected';
      const mockResult = {
        rows: [{
          id: mockId,
          shipment_id: '123e4567-e89b-12d3-a456-426614174001',
          amount: 100.50,
          currency: 'EGP',
          status: mockStatus,
          updated_at: new Date()
        }]
      };

      query.mockResolvedValue(mockResult);

      const result = await COD.updateCodPaymentStatus(mockId, mockStatus);

      expect(query).toHaveBeenCalledWith(expect.any(String), [mockStatus, mockId]);
      expect(result).toEqual(mockResult.rows[0]);
    });
  });

  describe('updateShipmentCodStatus', () => {
    it('should update shipment COD status', async () => {
      const mockShipmentId = '123e4567-e89b-12d3-a456-426614174000';
      const mockCodStatus = 'collected';
      const mockResult = {
        rows: [{
          id: mockShipmentId,
          cod_status: mockCodStatus,
          updated_at: new Date()
        }]
      };

      query.mockResolvedValue(mockResult);

      const result = await COD.updateShipmentCodStatus(mockShipmentId, mockCodStatus);

      expect(query).toHaveBeenCalledWith(expect.any(String), [mockCodStatus, mockShipmentId]);
      expect(result).toEqual(mockResult.rows[0]);
    });
  });

  describe('getCodSummary', () => {
    it('should retrieve COD summary statistics', async () => {
      const mockResult = {
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

      query.mockResolvedValue(mockResult);

      const result = await COD.getCodSummary();

      expect(query).toHaveBeenCalledWith(expect.any(String), []);
      expect(result).toEqual(mockResult.rows[0]);
    });
  });

  describe('getCodPaymentsByDriver', () => {
    it('should retrieve COD payments by driver', async () => {
      const mockDriverId = '123e4567-e89b-12d3-a456-426614174000';
      const mockResult = {
        rows: [
          {
            id: '123e4567-e89b-12d3-a456-426614174001',
            shipment_id: '123e4567-e89b-12d3-a456-426614174002',
            amount: 100.50,
            currency: 'EGP',
            status: 'pending',
            tracking_number: 'TRK001',
            destination: { address: '123 Main St' }
          }
        ]
      };

      query.mockResolvedValue(mockResult);

      const result = await COD.getCodPaymentsByDriver(mockDriverId);

      expect(query).toHaveBeenCalledWith(expect.any(String), [mockDriverId]);
      expect(result).toEqual(mockResult.rows);
    });
  });
});