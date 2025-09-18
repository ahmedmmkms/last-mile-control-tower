// Location Tracking Service
const { query } = require('../../database/db');

// Validate location data
function validateLocationData(location) {
  if (!location || typeof location !== 'object') {
    return { valid: false, error: 'Location data is required and must be an object' };
  }
  
  if (typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
    return { valid: false, error: 'Latitude and longitude must be numbers' };
  }
  
  if (location.latitude < -90 || location.latitude > 90) {
    return { valid: false, error: 'Latitude must be between -90 and 90' };
  }
  
  if (location.longitude < -180 || location.longitude > 180) {
    return { valid: false, error: 'Longitude must be between -180 and 180' };
  }
  
  return { valid: true };
}

// Store location history for a driver
async function storeDriverLocationHistory(driverId, location) {
  try {
    // Get current location history
    const queryText = 'SELECT location_history FROM drivers WHERE id = $1';
    const result = await query(queryText, [driverId]);
    
    if (result.rows.length === 0) {
      throw new Error('Driver not found');
    }
    
    // Add new location to history with timestamp
    const locationWithTimestamp = {
      ...location,
      timestamp: new Date().toISOString()
    };
    
    const currentHistory = result.rows[0].location_history || [];
    const updatedHistory = [...currentHistory, locationWithTimestamp];
    
    // Keep only the last 100 locations to prevent unbounded growth
    const trimmedHistory = updatedHistory.slice(-100);
    
    // Update driver's location history
    const updateQuery = `
      UPDATE drivers 
      SET location_history = $1::jsonb,
          last_active = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING location_history
    `;
    
    const updateResult = await query(updateQuery, [JSON.stringify(trimmedHistory), driverId]);
    return updateResult.rows[0].location_history;
  } catch (error) {
    console.error('Error storing driver location history:', error);
    throw error;
  }
}

// Store tracking data
async function storeTrackingData(shipmentId, driverId, location, eventType, metadata) {
  try {
    const queryText = `
      INSERT INTO tracking (shipment_id, driver_id, location, event_type, metadata)
      VALUES ($1, $2, $3::jsonb, $4, $5::jsonb)
      RETURNING *
    `;
    
    const values = [
      shipmentId,
      driverId,
      JSON.stringify(location),
      eventType,
      JSON.stringify(metadata || {})
    ];
    
    const result = await query(queryText, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error storing tracking data:', error);
    throw error;
  }
}

// Get driver location history
async function getDriverLocationHistory(driverId, limit = 50) {
  try {
    const queryText = `
      SELECT location_history 
      FROM drivers 
      WHERE id = $1
    `;
    
    const result = await query(queryText, [driverId]);
    
    if (result.rows.length === 0) {
      throw new Error('Driver not found');
    }
    
    const history = result.rows[0].location_history || [];
    
    // Return the most recent entries up to the limit
    return history.slice(-limit);
  } catch (error) {
    console.error('Error fetching driver location history:', error);
    throw error;
  }
}

// Get tracking data for a shipment
async function getShipmentTrackingData(shipmentId) {
  try {
    const queryText = `
      SELECT * 
      FROM tracking 
      WHERE shipment_id = $1 
      ORDER BY timestamp ASC
    `;
    
    const result = await query(queryText, [shipmentId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching shipment tracking data:', error);
    throw error;
  }
}

module.exports = {
  validateLocationData,
  storeDriverLocationHistory,
  storeTrackingData,
  getDriverLocationHistory,
  getShipmentTrackingData
};