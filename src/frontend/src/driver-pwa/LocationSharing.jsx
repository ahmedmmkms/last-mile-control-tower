import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
  FormControlLabel,
  Switch
} from '@mui/material';
import { LocationOn as LocationIcon, Error as ErrorIcon } from '@mui/icons-material';
import webSocketService from '../services/webSocketService';

const LocationSharing = ({ open, onClose, onLocationUpdate }) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sharingActive, setSharingActive] = useState(false);
  const [watchId, setWatchId] = useState(null);

  // Request location permission and start watching position
  const startLocationSharing = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError('');

    // Get current position first
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationData = {
          latitude,
          longitude,
          timestamp: new Date().toISOString()
        };
        
        setLocation(locationData);
        onLocationUpdate(locationData);
        sendLocationUpdate(locationData);
        setLoading(false);
        
        // Start watching position
        const id = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const updatedLocation = {
              latitude,
              longitude,
              timestamp: new Date().toISOString()
            };
            
            setLocation(updatedLocation);
            onLocationUpdate(updatedLocation);
            sendLocationUpdate(updatedLocation);
          },
          (err) => {
            setError(`Unable to retrieve your location: ${err.message}`);
            setLoading(false);
            setSharingActive(false);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 30000,
            timeout: 27000
          }
        );
        
        setWatchId(id);
        setSharingActive(true);
      },
      (err) => {
        setError(`Unable to retrieve your location: ${err.message}`);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000
      }
    );
  };

  // Send location update via WebSocket
  const sendLocationUpdate = (locationData) => {
    // In a real implementation, you would get the actual driver ID
    const driverId = localStorage.getItem('driverId') || 'driver-123';
    
    // Send location update via WebSocket
    webSocketService.sendDriverLocation({
      ...locationData,
      driverId
    });
  };

  // Stop watching position
  const stopLocationSharing = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setSharingActive(false);
    }
  };

  // Toggle location sharing
  const toggleLocationSharing = () => {
    if (sharingActive) {
      stopLocationSharing();
    } else {
      startLocationSharing();
    }
  };

  // Initialize WebSocket connection
  useEffect(() => {
    // Connect to WebSocket when component mounts
    const wsUrl = process.env.NODE_ENV === 'production' 
      ? `wss://${window.location.host}` 
      : 'ws://localhost:3000';
      
    webSocketService.connect(wsUrl);
    
    // Handle WebSocket events
    const handleConnect = () => {
      console.log('WebSocket connected');
      // Authenticate driver when connected
      const driverId = localStorage.getItem('driverId') || 'driver-123';
      const token = localStorage.getItem('authToken') || 'dummy-token';
      webSocketService.authenticateDriver(driverId, token);
    };
    
    const handleError = (error) => {
      console.error('WebSocket error:', error);
      setError('Connection error. Please try again later.');
    };
    
    webSocketService.on('connect', handleConnect);
    webSocketService.on('error', handleError);
    
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
      // Disconnect from WebSocket when component unmounts
      webSocketService.off('connect', handleConnect);
      webSocketService.off('error', handleError);
      webSocketService.disconnect();
    };
  }, [watchId]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Location Sharing</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ErrorIcon sx={{ mr: 1 }} />
                {error}
              </Box>
            </Alert>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={sharingActive}
                  onChange={toggleLocationSharing}
                  disabled={loading}
                />
              }
              label="Share my location"
            />
            {loading && <CircularProgress size={24} sx={{ ml: 2 }} />}
          </Box>
          
          {location && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Current Location:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body2">
                  Latitude: {location.latitude.toFixed(6)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body2">
                  Longitude: {location.longitude.toFixed(6)}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Last updated: {new Date(location.timestamp).toLocaleTimeString()}
              </Typography>
            </Box>
          )}
          
          {!location && !loading && (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <LocationIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
              <Typography color="text.secondary">
                Location sharing is currently disabled
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Enable location sharing to allow real-time tracking
              </Typography>
            </Box>
          )}
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              How it works:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Your location is shared with the dispatcher in real-time
              <br />• Location updates every 30 seconds while active
              <br />• You can stop sharing at any time
              <br />• Location data is only used for delivery tracking
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LocationSharing;