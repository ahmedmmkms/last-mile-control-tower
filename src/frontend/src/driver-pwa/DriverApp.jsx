import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import DriverLogin from './DriverLogin';
import DriverDashboard from './DriverDashboard';
import AssignmentDetail from './AssignmentDetail';
import PWAInstallPrompt from './PWAInstallPrompt';
import notificationService from '../services/notificationService';
import offlineDataService from '../services/offlineDataService';

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

const DriverApp = () => {
  const isAuthenticated = localStorage.getItem('driverAuthenticated') === 'true';

  useEffect(() => {
    // Initialize notification service
    const initNotifications = async () => {
      await notificationService.initServiceWorker();
      const hasPermission = await notificationService.requestPermission();
      
      if (hasPermission) {
        console.log('Notifications permission granted');
        // Subscribe to push notifications if needed
        // const subscription = await notificationService.subscribeToPush();
      } else {
        console.log('Notifications permission denied');
      }
    };

    initNotifications();
  }, []);

  useEffect(() => {
    // Initialize offline data service and start background sync
    const initOfflineData = async () => {
      try {
        await offlineDataService.initDB();
        offlineDataService.startBackgroundSync(30000); // Sync every 30 seconds
        
        // Sync immediately when coming online
        window.addEventListener('online', () => {
          console.log('Connection restored, syncing pending data');
          offlineDataService.syncPendingData();
        });
      } catch (error) {
        console.error('Failed to initialize offline data service:', error);
      }
    };

    if (isAuthenticated) {
      initOfflineData();
    }

    // Cleanup on unmount
    return () => {
      offlineDataService.stopBackgroundSync();
    };
  }, [isAuthenticated]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/driver/login" element={<DriverLogin />} />
          <Route 
            path="/driver/dashboard" 
            element={isAuthenticated ? <DriverDashboard /> : <Navigate to="/driver/login" />} 
          />
          <Route 
            path="/driver/assignment/:id" 
            element={isAuthenticated ? <AssignmentDetail /> : <Navigate to="/driver/login" />} 
          />
          <Route 
            path="/" 
            element={<Navigate to={isAuthenticated ? "/driver/dashboard" : "/driver/login"} />} 
          />
        </Routes>
        <PWAInstallPrompt />
      </Router>
    </ThemeProvider>
  );
};

export default DriverApp;