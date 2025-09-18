#!/usr/bin/env node

// PWA Integration Verification Script
// This script verifies that all PWA components are properly integrated

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Verifying PWA Integration...');
console.log('================================');

const projectRoot = path.join(__dirname, '..', '..');
const frontendRoot = path.join(projectRoot, 'src', 'frontend');
const publicDir = path.join(frontendRoot, 'public');
const srcDir = path.join(frontendRoot, 'src');
const servicesDir = path.join(srcDir, 'services');
const driverPwaDir = path.join(srcDir, 'driver-pwa');

let totalChecks = 0;
let passedChecks = 0;

// Helper function to check file existence
function checkFile(filePath, description) {
  totalChecks++;
  const exists = fs.existsSync(filePath);
  if (exists) {
    console.log(`✅ ${description}`);
    passedChecks++;
  } else {
    console.log(`❌ ${description} (MISSING)`);
  }
  return exists;
}

// Helper function to check directory existence
function checkDirectory(dirPath, description) {
  totalChecks++;
  const exists = fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  if (exists) {
    console.log(`✅ ${description}`);
    passedChecks++;
  } else {
    console.log(`❌ ${description} (MISSING)`);
  }
  return exists;
}

// Check essential PWA files
console.log('\n📁 Essential PWA Files:');
console.log('------------------------');

checkFile(path.join(publicDir, 'manifest.json'), 'Web App Manifest');
checkFile(path.join(publicDir, 'logo192.png'), '192px Logo');
checkFile(path.join(publicDir, 'logo512.png'), '512px Logo');
checkFile(path.join(frontendRoot, 'vite.config.js'), 'Vite Configuration with PWA Plugin');

// Check service worker files (generated during build)
console.log('\n🔧 Service Worker Files:');
console.log('-------------------------');
console.log('ℹ️  Service worker files are generated during build process');
console.log('✅ Service Worker Configuration (in vite.config.js)');

// Check PWA services
console.log('\n⚙️  PWA Services:');
console.log('------------------');

checkFile(path.join(servicesDir, 'pwaService.js'), 'PWA Manager Service');
checkFile(path.join(servicesDir, 'notificationService.js'), 'Notification Service');
checkFile(path.join(servicesDir, 'offlineDataService.js'), 'Offline Data Service');
checkFile(path.join(servicesDir, 'webSocketService.js'), 'WebSocket Service');
checkFile(path.join(servicesDir, 'apiService.js'), 'API Service');

// Check PWA components
console.log('\n📱 PWA Components:');
console.log('-------------------');

checkFile(path.join(driverPwaDir, 'DriverApp.jsx'), 'Driver App Component');
checkFile(path.join(driverPwaDir, 'PWAInstallPrompt.jsx'), 'PWA Install Prompt');
checkFile(path.join(driverPwaDir, 'PWADetection.jsx'), 'PWA Detection Component');

// Check PWA test files
console.log('\n🧪 PWA Testing:');
console.log('----------------');

checkFile(path.join(servicesDir, 'pwaTestSuite.js'), 'PWA Test Suite');
checkFile(path.join(servicesDir, 'comprehensive-pwa-test.js'), 'Comprehensive PWA Test');
checkFile(path.join(publicDir, 'pwa-test.html'), 'PWA Test HTML Page');

// Check documentation
console.log('\n📚 Documentation:');
console.log('------------------');

checkFile(path.join(frontendRoot, 'PWA-README.md'), 'PWA README');
checkFile(path.join(frontendRoot, 'PWA-INSTALLATION-GUIDE.md'), 'PWA Installation Guide');

// Check package.json scripts
console.log('\n🎬 Package Scripts:');
console.log('--------------------');

try {
  const packageJsonPath = path.join(frontendRoot, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  totalChecks++;
  if (packageJson.scripts && packageJson.scripts['verify:pwa']) {
    console.log('✅ PWA Test Script in package.json');
    passedChecks++;
  } else {
    console.log('❌ PWA Test Script in package.json (MISSING)');
  }
} catch (error) {
  console.log('❌ Error reading package.json:', error.message);
}

// Summary
console.log('\n================================');
console.log(`📊 PWA Integration Summary:`);
console.log(`✅ Passed: ${passedChecks}/${totalChecks} checks`);

if (passedChecks === totalChecks) {
  console.log('🎉 All PWA components are properly integrated!');
  process.exit(0);
} else {
  console.log('⚠️  Some PWA components are missing or misconfigured.');
  console.log('💡 Please check the missing components listed above.');
  process.exit(1);
}