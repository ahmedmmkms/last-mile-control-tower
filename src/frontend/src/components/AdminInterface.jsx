import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Divider
} from '@mui/material';
import ShipmentManagement from './ShipmentManagement';
import DriverManagement from './DriverManagement';
import RouteManagement from './RouteManagement';
import CODManagement from './CODManagement';
import CODReconciliation from './CODReconciliation';
import AnalyticsDashboard from './AnalyticsDashboard';

const AdminInterface = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Admin Interface
      </Typography>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Shipments" />
          <Tab label="Drivers" />
          <Tab label="Routes" />
          <Tab label="COD" />
          <Tab label="Reconciliation" />
          <Tab label="Analytics" />
        </Tabs>
      </Paper>

      <Divider sx={{ mb: 3 }} />

      {activeTab === 0 && <ShipmentManagement />}
      {activeTab === 1 && <DriverManagement />}
      {activeTab === 2 && <RouteManagement />}
      {activeTab === 3 && <CODManagement />}
      {activeTab === 4 && <CODReconciliation />}
      {activeTab === 5 && <AnalyticsDashboard />}
    </Box>
  );
};

export default AdminInterface;