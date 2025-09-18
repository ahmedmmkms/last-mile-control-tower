// Notification service for handling push notifications in the PWA
class NotificationService {
  constructor() {
    this.permission = 'default';
    this.swRegistration = null;
  }

  // Request permission for notifications
  async requestPermission() {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications.');
      return false;
    }

    this.permission = await Notification.requestPermission();
    return this.permission === 'granted';
  }

  // Initialize service worker registration
  async initServiceWorker() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        this.swRegistration = await navigator.serviceWorker.ready;
        console.log('Service Worker is ready for push notifications');
        return true;
      } catch (error) {
        console.error('Failed to initialize service worker for push notifications:', error);
        return false;
      }
    }
    return false;
  }

  // Show a notification
  async showNotification(title, options = {}) {
    if (this.permission !== 'granted') {
      console.log('Notifications permission not granted');
      return;
    }

    // Try to show via service worker first (for push notifications)
    if (this.swRegistration && this.swRegistration.showNotification) {
      try {
        await this.swRegistration.showNotification(title, options);
        return;
      } catch (error) {
        console.log('Could not show notification via service worker, falling back to standard notification');
      }
    }

    // Fallback to standard Notification API
    if ('Notification' in window && this.permission === 'granted') {
      new Notification(title, options);
    }
  }

  // Subscribe to push notifications
  async subscribeToPush() {
    if (!this.swRegistration) {
      console.log('Service worker not initialized');
      return null;
    }

    try {
      const subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array('YOUR_PUBLIC_VAPID_KEY_HERE') // Replace with actual key
      });
      
      console.log('Push subscription:', subscription);
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return null;
    }
  }

  // Convert base64 to Uint8Array for VAPID key
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Handle incoming push messages
  handlePushMessage(event) {
    console.log('Push message received:', event);
    
    const data = event.data.json();
    const title = data.title || 'New Notification';
    const options = {
      body: data.body || '',
      icon: data.icon || '/logo192.png',
      badge: data.badge || '/logo192.png',
      data: data.data || {}
    };

    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  }

  // Handle notification click
  handleNotificationClick(event) {
    console.log('Notification clicked:', event);
    event.notification.close();
    
    // Handle navigation or other actions based on notification data
    if (event.notification.data && event.notification.data.url) {
      event.waitUntil(
        clients.openWindow(event.notification.data.url)
      );
    }
  }

  // Send a push notification to the service worker
  async sendPushNotification(title, options) {
    if (!this.swRegistration) {
      console.log('Service worker not initialized');
      return false;
    }

    try {
      // Send a message to the service worker to show a notification
      this.swRegistration.active.postMessage({
        type: 'SHOW_NOTIFICATION',
        title,
        options
      });
      return true;
    } catch (error) {
      console.error('Failed to send push notification:', error);
      return false;
    }
  }

  // Check if push notifications are supported
  isPushSupported() {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  }

  // Check if notifications are enabled
  areNotificationsEnabled() {
    return this.permission === 'granted';
  }
}

// Create a singleton instance
const notificationService = new NotificationService();

export default notificationService;