// Concurrent Users Performance Tests
const http = require('http');
const { Server } = require('socket.io');
const { io: Client } = require('socket.io-client');
const { app } = require('../../index');
const request = require('supertest');

describe('Concurrent Users Performance Tests', () => {
  let server, io, clientSockets = [];

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
    server.listen(3004, () => {
      console.log('Performance test server running on port 3004');
      done();
    });
  });

  afterAll((done) => {
    // Close server
    server.close(() => {
      console.log('Performance test server closed');
      done();
    });
  });

  afterEach(() => {
    // Disconnect all client sockets
    clientSockets.forEach(socket => {
      if (socket) {
        socket.disconnect();
      }
    });
    clientSockets = [];
  });

  test('should handle 50 concurrent WebSocket connections', (done) => {
    const numberOfClients = 50;
    let connectedClients = 0;
    
    // Create multiple client sockets
    for (let i = 0; i < numberOfClients; i++) {
      const clientSocket = Client('http://localhost:3004');
      clientSockets.push(clientSocket);
      
      clientSocket.on('connect', () => {
        connectedClients++;
        
        // When all clients are connected
        if (connectedClients === numberOfClients) {
          console.log(`All ${numberOfClients} clients connected successfully`);
          expect(connectedClients).toBe(numberOfClients);
          done();
        }
      });
      
      clientSocket.on('connect_error', (error) => {
        done.fail(`Client ${i} failed to connect: ${error.message}`);
      });
    }
  }, 5000); // 5 second timeout

  test('should handle 100 concurrent REST API requests', async () => {
    const numberOfRequests = 100;
    const requests = [];
    
    // Create multiple concurrent requests
    for (let i = 0; i < numberOfRequests; i++) {
      const requestPromise = request(app)
        .get('/api')
        .expect(200);
      requests.push(requestPromise);
    }
    
    // Wait for all requests to complete
    const responses = await Promise.all(requests);
    
    expect(responses.length).toBe(numberOfRequests);
    responses.forEach(response => {
      expect(response.body.message).toBe('Last-Mile Delivery Control Tower API');
    });
  }, 10000); // 10 second timeout

  test('should handle concurrent driver location updates', (done) => {
    const numberOfDrivers = 20;
    let connectedDrivers = 0;
    let locationUpdatesReceived = 0;
    
    // Create dispatcher socket to listen for updates
    const dispatcherSocket = Client('http://localhost:3004');
    clientSockets.push(dispatcherSocket);
    
    dispatcherSocket.on('connect', () => {
      // Listen for location updates
      dispatcherSocket.on('driverLocationUpdated', (data) => {
        locationUpdatesReceived++;
        
        // When all location updates are received
        if (locationUpdatesReceived === numberOfDrivers) {
          console.log(`Received all ${numberOfDrivers} location updates`);
          expect(locationUpdatesReceived).toBe(numberOfDrivers);
          done();
        }
      });
      
      // Create multiple driver sockets
      for (let i = 0; i < numberOfDrivers; i++) {
        const driverSocket = Client('http://localhost:3004');
        clientSockets.push(driverSocket);
        
        driverSocket.on('connect', () => {
          connectedDrivers++;
          
          // Send location update
          driverSocket.emit('driverLocationUpdate', {
            latitude: 40.7128 + (i * 0.001),
            longitude: -74.0060 + (i * 0.001)
          });
        });
      }
    });
  }, 5000); // 5 second timeout
});