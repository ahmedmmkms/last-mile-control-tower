// Route Controller
const Route = require('../models/routeModel');
const { isValidUUID } = require('../utils/uuidValidator');

// Get all routes
async function getAllRoutes(req, res) {
  try {
    const routes = await Route.getAllRoutes();
    res.status(200).json(routes);
  } catch (error) {
    console.error('Error fetching routes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get route by ID
async function getRouteById(req, res) {
  try {
    const { id } = req.params;
    
    // Validate UUID format
    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid route ID format' });
    }
    
    const route = await Route.getRouteById(id);
    
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }
    
    res.status(200).json(route);
  } catch (error) {
    console.error('Error fetching route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Create a new route
async function createRoute(req, res) {
  try {
    const routeData = req.body;
    const route = await Route.createRoute(routeData);
    res.status(201).json(route);
  } catch (error) {
    console.error('Error creating route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Update a route
async function updateRoute(req, res) {
  try {
    const { id } = req.params;
    
    // Validate UUID format
    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid route ID format' });
    }
    
    const routeData = req.body;
    
    // Check if route exists
    const existingRoute = await Route.getRouteById(id);
    if (!existingRoute) {
      return res.status(404).json({ error: 'Route not found' });
    }
    
    const route = await Route.updateRoute(id, routeData);
    res.status(200).json(route);
  } catch (error) {
    console.error('Error updating route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Delete a route
async function deleteRoute(req, res) {
  try {
    const { id } = req.params;
    
    // Validate UUID format
    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid route ID format' });
    }
    
    // Check if route exists
    const existingRoute = await Route.getRouteById(id);
    if (!existingRoute) {
      return res.status(404).json({ error: 'Route not found' });
    }
    
    const route = await Route.deleteRoute(id);
    res.status(200).json(route);
  } catch (error) {
    console.error('Error deleting route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute
};