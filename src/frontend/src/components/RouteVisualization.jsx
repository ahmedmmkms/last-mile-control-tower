import React, { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline
} from 'react-leaflet';
import { Paper, Typography, Box, CircularProgress } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import ApiService from '../services/apiService';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const RouteVisualization = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getRoutes();
      setRoutes(data);
    } catch (err) {
      setError('Failed to fetch routes');
      console.error('Error fetching routes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Default center for the map (New York City)
  const center = [40.7128, -74.0060];

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
      <Typography variant="h5" gutterBottom>
        Route Visualization
      </Typography>
      
      <Paper sx={{ height: 400 }}>
        <MapContainer 
          center={center} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
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
              />
              
              {/* Draw markers for waypoints */}
              {route.waypoints && route.waypoints.map((waypoint, index) => (
                <Marker position={[waypoint.lat, waypoint.lng]} key={index}>
                  <Popup>
                    Waypoint {index + 1}<br />
                    Shipment: {route.shipment_id}
                  </Popup>
                </Marker>
              ))}
            </React.Fragment>
          ))}
        </MapContainer>
      </Paper>
    </Box>
  );
};

export default RouteVisualization;