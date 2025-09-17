#!/usr/bin/env node

// Simple API Test Script for CI/CD Pipeline
// This script performs basic API tests for the Vercel deployment

require('dotenv').config();
const axios = require('axios');

// Get the deployed URL from environment variables
const DEPLOYED_URL = process.env.DEPLOYED_URL || 'https://your-app-name.vercel.app';
const API_BASE_URL = `${DEPLOYED_URL}/api`;

async function runApiTests() {
  console.log(`Running API tests against: ${API_BASE_URL}`);
  
  try {
    // Test API root endpoint
    const rootResponse = await axios.get(`${DEPLOYED_URL}/api`);
    if (rootResponse.data.message !== 'Last-Mile Delivery Control Tower API') {
      throw new Error('API root endpoint returned unexpected response');
    }
    console.log('✅ API root endpoint test passed');
    
    // Test drivers endpoint
    const driversResponse = await axios.get(`${API_BASE_URL}/drivers`);
    if (!Array.isArray(driversResponse.data)) {
      throw new Error('Drivers endpoint did not return an array');
    }
    console.log('✅ Drivers endpoint test passed');
    
    // Test shipments endpoint
    const shipmentsResponse = await axios.get(`${API_BASE_URL}/shipments`);
    if (!Array.isArray(shipmentsResponse.data)) {
      throw new Error('Shipments endpoint did not return an array');
    }
    console.log('✅ Shipments endpoint test passed');
    
    // Test routes endpoint
    const routesResponse = await axios.get(`${API_BASE_URL}/routes`);
    if (!Array.isArray(routesResponse.data)) {
      throw new Error('Routes endpoint did not return an array');
    }
    console.log('✅ Routes endpoint test passed');
    
    console.log('🎉 All API tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    process.exit(1);
  }
}

// Run the tests
runApiTests();