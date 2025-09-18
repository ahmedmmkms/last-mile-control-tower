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
  
  // Verify frontend directory exists
  if (!fs.existsSync(frontendDir)) {
    console.error('Frontend directory does not exist:', frontendDir);
    process.exit(1);
  }
  
  // Install frontend dependencies first
  console.log('Installing frontend dependencies...');
  execSync('npm install', { 
    cwd: frontendDir,
    stdio: 'inherit'
  });
  
  // Copy PWA assets if they don't exist
  const publicDir = path.join(frontendDir, 'public');
  const logo192 = path.join(publicDir, 'logo192.png');
  const logo512 = path.join(publicDir, 'logo512.png');
  
  if (!fs.existsSync(logo192)) {
    console.log('Creating placeholder logo192.png...');
    fs.writeFileSync(logo192, 
      '<svg width="192" height="192" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="192" height="192" fill="#1976d2" rx="20"/>' +
      '<circle cx="96" cy="96" r="64" fill="white"/>' +
      '<rect x="48" y="48" width="96" height="96" fill="#1976d2" rx="10"/>' +
      '<text x="96" y="104" font-family="Arial, sans-serif" font-size="48" ' +
      'fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold">LD</text>' +
      '</svg>'
    );
  }
  
  if (!fs.existsSync(logo512)) {
    console.log('Creating placeholder logo512.png...');
    fs.writeFileSync(logo512, 
      '<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="512" height="512" fill="#1976d2" rx="40"/>' +
      '<circle cx="256" cy="256" r="170" fill="white"/>' +
      '<rect x="128" y="128" width="256" height="256" fill="#1976d2" rx="20"/>' +
      '<text x="256" y="276" font-family="Arial, sans-serif" font-size="128" ' +
      'fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold">LD</text>' +
      '</svg>'
    );
  }
  
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
    process.exit(1);
  }
  
  // Check for service worker files
  const swFiles = ['sw.js', 'sw-custom.js', 'registerSW.js'].map(file => path.join(distDir, file));
  const foundSWFiles = swFiles.filter(file => fs.existsSync(file));
  
  if (foundSWFiles.length > 0) {
    console.log('Service worker files found:', foundSWFiles.map(f => path.basename(f)));
  } else {
    console.log('Warning: No service worker files found in build output');
  }
  
  // Check for manifest file
  const manifestPath = path.join(distDir, 'manifest.json');
  if (fs.existsSync(manifestPath)) {
    console.log('Manifest file found: manifest.json');
  } else {
    console.log('Warning: Manifest file not found in build output');
  }
  
} catch (error) {
  console.error('Frontend build failed:', error.message);
  process.exit(1);
}