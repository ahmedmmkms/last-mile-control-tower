// Database connection module
require('dotenv').config();
const { Pool } = require('pg');

// Track connection state
let isConnected = false;

// Create a new PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  },
  // Connection pool settings optimized for Vercel serverless environment
  max: 5, // Maximum number of clients in the pool (reduced for serverless)
  min: 0,  // Minimum number of clients in the pool (0 for serverless)
  idleTimeoutMillis: 5000, // Close idle clients after 5 seconds (shorter for serverless)
  connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection could not be established
  query_timeout: 15000, // Query timeout of 15 seconds
});

// Function to connect to the database (initialize pool)
async function connect() {
  if (isConnected) {
    return;
  }
  
  try {
    // Test the connection
    const client = await pool.connect();
    console.log('Connected to the database successfully');
    client.release(); // Return the client to the pool
    isConnected = true;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
}

// Function to disconnect from the database (end pool)
async function disconnect() {
  try {
    await pool.end();
    console.log('Disconnected from the database');
    isConnected = false;
  } catch (error) {
    console.error('Error disconnecting from the database:', error);
    throw error;
  }
}

// Query function that automatically handles client acquisition and release
async function query(text, params) {
  // Ensure we're connected before querying
  await connect();
  
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    const duration = Date.now() - start;
    console.error('Error executing query', { text, duration, error: error.message });
    throw error;
  }
}

module.exports = {
  pool,
  connect,
  disconnect,
  query
};