// PWA Installation Diagnostics
// This script helps diagnose why a PWA might not be installing

class PWAInstallerDiagnostic {
  constructor() {
    this.results = [];
  }

  async runDiagnostics() {
    console.log('🔍 PWA Installation Diagnostic Tool');
    console.log('====================================');
    
    await this.checkServiceWorker();
    await this.checkManifest();
    await this.checkHTTPS();
    await this.checkInstallability();
    await this.checkRequiredFields();
    await this.checkIcons();
    await this.checkOfflineSupport();
    
    this.displayResults();
    this.provideRecommendations();
  }

  async checkServiceWorker() {
    console.log('\n🔧 Checking Service Worker...');
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          console.log('✅ Service Worker: Registered');
          this.results.push({ test: 'Service Worker', status: 'PASS', details: 'Service worker is registered' });
        } else {
          console.log('❌ Service Worker: Not registered');
          this.results.push({ test: 'Service Worker', status: 'FAIL', details: 'Service worker is not registered' });
        }
      } else {
        console.log('❌ Service Worker: Not supported');
        this.results.push({ test: 'Service Worker', status: 'FAIL', details: 'Service worker API not supported' });
      }
    } catch (error) {
      console.log('❌ Service Worker: Error -', error.message);
      this.results.push({ test: 'Service Worker', status: 'ERROR', details: `Service worker error: ${error.message}` });
    }
  }

  async checkManifest() {
    console.log('\n📋 Checking Web App Manifest...');
    try {
      // Check if manifest link exists
      const manifestLink = document.querySelector('link[rel="manifest"]');
      if (!manifestLink) {
        console.log('❌ Manifest Link: Missing <link rel="manifest"> tag');
        this.results.push({ test: 'Manifest Link', status: 'FAIL', details: 'Missing <link rel="manifest"> tag in HTML' });
        return;
      }
      
      console.log('✅ Manifest Link: Found');
      this.results.push({ test: 'Manifest Link', status: 'PASS', details: 'Manifest link tag found' });
      
      // Try to fetch and parse manifest
      const manifestHref = manifestLink.href;
      const response = await fetch(manifestHref);
      if (!response.ok) {
        console.log('❌ Manifest File: Not accessible');
        this.results.push({ test: 'Manifest File', status: 'FAIL', details: 'Manifest file not accessible' });
        return;
      }
      
      const manifest = await response.json();
      console.log('✅ Manifest File: Accessible and valid JSON');
      this.results.push({ test: 'Manifest File', status: 'PASS', details: 'Manifest file accessible and valid' });
      
      // Check required manifest fields
      const requiredFields = ['name', 'short_name', 'start_url', 'display', 'background_color', 'theme_color'];
      const missingFields = requiredFields.filter(field => !manifest[field]);
      
      if (missingFields.length > 0) {
        console.log('❌ Manifest Fields: Missing required fields:', missingFields);
        this.results.push({ test: 'Manifest Fields', status: 'FAIL', details: `Missing fields: ${missingFields.join(', ')}` });
      } else {
        console.log('✅ Manifest Fields: All required fields present');
        this.results.push({ test: 'Manifest Fields', status: 'PASS', details: 'All required fields present' });
      }
      
    } catch (error) {
      console.log('❌ Manifest: Error -', error.message);
      this.results.push({ test: 'Manifest', status: 'ERROR', details: `Manifest error: ${error.message}` });
    }
  }

  checkHTTPS() {
    console.log('\n🔒 Checking HTTPS...');
    try {
      const isSecure = location.protocol === 'https:' || 
                       location.hostname === 'localhost' || 
                       location.hostname === '127.0.0.1';
      
      if (isSecure) {
        console.log('✅ HTTPS: Secure connection');
        this.results.push({ test: 'HTTPS', status: 'PASS', details: 'Secure connection (HTTPS or localhost)' });
      } else {
        console.log('❌ HTTPS: Not secure - PWA requires HTTPS in production');
        this.results.push({ test: 'HTTPS', status: 'FAIL', details: 'PWA requires HTTPS in production' });
      }
    } catch (error) {
      console.log('❌ HTTPS: Error -', error.message);
      this.results.push({ test: 'HTTPS', status: 'ERROR', details: `HTTPS check error: ${error.message}` });
    }
  }

  checkInstallability() {
    console.log('\n📲 Checking Installability...');
    try {
      // Check for beforeinstallprompt event
      if ('BeforeInstallPromptEvent' in window) {
        console.log('✅ Install Event: BeforeInstallPrompt supported');
        this.results.push({ test: 'Install Event', status: 'PASS', details: 'BeforeInstallPromptEvent supported' });
      } else {
        console.log('⚠️ Install Event: BeforeInstallPrompt not directly supported (but may still work)');
        this.results.push({ test: 'Install Event', status: 'WARNING', details: 'BeforeInstallPromptEvent not directly supported' });
      }
      
      // Check display mode
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      if (isStandalone) {
        console.log('✅ Display Mode: Running in standalone mode');
        this.results.push({ test: 'Display Mode', status: 'PASS', details: 'Running in standalone mode' });
      } else {
        console.log('ℹ️ Display Mode: Running in browser (not standalone)');
        this.results.push({ test: 'Display Mode', status: 'INFO', details: 'Currently running in browser' });
      }
      
    } catch (error) {
      console.log('❌ Installability: Error -', error.message);
      this.results.push({ test: 'Installability', status: 'ERROR', details: `Installability check error: ${error.message}` });
    }
  }

  checkRequiredFields() {
    console.log('\n📝 Checking Required Meta Tags...');
    try {
      // Check viewport meta tag
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        console.log('✅ Viewport Meta Tag: Present');
        this.results.push({ test: 'Viewport Meta Tag', status: 'PASS', details: 'Viewport meta tag present' });
      } else {
        console.log('❌ Viewport Meta Tag: Missing');
        this.results.push({ test: 'Viewport Meta Tag', status: 'FAIL', details: 'Missing viewport meta tag' });
      }
      
      // Check theme color
      const themeColor = document.querySelector('meta[name="theme-color"]');
      if (themeColor) {
        console.log('✅ Theme Color Meta Tag: Present');
        this.results.push({ test: 'Theme Color Meta Tag', status: 'PASS', details: 'Theme color meta tag present' });
      } else {
        console.log('⚠️ Theme Color Meta Tag: Missing (recommended)');
        this.results.push({ test: 'Theme Color Meta Tag', status: 'WARNING', details: 'Missing theme color meta tag (recommended)' });
      }
      
    } catch (error) {
      console.log('❌ Meta Tags: Error -', error.message);
      this.results.push({ test: 'Meta Tags', status: 'ERROR', details: `Meta tags check error: ${error.message}` });
    }
  }

  async checkIcons() {
    console.log('\n🖼️ Checking Icons...');
    try {
      const manifestLink = document.querySelector('link[rel="manifest"]');
      if (!manifestLink) {
        console.log('❌ Icons: Cannot check without manifest');
        this.results.push({ test: 'Icons', status: 'FAIL', details: 'Cannot check icons without manifest' });
        return;
      }
      
      const manifestHref = manifestLink.href;
      const manifestDir = manifestHref.substring(0, manifestHref.lastIndexOf('/') + 1);
      
      const response = await fetch(manifestHref);
      const manifest = await response.json();
      
      if (!manifest.icons || manifest.icons.length === 0) {
        console.log('❌ Icons: No icons defined in manifest');
        this.results.push({ test: 'Icons', status: 'FAIL', details: 'No icons defined in manifest' });
        return;
      }
      
      console.log(`✅ Icons: ${manifest.icons.length} icons defined in manifest`);
      this.results.push({ test: 'Icons', status: 'PASS', details: `${manifest.icons.length} icons defined` });
      
      // Check if icon files exist
      let iconsWorking = 0;
      for (const icon of manifest.icons) {
        try {
          const iconUrl = new URL(icon.src, manifestDir).href;
          const iconResponse = await fetch(iconUrl, { method: 'HEAD' });
          if (iconResponse.ok) {
            iconsWorking++;
          }
        } catch (error) {
          // Ignore individual icon errors
        }
      }
      
      if (iconsWorking === manifest.icons.length) {
        console.log('✅ Icon Files: All icon files accessible');
        this.results.push({ test: 'Icon Files', status: 'PASS', details: 'All icon files accessible' });
      } else {
        console.log(`⚠️ Icon Files: ${iconsWorking}/${manifest.icons.length} icon files accessible`);
        this.results.push({ test: 'Icon Files', status: 'WARNING', details: `${iconsWorking}/${manifest.icons.length} icon files accessible` });
      }
      
    } catch (error) {
      console.log('❌ Icons: Error -', error.message);
      this.results.push({ test: 'Icons', status: 'ERROR', details: `Icons check error: ${error.message}` });
    }
  }

  checkOfflineSupport() {
    console.log('\n📶 Checking Offline Support...');
    try {
      const supportsOffline = 'caches' in window && 'indexedDB' in window;
      if (supportsOffline) {
        console.log('✅ Offline Support: Cache API and IndexedDB available');
        this.results.push({ test: 'Offline Support', status: 'PASS', details: 'Cache API and IndexedDB available' });
      } else {
        console.log('❌ Offline Support: Cache API or IndexedDB not available');
        this.results.push({ test: 'Offline Support', status: 'FAIL', details: 'Cache API or IndexedDB not available' });
      }
    } catch (error) {
      console.log('❌ Offline Support: Error -', error.message);
      this.results.push({ test: 'Offline Support', status: 'ERROR', details: `Offline support check error: ${error.message}` });
    }
  }

  displayResults() {
    console.log('\n📊 Diagnostic Results:');
    console.log('======================');
    
    const passCount = this.results.filter(r => r.status === 'PASS').length;
    const failCount = this.results.filter(r => r.status === 'FAIL').length;
    const warnCount = this.results.filter(r => r.status === 'WARNING').length;
    const errorCount = this.results.filter(r => r.status === 'ERROR').length;
    const infoCount = this.results.filter(r => r.status === 'INFO').length;
    const totalCount = this.results.length;
    
    console.log(`✅ Pass: ${passCount}`);
    console.log(`❌ Fail: ${failCount}`);
    console.log(`⚠️  Warning: ${warnCount}`);
    console.log(`❌ Error: ${errorCount}`);
    console.log(`ℹ️  Info: ${infoCount}`);
    console.log(`📊 Total: ${totalCount}`);
    
    console.log('\nDetailed Results:');
    this.results.forEach(result => {
      const statusIcon = {
        'PASS': '✅',
        'FAIL': '❌',
        'WARNING': '⚠️',
        'ERROR': '❌',
        'INFO': 'ℹ️'
      }[result.status] || '❓';
      
      console.log(`${statusIcon} ${result.test}: ${result.details}`);
    });
  }

  provideRecommendations() {
    console.log('\n💡 Recommendations:');
    console.log('==================');
    
    const fails = this.results.filter(r => r.status === 'FAIL');
    const errors = this.results.filter(r => r.status === 'ERROR');
    const warnings = this.results.filter(r => r.status === 'WARNING');
    
    if (fails.length === 0 && errors.length === 0) {
      console.log('🎉 No critical issues found! PWA should be installable.');
      console.log('If still having issues, try these steps:');
      console.log('1. Refresh the page');
      console.log('2. Check browser developer tools for errors');
      console.log('3. Try in an incognito/private window');
      console.log('4. Clear browser cache and try again');
      return;
    }
    
    if (errors.length > 0) {
      console.log('❌ Critical Errors:');
      errors.forEach(error => {
        console.log(`   - ${error.test}: ${error.details}`);
      });
      console.log('   Fix these errors first before attempting installation.');
    }
    
    if (fails.length > 0) {
      console.log('❌ Failed Checks:');
      fails.forEach(fail => {
        console.log(`   - ${fail.test}: ${fail.details}`);
      });
      console.log('   These issues must be resolved for PWA installation.');
    }
    
    if (warnings.length > 0) {
      console.log('⚠️ Warnings:');
      warnings.forEach(warning => {
        console.log(`   - ${warning.test}: ${warning.details}`);
      });
      console.log('   These are recommended but not required for installation.');
    }
  }
}

// Run diagnostics when called
if (typeof window !== 'undefined') {
  window.runPWADiagnostic = async () => {
    const diagnostic = new PWAInstallerDiagnostic();
    await diagnostic.runDiagnostics();
  };
  
  // Auto-run if in development mode
  if (process.env.NODE_ENV === 'development') {
    window.addEventListener('load', () => {
      setTimeout(() => {
        console.log('Auto-running PWA diagnostic in development mode...');
        window.runPWADiagnostic();
      }, 2000);
    });
  }
}

export default PWAInstallerDiagnostic;