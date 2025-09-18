import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  IconButton,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  LocationOn as LocationIcon,
  Logout as LogoutIcon,
  Directions as DirectionsIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DriverStatusManager from './DriverStatusManager';
import LocationSharing from './LocationSharing';
import notificationService from '../services/notificationService';

const DriverDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [driver, setDriver] = useState({
    name: 'John Doe',
    phone: '+1234567890',
    vehicle: 'Van',
    status: 'available'
  });
  
  const [assignments, setAssignments] = useState([
    {
      id: '1',
      trackingNumber: 'TRK001',
      status: 'assigned',
      destination: '123 Main St, Cairo, Egypt',
      estimatedTime: '30 min'
    },
    {
      id: '2',
      trackingNumber: 'TRK002',
      status: 'in_transit',
      destination: '456 Oak Ave, Giza, Egypt',
      estimatedTime: '15 min'
    }
  ]);
  
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '' });
  
  const navigate = useNavigate();

  // Simulate receiving assignment updates
  useEffect(() => {
    // In a real app, this would come from WebSocket or push notifications
    const interval = setInterval(() => {
      // Simulate a new assignment notification
      if (Math.random() > 0.7) {
        const newAssignment = {
          id: `${assignments.length + 1}`,
          trackingNumber: `TRK00${assignments.length + 1}`,
          status: 'assigned',
          destination: '789 New Assignment St, Nasr City, Cairo',
          estimatedTime: `${Math.floor(Math.random() * 30) + 15} min`
        };
        
        setAssignments(prev => [...prev, newAssignment]);
        
        // Show notification
        notificationService.showNotification('New Assignment', {
          body: `You have a new assignment: ${newAssignment.trackingNumber}`,
          icon: '/logo192.png'
        });
        
        // Also show in-app notification
        setNotification({
          open: true,
          message: `New assignment received: ${newAssignment.trackingNumber}`
        });
      }
    }, 30000); // Check every 30 seconds (in a real app, this would be event-driven)

    return () => clearInterval(interval);
  }, [assignments.length]);

  const handleLogout = () => {
    localStorage.removeItem('driverAuthenticated');
    localStorage.removeItem('driverPhone');
    navigate('/driver/login');
  };

  const handleStatusChange = (newStatusData) => {
    setDriver(prev => ({ ...prev, status: newStatusData.status }));
    // In a real app, you would also send this to the backend
    console.log('Status updated:', newStatusData);
  };

  const handleLocationUpdate = (locationData) => {
    // In a real app, you would send this to the backend via WebSocket or REST API
    console.log('Location updated:', locationData);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'success';
      case 'busy': return 'warning';
      case 'offline': return 'default';
      default: return 'default';
    }
  };

  const getAssignmentStatusColor = (status) => {
    switch (status) {
      case 'assigned': return 'primary';
      case 'in_transit': return 'secondary';
      case 'delivered': return 'success';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Container maxWidth="md" sx={{ p: isMobile ? 1 : 0 }}>
      <Box sx={{ 
        mt: isMobile ? 1 : 2, 
        mb: isMobile ? 2 : 3, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <Typography variant={isMobile ? "h5" : "h4"}>Driver Dashboard</Typography>
        <IconButton onClick={handleLogout} color="error">
          <LogoutIcon />
        </IconButton>
      </Box>

      {/* Driver Info */}
      <Paper elevation={3} sx={{ p: isMobile ? 2 : 3, mb: isMobile ? 2 : 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ width: isMobile ? 40 : 56, height: isMobile ? 40 : 56, mr: 2 }}>
            <AssignmentIcon />
          </Avatar>
          <Box>
            <Typography variant={isMobile ? "h6" : "h6"}>{driver.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {driver.phone} • {driver.vehicle}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Chip
            label={driver.status}
            color={getStatusColor(driver.status)}
            icon={<LocationIcon />}
            size={isMobile ? "small" : "medium"}
          />
          <IconButton 
            size="small" 
            sx={{ ml: 1 }} 
            onClick={() => setStatusDialogOpen(true)}
          >
            <EditIcon />
          </IconButton>
        </Box>
      </Paper>

      {/* Assignments */}
      <Paper elevation={3} sx={{ p: isMobile ? 2 : 3 }}>
        <Typography variant={isMobile ? "h6" : "h6"} gutterBottom>
          My Assignments
        </Typography>
        <List>
          {assignments.map((assignment) => (
            <React.Fragment key={assignment.id}>
              <ListItem
                secondaryAction={
                  <IconButton 
                    edge="end" 
                    onClick={() => navigate(`/driver/assignment/${assignment.id}`)}
                    size={isMobile ? "small" : "medium"}
                  >
                    <DirectionsIcon />
                  </IconButton>
                }
                sx={{ 
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: isMobile ? 'flex-start' : 'center'
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: isMobile ? 'flex-start' : 'center',
                      flexDirection: isMobile ? 'column' : 'row'
                    }}>
                      <Typography 
                        variant={isMobile ? "subtitle2" : "subtitle1"} 
                        sx={{ mr: isMobile ? 0 : 1, mb: isMobile ? 1 : 0 }}
                      >
                        {assignment.trackingNumber}
                      </Typography>
                      <Chip
                        label={assignment.status}
                        size={isMobile ? "small" : "small"}
                        color={getAssignmentStatusColor(assignment.status)}
                      />
                    </Box>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          whiteSpace: isMobile ? 'normal' : 'nowrap',
                          overflow: isMobile ? 'visible' : 'hidden',
                          textOverflow: isMobile ? 'clip' : 'ellipsis'
                        }}
                      >
                        {assignment.destination}
                      </Typography>
                      <Typography variant="caption">
                        Est. {assignment.estimatedTime}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
        {assignments.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography color="text.secondary">
              No assignments available
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ 
        mt: isMobile ? 2 : 3, 
        display: 'flex', 
        gap: isMobile ? 1 : 2,
        flexDirection: isMobile ? 'column' : 'row'
      }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<LocationIcon />}
          onClick={() => setLocationDialogOpen(true)}
          size={isMobile ? "large" : "medium"}
        >
          Location Sharing
        </Button>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => setStatusDialogOpen(true)}
          size={isMobile ? "large" : "medium"}
        >
          Update Status
        </Button>
      </Box>

      {/* Status Manager Dialog */}
      <DriverStatusManager
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        currentStatus={driver.status}
        onStatusChange={handleStatusChange}
      />
      
      {/* Location Sharing Dialog */}
      <LocationSharing
        open={locationDialogOpen}
        onClose={() => setLocationDialogOpen(false)}
        onLocationUpdate={handleLocationUpdate}
      />
      
      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleNotificationClose} severity="info" sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DriverDashboard;