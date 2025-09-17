#!/usr/bin/env node

// CI API Test Script
// This script runs basic API tests for CI pipeline

const axios = require('axios');

async function runAPITests() {
  console.log('Running API tests...');
  
  try {
    // Test API base endpoint
    const apiResponse = await axios.get('http://localhost:3000/api');
    console.log('✓ API base endpoint accessible');
    
    if (apiResponse.data.message !== 'Last-Mile Delivery Control Tower API') {
      throw new Error('API base endpoint returned unexpected response');
    }
    
    // Test shipments endpoint
    const shipmentsResponse = await axios.get('http://localhost:3000/api/shipments');
    console.log('✓ Shipments endpoint accessible');
    
    if (!Array.isArray(shipmentsResponse.data)) {
      throw new Error('Shipments endpoint did not return an array');
    }
    
    // Test drivers endpoint
    const driversResponse = await axios.get('http://localhost:3000/api/drivers');
    console.log('✓ Drivers endpoint accessible');
    
    if (!Array.isArray(driversResponse.data)) {
      throw new Error('Drivers endpoint did not return an array');
    }
    
    // Test routes endpoint
    const routesResponse = await axios.get('http://localhost:3000/api/routes');
    console.log('✓ Routes endpoint accessible');
    
    if (!Array.isArray(routesResponse.data)) {
      throw new Error('Routes endpoint did not return an array');
    }
    
    console.log('All API tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('API tests failed:', error.message);
    process.exit(1);
  }
}

// Run the tests
runAPITests();