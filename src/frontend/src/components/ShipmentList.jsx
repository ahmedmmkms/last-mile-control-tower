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
        <Paper>
          <List>
            {filteredShipments.map((shipment) => (
              <React.Fragment key={shipment.id}>
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
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {shipment.tracking_number}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Chip 
                        label={getLocalizedStatus(shipment.status)} 
                        color={getStatusColor(shipment.status)} 
                        size="small" 
                        sx={{ mr: 1 }}
                      />
                      <IconButton 
                        size="small" 
                        onClick={() => handleViewTimeline(shipment)}
                        title={t('view_details')}
                      >
                        <TimelineIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => toggleRowExpansion(shipment.id)}
                      >
                        {expandedRows.has(shipment.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Collapse in={expandedRows.has(shipment.id)} timeout="auto" unmountOnExit sx={{ width: '100%' }}>
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>{t('origin')}:</strong> {shipment.origin ? `${shipment.origin.lat}, ${shipment.origin.lng}` : 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>{t('destination')}:</strong> {shipment.destination ? `${shipment.destination.lat}, ${shipment.destination.lng}` : 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>{t('assigned_driver')}:</strong> {shipment.assigned_driver_id || 'Unassigned'}
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
        <TableContainer component={Paper}>
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow>
                <TableCell>{t('tracking_number')}</TableCell>
                <TableCell>{t('status')}</TableCell>
                <TableCell>{t('origin')}</TableCell>
                <TableCell>{t('destination')}</TableCell>
                <TableCell>{t('assigned_driver')}</TableCell>
                <TableCell>{t('actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredShipments.map((shipment) => (
                <TableRow key={shipment.id}>
                  <TableCell>{shipment.tracking_number}</TableCell>
                  <TableCell>
                    <Chip 
                      label={getLocalizedStatus(shipment.status)} 
                      color={getStatusColor(shipment.status)} 
                      size={isMobile ? "small" : "medium"} 
                    />
                  </TableCell>
                  <TableCell>
                    {shipment.origin ? `${shipment.origin.lat}, ${shipment.origin.lng}` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {shipment.destination ? `${shipment.destination.lat}, ${shipment.destination.lng}` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {shipment.assigned_driver_id || t('unassigned')}
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      size={isMobile ? "small" : "medium"} 
                      onClick={() => handleViewTimeline(shipment)}
                      title={t('view_details')}
                    >
                      <TimelineIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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