import React, { useState, useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline
} from 'react-leaflet';
import { Paper, Typography, Box, CircularProgress, Chip, Avatar, Alert, useMediaQuery, useTheme } from '@mui/material';
import { LocalShipping, Place, Error as ErrorIcon } from '@mui/icons-material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import ApiService from '../services/apiService';
import webSocketService from '../services/webSocketService';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon for drivers
const driverIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const RouteVisualization = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [routes, setRoutes] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liveTracking, setLiveTracking] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const mapRef = useRef();

  useEffect(() => {
    fetchRoutesAndDrivers();
    
    // Initialize WebSocket connection for real-time updates
    const wsUrl = process.env.NODE_ENV === 'production' 
      ? `wss://${window.location.host}/ws` 
      : 'ws://localhost:3000/ws';
    
    webSocketService.connect(wsUrl);
    
    // Subscribe to driver location updates
    webSocketService.subscribeToDriverLocations((driverData) => {
      console.log('Driver location update received:', driverData);
      setDrivers(prevDrivers => {
        const existingDriverIndex = prevDrivers.findIndex(d => d.id === driverData.id);
        if (existingDriverIndex >= 0) {
          const updatedDrivers = [...prevDrivers];
          updatedDrivers[existingDriverIndex] = { ...updatedDrivers[existingDriverIndex], ...driverData };
          return updatedDrivers;
        } else {
          return [...prevDrivers, driverData];
        }
      });
    });
    
    // Subscribe to shipment updates
    webSocketService.subscribeToShipmentUpdates((shipmentData) => {
      console.log('Shipment update received:', shipmentData);
      setRoutes(prevRoutes => {
        const updatedRoutes = prevRoutes.map(route => {
          if (route.shipment_id === shipmentData.id) {
            return { ...route, status: shipmentData.status };
          }
          return route;
        });
        return updatedRoutes;
      });
    });
    
    // Subscribe to connection status changes
    webSocketService.subscribeToConnectionStatus((event) => {
      if (event.type === 'open') {
        setConnectionStatus('connected');
      } else if (event.type === 'close') {
        setConnectionStatus('disconnected');
      } else if (event.type === 'error' || event.type === 'connection-error') {
        setConnectionStatus('error');
      }
    });
    
    // Cleanup on unmount
    return () => {
      webSocketService.close();
    };
  }, []);

  const fetchRoutesAndDrivers = async () => {
    try {
      setLoading(true);
      const [routesData, driversData] = await Promise.all([
        ApiService.getRoutes(),
        ApiService.getDrivers()
      ]);
      
      setRoutes(routesData);
      setDrivers(driversData.filter(driver => driver.current_location));
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Default center for the map (Cairo, Egypt)
  const center = [30.0444, 31.2357];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ my: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2,
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 2 : 0
      }}>
        <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
          Route Visualization
        </Typography>
        <Chip 
          label={liveTracking ? "Live Tracking ON" : "Live Tracking OFF"} 
          color={liveTracking ? "success" : "default"}
          onClick={() => setLiveTracking(!liveTracking)}
          sx={{ cursor: 'pointer' }}
        />
      </Box>
      
      {/* Connection status indicator */}
      {connectionStatus !== 'connected' && (
        <Alert 
          severity={connectionStatus === 'error' ? 'error' : 'warning'} 
          icon={<ErrorIcon />}
          sx={{ mb: 2 }}
        >
          {connectionStatus === 'disconnected' 
            ? 'Live tracking disconnected. Reconnecting...' 
            : 'Connection error. Please check your network connection.'}
        </Alert>
      )}
      
      <Paper sx={{ 
        height: isMobile ? 300 : 500, 
        position: 'relative',
        mb: isMobile ? 2 : 0
      }}>
        <MapContainer 
          center={center} 
          zoom={isMobile ? 12 : 13} 
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {routes.map((route) => (
            <React.Fragment key={route.id}>
              {/* Draw route path */}
              <Polyline
                positions={route.waypoints}
                color={route.status === 'active' ? 'blue' : 'gray'}
                weight={isMobile ? 4 : 6}
              />
              
              {/* Draw markers for waypoints */}
              {route.waypoints && route.waypoints.map((waypoint, index) => (
                <Marker position={[waypoint.lat, waypoint.lng]} key={index}>
                  <Popup>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Place sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="subtitle2">
                        Waypoint {index + 1}
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      Shipment: {route.shipment_id}
                    </Typography>
                    <Typography variant="body2">
                      Status: {route.status}
                    </Typography>
                  </Popup>
                </Marker>
              ))}
            </React.Fragment>
          ))}
          
          {/* Draw driver markers if live tracking is enabled */}
          {liveTracking && drivers.map((driver) => (
            <Marker 
              position={[driver.current_location.lat, driver.current_location.lng]} 
              key={driver.id}
              icon={driverIcon}
            >
              <Popup>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: 'primary.main' }}>
                    <LocalShipping sx={{ fontSize: 16 }} />
                  </Avatar>
                  <Typography variant="subtitle2">
                    {driver.name}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Vehicle: {driver.vehicle_type}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Status: {driver.status}
                </Typography>
                <Typography variant="caption">
                  Last updated: {new Date(driver.last_active).toLocaleTimeString()}
                </Typography>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Paper>
      
      {/* Driver status summary */}
      <Box sx={{ mt: 2 }}>
        <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom>
          Active Drivers ({drivers.length})
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 1,
          justifyContent: isMobile ? 'center' : 'flex-start'
        }}>
          {drivers.map(driver => (
            <Chip
              key={driver.id}
              label={`${driver.name} (${driver.status})`}
              size={isMobile ? "small" : "medium"}
              color={driver.status === 'available' ? 'success' : driver.status === 'busy' ? 'warning' : 'default'}
              icon={<LocalShipping />}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default RouteVisualization;