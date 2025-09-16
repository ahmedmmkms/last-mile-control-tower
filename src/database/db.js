// Database connection module
require('dotenv').config();
const { Client } = require('pg');

// Create a new PostgreSQL client
const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  }
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