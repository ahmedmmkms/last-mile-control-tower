#!/usr/bin/env node

// Test database connection and migrations
const { connect, disconnect } = require('./db');

async function testConnection() {
  try {
    console.log('Testing database connection...');
    await connect();
    console.log('Database connection successful!');
  } catch (error) {
    console.error('Database connection failed:', error.message);
  } finally {
    await disconnect();
  }
}

// Run test if this script is executed directly
if (require.main === module) {
  testConnection();
}