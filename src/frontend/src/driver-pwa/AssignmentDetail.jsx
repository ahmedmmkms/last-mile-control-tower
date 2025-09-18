import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  PhotoCamera as CameraIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';

const AssignmentDetail = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState({
    id: '1',
    trackingNumber: 'TRK001',
    status: 'assigned',
    origin: 'Warehouse: 789 Industrial Blvd, Queens, NY',
    destination: '123 Main St, New York, NY',
    recipient: 'Jane Smith',
    recipientPhone: '+1987654321',
    notes: 'Fragile item - handle with care',
    estimatedTime: '30 min'
  });
  
  const [podDialogOpen, setPodDialogOpen] = useState(false);
  const [podImage, setPodImage] = useState('');
  const [podNotes, setPodNotes] = useState('');

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'default';
      case 'assigned': return 'primary';
      case 'in_transit': return 'secondary';
      case 'delivered': return 'success';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const handleStartDelivery = () => {
    // In a real app, this would update the assignment status
    setAssignment(prev => ({ ...prev, status: 'in_transit' }));
    console.log('Starting delivery for assignment', id);
  };

  const handleCompleteDelivery = () => {
    setPodDialogOpen(true);
  };

  const handlePodSubmit = () => {
    // In a real app, this would submit the PoD to the backend
    setAssignment(prev => ({ ...prev, status: 'delivered' }));
    setPodDialogOpen(false);
    setPodImage('');
    setPodNotes('');
    console.log('PoD submitted for assignment', id);
  };

  return (
    <Container maxWidth="md" sx={{ p: isMobile ? 1 : 0 }}>
      <Box sx={{ mt: isMobile ? 1 : 2, mb: isMobile ? 2 : 3 }}>
        <IconButton onClick={() => navigate('/driver/dashboard')}>
          <BackIcon />
        </IconButton>
      </Box>

      <Paper elevation={3} sx={{ p: isMobile ? 2 : 3, mb: isMobile ? 2 : 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 2,
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 2 : 0
        }}>
          <Typography variant={isMobile ? "h6" : "h5"}>Assignment Details</Typography>
          <Chip
            label={assignment.status}
            color={getStatusColor(assignment.status)}
            size={isMobile ? "small" : "medium"}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography 
            variant={isMobile ? "h6" : "h6"} 
            color="primary" 
            gutterBottom
            align={isMobile ? "center" : "left"}
          >
            {assignment.trackingNumber}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
            <LocationIcon sx={{ mr: 1, color: 'text.secondary', mt: 0.5 }} />
            <Typography variant="body2">
              {assignment.origin}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
            <LocationIcon sx={{ mr: 1, color: 'text.secondary', mt: 0.5 }} />
            <Typography variant="body2">
              {assignment.destination}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
            <PhoneIcon sx={{ mr: 1, color: 'text.secondary', mt: 0.5 }} />
            <Typography variant="body2">
              {assignment.recipient} ({assignment.recipientPhone})
            </Typography>
          </Box>
          
          {assignment.notes && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Notes:
              </Typography>
              <Paper variant="outlined" sx={{ p: isMobile ? 1 : 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {assignment.notes}
                </Typography>
              </Paper>
            </Box>
          )}
        </Box>

        <Box sx={{ 
          display: 'flex', 
          gap: isMobile ? 1 : 2, 
          mt: 3,
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          {assignment.status === 'assigned' && (
            <Button
              variant="contained"
              fullWidth
              startIcon={<LocationIcon />}
              onClick={handleStartDelivery}
              size={isMobile ? "large" : "medium"}
            >
              Start Delivery
            </Button>
          )}
          
          {assignment.status === 'in_transit' && (
            <Button
              variant="contained"
              color="success"
              fullWidth
              startIcon={<CheckIcon />}
              onClick={handleCompleteDelivery}
              size={isMobile ? "large" : "medium"}
            >
              Complete Delivery
            </Button>
          )}
          
          {assignment.status === 'delivered' && (
            <Button
              variant="contained"
              color="success"
              fullWidth
              startIcon={<CheckIcon />}
              disabled
              size={isMobile ? "large" : "medium"}
            >
              Delivered
            </Button>
          )}
        </Box>
      </Paper>

      {/* PoD Dialog */}
      <Dialog 
        open={podDialogOpen} 
        onClose={() => setPodDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>Proof of Delivery</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<CameraIcon />}
              sx={{ mb: 2 }}
              size={isMobile ? "large" : "medium"}
            >
              Take Photo
              <input
                type="file"
                hidden
                accept="image/*"
                capture="environment"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    // In a real app, you would handle the image upload
                    setPodImage(URL.createObjectURL(e.target.files[0]));
                  }
                }}
              />
            </Button>
            
            {podImage && (
              <Box sx={{ mb: 2, textAlign: 'center' }}>
                <img 
                  src={podImage} 
                  alt="PoD" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: isMobile ? '150px' : '200px',
                    borderRadius: '8px'
                  }} 
                />
              </Box>
            )}
            
            <TextField
              label="Delivery Notes"
              multiline
              rows={isMobile ? 2 : 3}
              fullWidth
              value={podNotes}
              onChange={(e) => setPodNotes(e.target.value)}
              placeholder="Any special notes about the delivery..."
              size={isMobile ? "small" : "medium"}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setPodDialogOpen(false)}
            size={isMobile ? "large" : "medium"}
          >
            Cancel
          </Button>
          <Button 
            onClick={handlePodSubmit} 
            variant="contained" 
            disabled={!podImage}
            startIcon={<CheckIcon />}
            size={isMobile ? "large" : "medium"}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AssignmentDetail;