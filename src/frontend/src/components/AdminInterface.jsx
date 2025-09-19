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
import { useTranslation } from 'react-i18next';

const AdminInterface = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { t } = useTranslation();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const tabLabels = [
    t('shipments'),
    t('drivers'),
    t('routes'),
    'COD',
    t('reconciliation'),
    t('analytics')
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        {t('admin_interface')}
      </Typography>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          {tabLabels.map((label, index) => (
            <Tab key={index} label={label} />
          ))}
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