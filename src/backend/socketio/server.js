// Socket.IO server for real-time communication
const http = require('http');
const { Server } = require('socket.io');
const { app } = require('../../..');

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with authentication middleware
const io = new Server(server, {
  cors: {
    origin: "*", // In production, restrict this to your frontend domain
    methods: ["GET", "POST"]
  }
});

// Store active driver connections and connection statistics
const driverConnections = new Map();
let connectionCount = 0;
let activeConnections = 0;

// Authentication middleware for Socket.IO
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  // In a real implementation, we would validate the JWT token
  // For now, we'll allow all connections but log the token
  if (token) {
    console.log('Socket authentication token provided:', token);
    next();
  } else {
    console.log('No authentication token provided for socket connection');
    next(); // Still allow connection for now, but in production you might want to reject
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  connectionCount++;
  activeConnections++;
  
  console.log(`A user connected: ${socket.id}`);
  console.log(`Total connections: ${connectionCount}, Active connections: ${activeConnections}`);
  
  // Log connection details
  const connectionTime = new Date().toISOString();
  console.log(`Connection established at: ${connectionTime}`);
  console.log(`Client IP: ${socket.handshake.address}`);
  console.log(`User agent: ${socket.handshake.headers['user-agent']}`);
  
  // Handle driver authentication
  socket.on('authenticateDriver', (data) => {
    const { driverId, token } = data;
    // In a real implementation, we would validate the token and driverId
    // For now, we'll just associate the socket with the driverId
    driverConnections.set(driverId, socket.id);
    socket.driverId = driverId;
    console.log(`Driver ${driverId} authenticated with socket ${socket.id}`);
    socket.emit('authenticationSuccess', { driverId });
  });
  
  // Handle driver location updates
  socket.on('driverLocationUpdate', (data) => {
    // Validate that the driver is authenticated
    if (!socket.driverId) {
      socket.emit('error', { message: 'Driver not authenticated' });
      return;
    }
    
    // Add driver ID to the data
    const locationData = {
      ...data,
      driverId: socket.driverId,
      timestamp: new Date().toISOString()
    };
    
    // Broadcast to all connected clients
    io.emit('driverLocationUpdated', locationData);
  });
  
  // Handle driver assignment notifications
  socket.on('driverAssignment', (data) => {
    // Validate that the driver is authenticated
    if (!socket.driverId) {
      socket.emit('error', { message: 'Driver not authenticated' });
      return;
    }
    
    // Send to specific driver room
    socket.to(`driver-${data.driverId}`).emit('assignmentReceived', data);
  });
  
  // Handle driver joining a room
  socket.on('joinDriverRoom', (driverId) => {
    // Validate that the driver is authenticated
    if (!socket.driverId) {
      socket.emit('error', { message: 'Driver not authenticated' });
      return;
    }
    
    socket.join(`driver-${driverId}`);
  });
  
  // Handle errors
  socket.on('error', (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });
  
  socket.on('disconnect', (reason) => {
    activeConnections--;
    console.log(`User disconnected: ${socket.id}, reason: ${reason}`);
    console.log(`Active connections: ${activeConnections}`);
    
    // Log disconnection reason
    console.log(`Disconnection time: ${new Date().toISOString()}`);
    
    // Clean up driver connection
    if (socket.driverId) {
      driverConnections.delete(socket.driverId);
    }
  });
});

// Periodic connection statistics logging
setInterval(() => {
  console.log(`=== Socket.IO Stats ===`);
  console.log(`Total connections: ${connectionCount}`);
  console.log(`Active connections: ${activeConnections}`);
  console.log(`Connected drivers: ${driverConnections.size}`);
  console.log(`=======================`);
}, 60000); // Log every minute

module.exports = { server, io };