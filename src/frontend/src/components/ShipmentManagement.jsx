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
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import ApiService from '../services/apiService';
import { useTranslation } from 'react-i18next';

const ShipmentManagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingShipment, setEditingShipment] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { t } = useTranslation();
  
  // Form state
  const [formData, setFormData] = useState({
    tracking_number: '',
    status: 'pending',
    origin: { address: '', lat: '', lng: '' },
    destination: { address: '', lat: '', lng: '' },
    assigned_driver_id: ''
  });

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getShipments();
      setShipments(data);
    } catch (err) {
      setError('Failed to fetch shipments');
      console.error('Error fetching shipments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (shipment = null) => {
    if (shipment) {
      setEditingShipment(shipment);
      setFormData({
        tracking_number: shipment.tracking_number || '',
        status: shipment.status || 'pending',
        origin: {
          address: shipment.origin?.address || '',
          lat: shipment.origin?.lat || '',
          lng: shipment.origin?.lng || ''
        },
        destination: {
          address: shipment.destination?.address || '',
          lat: shipment.destination?.lat || '',
          lng: shipment.destination?.lng || ''
        },
        assigned_driver_id: shipment.assigned_driver_id || ''
      });
    } else {
      setEditingShipment(null);
      setFormData({
        tracking_number: '',
        status: 'pending',
        origin: { address: '', lat: '', lng: '' },
        destination: { address: '', lat: '', lng: '' },
        assigned_driver_id: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingShipment(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert lat/lng to numbers
    const shipmentData = {
      ...formData,
      origin: {
        ...formData.origin,
        lat: parseFloat(formData.origin.lat) || 0,
        lng: parseFloat(formData.origin.lng) || 0
      },
      destination: {
        ...formData.destination,
        lat: parseFloat(formData.destination.lat) || 0,
        lng: parseFloat(formData.destination.lng) || 0
      }
    };

    try {
      if (editingShipment) {
        await ApiService.updateShipment(editingShipment.id, shipmentData);
        setSnackbar({ open: true, message: 'Shipment updated successfully', severity: 'success' });
      } else {
        await ApiService.createShipment(shipmentData);
        setSnackbar({ open: true, message: 'Shipment created successfully', severity: 'success' });
      }
      
      handleCloseDialog();
      fetchShipments();
    } catch (err) {
      setSnackbar({ open: true, message: `Error ${editingShipment ? 'updating' : 'creating'} shipment`, severity: 'error' });
      console.error('Error saving shipment:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this shipment?')) {
      try {
        await ApiService.deleteShipment(id);
        setSnackbar({ open: true, message: 'Shipment deleted successfully', severity: 'success' });
        fetchShipments();
      } catch (err) {
        setSnackbar({ open: true, message: 'Error deleting shipment', severity: 'error' });
        console.error('Error deleting shipment:', err);
      }
    }
  };

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

  const getStatusLabel = (status) => {
    return t(`shipment_status_${status}`) || status;
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
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
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">{t('shipment_management')}</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => handleOpenDialog()}
        >
          {t('add_shipment')}
        </Button>
      </Box>

      <Box sx={{ 
        overflowX: 'auto', 
        maxWidth: '100%',
        mb: 2
      }}>
        <TableContainer component={Paper} sx={{ 
          minWidth: isMobile ? 600 : 'auto',
          width: isMobile ? 600 : '100%'
        }}>
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
            {shipments.map((shipment) => (
              <TableRow key={shipment.id}>
                <TableCell>{shipment.tracking_number}</TableCell>
                <TableCell>
                  <Chip 
                    label={getStatusLabel(shipment.status)} 
                    color={getStatusColor(shipment.status)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                  {shipment.origin ? `${shipment.origin.lat}, ${shipment.origin.lng}` : 'N/A'}
                </TableCell>
                <TableCell>
                  {shipment.destination ? `${shipment.destination.lat}, ${shipment.destination.lng}` : 'N/A'}
                </TableCell>
                <TableCell>
                  {shipment.assigned_driver_id || 'Unassigned'}
                </TableCell>
                <TableCell>
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenDialog(shipment)}
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    {t('edit')}
                  </Button>
                  <Button
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(shipment.id)}
                    size="small"
                    color="error"
                  >
                    {t('delete')}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>

      {/* Shipment Form Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          {editingShipment ? t('edit_shipment') : t('add_new_shipment')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label={t('tracking_number')}
              name="tracking_number"
              value={formData.tracking_number}
              onChange={handleChange}
              margin="normal"
              required
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel>{t('status')}</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                label={t('status')}
              >
                <MenuItem value="pending">{t('shipment_status_pending')}</MenuItem>
                <MenuItem value="assigned">{t('shipment_status_assigned')}</MenuItem>
                <MenuItem value="in_transit">{t('shipment_status_in_transit')}</MenuItem>
                <MenuItem value="delivered">{t('shipment_status_delivered')}</MenuItem>
                <MenuItem value="failed">{t('shipment_status_failed')}</MenuItem>
              </Select>
            </FormControl>
            
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>{t('origin')}</Typography>
            <TextField
              fullWidth
              label={t('address')}
              name="origin.address"
              value={formData.origin.address}
              onChange={handleChange}
              margin="normal"
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label={t('latitude')}
                name="origin.lat"
                value={formData.origin.lat}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label={t('longitude')}
                name="origin.lng"
                value={formData.origin.lng}
                onChange={handleChange}
                margin="normal"
              />
            </Box>
            
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>{t('destination')}</Typography>
            <TextField
              fullWidth
              label={t('address')}
              name="destination.address"
              value={formData.destination.address}
              onChange={handleChange}
              margin="normal"
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label={t('latitude')}
                name="destination.lat"
                value={formData.destination.lat}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label={t('longitude')}
                name="destination.lng"
                value={formData.destination.lng}
                onChange={handleChange}
                margin="normal"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('cancel')}</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingShipment ? t('update') : t('create')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ShipmentManagement;