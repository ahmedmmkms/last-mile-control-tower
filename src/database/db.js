// Database connection module
const { Client } = require('pg');
const config = require('../config/config');

// Create a new PostgreSQL client
const client = new Client({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.name,
});

// Function to connect to the database
async function connect() {
  try {
    await client.connect();
    console.log('Connected to the database successfully');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
}

// Function to disconnect from the database
async function disconnect() {
  try {
    await client.end();
    console.log('Disconnected from the database');
  } catch (error) {
    console.error('Error disconnecting from the database:', error);
    throw error;
  }
}

module.exports = {
  client,
  connect,
  disconnect,
};