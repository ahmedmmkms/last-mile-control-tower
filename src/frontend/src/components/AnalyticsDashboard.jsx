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
      
      const deliveryData = await ApiService.makeRequest(`${ApiService.API_BASE_URL}/analytics/deliveries`, {
        method: 'GET',
        params: deliveryParams
      });
      setDeliveryAnalytics(deliveryData);
      
      // Fetch driver performance analytics
      const driverParams = {};
      if (dateRange.from) driverParams.date_from = dateRange.from;
      if (dateRange.to) driverParams.date_to = dateRange.to;
      
      const driverData = await ApiService.makeRequest(`${ApiService.API_BASE_URL}/analytics/drivers`, {
        method: 'GET',
        params: driverParams
      });
      setDriverAnalytics(driverData);
      
      // Fetch geographic analytics
      const geographicParams = {};
      if (dateRange.from) geographicParams.date_from = dateRange.from;
      if (dateRange.to) geographicParams.date_to = dateRange.to;
      if (selectedDriver) geographicParams.driver_id = selectedDriver;
      
      const geographicData = await ApiService.makeRequest(`${ApiService.API_BASE_URL}/analytics/geographic`, {
        method: 'GET',
        params: geographicParams
      });
      setGeographicAnalytics(geographicData);
      
      // Fetch time-based analytics
      const timeParams = {};
      if (dateRange.from) timeParams.date_from = dateRange.from;
      if (dateRange.to) timeParams.date_to = dateRange.to;
      if (selectedDriver) timeParams.driver_id = selectedDriver;
      
      const timeData = await ApiService.makeRequest(`${ApiService.API_BASE_URL}/analytics/time`, {
        method: 'GET',
        params: timeParams
      });
      setTimeAnalytics(timeData);
      
      // Fetch COD analytics
      const codParams = {};
      if (dateRange.from) codParams.date_from = dateRange.from;
      if (dateRange.to) codParams.date_to = dateRange.to;
      if (selectedDriver) codParams.driver_id = selectedDriver;
      
      const codData = await ApiService.makeRequest(`${ApiService.API_BASE_URL}/analytics/cod`, {
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
    name: location.city && location.country ? 
          `${location.city}, ${location.country}` : 
          (location.city || location.country || 'Unassigned'),
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

  // Calculate KPIs
  const totalDeliveries = deliveryAnalytics.reduce((sum, day) => sum + parseInt(day.total_deliveries || 0), 0);
  const completionRate = deliveryAnalytics.length > 0 
    ? (deliveryAnalytics.reduce((sum, day) => sum + parseFloat(day.completion_rate || 0), 0) / deliveryAnalytics.length).toFixed(2)
    : 0;
  const activeDrivers = driverAnalytics.length;
  const codCollected = codAnalytics.reduce((sum, day) => sum + parseFloat(day.collected_amount || 0), 0).toFixed(0);

  if (loading && deliveryAnalytics.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: isMobile ? 2 : 3, backgroundColor: '#f5f7fa' }}>
      {/* Header Section */}
      <Box sx={{ 
        mb: 3, 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: 2
      }}>
        <Box>
          <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 600, color: '#263238' }}>
            Analytics Dashboard
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
            Comprehensive delivery performance insights
          </Typography>
        </Box>
        
        {/* Date Range Filters */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          alignItems: 'center',
          width: { xs: '100%', sm: 'auto' }
        }}>
          <TextField
            size="small"
            label="From Date"
            type="date"
            value={dateRange.from}
            onChange={(e) => handleDateChange('from', e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ width: { xs: '100%', sm: 150 } }}
          />
          <TextField
            size="small"
            label="To Date"
            type="date"
            value={dateRange.to}
            onChange={(e) => handleDateChange('to', e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ width: { xs: '100%', sm: 150 } }}
          />
          <Button
            size="small"
            variant="outlined"
            onClick={handleResetFilters}
            sx={{ height: 40 }}
          >
            Reset
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Key Metrics Row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              height: '100%',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              borderRadius: 2,
              border: '1px solid rgba(0,0,0,0.05)'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: '50%', 
                  backgroundColor: 'primary.light', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mr: 2
                }}>
                  <LocalShippingIcon sx={{ color: 'primary.main' }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">Total Deliveries</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600, mt: 0.5 }}>
                    {totalDeliveries}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              height: '100%',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              borderRadius: 2,
              border: '1px solid rgba(0,0,0,0.05)'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: '50%', 
                  backgroundColor: 'success.light', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mr: 2
                }}>
                  <TrendingUpIcon sx={{ color: 'success.main' }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">Completion Rate</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600, mt: 0.5 }}>
                    {completionRate}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              height: '100%',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              borderRadius: 2,
              border: '1px solid rgba(0,0,0,0.05)'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: '50%', 
                  backgroundColor: 'info.light', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mr: 2
                }}>
                  <DriveEtaIcon sx={{ color: 'info.main' }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">Active Drivers</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600, mt: 0.5 }}>
                    {activeDrivers}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              height: '100%',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              borderRadius: 2,
              border: '1px solid rgba(0,0,0,0.05)'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: '50%', 
                  backgroundColor: 'secondary.light', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mr: 2
                }}>
                  <PaidIcon sx={{ color: 'secondary.main' }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">COD Collected</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600, mt: 0.5 }}>
                    EGP {codCollected}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Charts Grid */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Delivery Trends Chart - Full Width on Mobile, 2/3 on Desktop */}
        <Grid item xs={12} lg={8}>
          <Paper 
            sx={{ 
              p: 3, 
              height: '100%',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              borderRadius: 2,
              border: '1px solid rgba(0,0,0,0.05)'
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2, color: '#263238' }}>
              Delivery Trends
            </Typography>
            <Box sx={{ height: { xs: 300, sm: 350, md: 400 } }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={deliveryTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: 8, 
                      border: '1px solid #eee',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="deliveries" 
                    name="Total Deliveries" 
                    stroke={theme.palette.primary.main} 
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="completed" 
                    name="Completed" 
                    stroke={theme.palette.success.main} 
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="failed" 
                    name="Failed" 
                    stroke={theme.palette.error.main} 
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Time Distribution Chart - Full Width on Mobile, 1/3 on Desktop */}
        <Grid item xs={12} lg={4}>
          <Paper 
            sx={{ 
              p: 3, 
              height: '100%',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              borderRadius: 2,
              border: '1px solid rgba(0,0,0,0.05)'
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2, color: '#263238' }}>
              Time Distribution
            </Typography>
            <Box sx={{ height: { xs: 300, sm: 350, md: 400 } }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="hour" 
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: 8, 
                      border: '1px solid #eee',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="deliveries" 
                    name="Deliveries" 
                    fill={theme.palette.primary.main} 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Second Row Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Geographic Distribution */}
        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 3, 
              height: '100%',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              borderRadius: 2,
              border: '1px solid rgba(0,0,0,0.05)'
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2, color: '#263238' }}>
              Geographic Distribution
            </Typography>
            <Box sx={{ height: { xs: 300, sm: 350 } }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={geographicData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 10 }}
                    angle={isMobile ? -45 : 0}
                    textAnchor={isMobile ? 'end' : 'middle'}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: 8, 
                      border: '1px solid #eee',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="count" 
                    name="Delivery Count" 
                    fill={theme.palette.info.main} 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Top Driver Performance */}
        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 3, 
              height: '100%',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              borderRadius: 2,
              border: '1px solid rgba(0,0,0,0.05)'
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2, color: '#263238' }}>
              Top Driver Performance
            </Typography>
            <Box sx={{ height: { xs: 300, sm: 350 } }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={driverPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 10 }}
                    angle={isMobile ? -45 : 0}
                    textAnchor={isMobile ? 'end' : 'middle'}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: 8, 
                      border: '1px solid #eee',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="deliveries" 
                    name="Total Deliveries" 
                    fill={theme.palette.success.main} 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* COD Trends - Full Width */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper 
            sx={{ 
              p: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              borderRadius: 2,
              border: '1px solid rgba(0,0,0,0.05)'
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2, color: '#263238' }}>
              COD Trends
            </Typography>
            <Box sx={{ height: { xs: 300, sm: 350, md: 400 } }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={codTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: 8, 
                      border: '1px solid #eee',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="payments" 
                    name="Payments" 
                    stroke={theme.palette.secondary.main} 
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="collected" 
                    name="Collected (EGP)" 
                    stroke={theme.palette.success.main} 
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="reconciled" 
                    name="Reconciled (EGP)" 
                    stroke={theme.palette.info.main} 
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsDashboard;