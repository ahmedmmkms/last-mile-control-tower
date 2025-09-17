#!/usr/bin/env node

// API Test Script for Vercel Deployment
// This script tests the live deployment of the Last-Mile Delivery Control Tower API

const axios = require('axios');

// Get the deployed URL from environment variables
const DEPLOYED_URL = process.env.DEPLOYED_URL || 'https://your-app-name.vercel.app';
const API_BASE_URL = `${DEPLOYED_URL}/api`;

console.log(`Testing API at: ${API_BASE_URL}`);

async function testApiEndpoints() {
  try {
    // Test 1: API Root Endpoint
    console.log('\n1. Testing API Root Endpoint...');
    try {
      const rootResponse = await axios.get(`${DEPLOYED_URL}/api`);
      console.log('✅ API Root Endpoint: SUCCESS');
      console.log(`   Response: ${JSON.stringify(rootResponse.data)}`);
    } catch (error) {
      console.log('❌ API Root Endpoint: FAILED');
      console.log(`   Error: ${error.message}`);
    }

    // Test 2: Get All Drivers
    console.log('\n2. Testing GET /api/drivers...');
    try {
      const driversResponse = await axios.get(`${API_BASE_URL}/drivers`);
      console.log('✅ GET /api/drivers: SUCCESS');
      console.log(`   Found ${driversResponse.data.length} drivers`);
      
      // If we have drivers, show details of the first one
      if (driversResponse.data.length > 0) {
        console.log(`   First driver: ${JSON.stringify(driversResponse.data[0])}`);
      }
    } catch (error) {
      console.log('❌ GET /api/drivers: FAILED');
      console.log(`   Error: ${error.message}`);
    }

    // Test 3: Get All Shipments
    console.log('\n3. Testing GET /api/shipments...');
    try {
      const shipmentsResponse = await axios.get(`${API_BASE_URL}/shipments`);
      console.log('✅ GET /api/shipments: SUCCESS');
      console.log(`   Found ${shipmentsResponse.data.length} shipments`);
      
      // If we have shipments, show details of the first one
      if (shipmentsResponse.data.length > 0) {
        console.log(`   First shipment: ${JSON.stringify(shipmentsResponse.data[0])}`);
      }
    } catch (error) {
      console.log('❌ GET /api/shipments: FAILED');
      console.log(`   Error: ${error.message}`);
    }

    // Test 4: Get All Routes
    console.log('\n4. Testing GET /api/routes...');
    try {
      const routesResponse = await axios.get(`${API_BASE_URL}/routes`);
      console.log('✅ GET /api/routes: SUCCESS');
      console.log(`   Found ${routesResponse.data.length} routes`);
      
      // If we have routes, show details of the first one
      if (routesResponse.data.length > 0) {
        console.log(`   First route: ${JSON.stringify(routesResponse.data[0])}`);
      }
    } catch (error) {
      console.log('❌ GET /api/routes: FAILED');
      console.log(`   Error: ${error.message}`);
    }

    // Test 5: Create a new Driver
    console.log('\n5. Testing POST /api/drivers...');
    try {
      const newDriver = {
        name: 'Test Driver',
        phone: '+1234567890',
        vehicle_type: 'car',
        status: 'available',
        current_location: { lat: 40.7128, lng: -74.0060 }
      };
      
      const createResponse = await axios.post(`${API_BASE_URL}/drivers`, newDriver);
      console.log('✅ POST /api/drivers: SUCCESS');
      console.log(`   Created driver ID: ${createResponse.data.id}`);
      
      // Test 6: Get the created driver
      console.log('\n6. Testing GET /api/drivers/:id...');
      try {
        const getResponse = await axios.get(`${API_BASE_URL}/drivers/${createResponse.data.id}`);
        console.log('✅ GET /api/drivers/:id: SUCCESS');
        console.log(`   Retrieved driver: ${JSON.stringify(getResponse.data)}`);
        
        // Test 7: Update the driver
        console.log('\n7. Testing PUT /api/drivers/:id...');
        try {
          const updatedDriver = {
            name: 'Updated Test Driver',
            phone: '+0987654321',
            vehicle_type: 'bike',
            status: 'busy',
            current_location: { lat: 40.7589, lng: -73.9851 }
          };
          
          const updateResponse = await axios.put(`${API_BASE_URL}/drivers/${createResponse.data.id}`, updatedDriver);
          console.log('✅ PUT /api/drivers/:id: SUCCESS');
          console.log(`   Updated driver: ${JSON.stringify(updateResponse.data)}`);
          
          // Test 8: Delete the driver
          console.log('\n8. Testing DELETE /api/drivers/:id...');
          try {
            const deleteResponse = await axios.delete(`${API_BASE_URL}/drivers/${createResponse.data.id}`);
            console.log('✅ DELETE /api/drivers/:id: SUCCESS');
            console.log(`   Deleted driver: ${JSON.stringify(deleteResponse.data)}`);
          } catch (error) {
            console.log('❌ DELETE /api/drivers/:id: FAILED');
            console.log(`   Error: ${error.message}`);
          }
        } catch (error) {
          console.log('❌ PUT /api/drivers/:id: FAILED');
          console.log(`   Error: ${error.message}`);
        }
      } catch (error) {
        console.log('❌ GET /api/drivers/:id: FAILED');
        console.log(`   Error: ${error.message}`);
      }
    } catch (error) {
      console.log('❌ POST /api/drivers: FAILED');
      console.log(`   Error: ${error.message}`);
    }

    console.log('\n🎉 API Testing Complete!');
  } catch (error) {
    console.error('Unexpected error during API testing:', error);
  }
}

// Run the tests
testApiEndpoints();
