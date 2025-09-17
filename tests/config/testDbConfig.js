// Test Database Configuration
require('dotenv').config();

// Test database configuration
const testConfig = {
  // Test database connection details
  testDb: {
    host: process.env.TEST_DB_HOST || 'localhost',
    port: process.env.TEST_DB_PORT || 5432,
    database: process.env.TEST_DB_NAME || 'test_delivery_control_tower',
    user: process.env.TEST_DB_USER || 'test_user',
    password: process.env.TEST_DB_PASSWORD || 'test_password'
  },
  
  // Connection pool settings
  pool: {
    min: 0,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
  }
};

module.exports = testConfig;