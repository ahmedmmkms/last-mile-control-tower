// Simple PWA Verification Test
// This script verifies basic PWA functionality

async function verifyPWA() {
  console.log('🔍 Verifying PWA functionality...');
  
  const results = {
    serviceWorker: false,
    manifest: false,
    installable: false,
    offlineSupport: false,
    https: false
  };
  
  // Check service worker
  try {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      console.log('✅ Service Worker: Registered');
      results.serviceWorker = true;
    }
  } catch (error) {
    console.log('❌ Service Worker: Not registered');
  }
  
  // Check manifest
  try {
    const response = await fetch('/manifest.json');
    if (response.ok) {
      console.log('✅ Manifest: Found');
      results.manifest = true;
    }
  } catch (error) {
    console.log('❌ Manifest: Not found');
  }
  
  // Check HTTPS
  if (location.protocol === 'https:' || 
      location.hostname === 'localhost' || 
      location.hostname === '127.0.0.1') {
    console.log('✅ HTTPS: Secure connection');
    results.https = true;
  } else {
    console.log('❌ HTTPS: Not secure');
  }
  
  // Check installability
  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('✅ Installable: Running in standalone mode');
    results.installable = true;
  }
  
  // Check offline support
  if ('caches' in window && 'indexedDB' in window) {
    console.log('✅ Offline Support: Available');
    results.offlineSupport = true;
  }
  
  console.log('\n📋 PWA Verification Results:');
  console.log('==============================');
  Object.entries(results).forEach(([feature, status]) => {
    console.log(`${status ? '✅' : '❌'} ${feature}: ${status ? 'PASS' : 'FAIL'}`);
  });
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  console.log(`\n📊 Summary: ${passed}/${total} features working`);
  
  if (passed === total) {
    console.log('🎉 PWA is fully functional!');
  } else if (passed >= total * 0.8) {
    console.log('👍 PWA is mostly functional');
  } else {
    console.log('⚠️  PWA needs improvement');
  }
  
  return results;
}

// Run verification
verifyPWA();