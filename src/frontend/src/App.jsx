import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Button } from '@mui/material';
import Dashboard from './components/Dashboard';
import DriverApp from './driver-pwa/DriverApp';
import './App.css';
import i18n from './localization/i18n';
import { useTranslation } from 'react-i18next';

// Create a logistics-themed palette with RTL support
const getTheme = (direction) => createTheme({
  direction: direction, // 'ltr' or 'rtl'
  palette: {
    primary: {
      main: '#1976d2', // Professional blue
      light: '#63a4ff',
      dark: '#004ba0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff9800', // Logistics orange
      light: '#ffc947',
      dark: '#c66900',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f7fa', // Light grey background
      paper: '#ffffff',
    },
    text: {
      primary: '#263238', // Dark grey text
      secondary: '#546e7a',
    },
    success: {
      main: '#4caf50',
    },
    warning: {
      main: '#ff9800',
    },
    error: {
      main: '#f44336',
    },
    info: {
      main: '#2196f3',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  const [isDriverRoute, setIsDriverRoute] = useState(false);
  const [showPwaTest, setShowPwaTest] = useState(false);
  const [language, setLanguage] = useState('en');
  const { t, i18n: i18nInstance } = useTranslation();
  const [theme, setTheme] = useState(getTheme('ltr'));

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

  // Handle language changes and RTL support
  useEffect(() => {
    const handleLanguageChange = () => {
      const newLanguage = i18nInstance.language;
      setLanguage(newLanguage);
      document.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
      setTheme(getTheme(newLanguage === 'ar' ? 'rtl' : 'ltr'));
    };

    // Listen for language changes
    i18nInstance.on('languageChanged', handleLanguageChange);
    
    // Set initial direction
    handleLanguageChange();
    
    return () => {
      i18nInstance.off('languageChanged', handleLanguageChange);
    };
  }, [i18nInstance]);

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
