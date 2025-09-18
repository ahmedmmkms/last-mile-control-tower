// Shipment Model
const { query } = require('../../database/db');

// Get all shipments
async function getAllShipments() {
  const queryText = 'SELECT * FROM shipments ORDER BY created_at DESC';
  const result = await query(queryText);
  return result.rows;
}

// Get shipment by ID
async function getShipmentById(id) {
  const queryText = 'SELECT * FROM shipments WHERE id = $1';
  const result = await query(queryText, [id]);
  return result.rows[0];
}

// Create a new shipment
async function createShipment(shipmentData) {
  const { tracking_number, status, origin, destination, assigned_driver_id } = shipmentData;
  const queryText = `
    INSERT INTO shipments (tracking_number, status, origin, destination, assigned_driver_id)
    VALUES ($1, $2, $3::jsonb, $4::jsonb, $5)
    RETURNING *
  `;
  const values = [tracking_number, status, JSON.stringify(origin), JSON.stringify(destination), assigned_driver_id];
  const result = await query(queryText, values);
  return result.rows[0];
}

// Update a shipment
async function updateShipment(id, shipmentData) {
  const { tracking_number, status, origin, destination, assigned_driver_id } = shipmentData;
  const queryText = `
    UPDATE shipments
    SET tracking_number = $1, status = $2, origin = $3::jsonb, destination = $4::jsonb, assigned_driver_id = $5, updated_at = CURRENT_TIMESTAMP
    WHERE id = $6
    RETURNING *
  `;
  const values = [tracking_number, status, JSON.stringify(origin), JSON.stringify(destination), assigned_driver_id, id];
  const result = await query(queryText, values);
  return result.rows[0];
}

// Update shipment status with PoD
async function updateShipmentStatus(id, status, pod_image, pod_timestamp, pod_location) {
  const queryText = `
    UPDATE shipments
    SET status = $1, 
        pod_image = $2, 
        pod_timestamp = $3, 
        pod_location = $4::jsonb, 
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $5
    RETURNING *
  `;
  const values = [status, pod_image, pod_timestamp, JSON.stringify(pod_location || {}), id];
  const result = await query(queryText, values);
  return result.rows[0];
}

// Submit Proof of Delivery
async function submitPod(id, pod_image, pod_timestamp, pod_location) {
  const queryText = `
    UPDATE shipments
    SET pod_image = $1, 
        pod_timestamp = $2, 
        pod_location = $3::jsonb, 
        status = 'delivered',
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $4
    RETURNING *
  `;
  const values = [pod_image, pod_timestamp, JSON.stringify(pod_location || {}), id];
  const result = await query(queryText, values);
  return result.rows[0];
}

// Delete a shipment
async function deleteShipment(id) {
  const queryText = 'DELETE FROM shipments WHERE id = $1 RETURNING *';
  const result = await query(queryText, [id]);
  return result.rows[0];
}

// Get shipments by status
async function getShipmentsByStatus(status) {
  const queryText = 'SELECT * FROM shipments WHERE status = $1 ORDER BY created_at DESC';
  const result = await query(queryText, [status]);
  return result.rows;
}

// Get shipments by driver ID
async function getShipmentsByDriverId(driverId) {
  const queryText = 'SELECT * FROM shipments WHERE assigned_driver_id = $1 ORDER BY created_at DESC';
  const result = await query(queryText, [driverId]);
  return result.rows;
}

module.exports = {
  getAllShipments,
  getShipmentById,
  createShipment,
  updateShipment,
  updateShipmentStatus,
  submitPod,
  deleteShipment,
  getShipmentsByStatus,
  getShipmentsByDriverId
};