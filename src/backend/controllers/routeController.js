// Route Controller
const Route = require('../models/routeModel');
const { isValidUUID } = require('../utils/uuidValidator');

// Get all routes with retry logic
async function getAllRoutes(req, res) {
  let retries = 3;
  while (retries > 0) {
    try {
      console.log(`Attempting to fetch routes (retries left: ${retries})`);
      const routes = await Route.getAllRoutes();
      console.log(`Successfully fetched ${routes.length} routes`);
      res.status(200).json(routes);
      return;
    } catch (error) {
      retries--;
      console.error(`Error fetching routes (retries left: ${retries}):`, error);
      if (retries === 0 || !error.message.includes('timeout')) {
        // If it's not a timeout error or we're out of retries, return error
        console.error('Final error when fetching routes:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      // Wait a bit before retrying with exponential backoff
      const waitTime = Math.pow(2, 3 - retries) * 100;
      console.log(`Waiting ${waitTime}ms before retrying...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
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