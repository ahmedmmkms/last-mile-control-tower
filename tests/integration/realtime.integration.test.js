// Real-time Integration Tests
const http = require('http');
const { Server } = require('socket.io');
const { io: Client } = require('socket.io-client');
const { app } = require('../../index');
const request = require('supertest');

describe('Real-time Integration Tests', () => {
  let server, io, driverSocket, dispatcherSocket;

  beforeAll((done) => {
    // Create HTTP server
    server = http.createServer(app);
    
    // Initialize Socket.IO server
    io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
    
    // Start server
    server.listen(3002, () => {
      console.log('Integration test server running on port 3002');
      done();
    });
  });

  afterAll((done) => {
    // Close server
    server.close(() => {
      console.log('Integration test server closed');
      done();
    });
  });

  beforeEach((done) => {
    // Create driver socket
    driverSocket = Client('http://localhost:3002');
    
    // Create dispatcher socket
    dispatcherSocket = Client('http://localhost:3002');
    
    let connectedClients = 0;
    const checkConnections = () => {
      connectedClients++;
      if (connectedClients === 2) {
        done();
      }
    };
    
    driverSocket.on('connect', checkConnections);
    dispatcherSocket.on('connect', checkConnections);
  });

  afterEach(() => {
    // Disconnect sockets
    if (driverSocket) {
      driverSocket.disconnect();
    }
    if (dispatcherSocket) {
      dispatcherSocket.disconnect();
    }
  });

  test('should broadcast driver location updates to all clients', (done) => {
    const locationData = {
      latitude: 40.7128,
      longitude: -74.0060
    };
    
    // Dispatcher listens for location updates
    dispatcherSocket.on('driverLocationUpdated', (data) => {
      expect(data.latitude).toBe(40.7128);
      expect(data.longitude).toBe(-74.0060);
      expect(data.driverId).toBeDefined();
      expect(data.timestamp).toBeDefined();
      done();
    });
    
    // Driver sends location update
    driverSocket.emit('driverLocationUpdate', locationData);
  });

  test('should send assignment notifications to specific driver', (done) => {
    const assignmentData = {
      driverId: 'test-driver-id',
      shipmentId: 'test-shipment-id',
      message: 'New assignment received'
    };
    
    // Driver joins room
    driverSocket.emit('joinDriverRoom', 'test-driver-id');
    
    // Driver listens for assignment notifications
    driverSocket.on('assignmentReceived', (data) => {
      expect(data.driverId).toBe('test-driver-id');
      expect(data.shipmentId).toBe('test-shipment-id');
      expect(data.message).toBe('New assignment received');
      done();
    });
    
    // Dispatcher sends assignment notification
    dispatcherSocket.emit('driverAssignment', assignmentData);
  });

  test('should authenticate driver and receive success response', (done) => {
    // Driver authenticates
    driverSocket.emit('authenticateDriver', { driverId: 'test-driver-id', token: 'test-token' });
    
    // Driver listens for authentication success
    driverSocket.on('authenticationSuccess', (data) => {
      expect(data.driverId).toBe('test-driver-id');
      done();
    });
  });

  test('should reject unauthenticated driver location updates', (done) => {
    const locationData = {
      latitude: 40.7128,
      longitude: -74.0060
    };
    
    // Driver listens for error
    driverSocket.on('error', (data) => {
      expect(data.message).toBe('Driver not authenticated');
      done();
    });
    
    // Driver sends location update without authentication
    driverSocket.emit('driverLocationUpdate', locationData);
  });
});