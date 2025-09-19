import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Drawer, 
  List as MaterialList, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Box, 
  CssBaseline,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { 
  Dashboard as DashboardIcon, 
  LocalShipping as ShipmentIcon, 
  DriveEta as DriverIcon, 
  Route as RouteIcon, 
  AdminPanelSettings as AdminIcon, 
  Assessment as AssessmentIcon,
  Add as AddIcon,
  PersonAdd as PersonAddIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  Language as LanguageIcon
} from '@mui/icons-material';
import ShipmentList from '../components/ShipmentList';
import DriverStatusPanel from '../components/DriverStatusPanel';
import RouteVisualization from '../components/RouteVisualization';
import AdminInterface from '../components/AdminInterface';
import DispatcherNotifications from '../components/DispatcherNotifications';
import SLAMonitoringDashboard from '../components/SLAMonitoringDashboard';
import { useTranslation } from 'react-i18next';
import i18n from '../localization/i18n';
import theme from '../lib/theme';

const drawerWidth = 240;

const Dashboard = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const { t, i18n: i18nInstance } = useTranslation();

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    i18nInstance.changeLanguage(newLanguage);
  };

  // Create a theme instance with background image
  const getThemedStyle = (isRtl) => ({
    background: `linear-gradient(rgba(245, 245, 245, 0.9), rgba(245, 245, 245, 0.9)), 
                 url('/src/assets/images/logistics-background.avif')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
    direction: isRtl ? 'rtl' : 'ltr',
  });

  const renderView = () => {
    switch (activeView) {
      case 'shipments':
        return <ShipmentList />;
      case 'drivers':
        return <DriverStatusPanel />;
      case 'routes':
        return <RouteVisualization />;
      case 'admin':
        return (
          <Box sx={{ width: '100%' }}>
            <AdminInterface />
          </Box>
        );
      case 'sla':
        return <SLAMonitoringDashboard />;
      default:
        return (
          <Box sx={{ width: '100%' }}>
            {/* Welcome Section */}
            <Paper 
              sx={{ 
                p: { xs: 2, sm: 3 }, 
                mb: 3, 
                background: 'linear-gradient(135deg, #1a1a1a 0%, #404040 100%)',
                color: 'white',
                borderRadius: 2
              }}
            >
              <Typography variant="h3" gutterBottom sx={{ fontSize: { xs: '1.75rem', sm: '2rem' } }}>
                {t('welcome')}{i18nInstance.language === 'en' ? ' to ' : ' '}Last-Mile Delivery Control Tower
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                {t('manage_delivery_operations')}
              </Typography>
            </Paper>

            {/* Quick Stats */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <ShipmentIcon sx={{ fontSize: 32, color: 'primary.main', mr: 1.5 }} />
                      <Typography variant="h4" sx={{ fontWeight: 600 }}>24</Typography>
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ fontSize: '1.1rem', mb: 0.5 }}>
                      {t('active_shipments')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('currently_in_transit')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <DriverIcon sx={{ fontSize: 32, color: 'secondary.main', mr: 1.5 }} />
                      <Typography variant="h4" sx={{ fontWeight: 600 }}>18</Typography>
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ fontSize: '1.1rem', mb: 0.5 }}>
                      {t('active_drivers')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('currently_on_duty')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <CheckCircleIcon sx={{ fontSize: 32, color: 'success.main', mr: 1.5 }} />
                      <Typography variant="h4" sx={{ fontWeight: 600 }}>87%</Typography>
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ fontSize: '1.1rem', mb: 0.5 }}>
                      {t('on_time_rate')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('deliveries_on_schedule')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <AccessTimeIcon sx={{ fontSize: 32, color: 'info.main', mr: 1.5 }} />
                      <Typography variant="h4" sx={{ fontWeight: 600 }}>42m</Typography>
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ fontSize: '1.1rem', mb: 0.5 }}>
                      {t('avg_delivery_time')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('average_time_per_delivery')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Recent Activity and Quick Actions */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Paper 
                  sx={{ 
                    p: { xs: 2, sm: 3 },
                    borderRadius: 2
                  }}
                >
                  <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                    {t('recent_activity')}
                  </Typography>
                  <MaterialList sx={{ py: 0 }}>
                    {[
                      { action: 'Shipment #DL-2023-001234 delivered', time: '2 minutes ago', status: 'success' },
                      { action: 'Driver John assigned to Route R-2023-0056', time: '15 minutes ago', status: 'info' },
                      { action: 'New shipment #DL-2023-001235 created', time: '1 hour ago', status: 'primary' },
                      { action: 'Shipment #DL-2023-001230 marked as delayed', time: '2 hours ago', status: 'warning' },
                    ].map((item, index) => (
                      <ListItem 
                        key={index} 
                        sx={{ 
                          pl: 0, 
                          pr: 0, 
                          py: 1.5,
                          borderBottom: index < 3 ? '1px solid rgba(0, 0, 0, 0.05)' : 'none'
                        }}
                      >
                        <ListItemText 
                          primary={item.action} 
                          secondary={item.time}
                          primaryTypographyProps={{ 
                            color: item.status === 'success' ? 'success.main' : 
                                   item.status === 'warning' ? 'warning.main' : 
                                   item.status === 'info' ? 'info.main' : 'text.primary',
                            fontWeight: 500
                          }}
                          secondaryTypographyProps={{
                            color: 'text.secondary',
                            fontSize: '0.85rem'
                          }}
                        />
                      </ListItem>
                    ))}
                  </MaterialList>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper 
                  sx={{ 
                    p: { xs: 2, sm: 3 },
                    borderRadius: 2
                  }}
                >
                  <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                    {t('quick_actions')}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Button 
                      variant="contained" 
                      fullWidth
                      onClick={() => setActiveView('shipments')}
                      startIcon={<AddIcon />}
                      sx={{ 
                        py: 1.5,
                        fontWeight: 600
                      }}
                    >
                      {t('create_shipment')}
                    </Button>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      onClick={() => setActiveView('drivers')}
                      startIcon={<PersonAddIcon />}
                      sx={{ 
                        py: 1.5,
                        fontWeight: 600
                      }}
                    >
                      {t('add_driver')}
                    </Button>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      onClick={() => setActiveView('routes')}
                      startIcon={<RouteIcon />}
                      sx={{ 
                        py: 1.5,
                        fontWeight: 600
                      }}
                    >
                      {t('optimize_routes')}
                    </Button>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      onClick={() => setActiveView('admin')}
                      startIcon={<AdminIcon />}
                      sx={{ 
                        py: 1.5,
                        fontWeight: 600
                      }}
                    >
                      {t('system_settings')}
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        {/* Header */}
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Last-Mile Delivery Control Tower
            </Typography>
            <FormControl sx={{ minWidth: 120, mr: 2 }} size="small">
              <Select
                value={i18nInstance.language}
                onChange={handleLanguageChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Language' }}
                sx={{ color: 'white', '& .MuiSelect-icon': { color: 'white' } }}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="ar">العربية</MenuItem>
              </Select>
            </FormControl>
            <DispatcherNotifications />
          </Toolbar>
        </AppBar>

        {/* Sidebar */}
        <Drawer
          variant="permanent"
          anchor={i18nInstance.language === 'ar' ? 'right' : 'left'}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { 
              width: drawerWidth, 
              boxSizing: 'border-box',
              right: i18nInstance.language === 'ar' ? 0 : 'auto',
              left: i18nInstance.language === 'ar' ? 'auto' : 0,
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            {['dashboard', 'shipments', 'drivers', 'routes', 'sla_monitoring', 'admin'].map((key, index) => {
              const isDisabled = key === 'sla_monitoring';
              const text = t(key);
              return (
                <ListItem key={key} disablePadding>
                  <ListItemButton 
                    onClick={() => !isDisabled && setActiveView(key)}
                    selected={activeView === key}
                    disabled={isDisabled}
                    sx={isDisabled ? { 
                      opacity: 0.5, 
                      '&.Mui-disabled': { 
                        opacity: 0.5,
                        color: 'rgba(0, 0, 0, 0.38)',
                        cursor: 'not-allowed'
                      }
                    } : {
                      '&.Mui-selected': {
                        backgroundColor: 'secondary.main',
                        color: 'secondary.contrastText',
                        '&:hover': {
                          backgroundColor: 'secondary.dark',
                        }
                      }
                    }}
                  >
                    <ListItemIcon sx={isDisabled ? { color: 'rgba(0, 0, 0, 0.38)' } : {
                      color: activeView === key ? 'secondary.contrastText' : 'inherit'
                    }}>
                      {index === 0 && <DashboardIcon />}
                      {index === 1 && <ShipmentIcon />}
                      {index === 2 && <DriverIcon />}
                      {index === 3 && <RouteIcon />}
                      {index === 4 && <AssessmentIcon />}
                      {index === 5 && <AdminIcon />}
                    </ListItemIcon>
                    <ListItemText 
                      primary={text} 
                      sx={isDisabled ? { color: 'rgba(0, 0, 0, 0.38)' } : {}}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </Box>
        </Drawer>

        {/* Main Content */}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: 3,
            ...getThemedStyle(i18nInstance.language === 'ar')
          }}
        >
          <Toolbar />
          {activeView !== 'admin' && activeView !== 'shipments' && (
            <Typography variant="h4" gutterBottom>
              {activeView === 'dashboard' ? t('dispatcher_dashboard') : 
               activeView === 'sla' ? t('sla_monitoring_dashboard') :
               t(activeView)}
            </Typography>
          )}
          
          {renderView()}
          
          {/* Signature */}
          <Box sx={{ 
            mt: 4, 
            textAlign: 'center', 
            color: 'text.secondary',
            fontSize: '0.875rem'
          }}>
            by AMM 2025
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;