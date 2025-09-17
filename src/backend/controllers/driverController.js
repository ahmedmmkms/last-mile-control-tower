// Driver Controller
const Driver = require('../models/driverModel');
const { isValidUUID } = require('../utils/uuidValidator');

// Get all drivers
async function getAllDrivers(req, res) {
  try {
    const drivers = await Driver.getAllDrivers();
    res.status(200).json(drivers);
  } catch (error) {
    console.error('Error fetching drivers:', error);
    res.status(500).json({ error: 'Internal server error' });
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
  deleteDriver
};