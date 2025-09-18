// WebSocket Tests
const http = require('http');
const { Server } = require('socket.io');
const { io: Client } = require('socket.io-client');
const { app } = require('../index');

describe('WebSocket Tests', () => {
  let server, io, clientSocket;

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
    server.listen(3001, () => {
      console.log('Test server running on port 3001');
      done();
    });
  });

  afterAll((done) => {
    // Close server
    server.close(() => {
      console.log('Test server closed');
      done();
    });
  });

  beforeEach((done) => {
    // Create client socket
    clientSocket = Client('http://localhost:3001');
    
    clientSocket.on('connect', () => {
      console.log('Client connected');
      done();
    });
  });

  afterEach(() => {
    // Disconnect client socket
    if (clientSocket) {
      clientSocket.disconnect();
    }
  });

  test('should connect to WebSocket server', (done) => {
    expect(clientSocket.connected).toBe(true);
    done();
  });

  test('should authenticate driver', (done) => {
    clientSocket.emit('authenticateDriver', { driverId: 'test-driver-id', token: 'test-token' });
    
    clientSocket.on('authenticationSuccess', (data) => {
      expect(data.driverId).toBe('test-driver-id');
      done();
    });
  });

  test('should handle driver location updates', (done) => {
    const locationData = {
      latitude: 40.7128,
      longitude: -74.0060
    };
    
    clientSocket.emit('driverLocationUpdate', locationData);
    
    clientSocket.on('driverLocationUpdated', (data) => {
      expect(data.latitude).toBe(40.7128);
      expect(data.longitude).toBe(-74.0060);
      expect(data.driverId).toBeDefined();
      expect(data.timestamp).toBeDefined();
      done();
    });
  });

  test('should handle driver assignment notifications', (done) => {
    const assignmentData = {
      driverId: 'test-driver-id',
      shipmentId: 'test-shipment-id',
      message: 'New assignment received'
    };
    
    clientSocket.emit('driverAssignment', assignmentData);
    
    // Join the driver room to receive the notification
    clientSocket.emit('joinDriverRoom', 'test-driver-id');
    
    clientSocket.on('assignmentReceived', (data) => {
      expect(data.driverId).toBe('test-driver-id');
      expect(data.shipmentId).toBe('test-shipment-id');
      expect(data.message).toBe('New assignment received');
      done();
    });
  });
});