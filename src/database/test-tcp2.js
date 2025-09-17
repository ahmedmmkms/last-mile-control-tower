// Simple TCP connection test
const net = require('net');

function testTCPPort(host, port) {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();
    let connected = false;
    
    console.log(`Creating socket connection to ${host}:${port}`);
    
    client.setTimeout(5000); // 5 second timeout
    
    client.on('connect', () => {
      console.log('Socket connected successfully');
      connected = true;
      client.destroy();
      resolve(true);
    });
    
    client.on('timeout', () => {
      console.log('Socket connection timed out');
      if (!connected) {
        client.destroy();
        reject(new Error('Connection timeout'));
      }
    });
    
    client.on('error', (err) => {
      console.log('Socket connection error:', err.message);
      if (!connected) {
        client.destroy();
        reject(err);
      }
    });
    
    console.log(`Attempting to connect to ${host}:${port}`);
    client.connect(port, host);
  });
}

async function testConnection() {
  const host = 'db.vnpcvmdhemtztkxinzqw.supabase.co';
  const port = 5432;
  
  console.log(`Testing TCP connection to ${host}:${port}`);
  
  try {
    await testTCPPort(host, port);
    console.log('✅ TCP connection successful!');
  } catch (error) {
    console.error('❌ TCP connection failed:', error.message);
    
    // Try with IPv4 address
    const ipv4 = '172.64.149.246';
    console.log(`\nTesting TCP connection to IPv4 ${ipv4}:${port}`);
    
    try {
      await testTCPPort(ipv4, port);
      console.log('✅ TCP connection successful with IPv4!');
    } catch (ipv4Error) {
      console.error('❌ TCP connection failed with IPv4:', ipv4Error.message);
    }
  }
}

testConnection();