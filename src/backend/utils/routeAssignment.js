// Route Assignment Utility
const Driver = require('../models/driverModel');
const Shipment = require('../models/shipmentModel');
const Route = require('../models/routeModel');

// Simple proximity-based assignment algorithm
// In a real-world scenario, this would be much more complex
async function assignShipmentToDriver(shipmentId) {
  try {
    // Get the shipment
    const shipment = await Shipment.getShipmentById(shipmentId);
    if (!shipment) {
      throw new Error('Shipment not found');
    }

    // Get available drivers
    const availableDrivers = await Driver.getAvailableDrivers();
    if (availableDrivers.length === 0) {
      throw new Error('No available drivers');
    }

    // For simplicity, we'll just assign to the first available driver
    // In a real implementation, we would calculate proximity and other factors
    const assignedDriver = availableDrivers[0];

    // Update shipment status and assign driver
    const updatedShipment = await Shipment.updateShipment(shipmentId, {
      ...shipment,
      status: 'assigned',
      assigned_driver_id: assignedDriver.id
    });

    // Update driver status
    await Driver.updateDriver(assignedDriver.id, {
      ...assignedDriver,
      status: 'busy'
    });

    // Create a route for this shipment
    const routeData = {
      shipment_id: shipmentId,
      waypoints: [shipment.origin, shipment.destination],
      status: 'active',
      estimated_time: 30 // Default estimation
    };

    const route = await Route.createRoute(routeData);

    return {
      shipment: updatedShipment,
      driver: assignedDriver,
      route: route
    };
  } catch (error) {
    console.error('Error assigning shipment to driver:', error);
    throw error;
  }
}

// Unassign a shipment from a driver
async function unassignShipmentFromDriver(shipmentId) {
  try {
    // Get the shipment
    const shipment = await Shipment.getShipmentById(shipmentId);
    if (!shipment) {
      throw new Error('Shipment not found');
    }

    // If there's an assigned driver, update their status
    if (shipment.assigned_driver_id) {
      const driver = await Driver.getDriverById(shipment.assigned_driver_id);
      if (driver) {
        await Driver.updateDriver(driver.id, {
          ...driver,
          status: 'available'
        });
      }
    }

    // Update shipment status
    const updatedShipment = await Shipment.updateShipment(shipmentId, {
      ...shipment,
      status: 'pending',
      assigned_driver_id: null
    });

    return updatedShipment;
  } catch (error) {
    console.error('Error unassigning shipment from driver:', error);
    throw error;
  }
}

module.exports = {
  assignShipmentToDriver,
  unassignShipmentFromDriver
};