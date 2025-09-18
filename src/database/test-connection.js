#!/usr/bin/env node

// Smoke test for database connection
const { query, connect, disconnect } = require('./db');

async function smokeTest() {
  try {
    console.log('Running database smoke test...');
    await connect();
    console.log('✅ Database connection successful!');
    
    // Test basic query
    const result = await query('SELECT 1 as test');
    if (result.rows[0].test === 1) {
      console.log('✅ Basic database query successful!');
    } else {
      console.error('❌ Basic database query failed!');
      process.exit(1);
    }
    
    // Test table existence
    const tables = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('drivers', 'shipments', 'routes')
    `);
    
    const existingTables = tables.rows.map(row => row.table_name);
    const requiredTables = ['drivers', 'shipments', 'routes'];
    const missingTables = requiredTables.filter(table => !existingTables.includes(table));
    
    if (missingTables.length === 0) {
      console.log('✅ All required tables exist!');
    } else {
      console.error(`❌ Missing tables: ${missingTables.join(', ')}`);
      process.exit(1);
    }
    
    console.log('✅ Database smoke test passed!');
    return true;
  } catch (error) {
    console.error('❌ Database smoke test failed:', error.message);
    process.exit(1);
  } finally {
    await disconnect();
  }
}

// Run test if this script is executed directly
if (require.main === module) {
  smokeTest();
}

module.exports = { smokeTest };