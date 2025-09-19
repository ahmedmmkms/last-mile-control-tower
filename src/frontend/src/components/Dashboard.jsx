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
  createTheme,
  useMediaQuery,
  useTheme,
  IconButton
} from '@mui/material';
import { 
  Menu as MenuIcon
} from '@mui/icons-material';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeView, setActiveView] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
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
            <Grid container spacing={isMobile ? 1 : 2} sx={{ mb: isMobile ? 1 : 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: isMobile ? 'none' : 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: isMobile ? 1.5 : 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: isMobile ? 1 : 1.5 }}>
                      <ShipmentIcon sx={{ fontSize: isMobile ? 24 : 32, color: 'primary.main', mr: isMobile ? 1 : 1.5 }} />
                      <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 600 }}>{isMobile ? '24' : '24'}</Typography>
                    </Box>
                    <Typography variant={isMobile ? "body1" : "h6"} gutterBottom sx={{ fontSize: isMobile ? '0.9rem' : '1.1rem', mb: isMobile ? 0.25 : 0.5 }}>
                      {t('active_shipments')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}>
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
                      transform: isMobile ? 'none' : 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: isMobile ? 1.5 : 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: isMobile ? 1 : 1.5 }}>
                      <DriverIcon sx={{ fontSize: isMobile ? 24 : 32, color: 'secondary.main', mr: isMobile ? 1 : 1.5 }} />
                      <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 600 }}>{isMobile ? '18' : '18'}</Typography>
                    </Box>
                    <Typography variant={isMobile ? "body1" : "h6"} gutterBottom sx={{ fontSize: isMobile ? '0.9rem' : '1.1rem', mb: isMobile ? 0.25 : 0.5 }}>
                      {t('active_drivers')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}>
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
                      transform: isMobile ? 'none' : 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: isMobile ? 1.5 : 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: isMobile ? 1 : 1.5 }}>
                      <CheckCircleIcon sx={{ fontSize: isMobile ? 24 : 32, color: 'success.main', mr: isMobile ? 1 : 1.5 }} />
                      <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 600 }}>{isMobile ? '87%' : '87%'}</Typography>
                    </Box>
                    <Typography variant={isMobile ? "body1" : "h6"} gutterBottom sx={{ fontSize: isMobile ? '0.9rem' : '1.1rem', mb: isMobile ? 0.25 : 0.5 }}>
                      {t('on_time_rate')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}>
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
                      transform: isMobile ? 'none' : 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: isMobile ? 1.5 : 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: isMobile ? 1 : 1.5 }}>
                      <AccessTimeIcon sx={{ fontSize: isMobile ? 24 : 32, color: 'info.main', mr: isMobile ? 1 : 1.5 }} />
                      <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 600 }}>{isMobile ? '42m' : '42m'}</Typography>
                    </Box>
                    <Typography variant={isMobile ? "body1" : "h6"} gutterBottom sx={{ fontSize: isMobile ? '0.9rem' : '1.1rem', mb: isMobile ? 0.25 : 0.5 }}>
                      {t('avg_delivery_time')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}>
                      {t('average_time_per_delivery')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Recent Activity and Quick Actions */}
            <Grid container spacing={isMobile ? 1 : 2}>
              <Grid item xs={12} md={8}>
                <Paper 
                  sx={{ 
                    p: isMobile ? 1 : { xs: 2, sm: 3 },
                    borderRadius: 2
                  }}
                >
                  <Typography 
                    variant={isMobile ? "h6" : "h5"} 
                    gutterBottom 
                    sx={{ 
                      mb: isMobile ? 1 : 2, 
                      fontWeight: 600,
                      fontSize: isMobile ? '1.1rem' : 'inherit'
                    }}
                  >
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
                          pl: isMobile ? 0 : 0, 
                          pr: isMobile ? 0 : 0, 
                          py: isMobile ? 1 : 1.5,
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
                            fontWeight: 500,
                            fontSize: isMobile ? '0.85rem' : 'inherit'
                          }}
                          secondaryTypographyProps={{
                            color: 'text.secondary',
                            fontSize: isMobile ? '0.75rem' : '0.85rem'
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
                    p: isMobile ? 1 : { xs: 2, sm: 3 },
                    borderRadius: 2
                  }}
                >
                  <Typography 
                    variant={isMobile ? "h6" : "h5"} 
                    gutterBottom 
                    sx={{ 
                      mb: isMobile ? 1 : 2, 
                      fontWeight: 600,
                      fontSize: isMobile ? '1.1rem' : 'inherit'
                    }}
                  >
                    {t('quick_actions')}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 1 : 1.5 }}>
                    <Button 
                      variant="contained" 
                      fullWidth
                      onClick={() => setActiveView('shipments')}
                      startIcon={<AddIcon />}
                      sx={{ 
                        py: isMobile ? 1 : 1.5,
                        fontWeight: 600,
                        fontSize: isMobile ? '0.875rem' : 'inherit'
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
                        py: isMobile ? 1 : 1.5,
                        fontWeight: 600,
                        fontSize: isMobile ? '0.875rem' : 'inherit'
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
                        py: isMobile ? 1 : 1.5,
                        fontWeight: 600,
                        fontSize: isMobile ? '0.875rem' : 'inherit'
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
                        py: isMobile ? 1 : 1.5,
                        fontWeight: 600,
                        fontSize: isMobile ? '0.875rem' : 'inherit'
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
          <Toolbar sx={{ 
            display: 'flex',
            flexDirection: isMobile ? 'row' : 'row',
            alignItems: 'center',
            gap: isMobile ? 1 : 0,
            pt: isMobile ? 1 : 0,
            pb: isMobile ? 1 : 0
          }}>
            {isMobile && (
              <IconButton
                color="inherit"
                edge={i18nInstance.language === 'ar' ? "end" : "start"}
                onClick={() => setMobileOpen(!mobileOpen)}
                sx={{ mr: i18nInstance.language === 'ar' ? 0 : 2, ml: i18nInstance.language === 'ar' ? 2 : 0 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography 
              variant={isMobile ? "h6" : "h6"} 
              noWrap 
              component="div" 
              sx={{ 
                flexGrow: 1,
                textAlign: isMobile ? 'center' : 'left',
                width: isMobile ? '100%' : 'auto'
              }}
            >
              Last-Mile Delivery Control Tower
            </Typography>
            <FormControl sx={{ 
              minWidth: isMobile ? 100 : 120, 
              mr: isMobile ? 0 : 2,
              width: isMobile ? '100%' : 'auto'
            }} size="small">
              <Select
                value={i18nInstance.language}
                onChange={handleLanguageChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Language' }}
                sx={{ 
                  color: 'white', 
                  '& .MuiSelect-icon': { color: 'white' },
                  textAlign: 'left'
                }}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="ar">العربية</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: isMobile ? 'center' : 'flex-end',
              width: isMobile ? 'auto' : 'auto'
            }}>
              <DispatcherNotifications />
            </Box>
          </Toolbar>
        </AppBar>

        {/* Sidebar */}
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          anchor={i18nInstance.language === 'ar' ? 'right' : 'left'}
          open={isMobile ? mobileOpen : true}
          onClose={isMobile ? () => setMobileOpen(false) : undefined}
          sx={{
            width: isMobile ? 0 : drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { 
              width: drawerWidth, 
              boxSizing: 'border-box',
              right: i18nInstance.language === 'ar' ? 0 : 'auto',
              left: i18nInstance.language === 'ar' ? 'auto' : 0,
            },
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
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
            p: isMobile ? 1 : 3,
            ...getThemedStyle(i18nInstance.language === 'ar')
          }}
        >
          <Toolbar />
          {activeView !== 'admin' && activeView !== 'shipments' && (
            <Typography 
              variant={isMobile ? "h5" : "h4"} 
              gutterBottom
              sx={{ 
                fontSize: isMobile ? '1.5rem' : '2rem',
                mb: isMobile ? 1 : 2
              }}
            >
              {activeView === 'dashboard' ? t('dispatcher_dashboard') : 
               activeView === 'sla' ? t('sla_monitoring_dashboard') :
               t(activeView)}
            </Typography>
          )}
          
          {renderView()}
          
          {/* Signature */}
          <Box sx={{ 
            mt: isMobile ? 2 : 4, 
            textAlign: 'center', 
            color: 'text.secondary',
            fontSize: isMobile ? '0.75rem' : '0.875rem'
          }}>
            by AMM 2025
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;