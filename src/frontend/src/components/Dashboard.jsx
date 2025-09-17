import React from 'react';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Box, CssBaseline } from '@mui/material';
import { Dashboard as DashboardIcon, LocalShipping as ShipmentIcon, DriveEta as DriverIcon, Route as RouteIcon } from '@mui/icons-material';
import ShipmentList from '../components/ShipmentList';
import DriverStatusPanel from '../components/DriverStatusPanel';
import RouteVisualization from '../components/RouteVisualization';

const drawerWidth = 240;

const Dashboard = () => {
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
            {['Dashboard', 'Shipments', 'Drivers', 'Routes'].map((text, index) => (
              <ListItem key={text} button>
                <ListItemIcon>
                  {index === 0 && <DashboardIcon />}
                  {index === 1 && <ShipmentIcon />}
                  {index === 2 && <DriverIcon />}
                  {index === 3 && <RouteIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography variant="h4" gutterBottom>
          Dispatcher Dashboard
        </Typography>
        
        {/* Shipment List */}
        <ShipmentList />
        
        {/* Driver Status Panel */}
        <DriverStatusPanel />
        
        {/* Route Visualization */}
        <RouteVisualization />
      </Box>
    </Box>
  );
};

export default Dashboard;