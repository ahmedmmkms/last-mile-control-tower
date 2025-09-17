// Simple Vercel API Test
const axios = require('axios');

async function testBasicEndpoints() {
  const DEPLOYED_URL = 'http://last-mile-control-tower.vercel.app';
  const API_BASE_URL = `${DEPLOYED_URL}/api`;
  
  console.log(`Testing API at: ${API_BASE_URL}\n`);
  
  try {
    // Test API root
    console.log('1. Testing API Root...');
    const rootResponse = await axios.get(`${DEPLOYED_URL}/api`);
    console.log('✅ API Root:', rootResponse.data.message);
    
    // Test drivers
    console.log('\n2. Testing Drivers...');
    const driversResponse = await axios.get(`${API_BASE_URL}/drivers`);
    console.log(`✅ Found ${driversResponse.data.length} drivers`);
    if (driversResponse.data.length > 0) {
      console.log('First driver:', JSON.stringify(driversResponse.data[0], null, 2));
    }
    
    // Test shipments
    console.log('\n3. Testing Shipments...');
    const shipmentsResponse = await axios.get(`${API_BASE_URL}/shipments`);
    console.log(`✅ Found ${shipmentsResponse.data.length} shipments`);
    if (shipmentsResponse.data.length > 0) {
      console.log('First shipment:', JSON.stringify(shipmentsResponse.data[0], null, 2));
    }
    
    // Test routes
    console.log('\n4. Testing Routes...');
    const routesResponse = await axios.get(`${API_BASE_URL}/routes`);
    console.log(`✅ Found ${routesResponse.data.length} routes`);
    if (routesResponse.data.length > 0) {
      console.log('First route:', JSON.stringify(routesResponse.data[0], null, 2));
    }
    
    console.log('\n🎉 Basic API tests completed successfully!');
  } catch (error) {
    console.error('❌ Error during testing:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Status:', error.response.status);
    }
  }
}

testBasicEndpoints();