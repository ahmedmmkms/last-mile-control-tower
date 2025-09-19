// SLA Controller
const SLA = require('../models/slaModel');
const { isValidUUID } = require('../utils/uuidValidator');
const { validateDate } = require('../utils/dateValidator');

// Get shipment SLA metrics
async function getShipmentSLAMetrics(req, res) {
  try {
    const filters = {};
    
    // Extract filters from query parameters
    if (req.query.date_from) {
      validateDate(req.query.date_from, 'date_from');
      filters.date_from = new Date(req.query.date_from);
    }
    if (req.query.date_to) {
      validateDate(req.query.date_to, 'date_to');
      filters.date_to = new Date(req.query.date_to);
    }
    if (req.query.driver_id) {
      if (!isValidUUID(req.query.driver_id)) {
        return res.status(400).json({ error: 'Invalid driver ID format' });
      }
      filters.driver_id = req.query.driver_id;
    }
    
    const metrics = await SLA.getShipmentSLAMetrics(filters);
    
    // Calculate additional metrics
    const totalShipments = parseInt(metrics.total_shipments) || 0;
    const deliveredShipments = parseInt(metrics.delivered_shipments) || 0;
    const onTimeDeliveries = parseInt(metrics.on_time_deliveries) || 0;
    const overdueShipments = parseInt(metrics.overdue_shipments) || 0;
    
    const deliveryRate = totalShipments > 0 ? (deliveredShipments / totalShipments * 100).toFixed(2) : 0;
    const onTimeDeliveryRate = deliveredShipments > 0 ? (onTimeDeliveries / deliveredShipments * 100).toFixed(2) : 0;
    const overdueRate = totalShipments > 0 ? (overdueShipments / totalShipments * 100).toFixed(2) : 0;
    
    res.status(200).json({
      ...metrics,
      delivery_rate: deliveryRate,
      on_time_delivery_rate: onTimeDeliveryRate,
      overdue_rate: overdueRate
    });
  } catch (error) {
    if (error.message.includes('Invalid date')) {
      return res.status(400).json({ error: error.message });
    }
    console.error('Error fetching shipment SLA metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get driver SLA metrics
async function getDriverSLAMetrics(req, res) {
  try {
    const filters = {};
    
    // Extract filters from query parameters
    if (req.query.date_from) {
      validateDate(req.query.date_from, 'date_from');
      filters.date_from = new Date(req.query.date_from);
    }
    if (req.query.date_to) {
      validateDate(req.query.date_to, 'date_to');
      filters.date_to = new Date(req.query.date_to);
    }
    
    const metrics = await SLA.getDriverSLAMetrics(filters);
    
    // Enrich with calculated metrics
    const enrichedMetrics = metrics.map(driver => {
      const totalAssignments = parseInt(driver.total_assignments) || 0;
      const completedDeliveries = parseInt(driver.completed_deliveries) || 0;
      const onTimeDeliveries = parseInt(driver.on_time_deliveries) || 0;
      const overdueDeliveries = parseInt(driver.overdue_deliveries) || 0;
      
      const completionRate = totalAssignments > 0 ? (completedDeliveries / totalAssignments * 100).toFixed(2) : 0;
      const onTimeRate = completedDeliveries > 0 ? (onTimeDeliveries / completedDeliveries * 100).toFixed(2) : 0;
      const overdueRate = totalAssignments > 0 ? (overdueDeliveries / totalAssignments * 100).toFixed(2) : 0;
      
      return {
        ...driver,
        completion_rate: completionRate,
        on_time_rate: onTimeRate,
        overdue_rate: overdueRate
      };
    });
    
    res.status(200).json(enrichedMetrics);
  } catch (error) {
    if (error.message.includes('Invalid date')) {
      return res.status(400).json({ error: error.message });
    }
    console.error('Error fetching driver SLA metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get delivery time distribution
async function getDeliveryTimeDistribution(req, res) {
  try {
    const filters = {};
    
    // Extract filters from query parameters
    if (req.query.date_from) {
      validateDate(req.query.date_from, 'date_from');
      filters.date_from = new Date(req.query.date_from);
    }
    if (req.query.date_to) {
      validateDate(req.query.date_to, 'date_to');
      filters.date_to = new Date(req.query.date_to);
    }
    if (req.query.driver_id) {
      if (!isValidUUID(req.query.driver_id)) {
        return res.status(400).json({ error: 'Invalid driver ID format' });
      }
      filters.driver_id = req.query.driver_id;
    }
    
    const distribution = await SLA.getDeliveryTimeDistribution(filters);
    res.status(200).json(distribution);
  } catch (error) {
    if (error.message.includes('Invalid date')) {
      return res.status(400).json({ error: error.message });
    }
    console.error('Error fetching delivery time distribution:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get overdue shipments
async function getOverdueShipments(req, res) {
  try {
    const filters = {};
    
    // Extract filters from query parameters
    if (req.query.driver_id) {
      if (!isValidUUID(req.query.driver_id)) {
        return res.status(400).json({ error: 'Invalid driver ID format' });
      }
      filters.driver_id = req.query.driver_id;
    }
    
    const overdueShipments = await SLA.getOverdueShipments(filters);
    res.status(200).json(overdueShipments);
  } catch (error) {
    console.error('Error fetching overdue shipments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getShipmentSLAMetrics,
  getDriverSLAMetrics,
  getDeliveryTimeDistribution,
  getOverdueShipments
};