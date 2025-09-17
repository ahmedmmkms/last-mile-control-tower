#!/usr/bin/env node

// Application smoke test
const { smokeTest: databaseSmokeTest } = require('../src/database/test-connection');

async function applicationSmokeTest() {
  console.log('Running application smoke test...\n');
  
  try {
    // Test 1: Database connection
    console.log('1. Testing database connection...');
    await databaseSmokeTest();
    
    // Test 2: Server startup (simulated)
    console.log('\n2. Testing server startup...');
    // This would normally test if the Express server starts correctly
    // For now, we'll just verify the main entry point loads
    const app = require('../index.js');
    console.log('✅ Server module loads correctly');
    
    // Test 3: Configuration loading
    console.log('\n3. Testing configuration loading...');
    const config = require('../src/config/config');
    if (config && config.database && config.server) {
      console.log('✅ Configuration loads correctly');
    } else {
      console.error('❌ Configuration loading failed');
      process.exit(1);
    }
    
    console.log('\n✅ Application smoke test passed!');
    
  } catch (error) {
    console.error('❌ Application smoke test failed:', error.message);
    process.exit(1);
  }
}

// Run test if this script is executed directly
if (require.main === module) {
  applicationSmokeTest();
}

module.exports = { applicationSmokeTest };