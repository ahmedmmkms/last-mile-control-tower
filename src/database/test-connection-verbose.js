#!/usr/bin/env node

// Verbose database connection test
require('dotenv').config();
const { Client } = require('pg');

async function verboseTest() {
  console.log('Starting verbose database connection test...');
  
  // Log environment variables
  console.log('Environment variables:');
  console.log('  DB_HOST:', process.env.DB_HOST);
  console.log('  DB_PORT:', process.env.DB_PORT);
  console.log('  DB_NAME:', process.env.DB_NAME);
  console.log('  DB_USER:', process.env.DB_USER);
  console.log('  DB_PASSWORD:', process.env.DB_PASSWORD ? '[SET]' : '[NOT SET]');
  
  // Create a new client
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 30000
  });
  
  try {
    console.log('Attempting to connect to database...');
    const startTime = Date.now();
    await client.connect();
    const connectDuration = Date.now() - startTime;
    console.log(`✅ Connected to database successfully in ${connectDuration}ms`);
    
    console.log('Executing test query...');
    const queryStartTime = Date.now();
    const result = await client.query('SELECT version(), current_database(), current_user');
    const queryDuration = Date.now() - queryStartTime;
    console.log(`✅ Query executed successfully in ${queryDuration}ms`);
    
    console.log('Database information:');
    console.log('  Version:', result.rows[0].version);
    console.log('  Database:', result.rows[0].current_database);
    console.log('  User:', result.rows[0].current_user);
    
    console.log('Disconnecting...');
    await client.end();
    console.log('✅ Disconnected successfully');
    
    console.log('🎉 All tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.error('Error code:', error.code);
    console.error('Error stack:', error.stack);
    
    try {
      await client.end();
    } catch (endError) {
      console.error('Error closing connection:', endError.message);
    }
    
    process.exit(1);
  }
}

// Run test if this script is executed directly
if (require.main === module) {
  verboseTest();
}

module.exports = { verboseTest };