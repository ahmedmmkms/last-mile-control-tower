import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Paid as PaidIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import ApiService from '../services/apiService';

const DriverCODCollection = ({ driverId }) => {
  const [codPayments, setCodPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [collectionAmount, setCollectionAmount] = useState('');
  const [collectionNotes, setCollectionNotes] = useState('');

  useEffect(() => {
    if (driverId) {
      fetchDriverCodPayments();
    }
  }, [driverId]);

  const fetchDriverCodPayments = async () => {
    try {
      setLoading(true);
      const data = await ApiService.makeRequest(`/api/cod/driver/${driverId}`, {
        method: 'GET'
      });
      setCodPayments(data);
    } catch (err) {
      setError('Failed to fetch COD payments');
      console.error('Error fetching COD payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCollectPayment = async (payment) => {
    setSelectedPayment(payment);
    setCollectionAmount(payment.amount);
    setOpenDialog(true);
  };

  const confirmCollection = async () => {
    try {
      // In a real implementation, this would integrate with a payment system
      // For now, we'll just update the status in our system
      const response = await ApiService.makeRequest(`/api/cod/${selectedPayment.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'collected',
          collected_at: new Date().toISOString(),
          notes: collectionNotes
        })
      });

      // Update the payment in the list
      setCodPayments(codPayments.map(payment => 
        payment.id === selectedPayment.id ? response : payment
      ));

      // Close dialog and reset form
      setOpenDialog(false);
      setSelectedPayment(null);
      setCollectionAmount('');
      setCollectionNotes('');
      
      // Show success message
      setError(null);
    } catch (err) {
      setError('Failed to collect COD payment');
      console.error('Error collecting COD payment:', err);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPayment(null);
    setCollectionAmount('');
    setCollectionNotes('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'collected': return 'success';
      case 'reconciled': return 'primary';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'collected': return 'Collected';
      case 'reconciled': return 'Reconciled';
      case 'pending': return 'Pending';
      case 'failed': return 'Failed';
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

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Cash on Delivery Collection
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {codPayments.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>No COD payments assigned to you</Typography>
        </Paper>
      ) : (
        <Paper>
          <List>
            {codPayments.map((payment) => (
              <ListItem key={payment.id} divider>
                <ListItemText
                  primary={`Shipment: ${payment.tracking_number}`}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        Amount: EGP {parseFloat(payment.amount).toFixed(2)}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="text.secondary">
                        Destination: {payment.destination?.address || 'N/A'}
                      </Typography>
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <Chip
                    label={getStatusLabel(payment.status)}
                    color={getStatusColor(payment.status)}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  {payment.status === 'pending' && (
                    <IconButton
                      edge="end"
                      color="primary"
                      onClick={() => handleCollectPayment(payment)}
                    >
                      <PaidIcon />
                    </IconButton>
                  )}
                  {payment.status === 'collected' && (
                    <IconButton edge="end" color="success">
                      <CheckCircleIcon />
                    </IconButton>
                  )}
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Collection Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Collect Cash on Delivery</DialogTitle>
        <DialogContent>
          {selectedPayment && (
            <Box sx={{ pt: 1 }}>
              <Typography variant="h6" gutterBottom>
                Shipment: {selectedPayment.tracking_number}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Amount to collect: EGP {parseFloat(selectedPayment.amount).toFixed(2)}
              </Typography>
              <TextField
                fullWidth
                label="Amount Collected"
                type="number"
                value={collectionAmount}
                onChange={(e) => setCollectionAmount(e.target.value)}
                margin="normal"
                helperText="Enter the amount collected from the customer"
              />
              <TextField
                fullWidth
                label="Notes"
                value={collectionNotes}
                onChange={(e) => setCollectionNotes(e.target.value)}
                margin="normal"
                multiline
                rows={3}
                helperText="Add any notes about the collection (optional)"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={confirmCollection} 
            variant="contained" 
            startIcon={<PaidIcon />}
            disabled={!collectionAmount || parseFloat(collectionAmount) <= 0}
          >
            Confirm Collection
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DriverCODCollection;