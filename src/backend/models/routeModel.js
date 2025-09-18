// Route Model
const { query } = require('../../database/db');

// Get all routes
async function getAllRoutes() {
  const queryText = 'SELECT * FROM routes ORDER BY created_at DESC';
  const result = await query(queryText);
  return result.rows;
}

// Get route by ID
async function getRouteById(id) {
  const queryText = 'SELECT * FROM routes WHERE id = $1';
  const result = await query(queryText, [id]);
  return result.rows[0];
}

// Create a new route
async function createRoute(routeData) {
  const { shipment_id, waypoints, status, estimated_time, actual_time } = routeData;
  const queryText = `
    INSERT INTO routes (shipment_id, waypoints, status, estimated_time, actual_time)
    VALUES ($1, $2::jsonb, $3, $4, $5)
    RETURNING *
  `;
  const values = [shipment_id, JSON.stringify(waypoints), status, estimated_time, actual_time];
  const result = await query(queryText, values);
  return result.rows[0];
}

// Update a route
async function updateRoute(id, routeData) {
  const { shipment_id, waypoints, status, estimated_time, actual_time } = routeData;
  const queryText = `
    UPDATE routes
    SET shipment_id = $1, waypoints = $2::jsonb, status = $3, estimated_time = $4, actual_time = $5, updated_at = CURRENT_TIMESTAMP
    WHERE id = $6
    RETURNING *
  `;
  const values = [shipment_id, JSON.stringify(waypoints), status, estimated_time, actual_time, id];
  const result = await query(queryText, values);
  return result.rows[0];
}

// Delete a route
async function deleteRoute(id) {
  const queryText = 'DELETE FROM routes WHERE id = $1 RETURNING *';
  const result = await query(queryText, [id]);
  return result.rows[0];
}

// Get route by shipment ID
async function getRouteByShipmentId(shipmentId) {
  const queryText = 'SELECT * FROM routes WHERE shipment_id = $1';
  const result = await query(queryText, [shipmentId]);
  return result.rows[0];
}

module.exports = {
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
  getRouteByShipmentId
};