// Comprehensive API Test Suite
// This script tests all API endpoints and functionality

const axios = require('axios');
const testFixtures = require('./fixtures/testData');

// Configuration
const DEPLOYED_URL = process.env.DEPLOYED_URL || 'https://your-app-name.vercel.app';
const API_BASE_URL = `${DEPLOYED_URL}/api`;

// Test results tracking
let testResults = {
  passed: 0,
  failed: 0,
  total: 0
};

// Test helper function
async function runTest(testName, testFn) {
  testResults.total++;
  try {
    await testFn();
    testResults.passed++;
    console.log(`✅ ${testName}: PASSED`);
  } catch (error) {
    testResults.failed++;
    console.log(`❌ ${testName}: FAILED`);
    console.log(`   Error: ${error.message}`);
  }
}

// API Test Suite
async function runApiTestSuite() {
  console.log(`Running comprehensive API test suite against: ${API_BASE_URL}\n`);
  
  // Test 1: API Root Endpoint
  await runTest('API Root Endpoint', async () => {
    const response = await axios.get(`${DEPLOYED_URL}/api`);
    if (response.data.message !== 'Last-Mile Delivery Control Tower API') {
      throw new Error('Unexpected response from API root endpoint');
    }
  });
  
  // Test 2: Get All Drivers
  await runTest('Get All Drivers', async () => {
    const response = await axios.get(`${API_BASE_URL}/drivers`);
    if (!Array.isArray(response.data)) {
      throw new Error('Drivers endpoint did not return an array');
    }
  });
  
  // Test 3: Get All Shipments
  await runTest('Get All Shipments', async () => {
    const response = await axios.get(`${API_BASE_URL}/shipments`);
    if (!Array.isArray(response.data)) {
      throw new Error('Shipments endpoint did not return an array');
    }
  });
  
  // Test 4: Get All Routes
  await runTest('Get All Routes', async () => {
    const response = await axios.get(`${API_BASE_URL}/routes`);
    if (!Array.isArray(response.data)) {
      throw new Error('Routes endpoint did not return an array');
    }
  });
  
  // Test 5: Create, Read, Update, Delete Driver
  let createdDriverId;
  await runTest('Create Driver', async () => {
    const driverData = testFixtures.drivers[0];
    const response = await axios.post(`${API_BASE_URL}/drivers`, driverData);
    if (!response.data.id) {
      throw new Error('Created driver does not have an ID');
    }
    createdDriverId = response.data.id;
  });
  
  await runTest('Read Driver', async () => {
    if (!createdDriverId) throw new Error('No driver ID available for reading');
    const response = await axios.get(`${API_BASE_URL}/drivers/${createdDriverId}`);
    if (response.data.id !== createdDriverId) {
      throw new Error('Retrieved driver ID does not match created driver ID');
    }
  });
  
  await runTest('Update Driver', async () => {
    if (!createdDriverId) throw new Error('No driver ID available for updating');
    const updatedData = { name: 'Updated Driver', status: 'busy' };
    const response = await axios.put(`${API_BASE_URL}/drivers/${createdDriverId}`, updatedData);
    if (response.data.name !== 'Updated Driver') {
      throw new Error('Driver was not updated correctly');
    }
  });
  
  await runTest('Delete Driver', async () => {
    if (!createdDriverId) throw new Error('No driver ID available for deleting');
    const response = await axios.delete(`${API_BASE_URL}/drivers/${createdDriverId}`);
    if (response.data.id !== createdDriverId) {
      throw new Error('Deleted driver ID does not match created driver ID');
    }
  });
  
  // Test 6: Create, Read, Update, Delete Shipment
  let createdShipmentId;
  await runTest('Create Shipment', async () => {
    const shipmentData = testFixtures.shipments[0];
    const response = await axios.post(`${API_BASE_URL}/shipments`, shipmentData);
    if (!response.data.id) {
      throw new Error('Created shipment does not have an ID');
    }
    createdShipmentId = response.data.id;
  });
  
  await runTest('Read Shipment', async () => {
    if (!createdShipmentId) throw new Error('No shipment ID available for reading');
    const response = await axios.get(`${API_BASE_URL}/shipments/${createdShipmentId}`);
    if (response.data.id !== createdShipmentId) {
      throw new Error('Retrieved shipment ID does not match created shipment ID');
    }
  });
  
  await runTest('Update Shipment', async () => {
    if (!createdShipmentId) throw new Error('No shipment ID available for updating');
    const updatedData = { tracking_number: 'TRK-UPDATED', status: 'delivered' };
    const response = await axios.put(`${API_BASE_URL}/shipments/${createdShipmentId}`, updatedData);
    if (response.data.tracking_number !== 'TRK-UPDATED') {
      throw new Error('Shipment was not updated correctly');
    }
  });
  
  await runTest('Delete Shipment', async () => {
    if (!createdShipmentId) throw new Error('No shipment ID available for deleting');
    const response = await axios.delete(`${API_BASE_URL}/shipments/${createdShipmentId}`);
    if (response.data.id !== createdShipmentId) {
      throw new Error('Deleted shipment ID does not match created shipment ID');
    }
  });
  
  // Test 7: Create, Read, Update, Delete Route
  let createdRouteId;
  await runTest('Create Route', async () => {
    const routeData = testFixtures.routes[0];
    const response = await axios.post(`${API_BASE_URL}/routes`, routeData);
    if (!response.data.id) {
      throw new Error('Created route does not have an ID');
    }
    createdRouteId = response.data.id;
  });
  
  await runTest('Read Route', async () => {
    if (!createdRouteId) throw new Error('No route ID available for reading');
    const response = await axios.get(`${API_BASE_URL}/routes/${createdRouteId}`);
    if (response.data.id !== createdRouteId) {
      throw new Error('Retrieved route ID does not match created route ID');
    }
  });
  
  await runTest('Update Route', async () => {
    if (!createdRouteId) throw new Error('No route ID available for updating');
    const updatedData = { status: 'completed', actual_time: 30 };
    const response = await axios.put(`${API_BASE_URL}/routes/${createdRouteId}`, updatedData);
    if (response.data.status !== 'completed') {
      throw new Error('Route was not updated correctly');
    }
  });
  
  await runTest('Delete Route', async () => {
    if (!createdRouteId) throw new Error('No route ID available for deleting');
    const response = await axios.delete(`${API_BASE_URL}/routes/${createdRouteId}`);
    if (response.data.id !== createdRouteId) {
      throw new Error('Deleted route ID does not match created route ID');
    }
  });
  
  // Print test results summary
  console.log('\n' + '='.repeat(50));
  console.log('TEST RESULTS SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total tests: ${testResults.total}`);
  console.log(`Passed: ${testResults.passed}`);
  console.log(`Failed: ${testResults.failed}`);
  console.log('='.repeat(50));
  
  if (testResults.failed === 0) {
    console.log('🎉 All tests passed!');
    process.exit(0);
  } else {
    console.log(`❌ ${testResults.failed} test(s) failed`);
    process.exit(1);
  }
}

// Run the test suite
runApiTestSuite();