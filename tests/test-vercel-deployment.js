// test-vercel-deployment.js
// Simple Node.js script to test the Vercel deployment

const axios = require('axios');

async function testDeployment() {
  const DEPLOYED_URL = 'http://last-mile-control-tower.vercel.app';
  const API_BASE_URL = `${DEPLOYED_URL}/api`;
  
  console.log('========================================');
  console.log('Last-Mile Delivery Control Tower API Test');
  console.log(`Testing deployment at: ${DEPLOYED_URL}`);
  console.log('========================================');
  
  try {
    // Test 1: API Root
    console.log('\n1. Testing API Root Endpoint...');
    const rootResponse = await axios.get(`${DEPLOYED_URL}/api`);
    if (rootResponse.data.message === 'Last-Mile Delivery Control Tower API') {
      console.log('✅ API Root Endpoint: PASSED');
    } else {
      console.log('❌ API Root Endpoint: FAILED');
      console.log(`   Expected: "Last-Mile Delivery Control Tower API"`);
      console.log(`   Received: "${rootResponse.data.message}"`);
    }
    
    // Test 2: Drivers
    console.log('\n2. Testing Drivers Endpoint...');
    const driversResponse = await axios.get(`${API_BASE_URL}/drivers`);
    if (Array.isArray(driversResponse.data)) {
      console.log(`✅ Drivers Endpoint: PASSED (${driversResponse.data.length} drivers found)`);
    } else {
      console.log('❌ Drivers Endpoint: FAILED');
    }
    
    // Test 3: Shipments
    console.log('\n3. Testing Shipments Endpoint...');
    const shipmentsResponse = await axios.get(`${API_BASE_URL}/shipments`);
    if (Array.isArray(shipmentsResponse.data)) {
      console.log(`✅ Shipments Endpoint: PASSED (${shipmentsResponse.data.length} shipments found)`);
    } else {
      console.log('❌ Shipments Endpoint: FAILED');
    }
    
    // Test 4: Routes
    console.log('\n4. Testing Routes Endpoint...');
    const routesResponse = await axios.get(`${API_BASE_URL}/routes`);
    if (Array.isArray(routesResponse.data)) {
      console.log(`✅ Routes Endpoint: PASSED (${routesResponse.data.length} routes found)`);
    } else {
      console.log('❌ Routes Endpoint: FAILED');
    }
    
    console.log('\n========================================');
    console.log('🎉 Basic API tests completed!');
    console.log('========================================');
    
  } catch (error) {
    console.error('❌ Error during testing:', error.message);
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data: ${JSON.stringify(error.response.data)}`);
    }
  }
}

testDeployment();