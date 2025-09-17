// Test connection to a public PostgreSQL database
const { Client } = require('pg');

async function testPublicDB() {
  console.log('Testing connection to a public PostgreSQL database...');
  
  // Using a free PostgreSQL database for testing
  // This is a public database for testing purposes only
  const client = new Client({
    host: 'localhost', // We'll test with localhost first
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'postgres',
    connectionTimeoutMillis: 5000,
  });

  try {
    console.log('Attempting to connect to localhost PostgreSQL...');
    await client.connect();
    console.log('✅ Connected to localhost PostgreSQL successfully!');
    await client.end();
  } catch (error) {
    console.error('❌ Error connecting to localhost PostgreSQL:');
    console.error('Error message:', error.message);
    console.error('Full error:', error);
  }
}

testPublicDB();