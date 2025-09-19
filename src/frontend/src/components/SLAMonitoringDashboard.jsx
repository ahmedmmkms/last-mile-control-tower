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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  CalendarToday as CalendarTodayIcon
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

const SLAMonitoringDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [metrics, setMetrics] = useState(null);
  const [driverMetrics, setDriverMetrics] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [overdueShipments, setOverdueShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [selectedDriver, setSelectedDriver] = useState('');

  useEffect(() => {
    fetchAllMetrics();
  }, [dateRange, selectedDriver]);

  const fetchAllMetrics = async () => {
    try {
      setLoading(true);
      
      // Fetch shipment SLA metrics
      const metricsParams = {};
      if (dateRange.from) metricsParams.date_from = dateRange.from;
      if (dateRange.to) metricsParams.date_to = dateRange.to;
      if (selectedDriver) metricsParams.driver_id = selectedDriver;
      
      const metricsData = await ApiService.makeRequest(`${ApiService.API_BASE_URL}/sla/metrics`, {
        method: 'GET',
        params: metricsParams
      });
      setMetrics(metricsData);
      
      // Fetch driver SLA metrics
      const driverMetricsData = await ApiService.makeRequest(`${ApiService.API_BASE_URL}/sla/drivers`, {
        method: 'GET',
        params: {
          date_from: dateRange.from,
          date_to: dateRange.to
        }
      });
      setDriverMetrics(driverMetricsData);
      
      // Fetch delivery time distribution
      const distributionData = await ApiService.makeRequest(`${ApiService.API_BASE_URL}/sla/distribution`, {
        method: 'GET',
        params: {
          date_from: dateRange.from,
          date_to: dateRange.to,
          driver_id: selectedDriver
        }
      });
      setDistribution(distributionData);
      
      // Fetch overdue shipments
      const overdueParams = {};
      if (selectedDriver) overdueParams.driver_id = selectedDriver;
      
      const overdueData = await ApiService.makeRequest(`${ApiService.API_BASE_URL}/sla/overdue`, {
        method: 'GET',
        params: overdueParams
      });
      setOverdueShipments(overdueData);
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch SLA metrics');
      console.error('Error fetching SLA metrics:', err);
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

  const getDeliveryRateColor = (rate) => {
    const rateNum = parseFloat(rate);
    if (rateNum >= 95) return 'success';
    if (rateNum >= 90) return 'warning';
    return 'error';
  };

  const getOnTimeRateColor = (rate) => {
    const rateNum = parseFloat(rate);
    if (rateNum >= 90) return 'success';
    if (rateNum >= 80) return 'warning';
    return 'error';
  };

  const getOverdueRateColor = (rate) => {
    const rateNum = parseFloat(rate);
    if (rateNum <= 2) return 'success';
    if (rateNum <= 5) return 'warning';
    return 'error';
  };

  // Prepare data for charts
  const distributionChartData = distribution.map(item => ({
    name: item.time_range,
    count: parseInt(item.count)
  }));

  const driverPerformanceData = driverMetrics.slice(0, 10).map(driver => ({
    name: driver.driver_name,
    completion: parseFloat(driver.completion_rate),
    onTime: parseFloat(driver.on_time_rate)
  }));

  if (loading && !metrics) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant={isMobile ? "h5" : "h4"}>SLA Monitoring Dashboard</Typography>
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

      {/* KPI Cards */}
      {metrics && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TrendingUpIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography color="textSecondary">Delivery Rate</Typography>
                </Box>
                <Typography variant="h4">{metrics.delivery_rate}%</Typography>
                <Typography variant="body2" color="textSecondary">
                  {metrics.delivered_shipments} of {metrics.total_shipments} delivered
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CheckCircleIcon sx={{ mr: 1, color: 'success.main' }} />
                  <Typography color="textSecondary">On-Time Rate</Typography>
                </Box>
                <Typography variant="h4">{metrics.on_time_delivery_rate}%</Typography>
                <Typography variant="body2" color="textSecondary">
                  {metrics.on_time_deliveries} delivered on time
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <WarningIcon sx={{ mr: 1, color: 'warning.main' }} />
                  <Typography color="textSecondary">Overdue Rate</Typography>
                </Box>
                <Typography variant="h4">{metrics.overdue_rate}%</Typography>
                <Typography variant="body2" color="textSecondary">
                  {metrics.overdue_shipments} shipments overdue
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AccessTimeIcon sx={{ mr: 1, color: 'info.main' }} />
                  <Typography color="textSecondary">Avg Delivery Time</Typography>
                </Box>
                <Typography variant="h4">
                  {parseFloat(metrics.avg_delivery_time_hours || 0).toFixed(1)}h
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Min: {parseFloat(metrics.min_delivery_time_hours || 0).toFixed(1)}h, 
                  Max: {parseFloat(metrics.max_delivery_time_hours || 0).toFixed(1)}h
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Delivery Time Distribution</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={distributionChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Number of Deliveries" fill={theme.palette.primary.main} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Top Driver Performance</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={driverPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="completion" 
                  name="Completion Rate" 
                  stroke={theme.palette.primary.main} 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="onTime" 
                  name="On-Time Rate" 
                  stroke={theme.palette.success.main} 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Driver Performance Table */}
      <Paper sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ p: 2 }}>Driver Performance</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Driver</TableCell>
                <TableCell align="right">Assignments</TableCell>
                <TableCell align="right">Completion Rate</TableCell>
                <TableCell align="right">On-Time Rate</TableCell>
                <TableCell align="right">Overdue Rate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {driverMetrics.map((driver) => (
                <TableRow key={driver.driver_id}>
                  <TableCell>{driver.driver_name}</TableCell>
                  <TableCell align="right">{driver.total_assignments}</TableCell>
                  <TableCell align="right">
                    <Chip 
                      label={`${driver.completion_rate}%`} 
                      color={getDeliveryRateColor(driver.completion_rate)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Chip 
                      label={`${driver.on_time_rate}%`} 
                      color={getOnTimeRateColor(driver.on_time_rate)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Chip 
                      label={`${driver.overdue_rate}%`} 
                      color={getOverdueRateColor(driver.overdue_rate)}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Overdue Shipments */}
      <Paper>
        <Typography variant="h6" sx={{ p: 2 }}>Overdue Shipments</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tracking Number</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Driver</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Hours Overdue</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {overdueShipments.map((shipment) => (
                <TableRow key={shipment.id}>
                  <TableCell>{shipment.tracking_number}</TableCell>
                  <TableCell>
                    <Chip 
                      label={shipment.status} 
                      color="warning"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{shipment.driver_name || 'Unassigned'}</TableCell>
                  <TableCell>{new Date(shipment.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>{parseFloat(shipment.hours_overdue).toFixed(1)}h</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default SLAMonitoringDashboard;