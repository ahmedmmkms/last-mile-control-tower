// Test general network connectivity
const https = require('https');

function testHTTPS(url) {
  return new Promise((resolve, reject) => {
    console.log(`Testing HTTPS connection to ${url}`);
    
    const req = https.get(url, (res) => {
      console.log(`✅ HTTPS connection successful to ${url}. Status: ${res.statusCode}`);
      res.resume(); // Consume response to free memory
      resolve(res.statusCode);
    });
    
    req.on('error', (error) => {
      console.error(`❌ HTTPS connection failed to ${url}:`, error.message);
      reject(error);
    });
    
    req.setTimeout(5000, () => {
      console.error(`❌ HTTPS connection timed out to ${url}`);
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

async function testConnectivity() {
  console.log('Starting network connectivity tests...');
  
  try {
    // Test connection to a known good HTTPS endpoint
    console.log('\nTesting connection to httpbin.org...');
    await testHTTPS('https://httpbin.org/get');
    
    // Test connection to Supabase (HTTP, not HTTPS)
    // This won't work directly but will test DNS resolution
    console.log('\nTesting DNS resolution for Supabase...');
    await testHTTPS('https://db.vnpcvmdhemtztkxinzqw.supabase.co');
    
    console.log('\n✅ All network tests completed');
  } catch (error) {
    console.error('❌ Network test failed:', error.message);
  }
}

testConnectivity();