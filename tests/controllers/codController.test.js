// COD Controller Unit Tests
const codController = require('../../src/backend/controllers/codController');
const COD = require('../../src/backend/models/codModel');
const Shipment = require('../../src/backend/models/shipmentModel');

// Mock the models
jest.mock('../../src/backend/models/codModel');
jest.mock('../../src/backend/models/shipmentModel');

describe('COD Controller', () => {
  let req, res;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Setup mock request and response objects
    req = {
      params: {},
      body: {},
      query: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('createCodPayment', () => {
    it('should create a new COD payment successfully', async () => {
      const mockCodData = {
        shipment_id: '123e4567-e89b-12d3-a456-426614174000',
        amount: 100.50
      };
      
      const mockShipment = {
        id: mockCodData.shipment_id,
        tracking_number: 'TRK001'
      };
      
      const mockCodPayment = {
        id: '123e4567-e89b-12d3-a456-426614174001',
        ...mockCodData,
        status: 'pending'
      };

      req.body = mockCodData;
      Shipment.getShipmentById.mockResolvedValue(mockShipment);
      COD.createCodPayment.mockResolvedValue(mockCodPayment);
      COD.updateShipmentCodStatus.mockResolvedValue({ ...mockShipment, cod_status: 'pending' });

      await codController.createCodPayment(req, res);

      expect(Shipment.getShipmentById).toHaveBeenCalledWith(mockCodData.shipment_id);
      expect(COD.createCodPayment).toHaveBeenCalledWith(mockCodData);
      expect(COD.updateShipmentCodStatus).toHaveBeenCalledWith(mockCodData.shipment_id, 'pending');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockCodPayment);
    });

    it('should return 400 if shipment_id is missing', async () => {
      req.body = { amount: 100.50 };

      await codController.createCodPayment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'shipment_id and amount are required' });
    });

    it('should return 400 if amount is missing', async () => {
      req.body = { shipment_id: '123e4567-e89b-12d3-a456-426614174000' };

      await codController.createCodPayment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'shipment_id and amount are required' });
    });

    it('should return 400 if shipment_id is invalid', async () => {
      req.body = { shipment_id: 'invalid-id', amount: 100.50 };

      await codController.createCodPayment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid shipment ID format' });
    });

    it('should return 404 if shipment not found', async () => {
      req.body = {
        shipment_id: '123e4567-e89b-12d3-a456-426614174000',
        amount: 100.50
      };
      
      Shipment.getShipmentById.mockResolvedValue(null);

      await codController.createCodPayment(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Shipment not found' });
    });

    it('should return 400 if driver_id is invalid', async () => {
      req.body = {
        shipment_id: '123e4567-e89b-12d3-a456-426614174000',
        amount: 100.50,
        driver_id: 'invalid-id'
      };
      
      const mockShipment = { id: req.body.shipment_id };
      Shipment.getShipmentById.mockResolvedValue(mockShipment);

      await codController.createCodPayment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid driver ID format' });
    });

    it('should return 400 if amount is not a positive number', async () => {
      req.body = {
        shipment_id: '123e4567-e89b-12d3-a456-426614174000',
        amount: -50
      };
      
      const mockShipment = { id: req.body.shipment_id };
      Shipment.getShipmentById.mockResolvedValue(mockShipment);

      await codController.createCodPayment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Amount must be a positive number' });
    });

    it('should return 500 if there is a server error', async () => {
      req.body = {
        shipment_id: '123e4567-e89b-12d3-a456-426614174000',
        amount: 100.50
      };
      
      Shipment.getShipmentById.mockRejectedValue(new Error('Database error'));

      await codController.createCodPayment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('getCodPaymentById', () => {
    it('should retrieve a COD payment by ID successfully', async () => {
      const mockId = '123e4567-e89b-12d3-a456-426614174000';
      const mockCodPayment = {
        id: mockId,
        shipment_id: '123e4567-e89b-12d3-a456-426614174001',
        amount: 100.50,
        status: 'pending'
      };

      req.params = { id: mockId };
      COD.getCodPaymentById.mockResolvedValue(mockCodPayment);

      await codController.getCodPaymentById(req, res);

      expect(COD.getCodPaymentById).toHaveBeenCalledWith(mockId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCodPayment);
    });

    it('should return 400 if ID is invalid', async () => {
      req.params = { id: 'invalid-id' };

      await codController.getCodPaymentById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid COD payment ID format' });
    });

    it('should return 404 if COD payment not found', async () => {
      const mockId = '123e4567-e89b-12d3-a456-426614174000';
      
      req.params = { id: mockId };
      COD.getCodPaymentById.mockResolvedValue(undefined);

      await codController.getCodPaymentById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'COD payment not found' });
    });

    it('should return 500 if there is a server error', async () => {
      const mockId = '123e4567-e89b-12d3-a456-426614174000';
      
      req.params = { id: mockId };
      COD.getCodPaymentById.mockRejectedValue(new Error('Database error'));

      await codController.getCodPaymentById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('getCodPaymentByShipmentId', () => {
    it('should retrieve a COD payment by shipment ID successfully', async () => {
      const mockShipmentId = '123e4567-e89b-12d3-a456-426614174000';
      const mockCodPayment = {
        id: '123e4567-e89b-12d3-a456-426614174001',
        shipment_id: mockShipmentId,
        amount: 100.50,
        status: 'pending'
      };

      req.params = { shipmentId: mockShipmentId };
      COD.getCodPaymentByShipmentId.mockResolvedValue(mockCodPayment);

      await codController.getCodPaymentByShipmentId(req, res);

      expect(COD.getCodPaymentByShipmentId).toHaveBeenCalledWith(mockShipmentId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCodPayment);
    });

    it('should return 400 if shipment ID is invalid', async () => {
      req.params = { shipmentId: 'invalid-id' };

      await codController.getCodPaymentByShipmentId(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid shipment ID format' });
    });

    it('should return 404 if COD payment not found for shipment', async () => {
      const mockShipmentId = '123e4567-e89b-12d3-a456-426614174000';
      
      req.params = { shipmentId: mockShipmentId };
      COD.getCodPaymentByShipmentId.mockResolvedValue(undefined);

      await codController.getCodPaymentByShipmentId(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'COD payment not found for this shipment' });
    });

    it('should return 500 if there is a server error', async () => {
      const mockShipmentId = '123e4567-e89b-12d3-a456-426614174000';
      
      req.params = { shipmentId: mockShipmentId };
      COD.getCodPaymentByShipmentId.mockRejectedValue(new Error('Database error'));

      await codController.getCodPaymentByShipmentId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('getAllCodPayments', () => {
    it('should retrieve all COD payments successfully', async () => {
      const mockCodPayments = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          shipment_id: '123e4567-e89b-12d3-a456-426614174001',
          amount: 100.50,
          status: 'pending'
        }
      ];

      COD.getAllCodPayments.mockResolvedValue(mockCodPayments);

      await codController.getAllCodPayments(req, res);

      expect(COD.getAllCodPayments).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCodPayments);
    });

    it('should filter COD payments by status', async () => {
      const mockCodPayments = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          shipment_id: '123e4567-e89b-12d3-a456-426614174001',
          amount: 100.50,
          status: 'collected'
        }
      ];

      req.query = { status: 'collected' };
      COD.getAllCodPayments.mockResolvedValue(mockCodPayments);

      await codController.getAllCodPayments(req, res);

      expect(COD.getAllCodPayments).toHaveBeenCalledWith({ status: 'collected' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCodPayments);
    });

    it('should return 500 if there is a server error', async () => {
      COD.getAllCodPayments.mockRejectedValue(new Error('Database error'));

      await codController.getAllCodPayments(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('updateCodPaymentStatus', () => {
    it('should update COD payment status successfully', async () => {
      const mockId = '123e4567-e89b-12d3-a456-426614174000';
      const mockStatus = 'collected';
      const mockCodPayment = {
        id: mockId,
        shipment_id: '123e4567-e89b-12d3-a456-426614174001',
        amount: 100.50,
        status: mockStatus
      };

      req.params = { id: mockId };
      req.body = { status: mockStatus };
      COD.getCodPaymentById.mockResolvedValue({ id: mockId, shipment_id: '123e4567-e89b-12d3-a456-426614174001' });
      COD.updateCodPaymentStatus.mockResolvedValue(mockCodPayment);
      COD.updateShipmentCodStatus.mockResolvedValue({ id: '123e4567-e89b-12d3-a456-426614174001', cod_status: mockStatus });

      await codController.updateCodPaymentStatus(req, res);

      expect(COD.getCodPaymentById).toHaveBeenCalledWith(mockId);
      expect(COD.updateCodPaymentStatus).toHaveBeenCalledWith(mockId, mockStatus, {});
      expect(COD.updateShipmentCodStatus).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174001', mockStatus);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCodPayment);
    });

    it('should return 400 if ID is invalid', async () => {
      req.params = { id: 'invalid-id' };

      await codController.updateCodPaymentStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid COD payment ID format' });
    });

    it('should return 400 if status is invalid', async () => {
      const mockId = '123e4567-e89b-12d3-a456-426614174000';
      
      req.params = { id: mockId };
      req.body = { status: 'invalid-status' };
      COD.getCodPaymentById.mockResolvedValue({ id: mockId });

      await codController.updateCodPaymentStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid status. Must be one of: pending, collected, reconciled, failed' });
    });

    it('should return 404 if COD payment not found', async () => {
      const mockId = '123e4567-e89b-12d3-a456-426614174000';
      
      req.params = { id: mockId };
      req.body = { status: 'collected' };
      COD.getCodPaymentById.mockResolvedValue(undefined);

      await codController.updateCodPaymentStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'COD payment not found' });
    });

    it('should return 500 if there is a server error', async () => {
      const mockId = '123e4567-e89b-12d3-a456-426614174000';
      
      req.params = { id: mockId };
      req.body = { status: 'collected' };
      COD.getCodPaymentById.mockRejectedValue(new Error('Database error'));

      await codController.updateCodPaymentStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('getCodSummary', () => {
    it('should retrieve COD summary successfully', async () => {
      const mockSummary = {
        total_payments: '2',
        total_amount: '301.25',
        collected_count: '1',
        collected_amount: '200.75'
      };

      COD.getCodSummary.mockResolvedValue(mockSummary);

      await codController.getCodSummary(req, res);

      expect(COD.getCodSummary).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockSummary);
    });

    it('should return 500 if there is a server error', async () => {
      COD.getCodSummary.mockRejectedValue(new Error('Database error'));

      await codController.getCodSummary(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('getCodPaymentsByDriver', () => {
    it('should retrieve COD payments by driver successfully', async () => {
      const mockDriverId = '123e4567-e89b-12d3-a456-426614174000';
      const mockCodPayments = [
        {
          id: '123e4567-e89b-12d3-a456-426614174001',
          shipment_id: '123e4567-e89b-12d3-a456-426614174002',
          amount: 100.50,
          status: 'pending',
          tracking_number: 'TRK001',
          destination: { address: '123 Main St' }
        }
      ];

      req.params = { driverId: mockDriverId };
      COD.getCodPaymentsByDriver.mockResolvedValue(mockCodPayments);

      await codController.getCodPaymentsByDriver(req, res);

      expect(COD.getCodPaymentsByDriver).toHaveBeenCalledWith(mockDriverId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCodPayments);
    });

    it('should return 400 if driver ID is invalid', async () => {
      req.params = { driverId: 'invalid-id' };

      await codController.getCodPaymentsByDriver(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid driver ID format' });
    });

    it('should return 500 if there is a server error', async () => {
      const mockDriverId = '123e4567-e89b-12d3-a456-426614174000';
      
      req.params = { driverId: mockDriverId };
      COD.getCodPaymentsByDriver.mockRejectedValue(new Error('Database error'));

      await codController.getCodPaymentsByDriver(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });
});