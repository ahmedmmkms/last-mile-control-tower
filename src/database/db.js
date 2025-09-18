// Database connection module
require('dotenv').config();
const { Pool } = require('pg');

// Create a new PostgreSQL connection pool with Supabase-compatible settings
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
  max: 1, // Maximum number of clients in the pool (minimal for serverless)
  min: 0,  // Minimum number of clients in the pool (0 for serverless)
  idleTimeoutMillis: 5000, // Close idle clients after 5 seconds
  connectionTimeoutMillis: 30000, // Return an error after 30 seconds if connection could not be established
  query_timeout: 30000, // Query timeout of 30 seconds
});

// Function to connect to the database (initialize pool)
async function connect() {
  try {
    console.log('Attempting to connect to database...');
    console.log('DB Connection params:', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      database: process.env.DB_NAME
    });
    
    // Test the connection
    const client = await pool.connect();
    console.log('Connected to the database successfully');
    client.release(); // Return the client to the pool
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
  } catch (error) {
    console.error('Error disconnecting from the database:', error);
    throw error;
  }
}

// Query function that automatically handles client acquisition and release
async function query(text, params) {
  console.log('Executing query:', text.substring(0, 100) + (text.length > 100 ? '...' : ''));
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Query executed successfully in', duration, 'ms');
    return res;
  } catch (error) {
    const duration = Date.now() - start;
    console.error('Error executing query after', duration, 'ms:', error.message);
    throw error;
  }
}

module.exports = {
  pool,
  connect,
  disconnect,
  query
};