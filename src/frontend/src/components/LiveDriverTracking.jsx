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
import { useTranslation } from 'react-i18next';

const LiveDriverTracking = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t, i18n } = useTranslation();
  
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

  const getLocalizedStatus = (status) => {
    switch (status) {
      case 'available': return t('driver_status_available');
      case 'busy': return t('driver_status_busy');
      case 'offline': return t('driver_status_offline');
      default: return status;
    }
  };

  const getLocalizedVehicleType = (vehicleType) => {
    switch (vehicleType) {
      case 'bike': return t('vehicle_type_bike');
      case 'car': return t('vehicle_type_car');
      case 'van': return t('vehicle_type_van');
      default: return vehicleType;
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
        {t('live_driver_tracking')}
      </Typography>
      
      {isMobile ? (
        // Mobile view - list with expandable details
        <Paper sx={{ 
          overflowX: 'auto',
          maxWidth: '100%'
        }}>
          <List>
            {drivers.map((driver) => (
              <React.Fragment key={driver.id}>
                <ListItem
                  sx={{ 
                    flexDirection: 'column', 
                    alignItems: 'flex-start',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                    p: isMobile ? 1 : 2
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
                                 driver.status === 'busy' ? 'warning.main' : 'grey.500',
                          fontSize: isMobile ? '1rem' : '1.5rem'
                        }} 
                      />
                      <Typography 
                        variant={isMobile ? "body1" : "subtitle1"}
                        sx={{ 
                          fontSize: isMobile ? '0.9rem' : 'inherit'
                        }}
                      >
                        {driver.name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Chip 
                        label={getLocalizedStatus(driver.status)} 
                        size="small" 
                        color={getStatusColor(driver.status)}
                        sx={{ mr: 1, fontSize: isMobile ? '0.7rem' : 'inherit', height: isMobile ? 20 : 24 }}
                      />
                      <IconButton 
                        size="small" 
                        onClick={() => toggleRowExpansion(driver.id)}
                      >
                        {expandedRows.has(driver.id) ? <ExpandLessIcon sx={{ fontSize: isMobile ? '1rem' : '1.5rem' }} /> : <ExpandMoreIcon sx={{ fontSize: isMobile ? '1rem' : '1.5rem' }} />}
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Collapse in={expandedRows.has(driver.id)} timeout="auto" unmountOnExit sx={{ width: '100%' }}>
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}>
                        <strong>{t('vehicle')}:</strong> {getLocalizedVehicleType(driver.vehicle_type)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}>
                        <strong>{t('location')}:</strong> {driver.current_location ? 
                          `${driver.current_location.lat.toFixed(2)}, ${driver.current_location.lng.toFixed(2)}` : 
                          t('no_location')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}>
                        <strong>{t('last_update')}:</strong> {driver.last_active ? 
                          new Date(driver.last_active).toLocaleTimeString() : 
                          t('never')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}>
                        <strong>{t('battery')}:</strong> {driver.battery_level !== undefined ? 
                          `${driver.battery_level}%` : 
                          t('unknown')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}>
                        <strong>{t('assignment')}:</strong> {driver.assigned_shipment || t('none')}
                      </Typography>
                      <Box sx={{ display: 'flex', mt: 1 }}>
                        <Tooltip title={t('view_on_map')}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleViewOnMap(driver)}
                            disabled={!driver.current_location}
                          >
                            <Directions sx={{ fontSize: isMobile ? '1rem' : '1.5rem' }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('call_driver')}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleCallDriver(driver.phone)}
                            disabled={!driver.phone}
                          >
                            <Phone sx={{ fontSize: isMobile ? '1rem' : '1.5rem' }} />
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
            <Box sx={{ textAlign: 'center', py: isMobile ? 2 : 4 }}>
              <Typography color="text.secondary" sx={{ fontSize: isMobile ? '0.875rem' : 'inherit' }}>
                {t('no_drivers_found')}
              </Typography>
            </Box>
          )}
        </Paper>
      ) : (
        // Desktop view - full table
        <Box sx={{ 
          overflowX: 'auto', 
          maxWidth: '100%',
          mb: 2
        }}>
          <TableContainer component={Paper} sx={{ 
            minWidth: 650,
            width: '100%'
          }}>
            <Table sx={{ minWidth: 650 }} aria-label="live driver tracking table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: isMobile ? '0.8rem' : 'inherit' }}>{t('driver')}</TableCell>
                  <TableCell sx={{ fontSize: isMobile ? '0.8rem' : 'inherit' }}>{t('vehicle')}</TableCell>
                  <TableCell sx={{ fontSize: isMobile ? '0.8rem' : 'inherit' }}>{t('status')}</TableCell>
                  <TableCell sx={{ fontSize: isMobile ? '0.8rem' : 'inherit' }}>{t('location')}</TableCell>
                  <TableCell sx={{ fontSize: isMobile ? '0.8rem' : 'inherit' }}>{t('last_update')}</TableCell>
                  <TableCell sx={{ fontSize: isMobile ? '0.8rem' : 'inherit' }}>{t('battery')}</TableCell>
                  <TableCell sx={{ fontSize: isMobile ? '0.8rem' : 'inherit' }}>{t('assignment')}</TableCell>
                  <TableCell sx={{ fontSize: isMobile ? '0.8rem' : 'inherit' }}>{t('actions')}</TableCell>
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
                                   driver.status === 'busy' ? 'warning.main' : 'grey.500',
                            fontSize: isMobile ? '1rem' : '1.5rem'
                          }} 
                        />
                        <Typography 
                          variant="body2"
                          sx={{ fontSize: isMobile ? '0.8rem' : 'inherit' }}
                        >
                          {driver.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={getLocalizedVehicleType(driver.vehicle_type)} 
                        size="small" 
                        variant="outlined"
                        sx={{ fontSize: isMobile ? '0.7rem' : 'inherit' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={getLocalizedStatus(driver.status)} 
                        size="small" 
                        color={getStatusColor(driver.status)}
                        sx={{ fontSize: isMobile ? '0.7rem' : 'inherit' }}
                      />
                    </TableCell>
                    <TableCell>
                      {driver.current_location ? (
                        <Typography 
                          variant="body2"
                          sx={{ fontSize: isMobile ? '0.8rem' : 'inherit' }}
                        >
                          {driver.current_location.lat.toFixed(2)}, {driver.current_location.lng.toFixed(2)}
                        </Typography>
                      ) : (
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ fontSize: isMobile ? '0.8rem' : 'inherit' }}
                        >
                          {t('no_location')}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {driver.last_active ? (
                        <Typography 
                          variant="body2"
                          sx={{ fontSize: isMobile ? '0.8rem' : 'inherit' }}
                        >
                          {new Date(driver.last_active).toLocaleTimeString()}
                        </Typography>
                      ) : (
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ fontSize: isMobile ? '0.8rem' : 'inherit' }}
                        >
                          {t('never')}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {driver.battery_level !== undefined ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {getBatteryIcon(driver.battery_level)}
                          <Typography 
                            variant="body2" 
                            sx={{ ml: 1, fontSize: isMobile ? '0.8rem' : 'inherit' }}
                          >
                            {driver.battery_level}%
                          </Typography>
                        </Box>
                      ) : (
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ fontSize: isMobile ? '0.8rem' : 'inherit' }}
                        >
                          {t('unknown')}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {driver.assigned_shipment ? (
                        <Chip 
                          label={driver.assigned_shipment} 
                          size="small" 
                          color="primary"
                          sx={{ fontSize: isMobile ? '0.7rem' : 'inherit' }}
                        />
                      ) : (
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ fontSize: isMobile ? '0.8rem' : 'inherit' }}
                        >
                          {t('none')}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Tooltip title={t('view_on_map')}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleViewOnMap(driver)}
                          disabled={!driver.current_location}
                        >
                          <Directions sx={{ fontSize: isMobile ? '1rem' : '1.5rem' }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('call_driver')}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleCallDriver(driver.phone)}
                          disabled={!driver.phone}
                        >
                          <Phone sx={{ fontSize: isMobile ? '1rem' : '1.5rem' }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
      )}
    </Box>
  );
};

export default LiveDriverTracking;