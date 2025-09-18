import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';
import { 
  Assignment, 
  LocalShipping, 
  CheckCircle, 
  Cancel,
  Pending,
  DriveEta
} from '@mui/icons-material';
import ApiService from '../services/apiService';
import webSocketService from '../services/webSocketService';

const ShipmentTimeline = ({ shipmentId }) => {
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchShipment();
    
    // Subscribe to shipment updates
    webSocketService.subscribeToShipmentUpdates((shipmentData) => {
      if (shipmentData.id === shipmentId) {
        console.log('Shipment update received:', shipmentData);
        setShipment(prev => ({ ...prev, ...shipmentData }));
      }
    });
  }, [shipmentId]);

  const fetchShipment = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getShipmentById(shipmentId);
      setShipment(data);
    } catch (err) {
      setError('Failed to fetch shipment');
      console.error('Error fetching shipment:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Pending />;
      case 'assigned': return <Assignment />;
      case 'in_transit': return <DriveEta />;
      case 'delivered': return <CheckCircle />;
      case 'failed': return <Cancel />;
      default: return <Pending />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'grey';
      case 'assigned': return 'primary';
      case 'in_transit': return 'secondary';
      case 'delivered': return 'success';
      case 'failed': return 'error';
      default: return 'grey';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'assigned': return 'Assigned to Driver';
      case 'in_transit': return 'In Transit';
      case 'delivered': return 'Delivered';
      case 'failed': return 'Delivery Failed';
      default: return status;
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

  if (!shipment) {
    return (
      <Box sx={{ my: 4 }}>
        <Typography color="text.secondary">Shipment not found</Typography>
      </Box>
    );
  }

  // Generate timeline events from shipment data
  const timelineEvents = [
    {
      timestamp: shipment.created_at,
      status: 'pending',
      title: 'Shipment Created',
      description: 'Shipment has been created in the system'
    }
  ];

  if (shipment.assigned_driver_id) {
    timelineEvents.push({
      timestamp: shipment.assigned_at || shipment.updated_at,
      status: 'assigned',
      title: 'Driver Assigned',
      description: `Assigned to driver ${shipment.assigned_driver_name || 'Unknown'}`
    });
  }

  if (shipment.status === 'in_transit') {
    timelineEvents.push({
      timestamp: shipment.in_transit_at || new Date().toISOString(),
      status: 'in_transit',
      title: 'In Transit',
      description: 'Driver has started delivery'
    });
  }

  if (shipment.status === 'delivered') {
    timelineEvents.push({
      timestamp: shipment.pod_timestamp,
      status: 'delivered',
      title: 'Delivered',
      description: 'Shipment successfully delivered'
    });
  }

  if (shipment.status === 'failed') {
    timelineEvents.push({
      timestamp: shipment.failed_at || new Date().toISOString(),
      status: 'failed',
      title: 'Delivery Failed',
      description: 'Delivery attempt failed'
    });
  }

  // Sort events by timestamp
  timelineEvents.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Shipment Timeline: {shipment.tracking_number}
      </Typography>
      
      <Paper sx={{ p: 2 }}>
        <Timeline position="alternate">
          {timelineEvents.map((event, index) => (
            <TimelineItem key={index}>
              <TimelineOppositeContent
                sx={{ m: 'auto 0' }}
                align="right"
                variant="body2"
                color="text.secondary"
              >
                {event.timestamp ? new Date(event.timestamp).toLocaleString() : 'Unknown time'}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineConnector sx={{ bgcolor: index === 0 ? 'transparent' : 'grey.400' }} />
                <TimelineDot color={getStatusColor(event.status)}>
                  {getStatusIcon(event.status)}
                </TimelineDot>
                <TimelineConnector sx={{ bgcolor: index === timelineEvents.length - 1 ? 'transparent' : 'grey.400' }} />
              </TimelineSeparator>
              <TimelineContent sx={{ py: '12px', px: 2 }}>
                <Typography variant="h6" component="span">
                  {event.title}
                </Typography>
                <Typography>{event.description}</Typography>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Paper>
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Current Status
        </Typography>
        <Chip
          label={getStatusText(shipment.status)}
          color={getStatusColor(shipment.status)}
          icon={getStatusIcon(shipment.status)}
          size="medium"
        />
      </Box>
    </Box>
  );
};

export default ShipmentTimeline;