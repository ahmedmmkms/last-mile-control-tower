// Test Supabase connection with IPv6 address
require('dotenv').config();
const { Client } = require('pg');

async function testConnection() {
  console.log('Testing Supabase database connection with IPv6 address...');
  
  // Try with IPv6 address directly
  console.log('\nTrying with IPv6 address...');
  const clientIPv6 = new Client({
    host: '2a05:d014:1c06:5f03:15bb:f34d:2282:5c95', // IPv6 address from DNS lookup
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 5000, // 5 second timeout
  });

  try {
    console.log('Attempting to connect with IPv6 address...');
    await clientIPv6.connect();
    console.log('✅ Connected to the database successfully with IPv6!');
    
    // Run a simple query to verify
    const result = await clientIPv6.query('SELECT version()');
    console.log('Database version:', result.rows[0].version);
    
    await clientIPv6.end();
    console.log('Disconnected from the database');
    return;
  } catch (error) {
    console.error('❌ Error connecting with IPv6 address:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
  }
}

testConnection();