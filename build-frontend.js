#!/usr/bin/env node

// This script builds the frontend during Vercel deployment
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting frontend build for Vercel deployment...');

try {
  // Change to the frontend directory
  const frontendDir = path.join(__dirname, 'src', 'frontend');
  
  // Check if we're in the frontend directory
  console.log('Current directory:', process.cwd());
  console.log('Frontend directory:', frontendDir);
  
  // Install frontend dependencies first
  console.log('Installing frontend dependencies...');
  execSync('npm install', { 
    cwd: frontendDir,
    stdio: 'inherit'
  });
  
  // Run the build command
  console.log('Running npm run build in frontend directory...');
  execSync('npm run build', { 
    cwd: frontendDir,
    stdio: 'inherit'
  });
  
  console.log('Frontend build completed successfully!');
  
  // Verify the build output
  const distDir = path.join(frontendDir, 'dist');
  const indexPath = path.join(distDir, 'index.html');
  
  if (fs.existsSync(indexPath)) {
    console.log('Build verification successful: index.html found');
  } else {
    console.error('Build verification failed: index.html not found');
  }
} catch (error) {
  console.error('Frontend build failed:', error.message);
  process.exit(1);
}