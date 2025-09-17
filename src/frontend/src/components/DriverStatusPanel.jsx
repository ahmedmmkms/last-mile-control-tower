import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Box,
  CircularProgress
} from '@mui/material';
import { DirectionsCar as CarIcon, DirectionsBike as BikeIcon, LocalShipping as VanIcon } from '@mui/icons-material';
import ApiService from '../services/apiService';

const DriverStatusPanel = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getDrivers();
      setDrivers(data);
    } catch (err) {
      setError('Failed to fetch drivers');
      console.error('Error fetching drivers:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'success';
      case 'busy': return 'warning';
      case 'offline': return 'default';
      default: return 'default';
    }
  };

  const getVehicleIcon = (vehicleType) => {
    switch (vehicleType) {
      case 'car': return <CarIcon />;
      case 'bike': return <BikeIcon />;
      case 'van': return <VanIcon />;
      default: return <CarIcon />;
    }
  };

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
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Driver Status
      </Typography>
      
      <Paper>
        <List>
          {drivers.map((driver) => (
            <ListItem key={driver.id} divider>
              <ListItemIcon>
                {getVehicleIcon(driver.vehicle_type)}
              </ListItemIcon>
              <ListItemText 
                primary={driver.name}
                secondary={driver.current_location ? 
                  `Location: ${driver.current_location.lat}, ${driver.current_location.lng}` : 
                  'Location: Unknown'
                }
              />
              <Chip 
                label={driver.status} 
                color={getStatusColor(driver.status)} 
                size="small" 
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default DriverStatusPanel;