// Analytics Controller
const Analytics = require('../models/analyticsModel');
const { isValidUUID } = require('../utils/uuidValidator');
const { validateDate } = require('../utils/dateValidator');

// Get delivery analytics
async function getDeliveryAnalytics(req, res) {
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
    
    const analytics = await Analytics.getDeliveryAnalytics(filters);
    res.status(200).json(analytics);
  } catch (error) {
    if (error.message.includes('Invalid date')) {
      return res.status(400).json({ error: error.message });
    }
    console.error('Error fetching delivery analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get driver performance analytics
async function getDriverPerformanceAnalytics(req, res) {
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
    
    const analytics = await Analytics.getDriverPerformanceAnalytics(filters);
    
    // Enrich with calculated metrics
    const enrichedAnalytics = analytics.map(driver => {
      const totalAssignments = parseInt(driver.total_assignments) || 0;
      const completedDeliveries = parseInt(driver.completed_deliveries) || 0;
      const failedDeliveries = parseInt(driver.failed_deliveries) || 0;
      const totalTime = parseFloat(driver.total_delivery_time) || 0;
      
      const successRate = totalAssignments > 0 ? ((totalAssignments - failedDeliveries) / totalAssignments * 100).toFixed(2) : 0;
      const avgDeliveryTime = completedDeliveries > 0 ? (totalTime / completedDeliveries).toFixed(2) : 0;
      
      return {
        ...driver,
        success_rate: successRate,
        average_delivery_time: avgDeliveryTime
      };
    });
    
    res.status(200).json(enrichedAnalytics);
  } catch (error) {
    if (error.message.includes('Invalid date')) {
      return res.status(400).json({ error: error.message });
    }
    console.error('Error fetching driver performance analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get geographic analytics
async function getGeographicAnalytics(req, res) {
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
    
    const analytics = await Analytics.getGeographicAnalytics(filters);
    
    // Enrich with calculated metrics
    const enrichedAnalytics = analytics.map(location => {
      const totalShipments = parseInt(location.total_shipments) || 0;
      const completedShipments = parseInt(location.completed_shipments) || 0;
      const failedShipments = parseInt(location.failed_shipments) || 0;
      
      const successRate = totalShipments > 0 ? ((totalShipments - failedShipments) / totalShipments * 100).toFixed(2) : 0;
      const completionRate = totalShipments > 0 ? (completedShipments / totalShipments * 100).toFixed(2) : 0;
      
      return {
        ...location,
        success_rate: successRate,
        completion_rate: completionRate
      };
    });
    
    res.status(200).json(enrichedAnalytics);
  } catch (error) {
    if (error.message.includes('Invalid date')) {
      return res.status(400).json({ error: error.message });
    }
    console.error('Error fetching geographic analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get time-based analytics
async function getTimeBasedAnalytics(req, res) {
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
    
    const analytics = await Analytics.getTimeBasedAnalytics(filters);
    
    // Enrich with calculated metrics
    const enrichedAnalytics = analytics.map(timeSlot => {
      const deliveryCount = parseInt(timeSlot.delivery_count) || 0;
      const completedCount = parseInt(timeSlot.completed_count) || 0;
      const failedCount = parseInt(timeSlot.failed_count) || 0;
      const totalTime = parseFloat(timeSlot.total_delivery_time) || 0;
      
      const successRate = deliveryCount > 0 ? ((deliveryCount - failedCount) / deliveryCount * 100).toFixed(2) : 0;
      const completionRate = deliveryCount > 0 ? (completedCount / deliveryCount * 100).toFixed(2) : 0;
      const avgDeliveryTime = completedCount > 0 ? (totalTime / completedCount).toFixed(2) : 0;
      
      return {
        ...timeSlot,
        success_rate: successRate,
        completion_rate: completionRate,
        average_delivery_time: avgDeliveryTime
      };
    });
    
    res.status(200).json(enrichedAnalytics);
  } catch (error) {
    if (error.message.includes('Invalid date')) {
      return res.status(400).json({ error: error.message });
    }
    console.error('Error fetching time-based analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get COD analytics
async function getCodAnalytics(req, res) {
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
    if (error.message.includes('Invalid date')) {
      return res.status(400).json({ error: error.message });
    }
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