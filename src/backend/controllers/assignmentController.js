// Assignment Controller
const { assignShipmentToDriver, unassignShipmentFromDriver } = require('../utils/routeAssignment');

// Assign a shipment to a driver
async function assignShipment(req, res) {
  try {
    const { shipmentId } = req.params;
    const assignment = await assignShipmentToDriver(shipmentId);
    res.status(200).json(assignment);
  } catch (error) {
    console.error('Error assigning shipment:', error);
    if (error.message === 'Shipment not found') {
      return res.status(404).json({ error: 'Shipment not found' });
    }
    if (error.message === 'No available drivers') {
      return res.status(400).json({ error: 'No available drivers' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Unassign a shipment from a driver
async function unassignShipment(req, res) {
  try {
    const { shipmentId } = req.params;
    const shipment = await unassignShipmentFromDriver(shipmentId);
    res.status(200).json(shipment);
  } catch (error) {
    console.error('Error unassigning shipment:', error);
    if (error.message === 'Shipment not found') {
      return res.status(404).json({ error: 'Shipment not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  assignShipment,
  unassignShipment
};