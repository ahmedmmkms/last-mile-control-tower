import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Button } from '@mui/material';
import Dashboard from './components/Dashboard';
import DriverApp from './driver-pwa/DriverApp';
import './App.css';
import './assets/styles/background.css';
import i18n from './localization/i18n';
import { useTranslation } from 'react-i18next';
import theme from './lib/theme';

// Create a logistics-themed palette with RTL support
const getTheme = (direction) => createTheme({
  direction: direction, // 'ltr' or 'rtl'
  palette: {
    primary: {
      main: '#1a1a1a', // Charcoal base
      light: '#404040',
      dark: '#000000',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FFD700', // Amber accent
      light: '#FFEB3B',
      dark: '#FFC107',
      contrastText: '#000000',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
      disabled: '#9E9E9E',
    },
    success: {
      main: '#4CAF50',
      light: '#81C784',
      dark: '#388E3C',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#FF9800',
      light: '#FFB74D',
      dark: '#F57C00',
      contrastText: '#000000',
    },
    info: {
      main: '#2196F3',
      light: '#64B5F6',
      dark: '#1976D2',
      contrastText: '#ffffff',
    },
    error: {
      main: '#F44336',
      light: '#E57373',
      dark: '#D32F2F',
      contrastText: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      'system-ui',
      'Avenir',
      'Helvetica',
      'Arial',
      'sans-serif'
    ].join(','),
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
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 2px 4px -1px rgba(0,0,0,0.1), 0px 4px 5px 0px rgba(0,0,0,0.07), 0px 1px 10px 0px rgba(0,0,0,0.06)',
    '0px 3px 5px -1px rgba(0,0,0,0.1), 0px 6px 10px 0px rgba(0,0,0,0.07), 0px 1px 18px 0px rgba(0,0,0,0.06)',
    ...Array(22).fill('0px 3px 5px -1px rgba(0,0,0,0.1), 0px 6px 10px 0px rgba(0,0,0,0.07), 0px 1px 18px 0px rgba(0,0,0,0.06)')
  ],
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
          boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.1), 0px 4px 5px 0px rgba(0,0,0,0.07), 0px 1px 10px 0px rgba(0,0,0,0.06)',
          borderRadius: 8,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          '&[dir="rtl"]': {
            left: 'auto',
            right: 0,
          },
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
