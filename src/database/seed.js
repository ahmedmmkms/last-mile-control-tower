#!/usr/bin/env node

// Seed data runner script
const fs = require('fs');
const path = require('path');
const { query, connect, disconnect } = require('./db');

async function runSeeds() {
  try {
    // Connect to the database
    await connect();
    
    // Get all seed files
    const seedsDir = path.join(__dirname, 'seeds');
    
    // Check if seeds directory exists
    if (!fs.existsSync(seedsDir)) {
      console.log('No seeds directory found');
      return;
    }
    
    const seedFiles = fs.readdirSync(seedsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    console.log(`Found ${seedFiles.length} seed files`);
    
    // Run each seed file
    for (const file of seedFiles) {
      console.log(`Running seed: ${file}`);
      const seedPath = path.join(seedsDir, file);
      const sql = fs.readFileSync(seedPath, 'utf8');
      
      try {
        await query(sql);
        console.log(`Successfully executed: ${file}`);
      } catch (error) {
        console.error(`Error executing ${file}:`, error);
        throw error;
      }
    }
    
    console.log('All seeds completed successfully');
  } catch (error) {
    console.error('Seed process failed:', error);
  } finally {
    // Disconnect from the database
    await disconnect();
  }
}

// Run seeds if this script is executed directly
if (require.main === module) {
  runSeeds();
}

module.exports = { runSeeds };