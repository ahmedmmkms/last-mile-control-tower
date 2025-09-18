import React, { useState, useEffect } from 'react';
import {
  Snackbar,
  Alert,
  Button,
  Box,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Listen for the beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      
      // Show the install prompt
      setShowInstallPrompt(true);
    };

    // Add event listener
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Clean up event listener
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Handle install button click
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    
    // Hide the prompt
    setShowInstallPrompt(false);
    
    // Log the result
    console.log(`User response to the install prompt: ${outcome}`);
  };

  // Handle close button click
  const handleClose = () => {
    setShowInstallPrompt(false);
  };

  // Don't render anything if not on mobile or if we shouldn't show the prompt
  if (!isMobile || !showInstallPrompt) {
    return null;
  }

  return (
    <Snackbar
      open={showInstallPrompt}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        severity="info"
        sx={{ width: '100%', maxWidth: 400 }}
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              color="inherit"
              size="small"
              onClick={handleClose}
            >
              Later
            </Button>
            <Button
              color="inherit"
              size="small"
              startIcon={<DownloadIcon />}
              onClick={handleInstallClick}
              variant="outlined"
              sx={{ 
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Install
            </Button>
          </Box>
        }
      >
        <Typography variant="body2" sx={{ color: 'white' }}>
          Install our app for a better experience
        </Typography>
      </Alert>
    </Snackbar>
  );
};

export default PWAInstallPrompt;