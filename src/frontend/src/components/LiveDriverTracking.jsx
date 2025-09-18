import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
  Collapse,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import {
  LocationOn,
  Directions,
  Phone,
  BatteryFull,
  Battery60,
  Battery20,
  BatteryUnknown,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import webSocketService from '../services/webSocketService';
import ApiService from '../services/apiService';

const LiveDriverTracking = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());

  useEffect(() => {
    fetchDrivers();
    
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
    
    // Subscribe to assignment notifications
    webSocketService.subscribeToAssignmentNotifications((assignmentData) => {
      console.log('Assignment notification received:', assignmentData);
      // Update driver assignment status
      setDrivers(prevDrivers => {
        return prevDrivers.map(driver => {
          if (driver.id === assignmentData.driver_id) {
            return { ...driver, assigned_shipment: assignmentData.shipment_id };
          }
          return driver;
        });
      });
    });
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const driversData = await ApiService.getDrivers();
      setDrivers(driversData);
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

  const getBatteryIcon = (level) => {
    if (level === null || level === undefined) return <BatteryUnknown />;
    if (level > 70) return <BatteryFull />;
    if (level > 30) return <Battery60 />;
    return <Battery20 />;
  };

  const handleViewOnMap = (driver) => {
    // In a real app, this would navigate to the map view centered on the driver
    console.log('Viewing driver on map:', driver);
  };

  const handleCallDriver = (phoneNumber) => {
    window.open(`tel:${phoneNumber}`);
  };

  const toggleRowExpansion = (driverId) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(driverId)) {
      newExpandedRows.delete(driverId);
    } else {
      newExpandedRows.add(driverId);
    }
    setExpandedRows(newExpandedRows);
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
    <Box>
      <Typography variant={isMobile ? "h6" : "h6"} gutterBottom>
        Live Driver Tracking
      </Typography>
      
      {isMobile ? (
        // Mobile view - list with expandable details
        <Paper>
          <List>
            {drivers.map((driver) => (
              <React.Fragment key={driver.id}>
                <ListItem
                  sx={{ 
                    flexDirection: 'column', 
                    alignItems: 'flex-start',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    width: '100%',
                    alignItems: 'center'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOn 
                        sx={{ 
                          mr: 1, 
                          color: driver.status === 'available' ? 'success.main' : 
                                 driver.status === 'busy' ? 'warning.main' : 'grey.500' 
                        }} 
                      />
                      <Typography variant="subtitle1">
                        {driver.name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Chip 
                        label={driver.status} 
                        size="small" 
                        color={getStatusColor(driver.status)}
                        sx={{ mr: 1 }}
                      />
                      <IconButton 
                        size="small" 
                        onClick={() => toggleRowExpansion(driver.id)}
                      >
                        {expandedRows.has(driver.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Collapse in={expandedRows.has(driver.id)} timeout="auto" unmountOnExit sx={{ width: '100%' }}>
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Vehicle:</strong> {driver.vehicle_type}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Location:</strong> {driver.current_location ? 
                          `${driver.current_location.lat.toFixed(4)}, ${driver.current_location.lng.toFixed(4)}` : 
                          'No location'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Last Update:</strong> {driver.last_active ? 
                          new Date(driver.last_active).toLocaleTimeString() : 
                          'Never'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Battery:</strong> {driver.battery_level !== undefined ? 
                          `${driver.battery_level}%` : 
                          'Unknown'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Assignment:</strong> {driver.assigned_shipment || 'None'}
                      </Typography>
                      <Box sx={{ display: 'flex', mt: 1 }}>
                        <Tooltip title="View on map">
                          <IconButton 
                            size="small" 
                            onClick={() => handleViewOnMap(driver)}
                            disabled={!driver.current_location}
                          >
                            <Directions />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Call driver">
                          <IconButton 
                            size="small" 
                            onClick={() => handleCallDriver(driver.phone)}
                            disabled={!driver.phone}
                          >
                            <Phone />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Collapse>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
          
          {drivers.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                No drivers found
              </Typography>
            </Box>
          )}
        </Paper>
      ) : (
        // Desktop view - full table
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="live driver tracking table">
            <TableHead>
              <TableRow>
                <TableCell>Driver</TableCell>
                <TableCell>Vehicle</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Last Update</TableCell>
                <TableCell>Battery</TableCell>
                <TableCell>Assignment</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {drivers.map((driver) => (
                <TableRow
                  key={driver.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOn 
                        sx={{ 
                          mr: 1, 
                          color: driver.status === 'available' ? 'success.main' : 
                                 driver.status === 'busy' ? 'warning.main' : 'grey.500' 
                        }} 
                      />
                      <Typography variant="body2">
                        {driver.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={driver.vehicle_type} 
                      size="small" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={driver.status} 
                      size="small" 
                      color={getStatusColor(driver.status)}
                    />
                  </TableCell>
                  <TableCell>
                    {driver.current_location ? (
                      <Typography variant="body2">
                        {driver.current_location.lat.toFixed(4)}, {driver.current_location.lng.toFixed(4)}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No location
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {driver.last_active ? (
                      <Typography variant="body2">
                        {new Date(driver.last_active).toLocaleTimeString()}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Never
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {driver.battery_level !== undefined ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getBatteryIcon(driver.battery_level)}
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {driver.battery_level}%
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Unknown
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {driver.assigned_shipment ? (
                      <Chip 
                        label={driver.assigned_shipment} 
                        size="small" 
                        color="primary"
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        None
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View on map">
                      <IconButton 
                        size="small" 
                        onClick={() => handleViewOnMap(driver)}
                        disabled={!driver.current_location}
                      >
                        <Directions />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Call driver">
                      <IconButton 
                        size="small" 
                        onClick={() => handleCallDriver(driver.phone)}
                        disabled={!driver.phone}
                      >
                        <Phone />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default LiveDriverTracking;