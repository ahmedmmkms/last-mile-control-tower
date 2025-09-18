// Database connection module
require('dotenv').config();
const { Pool } = require('pg');

// Create connection string for Supabase
const connectionString = `postgresql://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASSWORD)}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

// Create a new PostgreSQL connection pool with Supabase-specific settings
const pool = new Pool({
  connectionString: connectionString,
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
    console.log('Attempting to connect to database using connection string...');
    console.log('DB Host:', process.env.DB_HOST);
    console.log('DB Port:', process.env.DB_PORT);
    console.log('DB User:', process.env.DB_USER);
    console.log('DB Name:', process.env.DB_NAME);
    
    // Test the connection
    const client = await pool.connect();
    console.log('Connected to the database successfully');
    client.release(); // Return the client to the pool
  } catch (error) {
    console.error('Error connecting to the database:', error);
    // Log additional error details
    if (error.code) console.error('Error code:', error.code);
    if (error.errno) console.error('Error errno:', error.errno);
    if (error.syscall) console.error('Error syscall:', error.syscall);
    if (error.severity) console.error('Error severity:', error.severity);
    if (error.detail) console.error('Error detail:', error.detail);
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
    // Log additional error details
    if (error.code) console.error('Error code:', error.code);
    if (error.errno) console.error('Error errno:', error.errno);
    if (error.syscall) console.error('Error syscall:', error.syscall);
    if (error.severity) console.error('Error severity:', error.severity);
    if (error.detail) console.error('Error detail:', error.detail);
    throw error;
  }
}

module.exports = {
  pool,
  connect,
  disconnect,
  query
};