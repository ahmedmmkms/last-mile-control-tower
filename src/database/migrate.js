#!/usr/bin/env node

// Migration runner script
const fs = require('fs');
const path = require('path');
const { query, connect, disconnect } = require('./db');

async function runMigrations() {
  try {
    // Connect to the database
    await connect();
    
    // Get all migration files
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    console.log(`Found ${migrationFiles.length} migration files`);
    
    // Run each migration
    for (const file of migrationFiles) {
      console.log(`Running migration: ${file}`);
      const migrationPath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(migrationPath, 'utf8');
      
      try {
        await query(sql);
        console.log(`Successfully executed: ${file}`);
      } catch (error) {
        console.error(`Error executing ${file}:`, error);
        throw error;
      }
    }
    
    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration process failed:', error);
  } finally {
    // Disconnect from the database
    await disconnect();
  }
}

// Run migrations if this script is executed directly
if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };