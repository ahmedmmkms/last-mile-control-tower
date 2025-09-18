// COD Controller
const COD = require('../models/codModel');
const Shipment = require('../models/shipmentModel');
const { isValidUUID } = require('../utils/uuidValidator');

// Create a new COD payment
async function createCodPayment(req, res) {
  try {
    const codData = req.body;
    
    // Validate required fields
    if (!codData.shipment_id || !codData.amount) {
      return res.status(400).json({ error: 'shipment_id and amount are required' });
    }
    
    // Validate UUID format
    if (!isValidUUID(codData.shipment_id)) {
      return res.status(400).json({ error: 'Invalid shipment ID format' });
    }
    
    // Check if shipment exists
    const existingShipment = await Shipment.getShipmentById(codData.shipment_id);
    if (!existingShipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }
    
    // Validate driver ID if provided
    if (codData.driver_id && !isValidUUID(codData.driver_id)) {
      return res.status(400).json({ error: 'Invalid driver ID format' });
    }
    
    // Validate amount
    if (isNaN(codData.amount) || codData.amount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }
    
    const codPayment = await COD.createCodPayment(codData);
    
    // Update shipment COD status
    await COD.updateShipmentCodStatus(codData.shipment_id, 'pending');
    
    res.status(201).json(codPayment);
  } catch (error) {
    console.error('Error creating COD payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get COD payment by ID
async function getCodPaymentById(req, res) {
  try {
    const { id } = req.params;
    
    // Validate UUID format
    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid COD payment ID format' });
    }
    
    const codPayment = await COD.getCodPaymentById(id);
    
    if (!codPayment) {
      return res.status(404).json({ error: 'COD payment not found' });
    }
    
    res.status(200).json(codPayment);
  } catch (error) {
    console.error('Error fetching COD payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get COD payment by shipment ID
async function getCodPaymentByShipmentId(req, res) {
  try {
    const { shipmentId } = req.params;
    
    // Validate UUID format
    if (!isValidUUID(shipmentId)) {
      return res.status(400).json({ error: 'Invalid shipment ID format' });
    }
    
    const codPayment = await COD.getCodPaymentByShipmentId(shipmentId);
    
    if (!codPayment) {
      return res.status(404).json({ error: 'COD payment not found for this shipment' });
    }
    
    res.status(200).json(codPayment);
  } catch (error) {
    console.error('Error fetching COD payment by shipment ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get all COD payments with optional filters
async function getAllCodPayments(req, res) {
  try {
    const filters = {};
    
    // Extract filters from query parameters
    if (req.query.status) filters.status = req.query.status;
    if (req.query.driver_id) filters.driver_id = req.query.driver_id;
    if (req.query.date_from) filters.date_from = new Date(req.query.date_from);
    if (req.query.date_to) filters.date_to = new Date(req.query.date_to);
    
    const codPayments = await COD.getAllCodPayments(filters);
    res.status(200).json(codPayments);
  } catch (error) {
    console.error('Error fetching COD payments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Update COD payment status
async function updateCodPaymentStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, collected_at, reconciled_at, notes } = req.body;
    
    // Validate UUID format
    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid COD payment ID format' });
    }
    
    // Validate status if provided
    const validStatuses = ['pending', 'collected', 'reconciled', 'failed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be one of: pending, collected, reconciled, failed' });
    }
    
    // Check if COD payment exists
    const existingCodPayment = await COD.getCodPaymentById(id);
    if (!existingCodPayment) {
      return res.status(404).json({ error: 'COD payment not found' });
    }
    
    const codPayment = await COD.updateCodPaymentStatus(id, status, { collected_at, reconciled_at, notes });
    
    // Update shipment COD status if status changed
    if (status) {
      await COD.updateShipmentCodStatus(existingCodPayment.shipment_id, status);
    }
    
    res.status(200).json(codPayment);
  } catch (error) {
    console.error('Error updating COD payment status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get COD summary statistics
async function getCodSummary(req, res) {
  try {
    const filters = {};
    
    // Extract filters from query parameters
    if (req.query.driver_id) filters.driver_id = req.query.driver_id;
    if (req.query.date_from) filters.date_from = new Date(req.query.date_from);
    if (req.query.date_to) filters.date_to = new Date(req.query.date_to);
    
    const summary = await COD.getCodSummary(filters);
    res.status(200).json(summary);
  } catch (error) {
    console.error('Error fetching COD summary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get COD payments by driver
async function getCodPaymentsByDriver(req, res) {
  try {
    const { driverId } = req.params;
    
    // Validate UUID format
    if (!isValidUUID(driverId)) {
      return res.status(400).json({ error: 'Invalid driver ID format' });
    }
    
    const codPayments = await COD.getCodPaymentsByDriver(driverId);
    res.status(200).json(codPayments);
  } catch (error) {
    console.error('Error fetching COD payments by driver:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  createCodPayment,
  getCodPaymentById,
  getCodPaymentByShipmentId,
  getAllCodPayments,
  updateCodPaymentStatus,
  getCodSummary,
  getCodPaymentsByDriver
};