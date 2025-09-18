// COD Model
const { query } = require('../../database/db');

// Create a new COD payment record
async function createCodPayment(codData) {
  const { shipment_id, driver_id, amount, currency, status, collected_at, reconciled_at, notes } = codData;
  const queryText = `
    INSERT INTO cod_payments (shipment_id, driver_id, amount, currency, status, collected_at, reconciled_at, notes)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;
  const values = [shipment_id, driver_id, amount, currency || 'EGP', status || 'pending', collected_at, reconciled_at, notes];
  const result = await query(queryText, values);
  return result.rows[0];
}

// Get COD payment by ID
async function getCodPaymentById(id) {
  const queryText = 'SELECT * FROM cod_payments WHERE id = $1';
  const result = await query(queryText, [id]);
  return result.rows[0];
}

// Get COD payment by shipment ID
async function getCodPaymentByShipmentId(shipmentId) {
  const queryText = 'SELECT * FROM cod_payments WHERE shipment_id = $1 ORDER BY created_at DESC LIMIT 1';
  const result = await query(queryText, [shipmentId]);
  return result.rows[0];
}

// Get all COD payments with optional filters
async function getAllCodPayments(filters = {}) {
  let queryText = 'SELECT * FROM cod_payments';
  const values = [];
  const whereClauses = [];
  
  if (filters.status) {
    values.push(filters.status);
    whereClauses.push(`status = $${values.length}`);
  }
  
  if (filters.driver_id) {
    values.push(filters.driver_id);
    whereClauses.push(`driver_id = $${values.length}`);
  }
  
  if (filters.date_from) {
    values.push(filters.date_from);
    whereClauses.push(`created_at >= $${values.length}`);
  }
  
  if (filters.date_to) {
    values.push(filters.date_to);
    whereClauses.push(`created_at <= $${values.length}`);
  }
  
  if (whereClauses.length > 0) {
    queryText += ' WHERE ' + whereClauses.join(' AND ');
  }
  
  queryText += ' ORDER BY created_at DESC';
  
  const result = await query(queryText, values);
  return result.rows;
}

// Update COD payment status
async function updateCodPaymentStatus(id, status, additionalFields = {}) {
  const fields = ['status = $1'];
  const values = [status, id];
  
  if (additionalFields.collected_at) {
    fields.push(`collected_at = $${values.length + 1}`);
    values.push(additionalFields.collected_at);
  }
  
  if (additionalFields.reconciled_at) {
    fields.push(`reconciled_at = $${values.length + 1}`);
    values.push(additionalFields.reconciled_at);
  }
  
  if (additionalFields.notes) {
    fields.push(`notes = $${values.length + 1}`);
    values.push(additionalFields.notes);
  }
  
  const queryText = `
    UPDATE cod_payments
    SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
    WHERE id = $${values.length}
    RETURNING *
  `;
  
  const result = await query(queryText, values);
  return result.rows[0];
}

// Update shipment COD status
async function updateShipmentCodStatus(shipmentId, codStatus) {
  const queryText = `
    UPDATE shipments
    SET cod_status = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *
  `;
  const result = await query(queryText, [codStatus, shipmentId]);
  return result.rows[0];
}

// Get COD summary statistics
async function getCodSummary(filters = {}) {
  let queryText = `
    SELECT 
      COUNT(*) as total_payments,
      SUM(amount) as total_amount,
      COUNT(CASE WHEN status = 'collected' THEN 1 END) as collected_count,
      SUM(CASE WHEN status = 'collected' THEN amount ELSE 0 END) as collected_amount,
      COUNT(CASE WHEN status = 'reconciled' THEN 1 END) as reconciled_count,
      SUM(CASE WHEN status = 'reconciled' THEN amount ELSE 0 END) as reconciled_amount,
      COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
      SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as pending_amount
    FROM cod_payments
  `;
  
  const values = [];
  const whereClauses = [];
  
  if (filters.driver_id) {
    values.push(filters.driver_id);
    whereClauses.push(`driver_id = $${values.length}`);
  }
  
  if (filters.date_from) {
    values.push(filters.date_from);
    whereClauses.push(`created_at >= $${values.length}`);
  }
  
  if (filters.date_to) {
    values.push(filters.date_to);
    whereClauses.push(`created_at <= $${values.length}`);
  }
  
  if (whereClauses.length > 0) {
    queryText += ' WHERE ' + whereClauses.join(' AND ');
  }
  
  const result = await query(queryText, values);
  return result.rows[0];
}

// Get COD payments by driver
async function getCodPaymentsByDriver(driverId) {
  const queryText = `
    SELECT cp.*, s.tracking_number, s.destination
    FROM cod_payments cp
    JOIN shipments s ON cp.shipment_id = s.id
    WHERE cp.driver_id = $1
    ORDER BY cp.created_at DESC
  `;
  const result = await query(queryText, [driverId]);
  return result.rows;
}

module.exports = {
  createCodPayment,
  getCodPaymentById,
  getCodPaymentByShipmentId,
  getAllCodPayments,
  updateCodPaymentStatus,
  updateShipmentCodStatus,
  getCodSummary,
  getCodPaymentsByDriver
};