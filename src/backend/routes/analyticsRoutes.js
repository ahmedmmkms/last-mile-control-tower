// Analytics Routes
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// GET /api/analytics/deliveries - Get delivery analytics
router.get('/deliveries', analyticsController.getDeliveryAnalytics);

// GET /api/analytics/drivers - Get driver performance analytics
router.get('/drivers', analyticsController.getDriverPerformanceAnalytics);

// GET /api/analytics/geographic - Get geographic analytics
router.get('/geographic', analyticsController.getGeographicAnalytics);

// GET /api/analytics/time - Get time-based analytics
router.get('/time', analyticsController.getTimeBasedAnalytics);

// GET /api/analytics/cod - Get COD analytics
router.get('/cod', analyticsController.getCodAnalytics);

module.exports = router;