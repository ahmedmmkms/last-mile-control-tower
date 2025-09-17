// Entry point for the application
const express = require('express');
const path = require('path');
const { connect, disconnect } = require('./src/database/db');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Serve static files from the frontend build directory
const frontendDistPath = path.join(__dirname, 'src', 'frontend', 'dist');
app.use(express.static(frontendDistPath));

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

// Connect to database and start server
connect().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}).catch(error => {
  console.error('Failed to connect to database:', error);
  process.exit(1);
});

module.exports = app;