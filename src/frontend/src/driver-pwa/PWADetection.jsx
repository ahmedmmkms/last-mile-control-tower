import React, { useState, useEffect } from 'react';
import {
  Snackbar,
  Alert,
  Button,
  Box,
  Typography
} from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';

const PWADetection = () => {
  const [isPWA, setIsPWA] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // Check if the app is running as a PWA
    const checkPWA = () => {
      // Method 1: Check if display mode is standalone
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsPWA(true);
        return;
      }
      
      // Method 2: Check if the app was launched via a shortcut
      if (window.navigator.standalone === true) {
        setIsPWA(true);
        return;
      }
      
      // Method 3: Check if we're in an iframe (some PWAs use this)
      if (window.self !== window.top) {
        // This is inside an iframe, might be a PWA wrapper
        setIsPWA(true);
        return;
      }
      
      // If none of the above, we're likely in a browser
      setIsPWA(false);
    };

    checkPWA();
    
    // Also listen for changes in display mode
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = (e) => {
      setIsPWA(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // If we're already running as a PWA, don't show anything
  if (isPWA) {
    return null;
  }

  return (
    <Snackbar
      open={!isPWA}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        severity="info"
        sx={{ width: '100%', maxWidth: 400 }}
        action={
          <Button
            color="inherit"
            size="small"
            startIcon={<DownloadIcon />}
            onClick={() => {
              // In a real implementation, you might show installation instructions
              // or trigger the beforeinstallprompt event if available
              console.log('Show installation instructions');
              alert('To install this app:\n\n1. Tap the browser menu (usually three dots)\n2. Select "Add to Home Screen" or "Install App"\n3. Follow the prompts to complete installation');
            }}
          >
            Install
          </Button>
        }
      >
        <Typography variant="body2">
          Install this app for the best experience
        </Typography>
      </Alert>
    </Snackbar>
  );
};

export default PWADetection;