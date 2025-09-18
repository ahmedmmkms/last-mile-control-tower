// Entry point for the application
const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const { connect, disconnect, query } = require('./src/database/db');

// Create Express app
const app = express();

// Middleware
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.DEPLOYED_URL || 'https://your-app-name.vercel.app' 
    : true,
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// Serve static files from the frontend build directory
const frontendDistPath = path.join(__dirname, 'src', 'frontend', 'dist');
app.use(express.static(frontendDistPath));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    const result = await query('SELECT 1 as db_connected');
    res.status(200).json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      database: 'connected',
      dbResult: result.rows[0]
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ 
      status: 'error', 
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    });
  }
});

// API Routes
app.get('/api', (req, res) => {
  res.json({ message: 'Last-Mile Delivery Control Tower API' });
});

// Import route files
const driverRoutes = require('./src/backend/routes/driverRoutes');
const shipmentRoutes = require('./src/backend/routes/shipmentRoutes');
const routeRoutes = require('./src/backend/routes/routeRoutes');

// Register routes
app.use('/api/drivers', driverRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/routes', routeRoutes);

// Serve the frontend index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// Vercel serverless function handler
if (process.env.NOW_REGION || process.env.VERCEL) {
  // Export the Express app as the default export for Vercel
  module.exports = app;
} else {
  // Local development - start the HTTP server with Socket.IO
  const { server, io } = require('./src/backend/socketio/server');
  const port = process.env.PORT || 3000;

  // Connect to database and start server
  connect().then(() => {
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }).catch(error => {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  });

  // Export for local development
  module.exports = { app, server, io };
}