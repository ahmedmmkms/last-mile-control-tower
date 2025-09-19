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
  CardContent,
  CardActions,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Sync as SyncIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import ApiService from '../services/apiService';

const CODReconciliation = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [reconciliationRecords, setReconciliationRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  useEffect(() => {
    fetchCodPayments();
    fetchCodSummary();
  }, [filterStatus]);

  const fetchCodPayments = async () => {
    try {
      setLoading(true);
      const filters = { status: filterStatus };
      const data = await ApiService.makeRequest(`${ApiService.API_BASE_URL}/cod`, {
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
      const data = await ApiService.makeRequest(`${ApiService.API_BASE_URL}/cod/summary`, {
        method: 'GET'
      });
      setSummary(data);
    } catch (err) {
      console.error('Error fetching COD summary:', err);
    }
  };

  const handleReconcilePayment = async (id) => {
    try {
      setReconciling(true);
      const response = await ApiService.makeRequest(`${ApiService.API_BASE_URL}/cod/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'reconciled',
          reconciled_at: new Date().toISOString()
        })
      });
      
      // Update the payment in the list
      setCodPayments(codPayments.map(payment => 
        payment.id === id ? response : payment
      ));
      
      fetchCodSummary();
      
      // Show success message
      setError(null);
    } catch (err) {
      setError('Failed to reconcile COD payment');
      console.error('Error reconciling COD payment:', err);
    } finally {
      setReconciling(false);
    }
  };

  const handleBulkReconcile = async () => {
    try {
      setReconciling(true);
      const collectedPayments = codPayments.filter(payment => payment.status === 'collected');
      
      // Reconcile all collected payments
      for (const payment of collectedPayments) {
        await ApiService.makeRequest(`/api/cod/${payment.id}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: 'reconciled',
            reconciled_at: new Date().toISOString()
          })
        });
      }
      
      // Refresh the list
      fetchCodPayments();
      fetchCodSummary();
      
      // Show success message
      setError(null);
    } catch (err) {
      setError('Failed to reconcile COD payments');
      console.error('Error reconciling COD payments:', err);
    } finally {
      setReconciling(false);
    }
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

  const filteredPayments = codPayments.filter(payment => {
    if (!searchTerm) return true;
    return (
      payment.shipment_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.driver_id && payment.driver_id.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

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
          COD Reconciliation
        </Typography>
        <Button
          variant="contained"
          startIcon={<SyncIcon />}
          onClick={handleBulkReconcile}
          disabled={reconciling || codPayments.filter(p => p.status === 'collected').length === 0}
        >
          {reconciling ? 'Reconciling...' : 'Bulk Reconcile All'}
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
                  Total Collected
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
                  Pending Collection
                </Typography>
                <Typography variant="h5">
                  EGP {parseFloat(summary.pending_amount || 0).toFixed(2)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {summary.pending_count} payments
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
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Payments
                </Typography>
                <Typography variant="h5">
                  {summary.total_payments}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  EGP {parseFloat(summary.total_amount || 0).toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Filters */}
      <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status Filter</InputLabel>
          <Select
            value={filterStatus}
            label="Status Filter"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="collected">Collected</MenuItem>
            <MenuItem value="reconciled">Reconciled</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="failed">Failed</MenuItem>
            <MenuItem value="">All</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: <SearchIcon />
          }}
          sx={{ minWidth: 200 }}
        />
      </Box>

      {/* Reconciliation Records Table */}
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
              <TableCell>Shipment</TableCell>
              <TableCell>Driver</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Collected At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.shipment_id?.substring(0, 8)}...</TableCell>
                <TableCell>{payment.driver_id ? payment.driver_id.substring(0, 8) + '...' : 'N/A'}</TableCell>
                <TableCell>{payment.currency} {parseFloat(payment.amount).toFixed(2)}</TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(payment.status)}
                    color={getStatusColor(payment.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {payment.collected_at ? new Date(payment.collected_at).toLocaleString() : 'N/A'}
                </TableCell>
                <TableCell>
                  {payment.status === 'collected' && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleReconcilePayment(payment.id)}
                      disabled={reconciling}
                      startIcon={reconciling ? <CircularProgress size={16} /> : <CheckCircleIcon />}
                    >
                      Reconcile
                    </Button>
                  )}
                  {payment.status === 'reconciled' && (
                    <Chip
                      label="Reconciled"
                      color="primary"
                      size="small"
                      icon={<CheckCircleIcon />}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>
    </Box>
  );
};

export default CODReconciliation;