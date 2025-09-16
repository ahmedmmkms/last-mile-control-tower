// Configuration file for the application
module.exports = {
  // Server configuration
  server: {
    port: process.env.PORT || 3000,
  },
  
  // Database configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'lastmile_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  },
  
  // API configuration
  api: {
    baseUrl: process.env.API_BASE_URL || 'http://localhost:3000/api',
  },
  
  // Mobile app configuration
  mobile: {
    expoProjectId: process.env.EXPO_PROJECT_ID || 'last-mile-control-tower',
  },
};