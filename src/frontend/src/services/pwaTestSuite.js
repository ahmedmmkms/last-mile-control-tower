// PWA Test Suite
// This script tests all PWA features to ensure they're working correctly

class PWATestSuite {
  constructor() {
    this.results = [];
  }

  // Test if service worker is registered
  async testServiceWorker() {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        this.logResult('Service Worker', 'Registered', true);
        return registration;
      } else {
        this.logResult('Service Worker', 'Not supported', false);
        return null;
      }
    } catch (error) {
      this.logResult('Service Worker', `Error: ${error.message}`, false);
      return null;
    }
  }

  // Test if PWA manifest is present
  async testManifest() {
    try {
      const response = await fetch('/manifest.json');
      if (response.ok) {
        const manifest = await response.json();
        this.logResult('Web Manifest', 'Found and valid', true);
        return manifest;
      } else {
        this.logResult('Web Manifest', 'Not found', false);
        return null;
      }
    } catch (error) {
      this.logResult('Web Manifest', `Error: ${error.message}`, false);
      return null;
    }
  }

  // Test if app is installable
  async testInstallability() {
    try {
      // Check if beforeinstallprompt event is supported
      if ('BeforeInstallPromptEvent' in window) {
        this.logResult('Installability', 'BeforeInstallPrompt supported', true);
      } else {
        this.logResult('Installability', 'BeforeInstallPrompt not supported', false);
      }
      
      // Check if display mode is standalone
      if (window.matchMedia('(display-mode: standalone)').matches) {
        this.logResult('Installability', 'Running in standalone mode', true);
      } else {
        this.logResult('Installability', 'Not running in standalone mode', false);
      }
      
      return true;
    } catch (error) {
      this.logResult('Installability', `Error: ${error.message}`, false);
      return false;
    }
  }

  // Test offline capabilities
  async testOfflineCapabilities() {
    try {
      // Check if online/offline events are supported
      if ('ononline' in window && 'onoffline' in window) {
        this.logResult('Offline Capabilities', 'Online/Offline events supported', true);
      } else {
        this.logResult('Offline Capabilities', 'Online/Offline events not supported', false);
      }
      
      // Check if IndexedDB is supported
      if ('indexedDB' in window) {
        this.logResult('Offline Capabilities', 'IndexedDB supported', true);
      } else {
        this.logResult('Offline Capabilities', 'IndexedDB not supported', false);
      }
      
      // Check if Cache API is supported
      if ('caches' in window) {
        this.logResult('Offline Capabilities', 'Cache API supported', true);
      } else {
        this.logResult('Offline Capabilities', 'Cache API not supported', false);
      }
      
      return true;
    } catch (error) {
      this.logResult('Offline Capabilities', `Error: ${error.message}`, false);
      return false;
    }
  }

  // Test push notifications
  async testPushNotifications() {
    try {
      // Check if Push API is supported
      if ('PushManager' in window) {
        this.logResult('Push Notifications', 'Push API supported', true);
      } else {
        this.logResult('Push Notifications', 'Push API not supported', false);
      }
      
      // Check if Notification API is supported
      if ('Notification' in window) {
        this.logResult('Push Notifications', 'Notification API supported', true);
      } else {
        this.logResult('Push Notifications', 'Notification API not supported', false);
      }
      
      return true;
    } catch (error) {
      this.logResult('Push Notifications', `Error: ${error.message}`, false);
      return false;
    }
  }

  // Test responsive design
  async testResponsiveDesign() {
    try {
      // Check viewport meta tag
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        this.logResult('Responsive Design', 'Viewport meta tag present', true);
      } else {
        this.logResult('Responsive Design', 'Viewport meta tag missing', false);
      }
      
      // Check if the page is responsive
      const isResponsive = window.innerWidth <= screen.width;
      if (isResponsive) {
        this.logResult('Responsive Design', 'Page is responsive', true);
      } else {
        this.logResult('Responsive Design', 'Page may not be responsive', false);
      }
      
      return true;
    } catch (error) {
      this.logResult('Responsive Design', `Error: ${error.message}`, false);
      return false;
    }
  }

  // Test performance
  async testPerformance() {
    try {
      // Check if Performance API is supported
      if ('performance' in window) {
        this.logResult('Performance', 'Performance API supported', true);
      } else {
        this.logResult('Performance', 'Performance API not supported', false);
      }
      
      // Check if Navigation Timing API is supported
      if ('timing' in window.performance) {
        this.logResult('Performance', 'Navigation Timing API supported', true);
      } else {
        this.logResult('Performance', 'Navigation Timing API not supported', false);
      }
      
      return true;
    } catch (error) {
      this.logResult('Performance', `Error: ${error.message}`, false);
      return false;
    }
  }

  // Test security
  async testSecurity() {
    try {
      // Check if served over HTTPS
      if (location.protocol === 'https:') {
        this.logResult('Security', 'Served over HTTPS', true);
      } else if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
        this.logResult('Security', 'Served over HTTP (localhost)', true);
      } else {
        this.logResult('Security', 'Not served over HTTPS', false);
      }
      
      return true;
    } catch (error) {
      this.logResult('Security', `Error: ${error.message}`, false);
      return false;
    }
  }

  // Test all PWA features
  async runAllTests() {
    console.log('Running PWA Test Suite...');
    console.log('========================');
    
    await this.testServiceWorker();
    await this.testManifest();
    await this.testInstallability();
    await this.testOfflineCapabilities();
    await this.testPushNotifications();
    await this.testResponsiveDesign();
    await this.testPerformance();
    await this.testSecurity();
    
    console.log('========================');
    console.log('PWA Test Suite Complete');
    console.log('========================');
    
    // Display results summary
    const passedTests = this.results.filter(result => result.passed).length;
    const totalTests = this.results.length;
    
    console.log(`Passed: ${passedTests}/${totalTests} tests`);
    
    if (passedTests === totalTests) {
      console.log('🎉 All PWA tests passed!');
    } else {
      console.log('⚠️  Some PWA tests failed. Please check the results above.');
    }
    
    return this.results;
  }

  // Log test result
  logResult(testName, message, passed) {
    const result = { testName, message, passed };
    this.results.push(result);
    
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${testName}: ${message}`);
  }

  // Get test results
  getResults() {
    return this.results;
  }
}

// Run tests if this script is executed directly
if (typeof window !== 'undefined' && window.location) {
  // Run tests when the page loads
  window.addEventListener('load', async () => {
    // Wait a bit for everything to initialize
    setTimeout(async () => {
      const testSuite = new PWATestSuite();
      await testSuite.runAllTests();
    }, 1000);
  });
}

export default PWATestSuite;