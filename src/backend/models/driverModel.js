// Driver Model
const { client } = require('../../database/db');

// Get all drivers
async function getAllDrivers() {
  const query = 'SELECT * FROM drivers ORDER BY created_at DESC';
  const result = await client.query(query);
  return result.rows;
}

// Get driver by ID
async function getDriverById(id) {
  const query = 'SELECT * FROM drivers WHERE id = $1';
  const result = await client.query(query, [id]);
  return result.rows[0];
}

// Create a new driver
async function createDriver(driverData) {
  const { name, phone, vehicle_type, status, current_location } = driverData;
  const query = `
    INSERT INTO drivers (name, phone, vehicle_type, status, current_location)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const values = [name, phone, vehicle_type, status, current_location];
  const result = await client.query(query, values);
  return result.rows[0];
}

// Update a driver
async function updateDriver(id, driverData) {
  const { name, phone, vehicle_type, status, current_location } = driverData;
  const query = `
    UPDATE drivers
    SET name = $1, phone = $2, vehicle_type = $3, status = $4, current_location = $5, updated_at = CURRENT_TIMESTAMP
    WHERE id = $6
    RETURNING *
  `;
  const values = [name, phone, vehicle_type, status, current_location, id];
  const result = await client.query(query, values);
  return result.rows[0];
}

// Delete a driver
async function deleteDriver(id) {
  const query = 'DELETE FROM drivers WHERE id = $1 RETURNING *';
  const result = await client.query(query, [id]);
  return result.rows[0];
}

// Get available drivers
async function getAvailableDrivers() {
  const query = "SELECT * FROM drivers WHERE status = 'available' ORDER BY created_at DESC";
  const result = await client.query(query);
  return result.rows;
}

module.exports = {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
  getAvailableDrivers
};