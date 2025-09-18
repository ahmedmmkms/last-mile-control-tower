// WebSocket service for real-time communication with offline support
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
    this.offlineBuffer = []; // Buffer for messages when offline
    this.visibilityChangeListener = null;
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
        
        // Send any buffered messages
        this.sendBufferedMessages();
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
      console.warn('WebSocket not connected, buffering message:', message);
      // Buffer the message for when we reconnect
      this.bufferMessage(message);
      return false;
    }
  }

  // Buffer message for offline sending
  bufferMessage(message) {
    // Add timestamp to message
    const bufferedMessage = {
      message,
      timestamp: Date.now(),
      id: Math.random().toString(36).substr(2, 9)
    };
    
    // Add to buffer (keep only last 100 messages)
    this.offlineBuffer.push(bufferedMessage);
    if (this.offlineBuffer.length > 100) {
      this.offlineBuffer.shift();
    }
    
    console.log('Message buffered for offline sending:', message);
  }

  // Send buffered messages when connection is restored
  async sendBufferedMessages() {
    if (this.offlineBuffer.length === 0) {
      return;
    }
    
    console.log(`Sending ${this.offlineBuffer.length} buffered messages`);
    
    // Send messages one by one
    for (const buffered of this.offlineBuffer) {
      try {
        const success = this.send(buffered.message);
        if (success) {
          // Remove from buffer on success
          this.offlineBuffer = this.offlineBuffer.filter(msg => msg.id !== buffered.id);
        }
      } catch (error) {
        console.error('Error sending buffered message:', error);
      }
      
      // Small delay between messages
      await new Promise(resolve => setTimeout(resolve, 100));
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
      maxReconnectAttempts: this.maxReconnectAttempts,
      bufferedMessages: this.offlineBuffer.length
    };
  }

  // Start monitoring page visibility for connection management
  startVisibilityMonitoring() {
    if (this.visibilityChangeListener) {
      return; // Already monitoring
    }
    
    this.visibilityChangeListener = () => {
      if (document.hidden) {
        console.log('Page hidden, connection may be paused');
      } else {
        console.log('Page visible, checking connection status');
        // If we were connected but connection seems lost, try to reconnect
        if (this.url && !this.isConnected) {
          console.log('Attempting to reconnect due to page visibility');
          this.connect(this.url);
        }
      }
    };
    
    document.addEventListener('visibilitychange', this.visibilityChangeListener);
  }

  // Stop monitoring page visibility
  stopVisibilityMonitoring() {
    if (this.visibilityChangeListener) {
      document.removeEventListener('visibilitychange', this.visibilityChangeListener);
      this.visibilityChangeListener = null;
    }
  }

  // Handle online/offline events
  handleOnlineOfflineEvents() {
    window.addEventListener('online', () => {
      console.log('Browser came online, attempting to reconnect');
      if (this.url && !this.isConnected) {
        this.reconnectAttempts = 0; // Reset reconnect attempts
        this.connect(this.url);
      }
    });
    
    window.addEventListener('offline', () => {
      console.log('Browser went offline, connection paused');
      this.isConnected = false;
      this.notifyListeners('offline', {});
    });
  }
}

// Create a singleton instance
const webSocketService = new WebSocketService();

// Initialize online/offline event handlers
webSocketService.handleOnlineOfflineEvents();

export default webSocketService;