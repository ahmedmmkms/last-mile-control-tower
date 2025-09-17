// Test Supabase connection with detailed error handling
require('dotenv').config();
const { Client } = require('pg');

async function testConnection() {
  console.log('Testing Supabase database connection...');
  console.log('Host:', process.env.DB_HOST);
  console.log('Port:', process.env.DB_PORT);
  console.log('Database:', process.env.DB_NAME);
  console.log('User:', process.env.DB_USER);

  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      rejectUnauthorized: true // Enable proper SSL verification
    },
    connectionTimeoutMillis: 10000, // 10 second timeout
  });

  try {
    console.log('Attempting to connect with IPv4 address...');
    await clientIPv4.connect();
    console.log('✅ Connected to the database successfully with IPv4!');
    
    // Run a simple query to verify
    const result = await clientIPv4.query('SELECT version()');
    console.log('Database version:', result.rows[0].version);
    
    await clientIPv4.end();
    console.log('Disconnected from the database');
    return;
  } catch (error) {
    console.error('❌ Error connecting with IPv4 address:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
  }
  
  // Try with hostname
  console.log('\nTrying with hostname...');
  const client = new Client({
    host: process.env.DB_HOST,
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
    console.log('Attempting to connect with hostname...');
    await client.connect();
    console.log('✅ Connected to the database successfully with hostname!');
    
    // Run a simple query to verify
    const result = await client.query('SELECT version()');
    console.log('Database version:', result.rows[0].version);
    
    await client.end();
    console.log('Disconnected from the database');
  } catch (error) {
    console.error('❌ Error connecting to the database:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.error('DNS lookup failed - check your host name');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused - check your host and port');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('Connection timed out - check your network/firewall settings');
    } else if (error.code === 'ECONNRESET') {
      console.error('Connection reset by peer');
    } else if (error.code === 'ENETUNREACH') {
      console.error('Network is unreachable');
    }
    
    // Try to connect without SSL as a test
    console.log('\nTrying without SSL...');
    const clientNoSSL = new Client({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectionTimeoutMillis: 5000,
    });
    
    try {
      await clientNoSSL.connect();
      console.log('✅ Connected without SSL!');
      await clientNoSSL.end();
    } catch (sslError) {
      console.error('❌ Still failed without SSL:', sslError.message);
    }
  }
}

testConnection();