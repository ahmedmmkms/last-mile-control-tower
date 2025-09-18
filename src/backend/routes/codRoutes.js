// COD Routes
const express = require('express');
const router = express.Router();
const codController = require('../controllers/codController');

// POST /api/cod - Create a new COD payment
router.post('/', codController.createCodPayment);

// GET /api/cod/:id - Get COD payment by ID
router.get('/:id', codController.getCodPaymentById);

// GET /api/cod/shipment/:shipmentId - Get COD payment by shipment ID
router.get('/shipment/:shipmentId', codController.getCodPaymentByShipmentId);

// GET /api/cod - Get all COD payments with optional filters
router.get('/', codController.getAllCodPayments);

// PUT /api/cod/:id/status - Update COD payment status
router.put('/:id/status', codController.updateCodPaymentStatus);

// GET /api/cod/summary - Get COD summary statistics
router.get('/summary', codController.getCodSummary);

// GET /api/cod/driver/:driverId - Get COD payments by driver
router.get('/driver/:driverId', codController.getCodPaymentsByDriver);

module.exports = router;