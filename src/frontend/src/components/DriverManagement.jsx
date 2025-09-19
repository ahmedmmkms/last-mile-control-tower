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
import { useTranslation } from 'react-i18next';

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { t } = useTranslation();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicle_type: 'car',
    status: 'available',
    current_location: { lat: '', lng: '' }
  });

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getDrivers();
      setDrivers(data);
    } catch (err) {
      setError('Failed to fetch drivers');
      console.error('Error fetching drivers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (driver = null) => {
    if (driver) {
      setEditingDriver(driver);
      setFormData({
        name: driver.name || '',
        phone: driver.phone || '',
        vehicle_type: driver.vehicle_type || 'car',
        status: driver.status || 'available',
        current_location: {
          lat: driver.current_location?.lat || '',
          lng: driver.current_location?.lng || ''
        }
      });
    } else {
      setEditingDriver(null);
      setFormData({
        name: '',
        phone: '',
        vehicle_type: 'car',
        status: 'available',
        current_location: { lat: '', lng: '' }
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingDriver(null);
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
    const driverData = {
      ...formData,
      current_location: {
        ...formData.current_location,
        lat: parseFloat(formData.current_location.lat) || 0,
        lng: parseFloat(formData.current_location.lng) || 0
      }
    };

    try {
      if (editingDriver) {
        await ApiService.updateDriver(editingDriver.id, driverData);
        setSnackbar({ open: true, message: 'Driver updated successfully', severity: 'success' });
      } else {
        await ApiService.createDriver(driverData);
        setSnackbar({ open: true, message: 'Driver created successfully', severity: 'success' });
      }
      
      handleCloseDialog();
      fetchDrivers();
    } catch (err) {
      setSnackbar({ open: true, message: `Error ${editingDriver ? 'updating' : 'creating'} driver`, severity: 'error' });
      console.error('Error saving driver:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      try {
        await ApiService.deleteDriver(id);
        setSnackbar({ open: true, message: 'Driver deleted successfully', severity: 'success' });
        fetchDrivers();
      } catch (err) {
        setSnackbar({ open: true, message: 'Error deleting driver', severity: 'error' });
        console.error('Error deleting driver:', err);
      }
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

  const getVehicleIcon = (vehicleType) => {
    switch (vehicleType) {
      case 'bike': return '🏍️';
      case 'car': return '🚗';
      case 'van': return '🚐';
      default: return '🚗';
    }
  };

  const getStatusLabel = (status) => {
    return t(`driver_status_${status}`) || status;
  };

  const getVehicleLabel = (vehicleType) => {
    return t(`vehicle_type_${vehicleType}`) || vehicleType;
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
        <Typography variant="h5">{t('driver_management')}</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => handleOpenDialog()}
        >
          {t('add_driver')}
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('name')}</TableCell>
              <TableCell>{t('phone')}</TableCell>
              <TableCell>{t('vehicle')}</TableCell>
              <TableCell>{t('status')}</TableCell>
              <TableCell>{t('location')}</TableCell>
              <TableCell>{t('actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {drivers.map((driver) => (
              <TableRow key={driver.id}>
                <TableCell>{driver.name}</TableCell>
                <TableCell>{driver.phone}</TableCell>
                <TableCell>
                  {getVehicleIcon(driver.vehicle_type)} {getVehicleLabel(driver.vehicle_type)}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={getStatusLabel(driver.status)} 
                    color={getStatusColor(driver.status)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                  {driver.current_location ? 
                    `${driver.current_location.lat}, ${driver.current_location.lng}` : 
                    'Unknown'}
                </TableCell>
                <TableCell>
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenDialog(driver)}
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    {t('edit')}
                  </Button>
                  <Button
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(driver.id)}
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

      {/* Driver Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingDriver ? t('edit_driver') : t('add_new_driver')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label={t('name')}
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              label={t('phone')}
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              margin="normal"
              required
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel>{t('vehicle_type')}</InputLabel>
              <Select
                name="vehicle_type"
                value={formData.vehicle_type}
                onChange={handleChange}
                label={t('vehicle_type')}
              >
                <MenuItem value="bike">{t('vehicle_type_bike')}</MenuItem>
                <MenuItem value="car">{t('vehicle_type_car')}</MenuItem>
                <MenuItem value="van">{t('vehicle_type_van')}</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth margin="normal">
              <InputLabel>{t('status')}</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                label={t('status')}
              >
                <MenuItem value="available">{t('driver_status_available')}</MenuItem>
                <MenuItem value="busy">{t('driver_status_busy')}</MenuItem>
                <MenuItem value="offline">{t('driver_status_offline')}</MenuItem>
              </Select>
            </FormControl>
            
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>{t('current_location')}</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label={t('latitude')}
                name="current_location.lat"
                value={formData.current_location.lat}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label={t('longitude')}
                name="current_location.lng"
                value={formData.current_location.lng}
                onChange={handleChange}
                margin="normal"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('cancel')}</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingDriver ? t('update') : t('create')}
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

export default DriverManagement;