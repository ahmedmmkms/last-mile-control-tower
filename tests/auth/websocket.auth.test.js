// WebSocket Authentication Tests
const http = require('http');
const { Server } = require('socket.io');
const { io: Client } = require('socket.io-client');
const { app } = require('../../index');

describe('WebSocket Authentication Tests', () => {
  let server, io, clientSocket;

  beforeAll((done) => {
    // Create HTTP server
    server = http.createServer(app);
    
    // Initialize Socket.IO server with authentication middleware
    io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
    
    // Add authentication middleware
    io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      if (token) {
        next();
      } else {
        next(new Error('Authentication error'));
      }
    });
    
    // Start server
    server.listen(3003, () => {
      console.log('Auth test server running on port 3003');
      done();
    });
  });

  afterAll((done) => {
    // Close server
    server.close(() => {
      console.log('Auth test server closed');
      done();
    });
  });

  test('should reject connection without authentication token', (done) => {
    // Create client socket without auth token
    clientSocket = Client('http://localhost:3003');
    
    clientSocket.on('connect_error', (error) => {
      expect(error.message).toBe('Authentication error');
      done();
    });
  });

  test('should accept connection with valid authentication token', (done) => {
    // Create client socket with auth token
    clientSocket = Client('http://localhost:3003', {
      auth: {
        token: 'valid-test-token'
      }
    });
    
    clientSocket.on('connect', () => {
      expect(clientSocket.connected).toBe(true);
      done();
    });
  });
});