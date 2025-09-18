// Simple database connection test
require('dotenv').config();
const { Pool } = require('pg');

// Create connection string for Supabase
const connectionString = `postgresql://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASSWORD)}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

// Create a new PostgreSQL connection pool
const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('Connection string:', connectionString.replace(process.env.DB_PASSWORD, '****'));
    
    // Test the connection
    const client = await pool.connect();
    console.log('Connected to the database successfully');
    
    // Run a simple query
    const result = await client.query('SELECT NOW() as current_time');
    console.log('Query result:', result.rows[0]);
    
    // Release the client back to the pool
    client.release();
    
    // End the pool
    await pool.end();
    console.log('Database connection test completed successfully');
  } catch (error) {
    console.error('Database connection test failed:', error.message);
    console.error('Error code:', error.code);
    if (error.detail) console.error('Error detail:', error.detail);
  }
}

testConnection();