// Route Routes
const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');

// GET /api/routes - List all routes
router.get('/', routeController.getAllRoutes);

// GET /api/routes/:id - Get specific route
router.get('/:id', routeController.getRouteById);

// POST /api/routes - Create new route
router.post('/', routeController.createRoute);

// PUT /api/routes/:id - Update route
router.put('/:id', routeController.updateRoute);

// DELETE /api/routes/:id - Delete route
router.delete('/:id', routeController.deleteRoute);

module.exports = router;