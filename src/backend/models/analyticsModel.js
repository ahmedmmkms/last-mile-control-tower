// Analytics Model
const { query } = require('../../database/db');

// Get delivery analytics
async function getDeliveryAnalytics(filters = {}) {
  let queryText = `
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as total_deliveries,
      COUNT(CASE WHEN status = 'delivered' THEN 1 END) as completed_deliveries,
      COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_deliveries,
      AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/3600) as avg_delivery_time_hours
    FROM shipments
  `;
  
  const values = [];
  const whereClauses = [];
  
  if (filters.date_from) {
    values.push(filters.date_from);
    whereClauses.push(`created_at >= $${values.length}`);
  }
  
  if (filters.date_to) {
    values.push(filters.date_to);
    whereClauses.push(`created_at <= $${values.length}`);
  }
  
  if (filters.driver_id) {
    values.push(filters.driver_id);
    whereClauses.push(`assigned_driver_id = $${values.length}`);
  }
  
  if (whereClauses.length > 0) {
    queryText += ' WHERE ' + whereClauses.join(' AND ');
  }
  
  queryText += `
    GROUP BY DATE(created_at)
    ORDER BY date
  `;
  
  const result = await query(queryText, values);
  return result.rows;
}

// Get driver performance analytics
async function getDriverPerformanceAnalytics(filters = {}) {
  let queryText = `
    SELECT 
      d.id as driver_id,
      d.name as driver_name,
      d.vehicle_type,
      COUNT(s.id) as total_assignments,
      COUNT(CASE WHEN s.status = 'delivered' THEN 1 END) as completed_deliveries,
      COUNT(CASE WHEN s.status = 'failed' THEN 1 END) as failed_deliveries,
      AVG(CASE WHEN s.status = 'delivered' THEN EXTRACT(EPOCH FROM (s.updated_at - s.created_at))/3600 END) as avg_delivery_time_hours,
      COUNT(CASE WHEN s.status = 'delivered' AND EXTRACT(EPOCH FROM (s.updated_at - s.created_at))/3600 <= 24 THEN 1 END) as on_time_deliveries
    FROM drivers d
    LEFT JOIN shipments s ON d.id = s.assigned_driver_id
  `;
  
  const values = [];
  const whereClauses = [];
  
  if (filters.date_from) {
    values.push(filters.date_from);
    whereClauses.push(`s.created_at >= $${values.length}`);
  }
  
  if (filters.date_to) {
    values.push(filters.date_to);
    whereClauses.push(`s.created_at <= $${values.length}`);
  }
  
  if (whereClauses.length > 0) {
    queryText += ' WHERE ' + whereClauses.join(' AND ');
  }
  
  queryText += `
    GROUP BY d.id, d.name, d.vehicle_type
    HAVING COUNT(s.id) > 0
    ORDER BY completed_deliveries DESC
  `;
  
  const result = await query(queryText, values);
  return result.rows;
}

// Get geographic analytics
async function getGeographicAnalytics(filters = {}) {
  let queryText = `
    SELECT 
      s.destination->>'city' as city,
      s.destination->>'country' as country,
      COUNT(*) as delivery_count,
      COUNT(CASE WHEN s.status = 'delivered' THEN 1 END) as completed_deliveries,
      AVG(CASE WHEN s.status = 'delivered' THEN EXTRACT(EPOCH FROM (s.updated_at - s.created_at))/3600 END) as avg_delivery_time_hours
    FROM shipments s
  `;
  
  const values = [];
  const whereClauses = [];
  
  if (filters.date_from) {
    values.push(filters.date_from);
    whereClauses.push(`s.created_at >= $${values.length}`);
  }
  
  if (filters.date_to) {
    values.push(filters.date_to);
    whereClauses.push(`s.created_at <= $${values.length}`);
  }
  
  if (filters.driver_id) {
    values.push(filters.driver_id);
    whereClauses.push(`s.assigned_driver_id = $${values.length}`);
  }
  
  if (whereClauses.length > 0) {
    queryText += ' WHERE ' + whereClauses.join(' AND ');
  }
  
  queryText += `
    GROUP BY s.destination->>'city', s.destination->>'country'
    HAVING COUNT(*) > 0
    ORDER BY delivery_count DESC
    LIMIT 20
  `;
  
  const result = await query(queryText, values);
  return result.rows;
}

// Get time-based analytics
async function getTimeBasedAnalytics(filters = {}) {
  let queryText = `
    SELECT 
      EXTRACT(HOUR FROM created_at) as hour_of_day,
      COUNT(*) as delivery_count,
      COUNT(CASE WHEN status = 'delivered' THEN 1 END) as completed_deliveries,
      AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/3600) as avg_delivery_time_hours
    FROM shipments
  `;
  
  const values = [];
  const whereClauses = [];
  
  if (filters.date_from) {
    values.push(filters.date_from);
    whereClauses.push(`created_at >= $${values.length}`);
  }
  
  if (filters.date_to) {
    values.push(filters.date_to);
    whereClauses.push(`created_at <= $${values.length}`);
  }
  
  if (filters.driver_id) {
    values.push(filters.driver_id);
    whereClauses.push(`assigned_driver_id = $${values.length}`);
  }
  
  if (whereClauses.length > 0) {
    queryText += ' WHERE ' + whereClauses.join(' AND ');
  }
  
  queryText += `
    GROUP BY EXTRACT(HOUR FROM created_at)
    ORDER BY hour_of_day
  `;
  
  const result = await query(queryText, values);
  return result.rows;
}

// Get COD analytics
async function getCodAnalytics(filters = {}) {
  let queryText = `
    SELECT 
      DATE(cp.created_at) as date,
      COUNT(*) as cod_payments,
      SUM(cp.amount) as total_cod_amount,
      COUNT(CASE WHEN cp.status = 'collected' THEN 1 END) as collected_payments,
      SUM(CASE WHEN cp.status = 'collected' THEN cp.amount ELSE 0 END) as collected_amount,
      COUNT(CASE WHEN cp.status = 'reconciled' THEN 1 END) as reconciled_payments,
      SUM(CASE WHEN cp.status = 'reconciled' THEN cp.amount ELSE 0 END) as reconciled_amount
    FROM cod_payments cp
  `;
  
  const values = [];
  const whereClauses = [];
  
  if (filters.date_from) {
    values.push(filters.date_from);
    whereClauses.push(`cp.created_at >= $${values.length}`);
  }
  
  if (filters.date_to) {
    values.push(filters.date_to);
    whereClauses.push(`cp.created_at <= $${values.length}`);
  }
  
  if (filters.driver_id) {
    values.push(filters.driver_id);
    whereClauses.push(`cp.driver_id = $${values.length}`);
  }
  
  if (whereClauses.length > 0) {
    queryText += ' WHERE ' + whereClauses.join(' AND ');
  }
  
  queryText += `
    GROUP BY DATE(cp.created_at)
    ORDER BY date
  `;
  
  const result = await query(queryText, values);
  return result.rows;
}

module.exports = {
  getDeliveryAnalytics,
  getDriverPerformanceAnalytics,
  getGeographicAnalytics,
  getTimeBasedAnalytics,
  getCodAnalytics
};