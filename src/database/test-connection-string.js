// Test Supabase connection with connection string
require('dotenv').config();
const { Client } = require('pg');

async function testConnection() {
  console.log('Testing Supabase database connection with connection string...');
  
  // Create connection string
  const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
  console.log('Connection string:', connectionString.replace(process.env.DB_PASSWORD, '*****'));
  
  // Create a new PostgreSQL client using connection string
  const client = new Client({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 10000, // 10 second timeout
  });

  try {
    console.log('Attempting to connect...');
    await client.connect();
    console.log('✅ Connected to the database successfully!');
    
    // Run a simple query to verify
    const result = await client.query('SELECT version()');
    console.log('Database version:', result.rows[0].version);
    
    await client.end();
    console.log('Disconnected from the database');
  } catch (error) {
    console.error('❌ Error connecting to the database:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
  }
}

testConnection();