import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme
} from '@mui/material';
import ApiService from '../services/apiService';
import LiveDriverTracking from './LiveDriverTracking';

const DriverStatusPanel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
        Driver Status
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="driver status tabs"
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons={isMobile ? "auto" : false}
        >
          <Tab label="Overview" />
          <Tab label="Live Tracking" />
        </Tabs>
      </Box>
      
      {tabValue === 0 && (
        <Paper sx={{ p: isMobile ? 1 : 2 }}>
          <Typography variant={isMobile ? "body2" : "body1"} color="text.secondary">
            Switch to the Live Tracking tab to see real-time driver locations and status updates.
          </Typography>
        </Paper>
      )}
      
      {tabValue === 1 && <LiveDriverTracking />}
    </Box>
  );
};

export default DriverStatusPanel;