import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Divider,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  LocationOn as LocationIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  Refresh as RefreshIcon,
  Paid as PaidIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/apiService';
import webSocketService from '../services/webSocketService';
import offlineDataService from '../services/offlineDataService';
import DriverCODCollection from './DriverCODCollection';

const DriverDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState(0);
  const [driver, setDriver] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Check if driver is authenticated
    const storedDriver = localStorage.getItem('driver');
    if (!storedDriver) {
      navigate('/driver/login');
      return;
    }
    
    const driverData = JSON.parse(storedDriver);
    setDriver(driverData);
    
    // Fetch assignments
    fetchAssignments(driverData.id);
    
    // Initialize WebSocket connection
    initializeWebSocket(driverData.id);
    
    // Start background sync
    offlineDataService.startBackgroundSync();
    
    // Get any pending notifications
    loadNotifications();
    
    // Cleanup on unmount
    return () => {
      webSocketService.close();
      offlineDataService.stopBackgroundSync();
    };
  }, []);

  const initializeWebSocket = (driverId) => {
    // Initialize WebSocket connection for real-time updates
    const wsUrl = process.env.NODE_ENV === 'production' 
      ? `wss://${window.location.host}/ws` 
      : 'ws://localhost:3000/ws';
    
    webSocketService.connect(wsUrl);
    
    // Authenticate with driver ID
    webSocketService.send({
      type: 'authenticateDriver',
      payload: { driverId }
    });
    
    // Subscribe to assignment notifications
    webSocketService.subscribeToAssignmentNotifications((data) => {
      console.log('Assignment notification received:', data);
      setNotifications(prev => [...prev, data]);
      
      // Fetch updated assignments
      if (driver) {
        fetchAssignments(driver.id);
      }
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
  };

  const fetchAssignments = async (driverId) => {
    try {
      setLoading(true);
      const data = await ApiService.getDriverAssignments(driverId);
      setAssignments(data);
    } catch (err) {
      setError('Failed to fetch assignments');
      console.error('Error fetching assignments:', err);
      
      // Try to get cached data if offline
      if (!ApiService.isOnline()) {
        try {
          const cached = await offlineDataService.getAllCachedAssignments();
          if (cached && cached.length > 0) {
            setAssignments(cached);
          }
        } catch (cacheError) {
          console.error('Error fetching cached assignments:', cacheError);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const updateDriverLocation = async () => {
    if (!driver) return;
    
    try {
      // Get current position
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const locationData = {
            current_location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          };
          
          // Update driver location
          await ApiService.updateDriverLocation(driver.id, locationData);
          
          // Store location history
          await offlineDataService.storeLocationHistory(driver.id, locationData.current_location);
          
          setLocationError(null);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationError('Failed to get current location');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } catch (err) {
      console.error('Error updating driver location:', err);
      setLocationError('Failed to update location');
    }
  };

  const updateAssignmentStatus = async (assignmentId, status) => {
    try {
      const statusData = { status };
      
      // Update assignment status
      const updatedAssignment = await ApiService.updateShipmentStatus(assignmentId, statusData);
      
      // Update local state
      setAssignments(prev => 
        prev.map(assignment => 
          assignment.id === assignmentId ? updatedAssignment : assignment
        )
      );
      
      // Clear any related notifications
      setNotifications(prev => 
        prev.filter(notification => notification.shipment_id !== assignmentId)
      );
      
      // Cache updated assignment
      await offlineDataService.cacheAssignment(updatedAssignment);
    } catch (err) {
      console.error('Error updating assignment status:', err);
      setError('Failed to update assignment status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('driver');
    navigate('/driver/login');
  };

  const loadNotifications = () => {
    // In a real app, this would load from storage or API
    setNotifications([]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'default';
      case 'assigned': return 'primary';
      case 'in_transit': return 'warning';
      case 'delivered': return 'success';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'assigned': return 'Assigned';
      case 'in_transit': return 'In Transit';
      case 'delivered': return 'Delivered';
      case 'failed': return 'Failed';
      default: return status;
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading && !driver) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!driver) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Driver data not available. Please log in again.</Typography>
        <Button 
          variant="contained" 
          startIcon={<LogoutIcon />} 
          onClick={handleLogout}
          sx={{ mt: 2 }}
        >
          Log Out
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: isMobile ? 2 : 3 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 2 : 0
      }}>
        <Box>
          <Typography variant={isMobile ? "h5" : "h4"}>Driver Dashboard</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Welcome, {driver.name}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton 
            color="primary" 
            onClick={() => fetchAssignments(driver.id)}
            title="Refresh assignments"
          >
            <RefreshIcon />
          </IconButton>
          <IconButton 
            color="secondary" 
            onClick={updateDriverLocation}
            title="Update location"
          >
            <LocationIcon />
          </IconButton>
          <IconButton 
            color="error" 
            onClick={handleLogout}
            title="Log out"
          >
            <LogoutIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Connection status indicator */}
      {connectionStatus !== 'connected' && (
        <Alert 
          severity={connectionStatus === 'error' ? 'error' : 'warning'} 
          icon={<ErrorIcon />}
          sx={{ mb: 2 }}
        >
          {connectionStatus === 'disconnected' 
            ? 'Disconnected from server. Reconnecting...' 
            : 'Connection error. Please check your network connection.'}
        </Alert>
      )}

      {/* Location error */}
      {locationError && (
        <Alert 
          severity="error" 
          onClose={() => setLocationError(null)}
          sx={{ mb: 2 }}
        >
          {locationError}
        </Alert>
      )}

      {/* Notifications */}
      {notifications.length > 0 && (
        <Paper sx={{ mb: 3, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <NotificationsIcon /> Notifications ({notifications.length})
            </Typography>
            <Button size="small" onClick={clearNotifications}>Clear All</Button>
          </Box>
          <List>
            {notifications.map((notification, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={notification.message}
                  secondary={new Date().toLocaleString()}
                />
                <ListItemSecondaryAction>
                  <Button 
                    size="small" 
                    variant="contained"
                    onClick={() => {
                      // Navigate to the assignment
                      // In a real app, you might want to scroll to the assignment or highlight it
                      clearNotifications();
                    }}
                  >
                    View
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab icon={<AssignmentIcon />} label="Assignments" />
          <Tab icon={<PaidIcon />} label="COD Collection" />
        </Tabs>
      </Paper>

      {activeTab === 0 && (
        <>
          {/* Stats */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4">{assignments.length}</Typography>
                <Typography>Total Assignments</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4">
                  {assignments.filter(a => a.status === 'in_transit').length}
                </Typography>
                <Typography>In Transit</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4">
                  {assignments.filter(a => a.status === 'delivered').length}
                </Typography>
                <Typography>Delivered</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4">
                  {assignments.filter(a => a.status === 'failed').length}
                </Typography>
                <Typography>Failed</Typography>
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Assignments List */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom>My Assignments</Typography>
            
            {assignments.length === 0 ? (
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <AssignmentIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No assignments available
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Check back later for new assignments
                </Typography>
              </Paper>
            ) : (
              <Paper>
                <List>
                  {assignments.map((assignment) => (
                    <React.Fragment key={assignment.id}>
                      <ListItem alignItems="flex-start" divider>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <AssignmentIcon />
                              <Typography variant="subtitle1">
                                {assignment.tracking_number}
                              </Typography>
                              <Chip 
                                label={getStatusLabel(assignment.status)} 
                                color={getStatusColor(assignment.status)}
                                size="small"
                              />
                            </Box>
                          }
                          secondary={
                            <React.Fragment>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                Destination: {assignment.destination?.address || 'N/A'}
                              </Typography>
                              <br />
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.secondary"
                              >
                                Assigned: {new Date(assignment.created_at).toLocaleString()}
                              </Typography>
                            </React.Fragment>
                          }
                        />
                        <ListItemSecondaryAction>
                          {assignment.status === 'assigned' && (
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => updateAssignmentStatus(assignment.id, 'in_transit')}
                              startIcon={<LocationIcon />}
                            >
                              Start Delivery
                            </Button>
                          )}
                          {assignment.status === 'in_transit' && (
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => navigate(`/driver/assignment/${assignment.id}`)}
                              startIcon={<CheckCircleIcon />}
                            >
                              Complete Delivery
                            </Button>
                          )}
                        </ListItemSecondaryAction>
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            )}
          </Box>
        </>
      )}

      {activeTab === 1 && (
        <DriverCODCollection driverId={driver.id} />
      )}
    </Box>
  );
};

export default DriverDashboard;