// Shipment Model
const { client } = require('../../database/db');

// Get all shipments
async function getAllShipments() {
  const query = 'SELECT * FROM shipments ORDER BY created_at DESC';
  const result = await client.query(query);
  return result.rows;
}

// Get shipment by ID
async function getShipmentById(id) {
  const query = 'SELECT * FROM shipments WHERE id = $1';
  const result = await client.query(query, [id]);
  return result.rows[0];
}

// Create a new shipment
async function createShipment(shipmentData) {
  const { tracking_number, status, origin, destination, assigned_driver_id } = shipmentData;
  const query = `
    INSERT INTO shipments (tracking_number, status, origin, destination, assigned_driver_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const values = [tracking_number, status, origin, destination, assigned_driver_id];
  const result = await client.query(query, values);
  return result.rows[0];
}

// Update a shipment
async function updateShipment(id, shipmentData) {
  const { tracking_number, status, origin, destination, assigned_driver_id } = shipmentData;
  const query = `
    UPDATE shipments
    SET tracking_number = $1, status = $2, origin = $3, destination = $4, assigned_driver_id = $5, updated_at = CURRENT_TIMESTAMP
    WHERE id = $6
    RETURNING *
  `;
  const values = [tracking_number, status, origin, destination, assigned_driver_id, id];
  const result = await client.query(query, values);
  return result.rows[0];
}

// Delete a shipment
async function deleteShipment(id) {
  const query = 'DELETE FROM shipments WHERE id = $1 RETURNING *';
  const result = await client.query(query, [id]);
  return result.rows[0];
}

// Get shipments by status
async function getShipmentsByStatus(status) {
  const query = 'SELECT * FROM shipments WHERE status = $1 ORDER BY created_at DESC';
  const result = await client.query(query, [status]);
  return result.rows;
}

// Get shipments by driver ID
async function getShipmentsByDriverId(driverId) {
  const query = 'SELECT * FROM shipments WHERE assigned_driver_id = $1 ORDER BY created_at DESC';
  const result = await client.query(query, [driverId]);
  return result.rows;
}

module.exports = {
  getAllShipments,
  getShipmentById,
  createShipment,
  updateShipment,
  deleteShipment,
  getShipmentsByStatus,
  getShipmentsByDriverId
};