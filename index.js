// Entry point for the application
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, 'src', 'frontend')));

// API Routes
app.get('/api', (req, res) => {
  res.json({ message: 'Last-Mile Delivery Control Tower API' });
});

// Serve the frontend index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'frontend', 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;