// Driver Controller Unit Tests
const { getAllDrivers, getDriverById, createDriver, updateDriver, deleteDriver } = require('../../src/backend/controllers/driverController');

// Mock the database model functions
jest.mock('../../src/backend/models/driverModel', () => ({
  getAllDrivers: jest.fn(),
  getDriverById: jest.fn(),
  createDriver: jest.fn(),
  updateDriver: jest.fn(),
  deleteDriver: jest.fn()
}));

const DriverModel = require('../../src/backend/models/driverModel');

describe('Driver Controller', () => {
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

  describe('getAllDrivers', () => {
    it('should return all drivers', async () => {
      const mockDrivers = [
        { id: '1', name: 'Driver 1' },
        { id: '2', name: 'Driver 2' }
      ];
      
      DriverModel.getAllDrivers.mockResolvedValue(mockDrivers);
      
      await getAllDrivers(req, res);
      
      expect(DriverModel.getAllDrivers).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockDrivers);
    });

    it('should handle errors when fetching drivers', async () => {
      DriverModel.getAllDrivers.mockRejectedValue(new Error('Database error'));
      
      await getAllDrivers(req, res);
      
      expect(DriverModel.getAllDrivers).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('getDriverById', () => {
    it('should return a driver by ID', async () => {
      const mockDriver = { id: '1', name: 'Driver 1' };
      req.params.id = '1';
      
      DriverModel.getDriverById.mockResolvedValue(mockDriver);
      
      await getDriverById(req, res);
      
      expect(DriverModel.getDriverById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockDriver);
    });

    it('should return 404 if driver is not found', async () => {
      req.params.id = '1';
      
      DriverModel.getDriverById.mockResolvedValue(null);
      
      await getDriverById(req, res);
      
      expect(DriverModel.getDriverById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Driver not found' });
    });

    it('should handle errors when fetching a driver', async () => {
      req.params.id = '1';
      
      DriverModel.getDriverById.mockRejectedValue(new Error('Database error'));
      
      await getDriverById(req, res);
      
      expect(DriverModel.getDriverById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('createDriver', () => {
    it('should create a new driver', async () => {
      const mockDriver = { id: '1', name: 'Driver 1' };
      req.body = { name: 'Driver 1' };
      
      DriverModel.createDriver.mockResolvedValue(mockDriver);
      
      await createDriver(req, res);
      
      expect(DriverModel.createDriver).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockDriver);
    });

    it('should handle errors when creating a driver', async () => {
      req.body = { name: 'Driver 1' };
      
      DriverModel.createDriver.mockRejectedValue(new Error('Database error'));
      
      await createDriver(req, res);
      
      expect(DriverModel.createDriver).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('updateDriver', () => {
    it('should update an existing driver', async () => {
      const mockExistingDriver = { id: '1', name: 'Driver 1' };
      const mockUpdatedDriver = { id: '1', name: 'Updated Driver 1' };
      
      req.params.id = '1';
      req.body = { name: 'Updated Driver 1' };
      
      DriverModel.getDriverById.mockResolvedValue(mockExistingDriver);
      DriverModel.updateDriver.mockResolvedValue(mockUpdatedDriver);
      
      await updateDriver(req, res);
      
      expect(DriverModel.getDriverById).toHaveBeenCalledWith('1');
      expect(DriverModel.updateDriver).toHaveBeenCalledWith('1', req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUpdatedDriver);
    });

    it('should return 404 if driver to update is not found', async () => {
      req.params.id = '1';
      req.body = { name: 'Updated Driver 1' };
      
      DriverModel.getDriverById.mockResolvedValue(null);
      
      await updateDriver(req, res);
      
      expect(DriverModel.getDriverById).toHaveBeenCalledWith('1');
      expect(DriverModel.updateDriver).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Driver not found' });
    });

    it('should handle errors when updating a driver', async () => {
      const mockExistingDriver = { id: '1', name: 'Driver 1' };
      
      req.params.id = '1';
      req.body = { name: 'Updated Driver 1' };
      
      DriverModel.getDriverById.mockResolvedValue(mockExistingDriver);
      DriverModel.updateDriver.mockRejectedValue(new Error('Database error'));
      
      await updateDriver(req, res);
      
      expect(DriverModel.getDriverById).toHaveBeenCalledWith('1');
      expect(DriverModel.updateDriver).toHaveBeenCalledWith('1', req.body);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('deleteDriver', () => {
    it('should delete a driver', async () => {
      const mockExistingDriver = { id: '1', name: 'Driver 1' };
      const mockDeletedDriver = { id: '1', name: 'Driver 1' };
      
      req.params.id = '1';
      
      DriverModel.getDriverById.mockResolvedValue(mockExistingDriver);
      DriverModel.deleteDriver.mockResolvedValue(mockDeletedDriver);
      
      await deleteDriver(req, res);
      
      expect(DriverModel.getDriverById).toHaveBeenCalledWith('1');
      expect(DriverModel.deleteDriver).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockDeletedDriver);
    });

    it('should return 404 if driver to delete is not found', async () => {
      req.params.id = '1';
      
      DriverModel.getDriverById.mockResolvedValue(null);
      
      await deleteDriver(req, res);
      
      expect(DriverModel.getDriverById).toHaveBeenCalledWith('1');
      expect(DriverModel.deleteDriver).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Driver not found' });
    });

    it('should handle errors when deleting a driver', async () => {
      const mockExistingDriver = { id: '1', name: 'Driver 1' };
      
      req.params.id = '1';
      
      DriverModel.getDriverById.mockResolvedValue(mockExistingDriver);
      DriverModel.deleteDriver.mockRejectedValue(new Error('Database error'));
      
      await deleteDriver(req, res);
      
      expect(DriverModel.getDriverById).toHaveBeenCalledWith('1');
      expect(DriverModel.deleteDriver).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });
});