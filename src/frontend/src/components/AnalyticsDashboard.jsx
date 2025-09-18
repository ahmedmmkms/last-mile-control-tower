import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  LocalShipping as LocalShippingIcon,
  DriveEta as DriveEtaIcon,
  LocationOn as LocationOnIcon,
  Schedule as ScheduleIcon,
  Paid as PaidIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import ApiService from '../services/apiService';

const AnalyticsDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [deliveryAnalytics, setDeliveryAnalytics] = useState([]);
  const [driverAnalytics, setDriverAnalytics] = useState([]);
  const [geographicAnalytics, setGeographicAnalytics] = useState([]);
  const [timeAnalytics, setTimeAnalytics] = useState([]);
  const [codAnalytics, setCodAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [selectedDriver, setSelectedDriver] = useState('');

  useEffect(() => {
    fetchAllAnalytics();
  }, [dateRange, selectedDriver]);

  const fetchAllAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch delivery analytics
      const deliveryParams = {};
      if (dateRange.from) deliveryParams.date_from = dateRange.from;
      if (dateRange.to) deliveryParams.date_to = dateRange.to;
      if (selectedDriver) deliveryParams.driver_id = selectedDriver;
      
      const deliveryData = await ApiService.makeRequest('/api/analytics/deliveries', {
        method: 'GET',
        params: deliveryParams
      });
      setDeliveryAnalytics(deliveryData);
      
      // Fetch driver performance analytics
      const driverParams = {};
      if (dateRange.from) driverParams.date_from = dateRange.from;
      if (dateRange.to) driverParams.date_to = dateRange.to;
      
      const driverData = await ApiService.makeRequest('/api/analytics/drivers', {
        method: 'GET',
        params: driverParams
      });
      setDriverAnalytics(driverData);
      
      // Fetch geographic analytics
      const geographicParams = {};
      if (dateRange.from) geographicParams.date_from = dateRange.from;
      if (dateRange.to) geographicParams.date_to = dateRange.to;
      if (selectedDriver) geographicParams.driver_id = selectedDriver;
      
      const geographicData = await ApiService.makeRequest('/api/analytics/geographic', {
        method: 'GET',
        params: geographicParams
      });
      setGeographicAnalytics(geographicData);
      
      // Fetch time-based analytics
      const timeParams = {};
      if (dateRange.from) timeParams.date_from = dateRange.from;
      if (dateRange.to) timeParams.date_to = dateRange.to;
      if (selectedDriver) timeParams.driver_id = selectedDriver;
      
      const timeData = await ApiService.makeRequest('/api/analytics/time', {
        method: 'GET',
        params: timeParams
      });
      setTimeAnalytics(timeData);
      
      // Fetch COD analytics
      const codParams = {};
      if (dateRange.from) codParams.date_from = dateRange.from;
      if (dateRange.to) codParams.date_to = dateRange.to;
      if (selectedDriver) codParams.driver_id = selectedDriver;
      
      const codData = await ApiService.makeRequest('/api/analytics/cod', {
        method: 'GET',
        params: codParams
      });
      setCodAnalytics(codData);
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch analytics data');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleResetFilters = () => {
    setDateRange({ from: '', to: '' });
    setSelectedDriver('');
  };

  // Prepare data for charts
  const deliveryTrendData = deliveryAnalytics.map(day => ({
    date: day.date,
    deliveries: parseInt(day.total_deliveries),
    completed: parseInt(day.completed_deliveries),
    failed: parseInt(day.failed_deliveries)
  }));

  const driverPerformanceData = driverAnalytics.slice(0, 10).map(driver => ({
    name: driver.driver_name,
    deliveries: parseInt(driver.total_assignments),
    completion: parseFloat(driver.completion_rate)
  }));

  const geographicData = geographicAnalytics.slice(0, 10).map(location => ({
    name: `${location.city}, ${location.country}`,
    count: parseInt(location.delivery_count),
    completion: parseFloat(location.completion_rate)
  }));

  const timeDistributionData = timeAnalytics.map(timeSlot => ({
    hour: `${timeSlot.hour_of_day}:00`,
    deliveries: parseInt(timeSlot.delivery_count),
    completion: parseFloat(timeSlot.completion_rate)
  }));

  const codTrendData = codAnalytics.map(day => ({
    date: day.date,
    payments: parseInt(day.cod_payments),
    collected: parseFloat(day.collected_amount),
    reconciled: parseFloat(day.reconciled_amount)
  }));

  if (loading && deliveryAnalytics.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant={isMobile ? "h5" : "h4"}>Analytics Dashboard</Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="From Date"
              type="date"
              value={dateRange.from}
              onChange={(e) => handleDateChange('from', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="To Date"
              type="date"
              value={dateRange.to}
              onChange={(e) => handleDateChange('to', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleResetFilters}
            >
              Reset Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Delivery Trends */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Delivery Trends</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={deliveryTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="deliveries" 
                  name="Total Deliveries" 
                  stroke={theme.palette.primary.main} 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  name="Completed" 
                  stroke={theme.palette.success.main} 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="failed" 
                  name="Failed" 
                  stroke={theme.palette.error.main} 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Key Metrics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocalShippingIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography color="textSecondary">Total Deliveries</Typography>
              </Box>
              <Typography variant="h4">
                {deliveryAnalytics.reduce((sum, day) => sum + parseInt(day.total_deliveries || 0), 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUpIcon sx={{ mr: 1, color: 'success.main' }} />
                <Typography color="textSecondary">Completion Rate</Typography>
              </Box>
              <Typography variant="h4">
                {deliveryAnalytics.length > 0 
                  ? (deliveryAnalytics.reduce((sum, day) => sum + parseFloat(day.completion_rate || 0), 0) / deliveryAnalytics.length).toFixed(2)
                  : 0}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <DriveEtaIcon sx={{ mr: 1, color: 'info.main' }} />
                <Typography color="textSecondary">Active Drivers</Typography>
              </Box>
              <Typography variant="h4">{driverAnalytics.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PaidIcon sx={{ mr: 1, color: 'secondary.main' }} />
                <Typography color="textSecondary">COD Collected</Typography>
              </Box>
              <Typography variant="h4">
                EGP {codAnalytics.reduce((sum, day) => sum + parseFloat(day.collected_amount || 0), 0).toFixed(0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Top Driver Performance</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={driverPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="deliveries" name="Total Deliveries" fill={theme.palette.primary.main} />
                <Bar dataKey="completion" name="Completion Rate %" fill={theme.palette.success.main} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Geographic Distribution</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={geographicData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Delivery Count" fill={theme.palette.info.main} />
                <Bar dataKey="completion" name="Completion Rate %" fill={theme.palette.success.main} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Time Distribution</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="deliveries" 
                  name="Deliveries" 
                  stroke={theme.palette.primary.main} 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="completion" 
                  name="Completion Rate %" 
                  stroke={theme.palette.success.main} 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>COD Trends</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={codTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="payments" 
                  name="Payments" 
                  stroke={theme.palette.secondary.main} 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="collected" 
                  name="Collected (EGP)" 
                  stroke={theme.palette.success.main} 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="reconciled" 
                  name="Reconciled (EGP)" 
                  stroke={theme.palette.info.main} 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsDashboard;