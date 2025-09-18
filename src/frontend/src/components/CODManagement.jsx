import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  Add as AddIcon,
  Paid as PaidIcon,
  Sync as SyncIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import ApiService from '../services/apiService';

const CODManagement = () => {
  const [codPayments, setCodPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCodPayment, setSelectedCodPayment] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [summary, setSummary] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    shipment_id: '',
    driver_id: '',
    amount: '',
    currency: 'EGP',
    notes: ''
  });

  useEffect(() => {
    fetchCodPayments();
    fetchCodSummary();
  }, [filterStatus]);

  const fetchCodPayments = async () => {
    try {
      setLoading(true);
      const filters = filterStatus ? { status: filterStatus } : {};
      const data = await ApiService.makeRequest('/api/cod', {
        method: 'GET',
        params: filters
      });
      setCodPayments(data);
    } catch (err) {
      setError('Failed to fetch COD payments');
      console.error('Error fetching COD payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCodSummary = async () => {
    try {
      const data = await ApiService.makeRequest('/api/cod/summary', {
        method: 'GET'
      });
      setSummary(data);
    } catch (err) {
      console.error('Error fetching COD summary:', err);
    }
  };

  const handleCreateCodPayment = async () => {
    try {
      const response = await ApiService.makeRequest('/api/cod', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      setCodPayments([response, ...codPayments]);
      handleCloseDialog();
      fetchCodSummary();
      
      // Show success message
      setError(null);
    } catch (err) {
      setError('Failed to create COD payment');
      console.error('Error creating COD payment:', err);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await ApiService.makeRequest(`/api/cod/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      // Update the payment in the list
      setCodPayments(codPayments.map(payment => 
        payment.id === id ? response : payment
      ));
      
      fetchCodSummary();
      
      // Show success message
      setError(null);
    } catch (err) {
      setError('Failed to update COD payment status');
      console.error('Error updating COD payment status:', err);
    }
  };

  const handleOpenDialog = (payment = null) => {
    setSelectedCodPayment(payment);
    if (payment) {
      setFormData({
        shipment_id: payment.shipment_id,
        driver_id: payment.driver_id || '',
        amount: payment.amount,
        currency: payment.currency,
        notes: payment.notes || ''
      });
    } else {
      setFormData({
        shipment_id: '',
        driver_id: '',
        amount: '',
        currency: 'EGP',
        notes: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCodPayment(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'collected': return <PaidIcon />;
      case 'reconciled': return <CheckCircleIcon />;
      case 'pending': return <SyncIcon />;
      case 'failed': return <ErrorIcon />;
      default: return null;
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
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Cash on Delivery Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add COD Payment
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      {summary && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Payments
                </Typography>
                <Typography variant="h5">
                  {summary.total_payments}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Amount
                </Typography>
                <Typography variant="h5">
                  EGP {parseFloat(summary.total_amount || 0).toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Collected
                </Typography>
                <Typography variant="h5">
                  EGP {parseFloat(summary.collected_amount || 0).toFixed(2)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {summary.collected_count} payments
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Reconciled
                </Typography>
                <Typography variant="h5">
                  EGP {parseFloat(summary.reconciled_amount || 0).toFixed(2)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {summary.reconciled_count} payments
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Filters */}
      <Box sx={{ mb: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status Filter</InputLabel>
          <Select
            value={filterStatus}
            label="Status Filter"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="collected">Collected</MenuItem>
            <MenuItem value="reconciled">Reconciled</MenuItem>
            <MenuItem value="failed">Failed</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* COD Payments Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Shipment</TableCell>
              <TableCell>Driver</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Collected At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {codPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.shipment_id?.substring(0, 8)}...</TableCell>
                <TableCell>{payment.driver_id ? payment.driver_id.substring(0, 8) + '...' : 'N/A'}</TableCell>
                <TableCell>{payment.currency} {parseFloat(payment.amount).toFixed(2)}</TableCell>
                <TableCell>
                  <Chip
                    icon={getStatusIcon(payment.status)}
                    label={payment.status}
                    color={getStatusColor(payment.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {payment.collected_at ? new Date(payment.collected_at).toLocaleString() : 'N/A'}
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => handleOpenDialog(payment)}
                    sx={{ mr: 1 }}
                  >
                    View
                  </Button>
                  {payment.status === 'pending' && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleUpdateStatus(payment.id, 'collected')}
                      sx={{ mr: 1 }}
                    >
                      Collect
                    </Button>
                  )}
                  {payment.status === 'collected' && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleUpdateStatus(payment.id, 'reconciled')}
                    >
                      Reconcile
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit COD Payment Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedCodPayment ? 'View COD Payment' : 'Add COD Payment'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Shipment ID"
              name="shipment_id"
              value={formData.shipment_id}
              onChange={handleInputChange}
              margin="normal"
              disabled={!!selectedCodPayment}
            />
            <TextField
              fullWidth
              label="Driver ID"
              name="driver_id"
              value={formData.driver_id}
              onChange={handleInputChange}
              margin="normal"
              disabled={!!selectedCodPayment}
            />
            <TextField
              fullWidth
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleInputChange}
              margin="normal"
              disabled={!!selectedCodPayment}
            />
            <FormControl fullWidth margin="normal" disabled={!!selectedCodPayment}>
              <InputLabel>Currency</InputLabel>
              <Select
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                label="Currency"
              >
                <MenuItem value="EGP">EGP</MenuItem>
                <MenuItem value="USD">USD</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              margin="normal"
              multiline
              rows={3}
              disabled={!!selectedCodPayment}
            />
            
            {selectedCodPayment && (
              <>
                <TextField
                  fullWidth
                  label="Status"
                  value={selectedCodPayment.status}
                  margin="normal"
                  disabled
                />
                <TextField
                  fullWidth
                  label="Created At"
                  value={new Date(selectedCodPayment.created_at).toLocaleString()}
                  margin="normal"
                  disabled
                />
                {selectedCodPayment.collected_at && (
                  <TextField
                    fullWidth
                    label="Collected At"
                    value={new Date(selectedCodPayment.collected_at).toLocaleString()}
                    margin="normal"
                    disabled
                  />
                )}
                {selectedCodPayment.reconciled_at && (
                  <TextField
                    fullWidth
                    label="Reconciled At"
                    value={new Date(selectedCodPayment.reconciled_at).toLocaleString()}
                    margin="normal"
                    disabled
                  />
                )}
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          {!selectedCodPayment && (
            <Button onClick={handleCreateCodPayment} variant="contained">
              Create
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CODManagement;