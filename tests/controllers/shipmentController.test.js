// Shipment Controller Unit Tests
const { getAllShipments, getShipmentById, createShipment, updateShipment, deleteShipment } = require('../../src/backend/controllers/shipmentController');

// Mock the database model functions
jest.mock('../../src/backend/models/shipmentModel', () => ({
  getAllShipments: jest.fn(),
  getShipmentById: jest.fn(),
  createShipment: jest.fn(),
  updateShipment: jest.fn(),
  deleteShipment: jest.fn()
}));

const ShipmentModel = require('../../src/backend/models/shipmentModel');

describe('Shipment Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getAllShipments', () => {
    it('should return all shipments', async () => {
      const mockShipments = [
        { id: '1', tracking_number: 'TRK001' },
        { id: '2', tracking_number: 'TRK002' }
      ];
      
      ShipmentModel.getAllShipments.mockResolvedValue(mockShipments);
      
      await getAllShipments(req, res);
      
      expect(ShipmentModel.getAllShipments).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockShipments);
    });

    it('should handle errors when fetching shipments', async () => {
      ShipmentModel.getAllShipments.mockRejectedValue(new Error('Database error'));
      
      await getAllShipments(req, res);
      
      expect(ShipmentModel.getAllShipments).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('getShipmentById', () => {
    it('should return a shipment by ID', async () => {
      const mockShipment = { id: '1', tracking_number: 'TRK001' };
      req.params.id = '1';
      
      ShipmentModel.getShipmentById.mockResolvedValue(mockShipment);
      
      await getShipmentById(req, res);
      
      expect(ShipmentModel.getShipmentById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockShipment);
    });

    it('should return 404 if shipment is not found', async () => {
      req.params.id = '1';
      
      ShipmentModel.getShipmentById.mockResolvedValue(null);
      
      await getShipmentById(req, res);
      
      expect(ShipmentModel.getShipmentById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Shipment not found' });
    });

    it('should handle errors when fetching a shipment', async () => {
      req.params.id = '1';
      
      ShipmentModel.getShipmentById.mockRejectedValue(new Error('Database error'));
      
      await getShipmentById(req, res);
      
      expect(ShipmentModel.getShipmentById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('createShipment', () => {
    it('should create a new shipment', async () => {
      const mockShipment = { id: '1', tracking_number: 'TRK001' };
      req.body = { tracking_number: 'TRK001' };
      
      ShipmentModel.createShipment.mockResolvedValue(mockShipment);
      
      await createShipment(req, res);
      
      expect(ShipmentModel.createShipment).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockShipment);
    });

    it('should handle errors when creating a shipment', async () => {
      req.body = { tracking_number: 'TRK001' };
      
      ShipmentModel.createShipment.mockRejectedValue(new Error('Database error'));
      
      await createShipment(req, res);
      
      expect(ShipmentModel.createShipment).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('updateShipment', () => {
    it('should update an existing shipment', async () => {
      const mockExistingShipment = { id: '1', tracking_number: 'TRK001' };
      const mockUpdatedShipment = { id: '1', tracking_number: 'TRK001-UPDATED' };
      
      req.params.id = '1';
      req.body = { tracking_number: 'TRK001-UPDATED' };
      
      ShipmentModel.getShipmentById.mockResolvedValue(mockExistingShipment);
      ShipmentModel.updateShipment.mockResolvedValue(mockUpdatedShipment);
      
      await updateShipment(req, res);
      
      expect(ShipmentModel.getShipmentById).toHaveBeenCalledWith('1');
      expect(ShipmentModel.updateShipment).toHaveBeenCalledWith('1', req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUpdatedShipment);
    });

    it('should return 404 if shipment to update is not found', async () => {
      req.params.id = '1';
      req.body = { tracking_number: 'TRK001-UPDATED' };
      
      ShipmentModel.getShipmentById.mockResolvedValue(null);
      
      await updateShipment(req, res);
      
      expect(ShipmentModel.getShipmentById).toHaveBeenCalledWith('1');
      expect(ShipmentModel.updateShipment).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Shipment not found' });
    });

    it('should handle errors when updating a shipment', async () => {
      const mockExistingShipment = { id: '1', tracking_number: 'TRK001' };
      
      req.params.id = '1';
      req.body = { tracking_number: 'TRK001-UPDATED' };
      
      ShipmentModel.getShipmentById.mockResolvedValue(mockExistingShipment);
      ShipmentModel.updateShipment.mockRejectedValue(new Error('Database error'));
      
      await updateShipment(req, res);
      
      expect(ShipmentModel.getShipmentById).toHaveBeenCalledWith('1');
      expect(ShipmentModel.updateShipment).toHaveBeenCalledWith('1', req.body);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('deleteShipment', () => {
    it('should delete a shipment', async () => {
      const mockExistingShipment = { id: '1', tracking_number: 'TRK001' };
      const mockDeletedShipment = { id: '1', tracking_number: 'TRK001' };
      
      req.params.id = '1';
      
      ShipmentModel.getShipmentById.mockResolvedValue(mockExistingShipment);
      ShipmentModel.deleteShipment.mockResolvedValue(mockDeletedShipment);
      
      await deleteShipment(req, res);
      
      expect(ShipmentModel.getShipmentById).toHaveBeenCalledWith('1');
      expect(ShipmentModel.deleteShipment).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockDeletedShipment);
    });

    it('should return 404 if shipment to delete is not found', async () => {
      req.params.id = '1';
      
      ShipmentModel.getShipmentById.mockResolvedValue(null);
      
      await deleteShipment(req, res);
      
      expect(ShipmentModel.getShipmentById).toHaveBeenCalledWith('1');
      expect(ShipmentModel.deleteShipment).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Shipment not found' });
    });

    it('should handle errors when deleting a shipment', async () => {
      const mockExistingShipment = { id: '1', tracking_number: 'TRK001' };
      
      req.params.id = '1';
      
      ShipmentModel.getShipmentById.mockResolvedValue(mockExistingShipment);
      ShipmentModel.deleteShipment.mockRejectedValue(new Error('Database error'));
      
      await deleteShipment(req, res);
      
      expect(ShipmentModel.getShipmentById).toHaveBeenCalledWith('1');
      expect(ShipmentModel.deleteShipment).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });
});