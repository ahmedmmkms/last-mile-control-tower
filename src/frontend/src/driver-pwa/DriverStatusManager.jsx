import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Typography
} from '@mui/material';

const DriverStatusManager = ({ open, onClose, currentStatus, onStatusChange }) => {
  const [status, setStatus] = useState(currentStatus || 'available');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    onStatusChange({ status, notes });
    onClose();
  };

  const statusOptions = [
    { value: 'available', label: 'Available' },
    { value: 'busy', label: 'Busy' },
    { value: 'offline', label: 'Offline' }
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Driver Status</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value)}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            label="Notes"
            multiline
            rows={3}
            fullWidth
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional information about your status..."
          />
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Status Guide:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Available: Ready to accept new assignments
              <br />• Busy: Currently working on an assignment
              <br />• Offline: Not available for assignments
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Update Status
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DriverStatusManager;