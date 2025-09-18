// Shipment Routes
const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipmentController');

// GET /api/shipments - List all shipments
router.get('/', shipmentController.getAllShipments);

// GET /api/shipments/:id - Get specific shipment
router.get('/:id', shipmentController.getShipmentById);

// POST /api/shipments - Create new shipment
router.post('/', shipmentController.createShipment);

// PUT /api/shipments/:id - Update shipment
router.put('/:id', shipmentController.updateShipment);

// PUT /api/shipments/:id/status - Update shipment status with PoD
router.put('/:id/status', shipmentController.updateShipmentStatus);

// POST /api/shipments/:id/pod - Submit Proof of Delivery
router.post('/:id/pod', shipmentController.submitPod);

// DELETE /api/shipments/:id - Delete shipment
router.delete('/:id', shipmentController.deleteShipment);

module.exports = router;