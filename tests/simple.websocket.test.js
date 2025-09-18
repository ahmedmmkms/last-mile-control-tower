// Simple WebSocket Test
const http = require('http');
const { Server } = require('socket.io');
const { io: Client } = require('socket.io-client');

describe('Simple WebSocket Test', () => {
  let server, io, clientSocket;

  beforeAll((done) => {
    // Create a simple HTTP server
    const app = require('express')();
    server = http.createServer(app);
    
    // Initialize Socket.IO server
    io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
    
    // Handle connection
    io.on('connection', (socket) => {
      socket.on('testEvent', (data) => {
        socket.emit('testResponse', data);
      });
    });
    
    // Start server
    server.listen(3005, () => {
      done();
    });
  });

  afterAll((done) => {
    // Close server
    if (server) {
      server.close(done);
    } else {
      done();
    }
  });

  test('should connect to WebSocket server and exchange messages', (done) => {
    // Create client socket
    clientSocket = Client('http://localhost:3005');
    
    clientSocket.on('connect', () => {
      // Send a test event
      clientSocket.emit('testEvent', { message: 'Hello WebSocket' });
    });
    
    clientSocket.on('testResponse', (data) => {
      expect(data.message).toBe('Hello WebSocket');
      clientSocket.disconnect();
      done();
    });
  });
});