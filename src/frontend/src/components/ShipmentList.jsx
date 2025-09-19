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
  TextField,
  Button,
  Chip,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  useMediaQuery,
  useTheme,
  Collapse,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Add as AddIcon, 
  Timeline as TimelineIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import ApiService from '../services/apiService';
import ShipmentTimeline from './ShipmentTimeline';
import { useTranslation } from 'react-i18next';

const ShipmentList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t, i18n } = useTranslation();
  
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredShipments, setFilteredShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [timelineDialogOpen, setTimelineDialogOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getShipments();
      setShipments(data);
      setFilteredShipments(data);
    } catch (err) {
      setError('Failed to fetch shipments');
      console.error('Error fetching shipments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = shipments.filter(shipment =>
      shipment.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (shipment.assigned_driver_id && shipment.assigned_driver_id.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredShipments(filtered);
  }, [searchTerm, shipments]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'default';
      case 'assigned': return 'primary';
      case 'in_transit': return 'secondary';
      case 'delivered': return 'success';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getLocalizedStatus = (status) => {
    switch (status) {
      case 'pending': return t('shipment_status_pending');
      case 'assigned': return t('shipment_status_assigned');
      case 'in_transit': return t('shipment_status_in_transit');
      case 'delivered': return t('shipment_status_delivered');
      case 'failed': return t('shipment_status_failed');
      default: return status;
    }
  };;

  const handleViewTimeline = (shipment) => {
    setSelectedShipment(shipment);
    setTimelineDialogOpen(true);
  };

  const toggleRowExpansion = (shipmentId) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(shipmentId)) {
      newExpandedRows.delete(shipmentId);
    } else {
      newExpandedRows.add(shipmentId);
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
    <Box sx={{ mb: 4 }}>
      <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
        {t('shipment_list')}
      </Typography>
      
      {/* Search Bar */}
      <Box sx={{ 
        display: 'flex', 
        mb: 2,
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 2 : 0
      }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={t('search_shipments')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1 }} />,
          }}
          size={isMobile ? "small" : "medium"}
        />
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          sx={{ 
            ml: isMobile ? 0 : 2,
            mt: isMobile ? 0 : 0,
            width: isMobile ? '100%' : 'auto'
          }}
          size={isMobile ? "small" : "medium"}
        >
          {t('add_shipment')}
        </Button>
      </Box>
      
      {/* Shipments View */}
      {isMobile ? (
        // Mobile view - list with expandable details
        <Paper sx={{ 
          overflowX: 'auto',
          maxWidth: '100%'
        }}>
          <List>
            {filteredShipments.map((shipment) => (
              <React.Fragment key={shipment.id}>
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
                    <Typography 
                      variant={isMobile ? "body1" : "subtitle1"} 
                      sx={{ 
                        fontWeight: 'bold',
                        fontSize: isMobile ? '0.9rem' : 'inherit'
                      }}
                    >
                      {shipment.tracking_number}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Chip 
                        label={getLocalizedStatus(shipment.status)} 
                        color={getStatusColor(shipment.status)} 
                        size="small" 
                        sx={{ mr: 1, fontSize: isMobile ? '0.7rem' : 'inherit', height: isMobile ? 20 : 24 }}
                      />
                      <IconButton 
                        size="small" 
                        onClick={() => handleViewTimeline(shipment)}
                        title={t('view_details')}
                      >
                        <TimelineIcon sx={{ fontSize: isMobile ? '1rem' : '1.5rem' }} />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => toggleRowExpansion(shipment.id)}
                      >
                        {expandedRows.has(shipment.id) ? <ExpandLessIcon sx={{ fontSize: isMobile ? '1rem' : '1.5rem' }} /> : <ExpandMoreIcon sx={{ fontSize: isMobile ? '1rem' : '1.5rem' }} />}
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Collapse in={expandedRows.has(shipment.id)} timeout="auto" unmountOnExit sx={{ width: '100%' }}>
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}>
                        <strong>{t('origin')}:</strong> {shipment.origin ? `${shipment.origin.lat.toFixed(2)}, ${shipment.origin.lng.toFixed(2)}` : 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}>
                        <strong>{t('destination')}:</strong> {shipment.destination ? `${shipment.destination.lat.toFixed(2)}, ${shipment.destination.lng.toFixed(2)}` : 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}>
                        <strong>{t('assigned_driver')}:</strong> {shipment.assigned_driver_id || t('unassigned')}
                      </Typography>
                    </Box>
                  </Collapse>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
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
            <Table size={isMobile ? "small" : "medium"}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: isMobile ? '0.8rem' : 'inherit' }}>{t('tracking_number')}</TableCell>
                  <TableCell sx={{ fontSize: isMobile ? '0.8rem' : 'inherit' }}>{t('status')}</TableCell>
                  <TableCell sx={{ fontSize: isMobile ? '0.8rem' : 'inherit' }}>{t('origin')}</TableCell>
                  <TableCell sx={{ fontSize: isMobile ? '0.8rem' : 'inherit' }}>{t('destination')}</TableCell>
                  <TableCell sx={{ fontSize: isMobile ? '0.8rem' : 'inherit' }}>{t('assigned_driver')}</TableCell>
                  <TableCell sx={{ fontSize: isMobile ? '0.8rem' : 'inherit' }}>{t('actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredShipments.map((shipment) => (
                  <TableRow key={shipment.id}>
                    <TableCell sx={{ fontSize: isMobile ? '0.8rem' : 'inherit' }}>{shipment.tracking_number}</TableCell>
                    <TableCell>
                      <Chip 
                        label={getLocalizedStatus(shipment.status)} 
                        color={getStatusColor(shipment.status)} 
                        size={isMobile ? "small" : "medium"} 
                        sx={{ fontSize: isMobile ? '0.7rem' : 'inherit' }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: isMobile ? '0.8rem' : 'inherit' }}>
                      {shipment.origin ? `${shipment.origin.lat.toFixed(2)}, ${shipment.origin.lng.toFixed(2)}` : 'N/A'}
                    </TableCell>
                    <TableCell sx={{ fontSize: isMobile ? '0.8rem' : 'inherit' }}>
                      {shipment.destination ? `${shipment.destination.lat.toFixed(2)}, ${shipment.destination.lng.toFixed(2)}` : 'N/A'}
                    </TableCell>
                    <TableCell sx={{ fontSize: isMobile ? '0.8rem' : 'inherit' }}>
                      {shipment.assigned_driver_id || t('unassigned')}
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        size={isMobile ? "small" : "medium"} 
                        onClick={() => handleViewTimeline(shipment)}
                        title={t('view_details')}
                      >
                        <TimelineIcon sx={{ fontSize: isMobile ? '1rem' : '1.5rem' }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
      
      {/* Shipment Timeline Dialog */}
      <Dialog 
        open={timelineDialogOpen} 
        onClose={() => setTimelineDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          {t('shipment_timeline')}
          <IconButton
            aria-label="close"
            onClick={() => setTimelineDialogOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedShipment && (
            <ShipmentTimeline shipmentId={selectedShipment.id} />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ShipmentList;