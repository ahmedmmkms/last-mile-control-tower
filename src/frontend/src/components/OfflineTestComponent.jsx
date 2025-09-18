import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip
} from '@mui/material';
import offlineDataService from '../services/offlineDataService';
import ApiService from '../services/apiService';

const OfflineTestComponent = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [testData, setTestData] = useState('');
  const [useOffline, setUseOffline] = useState(false);
  const [pendingSyncData, setPendingSyncData] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Load pending sync data
    loadPendingSyncData();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadPendingSyncData = async () => {
    try {
      await offlineDataService.initDB();
      const data = await offlineDataService.getPendingSyncData();
      setPendingSyncData(data);
    } catch (error) {
      console.error('Error loading pending sync data:', error);
      addTestResult(`Error loading pending sync data: ${error.message}`);
    }
  };

  const handleCreateTestData = async () => {
    if (!testData.trim()) return;
    
    setLoading(true);
    
    const testDataObj = {
      id: Date.now(),
      name: testData,
      timestamp: new Date().toISOString(),
      test: true
    };
    
    try {
      if (useOffline || !isOnline) {
        // Simulate offline creation
        await offlineDataService.saveForSync('/api/test', 'POST', testDataObj);
        addTestResult('Data saved for offline sync');
      } else {
        // Try to create via API
        await ApiService.createShipment(testDataObj); // Using shipment API for test
        addTestResult('Data created successfully via API');
      }
      
      setTestData('');
      await loadPendingSyncData();
    } catch (error) {
      if (useOffline || !isOnline) {
        // Even in offline mode, we might have errors
        addTestResult(`Error: ${error.message}`);
      } else {
        // If online request fails, save for sync
        try {
          await offlineDataService.saveForSync('/api/test', 'POST', testDataObj);
          addTestResult('API failed, data saved for offline sync');
          await loadPendingSyncData();
        } catch (syncError) {
          addTestResult(`Error saving for sync: ${syncError.message}`);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSyncNow = async () => {
    setLoading(true);
    try {
      await offlineDataService.syncPendingData();
      addTestResult('Manual sync completed');
      await loadPendingSyncData();
    } catch (error) {
      addTestResult(`Sync error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addTestResult = (message) => {
    setTestResults(prev => [...prev, {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      message
    }]);
  };

  const clearTestResults = () => {
    setTestResults([]);
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Offline Functionality Test
      </Typography>
      
      <Alert 
        severity={isOnline ? "success" : "warning"} 
        sx={{ mb: 2 }}
      >
        Connection Status: {isOnline ? 'Online' : 'Offline'}
      </Alert>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
        <TextField
          fullWidth
          label="Test Data"
          value={testData}
          onChange={(e) => setTestData(e.target.value)}
          placeholder="Enter test data"
        />
        <Button 
          variant="contained" 
          onClick={handleCreateTestData}
          disabled={!testData.trim() || loading}
        >
          {loading ? 'Processing...' : 'Create'}
        </Button>
      </Box>
      
      <FormControlLabel
        control={
          <Switch
            checked={useOffline}
            onChange={(e) => setUseOffline(e.target.checked)}
          />
        }
        label="Force Offline Mode"
      />
      
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle1">
            Pending Sync Data ({pendingSyncData.length})
          </Typography>
          <Chip 
            label={isOnline ? "Online" : "Offline"} 
            color={isOnline ? "success" : "warning"} 
            size="small" 
          />
        </Box>
        {pendingSyncData.length > 0 ? (
          <List>
            {pendingSyncData.map((item) => (
              <React.Fragment key={item.id}>
                <ListItem>
                  <ListItemText
                    primary={`Endpoint: ${item.endpoint}`}
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          Method: {item.method}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2">
                          Attempts: {item.attempts}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2">
                          Data: {JSON.stringify(item.data).substring(0, 50)}...
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography color="text.secondary">No pending sync data</Typography>
        )}
      </Box>
      
      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button 
          variant="outlined" 
          onClick={handleSyncNow}
          disabled={pendingSyncData.length === 0 || loading}
        >
          Sync Now
        </Button>
        <Button 
          variant="outlined" 
          onClick={loadPendingSyncData}
          disabled={loading}
        >
          Refresh
        </Button>
        <Button 
          variant="outlined" 
          onClick={clearTestResults}
          disabled={testResults.length === 0}
        >
          Clear Results
        </Button>
      </Box>
      
      {testResults.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Test Results
          </Typography>
          <List>
            {testResults.map((result) => (
              <React.Fragment key={result.id}>
                <ListItem>
                  <ListItemText
                    primary={result.message}
                    secondary={result.timestamp}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Box>
      )}
    </Paper>
  );
};

export default OfflineTestComponent;