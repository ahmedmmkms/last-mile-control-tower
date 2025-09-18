// Comprehensive PWA service to handle all PWA features
class PWAManager {
  constructor() {
    this.deferredPrompt = null;
    this.isPWA = false;
    this.installCallback = null;
  }

  // Initialize PWA features
  async init() {
    // Check if running as PWA
    this.checkIfPWA();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Initialize service worker
    await this.initServiceWorker();
    
    console.log('PWA Manager initialized');
  }

  // Check if app is running as PWA
  checkIfPWA() {
    // Method 1: Check if display mode is standalone
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isPWA = true;
      console.log('Running as PWA (standalone mode)');
      return;
    }
    
    // Method 2: Check if the app was launched via a shortcut
    if (window.navigator.standalone === true) {
      this.isPWA = true;
      console.log('Running as PWA (iOS standalone mode)');
      return;
    }
    
    // Method 3: Check if we're in an iframe (some PWAs use this)
    if (window.self !== window.top) {
      // This is inside an iframe, might be a PWA wrapper
      this.isPWA = true;
      console.log('Running as PWA (iframe mode)');
      return;
    }
    
    // If none of the above, we're likely in a browser
    this.isPWA = false;
    console.log('Running in browser mode');
  }

  // Set up event listeners
  setupEventListeners() {
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      
      // Stash the event so it can be triggered later
      this.deferredPrompt = e;
      
      console.log('PWA installation available');
      
      // Notify callback if set
      if (this.installCallback) {
        this.installCallback(true);
      }
    });

    // Listen for appinstalled event
    window.addEventListener('appinstalled', (evt) => {
      console.log('PWA installed successfully');
      // Clear the deferred prompt since it's no longer needed
      this.deferredPrompt = null;
      
      // Notify callback if set
      if (this.installCallback) {
        this.installCallback(false);
      }
    });

    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', (e) => {
      this.isPWA = e.matches;
      console.log(`Display mode changed: ${this.isPWA ? 'PWA' : 'Browser'}`);
    });
  }

  // Initialize service worker
  async initServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered: ', registration);
        
        // Handle updates
        registration.addEventListener('updatefound', () => {
          console.log('New service worker available');
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            console.log('Service worker state changed:', newWorker.state);
          });
        });
        
        return registration;
      } catch (error) {
        console.error('Service Worker registration failed: ', error);
        return null;
      }
    }
    return null;
  }

  // Prompt user to install PWA
  async promptInstall() {
    if (!this.deferredPrompt) {
      console.log('No installation prompt available');
      return false;
    }

    // Show the install prompt
    this.deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await this.deferredPrompt.userChoice;

    // We've used the prompt, and can't use it again, throw it away
    this.deferredPrompt = null;

    console.log(`User response to install prompt: ${outcome}`);
    return outcome === 'accepted';
  }

  // Check if installation is available
  isInstallAvailable() {
    return !!this.deferredPrompt;
  }

  // Get PWA status
  getPWAStatus() {
    return {
      isPWA: this.isPWA,
      installAvailable: this.isInstallAvailable(),
      deferredPrompt: !!this.deferredPrompt
    };
  }

  // Set callback for installation availability
  onInstallAvailabilityChange(callback) {
    this.installCallback = callback;
  }

  // Toggle fullscreen mode (for installed PWAs)
  async toggleFullscreen() {
    if (!document.fullscreenElement) {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) { /* Firefox */
          await document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
          await document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) { /* IE/Edge */
          await document.documentElement.msRequestFullscreen();
        }
        console.log('Entered fullscreen mode');
      } catch (error) {
        console.error('Error entering fullscreen mode:', error);
      }
    } else {
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { /* Firefox */
          await document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { /* Chrome, Safari & Opera */
          await document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE/Edge */
          await document.msExitFullscreen();
        }
        console.log('Exited fullscreen mode');
      } catch (error) {
        console.error('Error exiting fullscreen mode:', error);
      }
    }
  }

  // Send message to service worker
  sendMessageToSW(message) {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.active.postMessage(message);
      });
    }
  }

  // Listen for messages from service worker
  onMessageFromSW(callback) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      callback(event.data);
    });
  }
}

// Create a singleton instance
const pwaManager = new PWAManager();

// Initialize the PWA manager when the DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    pwaManager.init();
  });
} else {
  pwaManager.init();
}

export default pwaManager;