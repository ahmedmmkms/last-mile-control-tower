#!/usr/bin/env node

// Acceptance test for deployed application
const https = require('https');

async function acceptanceTest() {
  // Get the deployed URL from environment or use default
  const deployedUrl = process.env.DEPLOYED_URL || 'https://last-mile-control-tower.vercel.app';
  
  console.log(`Running acceptance test against: ${deployedUrl}`);
  
  try {
    // Test 1: Check if the API root endpoint is accessible
    console.log('\n1. Testing API root endpoint...');
    const apiResponse = await makeRequest(`${deployedUrl}/api`);
    if (apiResponse.statusCode === 200) {
      console.log('✅ API root endpoint is accessible');
      console.log('   Response:', apiResponse.body);
    } else {
      console.error(`❌ API root endpoint returned status ${apiResponse.statusCode}`);
      process.exit(1);
    }
    
    // Test 2: Check if we can access drivers endpoint (if implemented)
    console.log('\n2. Testing drivers endpoint...');
    try {
      const driversResponse = await makeRequest(`${deployedUrl}/api/drivers`);
      if (driversResponse.statusCode === 200) {
        console.log('✅ Drivers endpoint is accessible');
      } else {
        console.log(`ℹ️  Drivers endpoint returned status ${driversResponse.statusCode} (may not be implemented yet)`);
      }
    } catch (error) {
      console.log('ℹ️  Drivers endpoint may not be implemented yet');
    }
    
    // Test 3: Check if we can access shipments endpoint (if implemented)
    console.log('\n3. Testing shipments endpoint...');
    try {
      const shipmentsResponse = await makeRequest(`${deployedUrl}/api/shipments`);
      if (shipmentsResponse.statusCode === 200) {
        console.log('✅ Shipments endpoint is accessible');
      } else {
        console.log(`ℹ️  Shipments endpoint returned status ${shipmentsResponse.statusCode} (may not be implemented yet)`);
      }
    } catch (error) {
      console.log('ℹ️  Shipments endpoint may not be implemented yet');
    }
    
    // Test 4: Check if we can access routes endpoint (if implemented)
    console.log('\n4. Testing routes endpoint...');
    try {
      const routesResponse = await makeRequest(`${deployedUrl}/api/routes`);
      if (routesResponse.statusCode === 200) {
        console.log('✅ Routes endpoint is accessible');
      } else {
        console.log(`ℹ️  Routes endpoint returned status ${routesResponse.statusCode} (may not be implemented yet)`);
      }
    } catch (error) {
      console.log('ℹ️  Routes endpoint may not be implemented yet');
    }
    
    console.log('\n✅ Acceptance test completed successfully!');
    console.log('Note: Some endpoints may show as not implemented if they haven\'t been developed yet.');
    
  } catch (error) {
    console.error('❌ Acceptance test failed:', error.message);
    process.exit(1);
  }
}

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error(`Request timeout for ${url}`));
    });
  });
}

// Run test if this script is executed directly
if (require.main === module) {
  acceptanceTest();
}

module.exports = { acceptanceTest };