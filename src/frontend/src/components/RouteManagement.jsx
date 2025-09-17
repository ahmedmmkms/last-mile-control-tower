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
  Autocomplete
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import ApiService from '../services/apiService';

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Form state
  const [formData, setFormData] = useState({
    shipment_id: '',
    waypoints: [],
    status: 'pending',
    estimated_time: ''
  });

  // Waypoint form state
  const [waypointForm, setWaypointForm] = useState({ lat: '', lng: '' });

  useEffect(() => {
    fetchRoutesAndShipments();
  }, []);

  const fetchRoutesAndShipments = async () => {
    try {
      setLoading(true);
      const [routesData, shipmentsData] = await Promise.all([
        ApiService.getRoutes(),
        ApiService.getShipments()
      ]);
      setRoutes(routesData);
      setShipments(shipmentsData);
    } catch (err) {
      setError('Failed to fetch routes and shipments');
      console.error('Error fetching routes and shipments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (route = null) => {
    if (route) {
      setEditingRoute(route);
      setFormData({
        shipment_id: route.shipment_id || '',
        waypoints: route.waypoints || [],
        status: route.status || 'pending',
        estimated_time: route.estimated_time || ''
      });
    } else {
      setEditingRoute(null);
      setFormData({
        shipment_id: '',
        waypoints: [],
        status: 'pending',
        estimated_time: ''
      });
    }
    setWaypointForm({ lat: '', lng: '' });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRoute(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddWaypoint = () => {
    if (waypointForm.lat && waypointForm.lng) {
      const newWaypoint = {
        lat: parseFloat(waypointForm.lat),
        lng: parseFloat(waypointForm.lng)
      };
      setFormData(prev => ({
        ...prev,
        waypoints: [...prev.waypoints, newWaypoint]
      }));
      setWaypointForm({ lat: '', lng: '' });
    }
  };

  const handleRemoveWaypoint = (index) => {
    setFormData(prev => ({
      ...prev,
      waypoints: prev.waypoints.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const routeData = {
      ...formData,
      estimated_time: formData.estimated_time ? parseInt(formData.estimated_time) : null
    };

    try {
      if (editingRoute) {
        await ApiService.updateRoute(editingRoute.id, routeData);
        setSnackbar({ open: true, message: 'Route updated successfully', severity: 'success' });
      } else {
        await ApiService.createRoute(routeData);
        setSnackbar({ open: true, message: 'Route created successfully', severity: 'success' });
      }
      
      handleCloseDialog();
      fetchRoutesAndShipments();
    } catch (err) {
      setSnackbar({ open: true, message: `Error ${editingRoute ? 'updating' : 'creating'} route`, severity: 'error' });
      console.error('Error saving route:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      try {
        await ApiService.deleteRoute(id);
        setSnackbar({ open: true, message: 'Route deleted successfully', severity: 'success' });
        fetchRoutesAndShipments();
      } catch (err) {
        setSnackbar({ open: true, message: 'Error deleting route', severity: 'error' });
        console.error('Error deleting route:', err);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'default';
      case 'active': return 'primary';
      case 'completed': return 'success';
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
        <Typography variant="h5">Route Management</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => handleOpenDialog()}
        >
          Add Route
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Shipment</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Waypoints</TableCell>
              <TableCell>Estimated Time</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {routes.map((route) => {
              const shipment = shipments.find(s => s.id === route.shipment_id);
              return (
                <TableRow key={route.id}>
                  <TableCell>
                    {shipment ? shipment.tracking_number : 'Unknown'}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={route.status} 
                      color={getStatusColor(route.status)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    {route.waypoints ? route.waypoints.length : 0} waypoints
                  </TableCell>
                  <TableCell>
                    {route.estimated_time ? `${route.estimated_time} min` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Button
                      startIcon={<EditIcon />}
                      onClick={() => handleOpenDialog(route)}
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(route.id)}
                      size="small"
                      color="error"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Route Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingRoute ? 'Edit Route' : 'Add New Route'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth margin="normal">
              <Autocomplete
                options={shipments}
                getOptionLabel={(option) => option.tracking_number || ''}
                value={shipments.find(s => s.id === formData.shipment_id) || null}
                onChange={(event, newValue) => {
                  setFormData(prev => ({
                    ...prev,
                    shipment_id: newValue ? newValue.id : ''
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Shipment" required />
                )}
              />
            </FormControl>
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                label="Status"
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Estimated Time (minutes)"
              name="estimated_time"
              type="number"
              value={formData.estimated_time}
              onChange={handleChange}
              margin="normal"
            />
            
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Waypoints</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="Latitude"
                value={waypointForm.lat}
                onChange={(e) => setWaypointForm(prev => ({ ...prev, lat: e.target.value }))}
              />
              <TextField
                fullWidth
                label="Longitude"
                value={waypointForm.lng}
                onChange={(e) => setWaypointForm(prev => ({ ...prev, lng: e.target.value }))}
              />
              <Button 
                variant="contained" 
                onClick={handleAddWaypoint}
                disabled={!waypointForm.lat || !waypointForm.lng}
              >
                Add
              </Button>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              {formData.waypoints.map((waypoint, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 1,
                    mb: 1,
                    bgcolor: 'grey.100',
                    borderRadius: 1
                  }}
                >
                  <Typography>
                    {index + 1}. {waypoint.lat}, {waypoint.lng}
                  </Typography>
                  <Button 
                    size="small" 
                    color="error"
                    onClick={() => handleRemoveWaypoint(index)}
                  >
                    Remove
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={!formData.shipment_id}
          >
            {editingRoute ? 'Update' : 'Create'}
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

export default RouteManagement;