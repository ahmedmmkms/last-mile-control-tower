import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Button } from '@mui/material';
import Dashboard from './components/Dashboard';
import DriverApp from './driver-pwa/DriverApp';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#e57373',
    },
  },
});

function App() {
  const [isDriverRoute, setIsDriverRoute] = useState(false);
  const [showPwaTest, setShowPwaTest] = useState(false);

  useEffect(() => {
    // Check if we're on a driver route
    const checkRoute = () => {
      const isDriver = window.location.pathname.startsWith('/driver');
      setIsDriverRoute(isDriver);
    };

    checkRoute();
    
    // Listen for route changes
    const handlePopState = () => {
      checkRoute();
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Check if we're in development mode and show PWA test button
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setShowPwaTest(true);
    }
  }, []);

  const handlePwaTestClick = () => {
    // Redirect to PWA test page
    window.location.href = '/pwa-test.html';
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        position: 'relative'
      }}>
        {isDriverRoute ? <DriverApp /> : <Dashboard />}
        
        {/* PWA Test Button (only in development) */}
        {showPwaTest && (
          <Box sx={{ 
            position: 'fixed', 
            bottom: 16, 
            right: 16,
            zIndex: 1000
          }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handlePwaTestClick}
              sx={{
                boxShadow: 3,
                '&:hover': {
                  boxShadow: 6
                }
              }}
            >
              Test PWA
            </Button>
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
