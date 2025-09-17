// Route Controller Unit Tests
const { getAllRoutes, getRouteById, createRoute, updateRoute, deleteRoute } = require('../../src/backend/controllers/routeController');

// Mock the database model functions
jest.mock('../../src/backend/models/routeModel', () => ({
  getAllRoutes: jest.fn(),
  getRouteById: jest.fn(),
  createRoute: jest.fn(),
  updateRoute: jest.fn(),
  deleteRoute: jest.fn()
}));

const RouteModel = require('../../src/backend/models/routeModel');

describe('Route Controller', () => {
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

  describe('getAllRoutes', () => {
    it('should return all routes', async () => {
      const mockRoutes = [
        { id: '1', shipment_id: '1' },
        { id: '2', shipment_id: '2' }
      ];
      
      RouteModel.getAllRoutes.mockResolvedValue(mockRoutes);
      
      await getAllRoutes(req, res);
      
      expect(RouteModel.getAllRoutes).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockRoutes);
    });

    it('should handle errors when fetching routes', async () => {
      RouteModel.getAllRoutes.mockRejectedValue(new Error('Database error'));
      
      await getAllRoutes(req, res);
      
      expect(RouteModel.getAllRoutes).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('getRouteById', () => {
    it('should return a route by ID', async () => {
      const mockRoute = { id: '1', shipment_id: '1' };
      req.params.id = '1';
      
      RouteModel.getRouteById.mockResolvedValue(mockRoute);
      
      await getRouteById(req, res);
      
      expect(RouteModel.getRouteById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockRoute);
    });

    it('should return 404 if route is not found', async () => {
      req.params.id = '1';
      
      RouteModel.getRouteById.mockResolvedValue(null);
      
      await getRouteById(req, res);
      
      expect(RouteModel.getRouteById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Route not found' });
    });

    it('should handle errors when fetching a route', async () => {
      req.params.id = '1';
      
      RouteModel.getRouteById.mockRejectedValue(new Error('Database error'));
      
      await getRouteById(req, res);
      
      expect(RouteModel.getRouteById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('createRoute', () => {
    it('should create a new route', async () => {
      const mockRoute = { id: '1', shipment_id: '1' };
      req.body = { shipment_id: '1' };
      
      RouteModel.createRoute.mockResolvedValue(mockRoute);
      
      await createRoute(req, res);
      
      expect(RouteModel.createRoute).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockRoute);
    });

    it('should handle errors when creating a route', async () => {
      req.body = { shipment_id: '1' };
      
      RouteModel.createRoute.mockRejectedValue(new Error('Database error'));
      
      await createRoute(req, res);
      
      expect(RouteModel.createRoute).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('updateRoute', () => {
    it('should update an existing route', async () => {
      const mockExistingRoute = { id: '1', shipment_id: '1' };
      const mockUpdatedRoute = { id: '1', shipment_id: '1-updated' };
      
      req.params.id = '1';
      req.body = { shipment_id: '1-updated' };
      
      RouteModel.getRouteById.mockResolvedValue(mockExistingRoute);
      RouteModel.updateRoute.mockResolvedValue(mockUpdatedRoute);
      
      await updateRoute(req, res);
      
      expect(RouteModel.getRouteById).toHaveBeenCalledWith('1');
      expect(RouteModel.updateRoute).toHaveBeenCalledWith('1', req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUpdatedRoute);
    });

    it('should return 404 if route to update is not found', async () => {
      req.params.id = '1';
      req.body = { shipment_id: '1-updated' };
      
      RouteModel.getRouteById.mockResolvedValue(null);
      
      await updateRoute(req, res);
      
      expect(RouteModel.getRouteById).toHaveBeenCalledWith('1');
      expect(RouteModel.updateRoute).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Route not found' });
    });

    it('should handle errors when updating a route', async () => {
      const mockExistingRoute = { id: '1', shipment_id: '1' };
      
      req.params.id = '1';
      req.body = { shipment_id: '1-updated' };
      
      RouteModel.getRouteById.mockResolvedValue(mockExistingRoute);
      RouteModel.updateRoute.mockRejectedValue(new Error('Database error'));
      
      await updateRoute(req, res);
      
      expect(RouteModel.getRouteById).toHaveBeenCalledWith('1');
      expect(RouteModel.updateRoute).toHaveBeenCalledWith('1', req.body);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('deleteRoute', () => {
    it('should delete a route', async () => {
      const mockExistingRoute = { id: '1', shipment_id: '1' };
      const mockDeletedRoute = { id: '1', shipment_id: '1' };
      
      req.params.id = '1';
      
      RouteModel.getRouteById.mockResolvedValue(mockExistingRoute);
      RouteModel.deleteRoute.mockResolvedValue(mockDeletedRoute);
      
      await deleteRoute(req, res);
      
      expect(RouteModel.getRouteById).toHaveBeenCalledWith('1');
      expect(RouteModel.deleteRoute).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockDeletedRoute);
    });

    it('should return 404 if route to delete is not found', async () => {
      req.params.id = '1';
      
      RouteModel.getRouteById.mockResolvedValue(null);
      
      await deleteRoute(req, res);
      
      expect(RouteModel.getRouteById).toHaveBeenCalledWith('1');
      expect(RouteModel.deleteRoute).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Route not found' });
    });

    it('should handle errors when deleting a route', async () => {
      const mockExistingRoute = { id: '1', shipment_id: '1' };
      
      req.params.id = '1';
      
      RouteModel.getRouteById.mockResolvedValue(mockExistingRoute);
      RouteModel.deleteRoute.mockRejectedValue(new Error('Database error'));
      
      await deleteRoute(req, res);
      
      expect(RouteModel.getRouteById).toHaveBeenCalledWith('1');
      expect(RouteModel.deleteRoute).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });
});