// Analytics Controller
const Analytics = require('../models/analyticsModel');
const { isValidUUID } = require('../utils/uuidValidator');

// Get delivery analytics
async function getDeliveryAnalytics(req, res) {
  try {
    const filters = {};
    
    // Extract filters from query parameters
    if (req.query.date_from) filters.date_from = new Date(req.query.date_from);
    if (req.query.date_to) filters.date_to = new Date(req.query.date_to);
    if (req.query.driver_id) {
      if (!isValidUUID(req.query.driver_id)) {
        return res.status(400).json({ error: 'Invalid driver ID format' });
      }
      filters.driver_id = req.query.driver_id;
    }
    
    const analytics = await Analytics.getDeliveryAnalytics(filters);
    
    // Enrich with calculated metrics
    const enrichedAnalytics = analytics.map(day => {
      const totalDeliveries = parseInt(day.total_deliveries) || 0;
      const completedDeliveries = parseInt(day.completed_deliveries) || 0;
      const failedDeliveries = parseInt(day.failed_deliveries) || 0;
      
      const completionRate = totalDeliveries > 0 ? (completedDeliveries / totalDeliveries * 100).toFixed(2) : 0;
      const failureRate = totalDeliveries > 0 ? (failedDeliveries / totalDeliveries * 100).toFixed(2) : 0;
      
      return {
        ...day,
        completion_rate: completionRate,
        failure_rate: failureRate,
        avg_delivery_time_hours: parseFloat(day.avg_delivery_time_hours || 0).toFixed(2)
      };
    });
    
    res.status(200).json(enrichedAnalytics);
  } catch (error) {
    console.error('Error fetching delivery analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get driver performance analytics
async function getDriverPerformanceAnalytics(req, res) {
  try {
    const filters = {};
    
    // Extract filters from query parameters
    if (req.query.date_from) filters.date_from = new Date(req.query.date_from);
    if (req.query.date_to) filters.date_to = new Date(req.query.date_to);
    
    const analytics = await Analytics.getDriverPerformanceAnalytics(filters);
    
    // Enrich with calculated metrics
    const enrichedAnalytics = analytics.map(driver => {
      const totalAssignments = parseInt(driver.total_assignments) || 0;
      const completedDeliveries = parseInt(driver.completed_deliveries) || 0;
      const failedDeliveries = parseInt(driver.failed_deliveries) || 0;
      const onTimeDeliveries = parseInt(driver.on_time_deliveries) || 0;
      
      const completionRate = totalAssignments > 0 ? (completedDeliveries / totalAssignments * 100).toFixed(2) : 0;
      const failureRate = totalAssignments > 0 ? (failedDeliveries / totalAssignments * 100).toFixed(2) : 0;
      const onTimeRate = completedDeliveries > 0 ? (onTimeDeliveries / completedDeliveries * 100).toFixed(2) : 0;
      const avgDeliveryTime = parseFloat(driver.avg_delivery_time_hours || 0).toFixed(2);
      
      return {
        ...driver,
        completion_rate: completionRate,
        failure_rate: failureRate,
        on_time_rate: onTimeRate,
        avg_delivery_time_hours: avgDeliveryTime
      };
    });
    
    res.status(200).json(enrichedAnalytics);
  } catch (error) {
    console.error('Error fetching driver performance analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get geographic analytics
async function getGeographicAnalytics(req, res) {
  try {
    const filters = {};
    
    // Extract filters from query parameters
    if (req.query.date_from) filters.date_from = new Date(req.query.date_from);
    if (req.query.date_to) filters.date_to = new Date(req.query.date_to);
    if (req.query.driver_id) {
      if (!isValidUUID(req.query.driver_id)) {
        return res.status(400).json({ error: 'Invalid driver ID format' });
      }
      filters.driver_id = req.query.driver_id;
    }
    
    const analytics = await Analytics.getGeographicAnalytics(filters);
    
    // Enrich with calculated metrics
    const enrichedAnalytics = analytics.map(location => {
      const deliveryCount = parseInt(location.delivery_count) || 0;
      const completedDeliveries = parseInt(location.completed_deliveries) || 0;
      
      const completionRate = deliveryCount > 0 ? (completedDeliveries / deliveryCount * 100).toFixed(2) : 0;
      const avgDeliveryTime = parseFloat(location.avg_delivery_time_hours || 0).toFixed(2);
      
      return {
        ...location,
        completion_rate: completionRate,
        avg_delivery_time_hours: avgDeliveryTime
      };
    });
    
    res.status(200).json(enrichedAnalytics);
  } catch (error) {
    console.error('Error fetching geographic analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get time-based analytics
async function getTimeBasedAnalytics(req, res) {
  try {
    const filters = {};
    
    // Extract filters from query parameters
    if (req.query.date_from) filters.date_from = new Date(req.query.date_from);
    if (req.query.date_to) filters.date_to = new Date(req.query.date_to);
    if (req.query.driver_id) {
      if (!isValidUUID(req.query.driver_id)) {
        return res.status(400).json({ error: 'Invalid driver ID format' });
      }
      filters.driver_id = req.query.driver_id;
    }
    
    const analytics = await Analytics.getTimeBasedAnalytics(filters);
    
    // Enrich with calculated metrics
    const enrichedAnalytics = analytics.map(timeSlot => {
      const deliveryCount = parseInt(timeSlot.delivery_count) || 0;
      const completedDeliveries = parseInt(timeSlot.completed_deliveries) || 0;
      
      const completionRate = deliveryCount > 0 ? (completedDeliveries / deliveryCount * 100).toFixed(2) : 0;
      const avgDeliveryTime = parseFloat(timeSlot.avg_delivery_time_hours || 0).toFixed(2);
      
      return {
        ...timeSlot,
        completion_rate: completionRate,
        avg_delivery_time_hours: avgDeliveryTime
      };
    });
    
    res.status(200).json(enrichedAnalytics);
  } catch (error) {
    console.error('Error fetching time-based analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get COD analytics
async function getCodAnalytics(req, res) {
  try {
    const filters = {};
    
    // Extract filters from query parameters
    if (req.query.date_from) filters.date_from = new Date(req.query.date_from);
    if (req.query.date_to) filters.date_to = new Date(req.query.date_to);
    if (req.query.driver_id) {
      if (!isValidUUID(req.query.driver_id)) {
        return res.status(400).json({ error: 'Invalid driver ID format' });
      }
      filters.driver_id = req.query.driver_id;
    }
    
    const analytics = await Analytics.getCodAnalytics(filters);
    
    // Enrich with calculated metrics
    const enrichedAnalytics = analytics.map(day => {
      const codPayments = parseInt(day.cod_payments) || 0;
      const collectedPayments = parseInt(day.collected_payments) || 0;
      const reconciledPayments = parseInt(day.reconciled_payments) || 0;
      
      const collectionRate = codPayments > 0 ? (collectedPayments / codPayments * 100).toFixed(2) : 0;
      const reconciliationRate = codPayments > 0 ? (reconciledPayments / codPayments * 100).toFixed(2) : 0;
      
      const totalCodAmount = parseFloat(day.total_cod_amount || 0).toFixed(2);
      const collectedAmount = parseFloat(day.collected_amount || 0).toFixed(2);
      const reconciledAmount = parseFloat(day.reconciled_amount || 0).toFixed(2);
      
      return {
        ...day,
        collection_rate: collectionRate,
        reconciliation_rate: reconciliationRate,
        total_cod_amount: totalCodAmount,
        collected_amount: collectedAmount,
        reconciled_amount: reconciledAmount
      };
    });
    
    res.status(200).json(enrichedAnalytics);
  } catch (error) {
    console.error('Error fetching COD analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getDeliveryAnalytics,
  getDriverPerformanceAnalytics,
  getGeographicAnalytics,
  getTimeBasedAnalytics,
  getCodAnalytics
};