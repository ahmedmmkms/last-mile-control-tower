// Driver Controller
const Driver = require('../models/driverModel');
const { isValidUUID } = require('../utils/uuidValidator');
const { validateLocationData, storeDriverLocationHistory, storeTrackingData } = require('../services/locationTrackingService');

// Get all drivers with retry logic
async function getAllDrivers(req, res) {
  let retries = 3;
  while (retries > 0) {
    try {
      console.log(`Attempting to fetch drivers (retries left: ${retries})`);
      const drivers = await Driver.getAllDrivers();
      console.log(`Successfully fetched ${drivers.length} drivers`);
      res.status(200).json(drivers);
      return;
    } catch (error) {
      retries--;
      console.error(`Error fetching drivers (retries left: ${retries}):`, error);
      if (retries === 0 || !error.message.includes('timeout')) {
        // If it's not a timeout error or we're out of retries, return error
        console.error('Final error when fetching drivers:', error);
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

// Get driver by ID
async function getDriverById(req, res) {
  try {
    const { id } = req.params;
    
    // Validate UUID format
    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid driver ID format' });
    }
    
    const driver = await Driver.getDriverById(id);
    
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    
    res.status(200).json(driver);
  } catch (error) {
    console.error('Error fetching driver:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Create a new driver
async function createDriver(req, res) {
  try {
    const driverData = req.body;
    const driver = await Driver.createDriver(driverData);
    res.status(201).json(driver);
  } catch (error) {
    console.error('Error creating driver:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Update a driver
async function updateDriver(req, res) {
  try {
    const { id } = req.params;
    
    // Validate UUID format
    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid driver ID format' });
    }
    
    const driverData = req.body;
    
    // Check if driver exists
    const existingDriver = await Driver.getDriverById(id);
    if (!existingDriver) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    
    const driver = await Driver.updateDriver(id, driverData);
    res.status(200).json(driver);
  } catch (error) {
    console.error('Error updating driver:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Update driver location
async function updateDriverLocation(req, res) {
  try {
    const { id } = req.params;
    const { current_location } = req.body;
    
    // Validate UUID format
    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid driver ID format' });
    }
    
    // Validate location data
    const validation = validateLocationData(current_location);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }
    
    // Check if driver exists
    const existingDriver = await Driver.getDriverById(id);
    if (!existingDriver) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    
    // Update driver location
    const driver = await Driver.updateDriverLocation(id, current_location);
    
    // Store location history
    await storeDriverLocationHistory(id, current_location);
    
    // Store tracking data
    await storeTrackingData(null, id, current_location, 'location_update');
    
    res.status(200).json(driver);
  } catch (error) {
    console.error('Error updating driver location:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Update driver status
async function updateDriverStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate UUID format
    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid driver ID format' });
    }
    
    // Validate status
    const validStatuses = ['available', 'busy', 'offline'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be one of: available, busy, offline' });
    }
    
    // Check if driver exists
    const existingDriver = await Driver.getDriverById(id);
    if (!existingDriver) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    
    const driver = await Driver.updateDriverStatus(id, status);
    res.status(200).json(driver);
  } catch (error) {
    console.error('Error updating driver status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get driver assignments
async function getDriverAssignments(req, res) {
  try {
    const { id } = req.params;
    
    // Validate UUID format
    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid driver ID format' });
    }
    
    // Check if driver exists
    const existingDriver = await Driver.getDriverById(id);
    if (!existingDriver) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    
    const assignments = await Driver.getDriverAssignments(id);
    res.status(200).json(assignments);
  } catch (error) {
    console.error('Error fetching driver assignments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Delete a driver
async function deleteDriver(req, res) {
  try {
    const { id } = req.params;
    
    // Validate UUID format
    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid driver ID format' });
    }
    
    // Check if driver exists
    const existingDriver = await Driver.getDriverById(id);
    if (!existingDriver) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    
    const driver = await Driver.deleteDriver(id);
    res.status(200).json(driver);
  } catch (error) {
    console.error('Error deleting driver:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  updateDriverLocation,
  updateDriverStatus,
  getDriverAssignments,
  deleteDriver
};