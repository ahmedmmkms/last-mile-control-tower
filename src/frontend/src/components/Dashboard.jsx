import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, CssBaseline } from '@mui/material';
import { Dashboard as DashboardIcon, LocalShipping as ShipmentIcon, DriveEta as DriverIcon, Route as RouteIcon, AdminPanelSettings as AdminIcon } from '@mui/icons-material';
import ShipmentList from '../components/ShipmentList';
import DriverStatusPanel from '../components/DriverStatusPanel';
import RouteVisualization from '../components/RouteVisualization';
import AdminInterface from '../components/AdminInterface';

const drawerWidth = 240;

const Dashboard = () => {
  const [activeView, setActiveView] = useState('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'shipments':
        return <ShipmentList />;
      case 'drivers':
        return <DriverStatusPanel />;
      case 'routes':
        return <RouteVisualization />;
      case 'admin':
        return <AdminInterface />;
      default:
        return (
          <>
            <ShipmentList />
            <DriverStatusPanel />
            <RouteVisualization />
          </>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* Header */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Last-Mile Delivery Control Tower
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {['Dashboard', 'Shipments', 'Drivers', 'Routes', 'Admin'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton 
                  onClick={() => setActiveView(text.toLowerCase())}
                  selected={activeView === text.toLowerCase()}
                >
                  <ListItemIcon>
                    {index === 0 && <DashboardIcon />}
                    {index === 1 && <ShipmentIcon />}
                    {index === 2 && <DriverIcon />}
                    {index === 3 && <RouteIcon />}
                    {index === 4 && <AdminIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography variant="h4" gutterBottom>
          {activeView === 'dashboard' ? 'Dispatcher Dashboard' : 
           activeView === 'admin' ? 'Admin Interface' : 
           `${activeView.charAt(0).toUpperCase() + activeView.slice(1)}`}
        </Typography>
        
        {renderView()}
      </Box>
    </Box>
  );
};

export default Dashboard;