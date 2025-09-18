// WebSocket service for real-time communication
class WebSocketService {
  constructor() {
    this.ws = null;
    this.reconnectInterval = 5000; // 5 seconds
    this.maxReconnectAttempts = 5;
    this.reconnectAttempts = 0;
    this.listeners = {};
    this.isConnected = false;
    this.url = null;
    this.connectionTimeout = null;
  }

  // Connect to WebSocket server
  connect(url) {
    this.url = url;
    
    // Clear any existing connection
    this.close();
    
    try {
      this.ws = new WebSocket(url);
      
      // Set up connection timeout
      this.connectionTimeout = setTimeout(() => {
        if (!this.isConnected) {
          console.warn('WebSocket connection timeout');
          this.handleConnectionError(new Error('Connection timeout'));
        }
      }, 10000); // 10 seconds timeout
      
      this.ws.onopen = (event) => {
        console.log('WebSocket connected');
        clearTimeout(this.connectionTimeout);
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.notifyListeners('open', event);
      };
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data);
          this.notifyListeners('message', data);
          
          // Also notify specific event listeners
          if (data.type) {
            this.notifyListeners(data.type, data.payload);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected', event.code, event.reason);
        clearTimeout(this.connectionTimeout);
        this.isConnected = false;
        this.notifyListeners('close', event);
        
        // Attempt to reconnect if not closed intentionally
        if (event.code !== 1000) { // 1000 = Normal closure
          this.handleReconnection();
        }
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        clearTimeout(this.connectionTimeout);
        this.notifyListeners('error', error);
        this.handleConnectionError(error);
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.handleConnectionError(error);
    }
  }

  // Handle connection errors
  handleConnectionError(error) {
    this.isConnected = false;
    this.notifyListeners('connection-error', error);
    this.handleReconnection();
  }

  // Handle reconnection logic
  handleReconnection() {
    if (this.reconnectAttempts < this.maxReconnectAttempts && this.url) {
      setTimeout(() => {
        this.reconnectAttempts++;
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect(this.url);
      }, this.reconnectInterval);
    } else {
      console.log('Max reconnection attempts reached or no URL available');
      this.notifyListeners('max-reconnect-attempts-reached', {
        attempts: this.reconnectAttempts,
        maxAttempts: this.maxReconnectAttempts
      });
    }
  }

  // Send message to server
  send(message) {
    if (this.ws && this.isConnected) {
      try {
        const messageToSend = typeof message === 'string' ? message : JSON.stringify(message);
        this.ws.send(messageToSend);
        console.log('WebSocket message sent:', message);
        return true;
      } catch (error) {
        console.error('Error sending WebSocket message:', error);
        return false;
      }
    } else {
      console.warn('WebSocket not connected, message not sent:', message);
      return false;
    }
  }

  // Send message with retry logic
  sendWithRetry(message, maxRetries = 3) {
    return new Promise((resolve, reject) => {
      const attemptSend = (retryCount) => {
        if (this.send(message)) {
          resolve(true);
        } else if (retryCount < maxRetries) {
          console.log(`Retrying message send (${retryCount + 1}/${maxRetries})`);
          setTimeout(() => attemptSend(retryCount + 1), 1000);
        } else {
          reject(new Error('Failed to send message after retries'));
        }
      };
      
      attemptSend(0);
    });
  }

  // Close connection
  close() {
    if (this.ws) {
      this.ws.close(1000, 'Client closed connection');
      this.ws = null;
    }
    
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }
    
    this.isConnected = false;
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
          console.error('Error in WebSocket listener callback:', error);
        }
      });
    }
  }

  // Subscribe to specific events
  subscribeToDriverLocations(callback) {
    this.addListener('driver-location-update', callback);
  }

  subscribeToShipmentUpdates(callback) {
    this.addListener('shipment-update', callback);
  }

  subscribeToAssignmentNotifications(callback) {
    this.addListener('assignment-notification', callback);
  }

  // Subscribe to connection status changes
  subscribeToConnectionStatus(callback) {
    this.addListener('open', callback);
    this.addListener('close', callback);
    this.addListener('error', callback);
    this.addListener('connection-error', callback);
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.maxReconnectAttempts
    };
  }
}

// Create a singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;