// SLA Model
const { query } = require('../../database/db');

// Get SLA metrics for shipments
async function getShipmentSLAMetrics(filters = {}) {
  let queryText = `
    SELECT 
      COUNT(*) as total_shipments,
      COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_shipments,
      COUNT(CASE WHEN status = 'delivered' AND EXTRACT(EPOCH FROM (updated_at - created_at))/3600 <= 24 THEN 1 END) as on_time_deliveries,
      AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/3600) as avg_delivery_time_hours,
      MIN(EXTRACT(EPOCH FROM (updated_at - created_at))/3600) as min_delivery_time_hours,
      MAX(EXTRACT(EPOCH FROM (updated_at - created_at))/3600) as max_delivery_time_hours,
      COUNT(CASE WHEN status IN ('pending', 'assigned', 'in_transit') AND EXTRACT(EPOCH FROM (NOW() - created_at))/3600 > 48 THEN 1 END) as overdue_shipments
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
  
  const result = await query(queryText, values);
  return result.rows[0];
}

// Get SLA metrics by driver
async function getDriverSLAMetrics(filters = {}) {
  let queryText = `
    SELECT 
      d.id as driver_id,
      d.name as driver_name,
      COUNT(s.id) as total_assignments,
      COUNT(CASE WHEN s.status = 'delivered' THEN 1 END) as completed_deliveries,
      COUNT(CASE WHEN s.status = 'delivered' AND EXTRACT(EPOCH FROM (s.updated_at - s.created_at))/3600 <= 24 THEN 1 END) as on_time_deliveries,
      AVG(CASE WHEN s.status = 'delivered' THEN EXTRACT(EPOCH FROM (s.updated_at - s.created_at))/3600 END) as avg_delivery_time_hours,
      COUNT(CASE WHEN s.status IN ('pending', 'assigned', 'in_transit') AND EXTRACT(EPOCH FROM (NOW() - s.created_at))/3600 > 48 THEN 1 END) as overdue_deliveries
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
    GROUP BY d.id, d.name
    HAVING COUNT(s.id) > 0
    ORDER BY completed_deliveries DESC
  `;
  
  const result = await query(queryText, values);
  return result.rows;
}

// Get delivery time distribution
async function getDeliveryTimeDistribution(filters = {}) {
  let queryText = `
    SELECT 
      CASE 
        WHEN EXTRACT(EPOCH FROM (updated_at - created_at))/3600 <= 6 THEN '0-6 hours'
        WHEN EXTRACT(EPOCH FROM (updated_at - created_at))/3600 <= 12 THEN '6-12 hours'
        WHEN EXTRACT(EPOCH FROM (updated_at - created_at))/3600 <= 18 THEN '12-18 hours'
        WHEN EXTRACT(EPOCH FROM (updated_at - created_at))/3600 <= 24 THEN '18-24 hours'
        ELSE '24+ hours'
      END as time_range,
      COUNT(*) as count
    FROM shipments
    WHERE status = 'delivered'
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
    queryText += ' AND ' + whereClauses.join(' AND ');
  }
  
  queryText += `
    GROUP BY 
      CASE 
        WHEN EXTRACT(EPOCH FROM (updated_at - created_at))/3600 <= 6 THEN '0-6 hours'
        WHEN EXTRACT(EPOCH FROM (updated_at - created_at))/3600 <= 12 THEN '6-12 hours'
        WHEN EXTRACT(EPOCH FROM (updated_at - created_at))/3600 <= 18 THEN '12-18 hours'
        WHEN EXTRACT(EPOCH FROM (updated_at - created_at))/3600 <= 24 THEN '18-24 hours'
        ELSE '24+ hours'
      END
    ORDER BY 
      CASE 
        WHEN EXTRACT(EPOCH FROM (updated_at - created_at))/3600 <= 6 THEN 1
        WHEN EXTRACT(EPOCH FROM (updated_at - created_at))/3600 <= 12 THEN 2
        WHEN EXTRACT(EPOCH FROM (updated_at - created_at))/3600 <= 18 THEN 3
        WHEN EXTRACT(EPOCH FROM (updated_at - created_at))/3600 <= 24 THEN 4
        ELSE 5
      END
  `;
  
  const result = await query(queryText, values);
  return result.rows;
}

// Get overdue shipments
async function getOverdueShipments(filters = {}) {
  let queryText = `
    SELECT 
      s.id,
      s.tracking_number,
      s.status,
      s.created_at,
      s.updated_at,
      d.name as driver_name,
      EXTRACT(EPOCH FROM (NOW() - s.created_at))/3600 as hours_overdue
    FROM shipments s
    LEFT JOIN drivers d ON s.assigned_driver_id = d.id
    WHERE s.status IN ('pending', 'assigned', 'in_transit') 
    AND EXTRACT(EPOCH FROM (NOW() - s.created_at))/3600 > 48
  `;
  
  const values = [];
  const whereClauses = [];
  
  if (filters.driver_id) {
    values.push(filters.driver_id);
    whereClauses.push(`s.assigned_driver_id = $${values.length}`);
  }
  
  if (whereClauses.length > 0) {
    queryText += ' AND ' + whereClauses.join(' AND ');
  }
  
  queryText += ' ORDER BY hours_overdue DESC LIMIT 50';
  
  const result = await query(queryText, values);
  return result.rows;
}

module.exports = {
  getShipmentSLAMetrics,
  getDriverSLAMetrics,
  getDeliveryTimeDistribution,
  getOverdueShipments
};