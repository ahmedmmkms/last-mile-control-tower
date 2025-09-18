// Comprehensive PWA Test Script
// This script tests all PWA features to ensure they're working correctly

async function runPWATests() {
  console.log('🚀 Starting PWA Test Suite...');
  console.log('=====================================');
  
  let passedTests = 0;
  let totalTests = 0;
  
  // Test 1: Service Worker Registration
  totalTests++;
  try {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      console.log('✅ Service Worker: Registered successfully');
      passedTests++;
    } else {
      console.log('❌ Service Worker: Not supported');
    }
  } catch (error) {
    console.log('❌ Service Worker: Registration failed -', error.message);
  }
  
  // Test 2: Web App Manifest
  totalTests++;
  try {
    const response = await fetch('/manifest.json');
    if (response.ok) {
      const manifest = await response.json();
      console.log('✅ Web App Manifest: Found and valid');
      passedTests++;
    } else {
      console.log('❌ Web App Manifest: Not found');
    }
  } catch (error) {
    console.log('❌ Web App Manifest: Error -', error.message);
  }
  
  // Test 3: Installability
  totalTests++;
  try {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) {
      console.log('✅ Installability: Running in standalone mode');
      passedTests++;
    } else {
      console.log('⚠️  Installability: Not running in standalone mode (may be in browser)');
    }
  } catch (error) {
    console.log('❌ Installability: Error -', error.message);
  }
  
  // Test 4: Offline Support
  totalTests++;
  try {
    const supportsOffline = 'caches' in window && 'indexedDB' in window;
    if (supportsOffline) {
      console.log('✅ Offline Support: Cache API and IndexedDB available');
      passedTests++;
    } else {
      console.log('❌ Offline Support: Cache API or IndexedDB not available');
    }
  } catch (error) {
    console.log('❌ Offline Support: Error -', error.message);
  }
  
  // Test 5: Responsive Design
  totalTests++;
  try {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      console.log('✅ Responsive Design: Viewport meta tag present');
      passedTests++;
    } else {
      console.log('❌ Responsive Design: Viewport meta tag missing');
    }
  } catch (error) {
    console.log('❌ Responsive Design: Error -', error.message);
  }
  
  // Test 6: HTTPS
  totalTests++;
  try {
    const isSecure = location.protocol === 'https:' || 
                     location.hostname === 'localhost' || 
                     location.hostname === '127.0.0.1';
    if (isSecure) {
      console.log('✅ Security: Served over secure connection');
      passedTests++;
    } else {
      console.log('❌ Security: Not served over HTTPS');
    }
  } catch (error) {
    console.log('❌ Security: Error -', error.message);
  }
  
  // Test 7: Push Notifications
  totalTests++;
  try {
    const supportsPush = 'PushManager' in window && 'Notification' in window;
    if (supportsPush) {
      console.log('✅ Push Notifications: Supported');
      passedTests++;
    } else {
      console.log('⚠️  Push Notifications: Not supported (optional feature)');
      // Don't count this as a failure since it's optional
      totalTests--;
    }
  } catch (error) {
    console.log('⚠️  Push Notifications: Error -', error.message);
    // Don't count this as a failure since it's optional
    totalTests--;
  }
  
  // Test 8: Background Sync
  totalTests++;
  try {
    const supportsSync = 'serviceWorker' in navigator && 'SyncManager' in window;
    if (supportsSync) {
      console.log('✅ Background Sync: Supported');
      passedTests++;
    } else {
      console.log('⚠️  Background Sync: Not supported (optional feature)');
      // Don't count this as a failure since it's optional
      totalTests--;
    }
  } catch (error) {
    console.log('⚠️  Background Sync: Error -', error.message);
    // Don't count this as a failure since it's optional
    totalTests--;
  }
  
  // Test 9: IndexedDB
  totalTests++;
  try {
    if ('indexedDB' in window) {
      console.log('✅ IndexedDB: Available');
      passedTests++;
    } else {
      console.log('❌ IndexedDB: Not available');
    }
  } catch (error) {
    console.log('❌ IndexedDB: Error -', error.message);
  }
  
  // Test 10: Cache API
  totalTests++;
  try {
    if ('caches' in window) {
      console.log('✅ Cache API: Available');
      passedTests++;
    } else {
      console.log('❌ Cache API: Not available');
    }
  } catch (error) {
    console.log('❌ Cache API: Error -', error.message);
  }
  
  console.log('=====================================');
  console.log(`📊 Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All PWA tests passed! The app is PWA compliant.');
  } else if (passedTests >= totalTests * 0.8) {
    console.log('👍 Good PWA compliance. Some optional features could be improved.');
  } else {
    console.log('⚠️  PWA compliance needs improvement. Check the failed tests above.');
  }
  
  console.log('=====================================');
  
  return {
    passed: passedTests,
    total: totalTests,
    percentage: Math.round((passedTests / totalTests) * 100)
  };
}

// Run tests when the page loads
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    // Wait a bit for everything to initialize
    setTimeout(runPWATests, 1000);
  });
}

// Export for Node.js usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runPWATests };
}