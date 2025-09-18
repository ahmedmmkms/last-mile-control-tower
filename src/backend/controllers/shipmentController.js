// Shipment Controller
const Shipment = require('../models/shipmentModel');
const { isValidUUID } = require('../utils/uuidValidator');
const { storeTrackingData } = require('../services/locationTrackingService');

// Get all shipments
async function getAllShipments(req, res) {
  try {
    const shipments = await Shipment.getAllShipments();
    res.status(200).json(shipments);
  } catch (error) {
    console.error('Error fetching shipments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get shipment by ID
async function getShipmentById(req, res) {
  try {
    const { id } = req.params;
    
    // Validate UUID format
    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid shipment ID format' });
    }
    
    const shipment = await Shipment.getShipmentById(id);
    
    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }
    
    res.status(200).json(shipment);
  } catch (error) {
    console.error('Error fetching shipment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Create a new shipment
async function createShipment(req, res) {
  try {
    const shipmentData = req.body;
    const shipment = await Shipment.createShipment(shipmentData);
    res.status(201).json(shipment);
  } catch (error) {
    console.error('Error creating shipment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Update a shipment
async function updateShipment(req, res) {
  try {
    const { id } = req.params;
    
    // Validate UUID format
    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid shipment ID format' });
    }
    
    const shipmentData = req.body;
    
    // Check if shipment exists
    const existingShipment = await Shipment.getShipmentById(id);
    if (!existingShipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }
    
    const shipment = await Shipment.updateShipment(id, shipmentData);
    res.status(200).json(shipment);
  } catch (error) {
    console.error('Error updating shipment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Update shipment status with PoD
async function updateShipmentStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, pod_image, pod_timestamp, pod_location } = req.body;
    
    // Validate UUID format
    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid shipment ID format' });
    }
    
    // Validate status
    const validStatuses = ['pending', 'assigned', 'in_transit', 'delivered', 'failed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be one of: pending, assigned, in_transit, delivered, failed' });
    }
    
    // Check if shipment exists
    const existingShipment = await Shipment.getShipmentById(id);
    if (!existingShipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }
    
    const shipment = await Shipment.updateShipmentStatus(id, status, pod_image, pod_timestamp, pod_location);
    
    // Store tracking data for status change
    await storeTrackingData(id, existingShipment.assigned_driver_id, null, 'status_change', { 
      status, 
      pod_image, 
      pod_timestamp, 
      pod_location 
    });
    
    res.status(200).json(shipment);
  } catch (error) {
    console.error('Error updating shipment status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Submit Proof of Delivery
async function submitPod(req, res) {
  try {
    const { id } = req.params;
    const { pod_image, pod_timestamp, pod_location } = req.body;
    
    // Validate UUID format
    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid shipment ID format' });
    }
    
    // Check if shipment exists
    const existingShipment = await Shipment.getShipmentById(id);
    if (!existingShipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }
    
    // Validate required fields
    if (!pod_image || !pod_timestamp) {
      return res.status(400).json({ error: 'pod_image and pod_timestamp are required' });
    }
    
    const shipment = await Shipment.submitPod(id, pod_image, pod_timestamp, pod_location);
    
    // Store tracking data for PoD submission
    await storeTrackingData(id, existingShipment.assigned_driver_id, pod_location, 'pod_submission', { 
      pod_image, 
      pod_timestamp 
    });
    
    res.status(200).json(shipment);
  } catch (error) {
    console.error('Error submitting PoD:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Delete a shipment
async function deleteShipment(req, res) {
  try {
    const { id } = req.params;
    
    // Validate UUID format
    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid shipment ID format' });
    }
    
    // Check if shipment exists
    const existingShipment = await Shipment.getShipmentById(id);
    if (!existingShipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }
    
    const shipment = await Shipment.deleteShipment(id);
    res.status(200).json(shipment);
  } catch (error) {
    console.error('Error deleting shipment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getAllShipments,
  getShipmentById,
  createShipment,
  updateShipment,
  updateShipmentStatus,
  submitPod,
  deleteShipment
};