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
  Snackbar
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import ApiService from '../services/apiService';

const ShipmentManagement = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingShipment, setEditingShipment] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
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
        <Typography variant="h5">Shipment Management</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => handleOpenDialog()}
        >
          Add Shipment
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tracking Number</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Origin</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Assigned Driver</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shipments.map((shipment) => (
              <TableRow key={shipment.id}>
                <TableCell>{shipment.tracking_number}</TableCell>
                <TableCell>
                  <Chip 
                    label={shipment.status} 
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
                    Edit
                  </Button>
                  <Button
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(shipment.id)}
                    size="small"
                    color="error"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Shipment Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingShipment ? 'Edit Shipment' : 'Add New Shipment'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Tracking Number"
              name="tracking_number"
              value={formData.tracking_number}
              onChange={handleChange}
              margin="normal"
              required
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                label="Status"
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="assigned">Assigned</MenuItem>
                <MenuItem value="in_transit">In Transit</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
              </Select>
            </FormControl>
            
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Origin</Typography>
            <TextField
              fullWidth
              label="Address"
              name="origin.address"
              value={formData.origin.address}
              onChange={handleChange}
              margin="normal"
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Latitude"
                name="origin.lat"
                value={formData.origin.lat}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Longitude"
                name="origin.lng"
                value={formData.origin.lng}
                onChange={handleChange}
                margin="normal"
              />
            </Box>
            
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Destination</Typography>
            <TextField
              fullWidth
              label="Address"
              name="destination.address"
              value={formData.destination.address}
              onChange={handleChange}
              margin="normal"
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Latitude"
                name="destination.lat"
                value={formData.destination.lat}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Longitude"
                name="destination.lng"
                value={formData.destination.lng}
                onChange={handleChange}
                margin="normal"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingShipment ? 'Update' : 'Create'}
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