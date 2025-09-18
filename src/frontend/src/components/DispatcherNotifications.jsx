import React, { useState, useEffect } from 'react';
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Divider,
  Box,
  Chip
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Assignment as AssignmentIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import dispatcherNotificationService from '../services/dispatcherNotificationService';
import webSocketService from '../services/webSocketService';

const DispatcherNotifications = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Initialize notifications
    const initialNotifications = dispatcherNotificationService.getNotifications();
    setNotifications(initialNotifications);
    setUnreadCount(initialNotifications.filter(n => !n.read).length);
    
    // Listen for new notifications
    dispatcherNotificationService.addListener('notification', (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });
    
    // Subscribe to WebSocket events for real-time notifications
    webSocketService.subscribeToAssignmentNotifications((assignmentData) => {
      dispatcherNotificationService.createAssignmentNotification(assignmentData);
    });
    
    webSocketService.subscribeToDriverLocations((driverData) => {
      // Only create notification if status changed significantly
      if (driverData.status_change) {
        dispatcherNotificationService.createDriverStatusNotification(driverData);
      }
    });
    
    webSocketService.subscribeToShipmentUpdates((shipmentData) => {
      // Only create notification for significant status changes
      if (['delivered', 'failed'].includes(shipmentData.status)) {
        dispatcherNotificationService.createShipmentUpdateNotification(shipmentData);
      }
    });
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification) => {
    // Mark as read
    dispatcherNotificationService.markAsRead(notification.id);
    setUnreadCount(prev => Math.max(0, prev - 1));
    
    // Handle specific notification actions
    if (notification.type === 'assignment-notification') {
      // Navigate to assignments or driver
      console.log('Assignment notification clicked:', notification);
    } else if (notification.type === 'driver-status-change') {
      // Navigate to driver status panel
      console.log('Driver status notification clicked:', notification);
    } else if (notification.type === 'shipment-update') {
      // Navigate to shipment
      console.log('Shipment update notification clicked:', notification);
    }
    
    handleClose();
  };

  const handleMarkAllAsRead = () => {
    dispatcherNotificationService.markAllAsRead();
    setUnreadCount(0);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'assignment-notification':
        return <AssignmentIcon fontSize="small" />;
      case 'driver-status-change':
        return <ShippingIcon fontSize="small" />;
      case 'shipment-update':
        return <CheckCircleIcon fontSize="small" />;
      default:
        return <NotificationsIcon fontSize="small" />;
    }
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        aria-controls="notifications-menu"
        aria-haspopup="true"
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      
      <Menu
        id="notifications-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ minWidth: 300, maxWidth: 400 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
            <Typography variant="h6">Notifications</Typography>
            {unreadCount > 0 && (
              <Chip 
                label={`${unreadCount} unread`} 
                color="primary" 
                size="small" 
                onClick={handleMarkAllAsRead}
                sx={{ cursor: 'pointer' }}
              />
            )}
          </Box>
          
          <Divider />
          
          {notifications.length === 0 ? (
            <MenuItem>
              <Typography color="text.secondary">No notifications</Typography>
            </MenuItem>
          ) : (
            notifications.slice(0, 5).map((notification) => (
              <MenuItem 
                key={notification.id} 
                onClick={() => handleNotificationClick(notification)}
                selected={!notification.read}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                  <Box sx={{ mr: 2, mt: 0.5 }}>
                    {getNotificationIcon(notification.type)}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      {notification.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(notification.timestamp).toLocaleTimeString()}
                    </Typography>
                  </Box>
                  {!notification.read && (
                    <Box sx={{ ml: 1 }}>
                      <Box sx={{ width: 8, height: 8, bgcolor: 'primary.main', borderRadius: '50%' }} />
                    </Box>
                  )}
                </Box>
              </MenuItem>
            ))
          )}
          
          <Divider />
          
          <MenuItem onClick={handleClose}>
            <Typography variant="body2" color="primary">
              Close
            </Typography>
          </MenuItem>
        </Box>
      </Menu>
    </>
  );
};

export default DispatcherNotifications;