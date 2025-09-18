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
import pwaManager from '../services/pwaService';

const PWAInstallPrompt = () => {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Listen for installation availability
  useEffect(() => {
    const handleInstallAvailability = (available) => {
      setShowInstallPrompt(available);
    };

    // Set up callback for installation availability changes
    pwaManager.onInstallAvailabilityChange(handleInstallAvailability);

    // Check initial status
    const status = pwaManager.getPWAStatus();
    setShowInstallPrompt(status.installAvailable);

    // Clean up
    return () => {
      pwaManager.onInstallAvailabilityChange(null);
    };
  }, []);

  // Handle install button click
  const handleInstallClick = async () => {
    try {
      const accepted = await pwaManager.promptInstall();
      if (accepted) {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      // Hide the prompt regardless of user choice
      setShowInstallPrompt(false);
    } catch (error) {
      console.error('Error prompting installation:', error);
      setShowInstallPrompt(false);
    }
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