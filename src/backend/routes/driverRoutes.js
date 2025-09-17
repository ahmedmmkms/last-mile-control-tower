// Driver Routes
const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');

// GET /api/drivers - List all drivers
router.get('/', driverController.getAllDrivers);

// GET /api/drivers/:id - Get specific driver
router.get('/:id', driverController.getDriverById);

// POST /api/drivers - Create new driver
router.post('/', driverController.createDriver);

// PUT /api/drivers/:id - Update driver
router.put('/:id', driverController.updateDriver);

// DELETE /api/drivers/:id - Delete driver
router.delete('/:id', driverController.deleteDriver);

module.exports = router;