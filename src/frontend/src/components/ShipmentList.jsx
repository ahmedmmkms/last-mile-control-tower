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
  CircularProgress
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import ApiService from '../services/apiService';

const ShipmentList = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredShipments, setFilteredShipments] = useState([]);

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
      <Typography variant="h5" gutterBottom>
        Shipments
      </Typography>
      
      {/* Search Bar */}
      <Box sx={{ display: 'flex', mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search shipments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1 }} />,
          }}
        />
        <Button variant="contained" startIcon={<AddIcon />} sx={{ ml: 2 }}>
          Add Shipment
        </Button>
      </Box>
      
      {/* Shipments Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tracking Number</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Origin</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Assigned Driver</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredShipments.map((shipment) => (
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ShipmentList;