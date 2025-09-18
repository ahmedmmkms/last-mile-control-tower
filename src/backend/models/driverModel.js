// Driver Model
const { query } = require('../../database/db');

// Get all drivers
async function getAllDrivers() {
  const queryText = 'SELECT * FROM drivers ORDER BY created_at DESC';
  const result = await query(queryText);
  return result.rows;
}

// Get driver by ID
async function getDriverById(id) {
  const queryText = 'SELECT * FROM drivers WHERE id = $1';
  const result = await query(queryText, [id]);
  return result.rows[0];
}

// Create a new driver
async function createDriver(driverData) {
  const { name, phone, vehicle_type, status, current_location } = driverData;
  const queryText = `
    INSERT INTO drivers (name, phone, vehicle_type, status, current_location)
    VALUES ($1, $2, $3, $4, $5::jsonb)
    RETURNING *
  `;
  const values = [name, phone, vehicle_type, status, JSON.stringify(current_location)];
  const result = await query(queryText, values);
  return result.rows[0];
}

// Update a driver
async function updateDriver(id, driverData) {
  const { name, phone, vehicle_type, status, current_location } = driverData;
  const queryText = `
    UPDATE drivers
    SET name = $1, phone = $2, vehicle_type = $3, status = $4, current_location = $5::jsonb, updated_at = CURRENT_TIMESTAMP
    WHERE id = $6
    RETURNING *
  `;
  const values = [name, phone, vehicle_type, status, JSON.stringify(current_location), id];
  const result = await query(queryText, values);
  return result.rows[0];
}

// Update driver location
async function updateDriverLocation(id, current_location) {
  const queryText = `
    UPDATE drivers
    SET current_location = $1::jsonb, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *
  `;
  const values = [JSON.stringify(current_location), id];
  const result = await query(queryText, values);
  return result.rows[0];
}

// Update driver status
async function updateDriverStatus(id, status) {
  const queryText = `
    UPDATE drivers
    SET status = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *
  `;
  const values = [status, id];
  const result = await query(queryText, values);
  return result.rows[0];
}

// Delete a driver
async function deleteDriver(id) {
  const queryText = 'DELETE FROM drivers WHERE id = $1 RETURNING *';
  const result = await query(queryText, [id]);
  return result.rows[0];
}

// Get available drivers
async function getAvailableDrivers() {
  const queryText = "SELECT * FROM drivers WHERE status = 'available' ORDER BY created_at DESC";
  const result = await query(queryText);
  return result.rows;
}

// Get driver assignments (shipments assigned to driver)
async function getDriverAssignments(driverId) {
  const queryText = `
    SELECT s.*, d.name as driver_name
    FROM shipments s
    JOIN drivers d ON s.assigned_driver_id = d.id
    WHERE s.assigned_driver_id = $1
    ORDER BY s.created_at DESC
  `;
  const result = await query(queryText, [driverId]);
  return result.rows;
}

module.exports = {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  updateDriverLocation,
  updateDriverStatus,
  deleteDriver,
  getAvailableDrivers,
  getDriverAssignments
};