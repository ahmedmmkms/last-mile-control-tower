// Dispatcher notification service for handling real-time alerts and notifications
class DispatcherNotificationService {
  constructor() {
    this.listeners = {};
    this.notifications = [];
  }

  // Add event listener
  addListener(eventType, callback) {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    this.listeners[eventType].push(callback);
  }

  // Remove event listener
  removeListener(eventType, callback) {
    if (this.listeners[eventType]) {
      this.listeners[eventType] = this.listeners[eventType].filter(cb => cb !== callback);
    }
  }

  // Notify listeners of an event
  notifyListeners(eventType, data) {
    if (this.listeners[eventType]) {
      this.listeners[eventType].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in notification listener callback:', error);
        }
      });
    }
  }

  // Add a new notification
  addNotification(notification) {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...notification
    };
    
    this.notifications.push(newNotification);
    this.notifyListeners('notification', newNotification);
    
    // Also notify specific event listeners
    if (notification.type) {
      this.notifyListeners(notification.type, newNotification);
    }
    
    return newNotification;
  }

  // Get all notifications
  getNotifications() {
    return this.notifications;
  }

  // Get unread notifications
  getUnreadNotifications() {
    return this.notifications.filter(n => !n.read);
  }

  // Mark notification as read
  markAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.notifyListeners('notification-read', notification);
    }
  }

  // Mark all notifications as read
  markAllAsRead() {
    this.notifications.forEach(n => {
      n.read = true;
    });
    this.notifyListeners('all-notifications-read', this.notifications);
  }

  // Remove notification
  removeNotification(notificationId) {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.notifyListeners('notification-removed', notificationId);
  }

  // Clear all notifications
  clearAll() {
    this.notifications = [];
    this.notifyListeners('all-notifications-cleared', []);
  }

  // Subscribe to assignment notifications
  subscribeToAssignments(callback) {
    this.addListener('assignment-notification', callback);
  }

  // Subscribe to driver status changes
  subscribeToDriverStatus(callback) {
    this.addListener('driver-status-change', callback);
  }

  // Subscribe to shipment updates
  subscribeToShipmentUpdates(callback) {
    this.addListener('shipment-update', callback);
  }

  // Create assignment notification
  createAssignmentNotification(assignmentData) {
    return this.addNotification({
      type: 'assignment-notification',
      title: 'New Assignment',
      message: `Shipment ${assignmentData.shipment_id} assigned to driver ${assignmentData.driver_name}`,
      data: assignmentData
    });
  }

  // Create driver status notification
  createDriverStatusNotification(driverData) {
    return this.addNotification({
      type: 'driver-status-change',
      title: 'Driver Status Update',
      message: `Driver ${driverData.name} is now ${driverData.status}`,
      data: driverData
    });
  }

  // Create shipment update notification
  createShipmentUpdateNotification(shipmentData) {
    return this.addNotification({
      type: 'shipment-update',
      title: 'Shipment Update',
      message: `Shipment ${shipmentData.tracking_number} status changed to ${shipmentData.status}`,
      data: shipmentData
    });
  }
}

// Create a singleton instance
const dispatcherNotificationService = new DispatcherNotificationService();

export default dispatcherNotificationService;