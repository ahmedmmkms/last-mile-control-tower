// Shipment Controller
const Shipment = require('../models/shipmentModel');

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

// Delete a shipment
async function deleteShipment(req, res) {
  try {
    const { id } = req.params;
    
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
  deleteShipment
};