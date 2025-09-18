// SLA Routes
const express = require('express');
const router = express.Router();
const slaController = require('../controllers/slaController');

// GET /api/sla/metrics - Get shipment SLA metrics
router.get('/metrics', slaController.getShipmentSLAMetrics);

// GET /api/sla/drivers - Get driver SLA metrics
router.get('/drivers', slaController.getDriverSLAMetrics);

// GET /api/sla/distribution - Get delivery time distribution
router.get('/distribution', slaController.getDeliveryTimeDistribution);

// GET /api/sla/overdue - Get overdue shipments
router.get('/overdue', slaController.getOverdueShipments);

module.exports = router;