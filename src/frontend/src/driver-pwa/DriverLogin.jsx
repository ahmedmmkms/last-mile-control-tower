import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const DriverLogin = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // In a real implementation, we would call an authentication API
      // For now, we'll simulate authentication
      console.log('Login attempt with:', { phone, password });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll consider any login successful
      // In a real app, you would validate credentials and get a token
      localStorage.setItem('driverAuthenticated', 'true');
      localStorage.setItem('driverPhone', phone);
      
      // Navigate to driver dashboard
      navigate('/driver/dashboard');
    } catch (err) {
      setError('Invalid phone number or password');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container 
      component="main" 
      maxWidth="xs" 
      sx={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center',
        p: isMobile ? 2 : 0
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%'
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: isMobile ? 2 : 4, 
            width: '100%',
            maxWidth: 400
          }}
        >
          <Typography 
            component="h1" 
            variant={isMobile ? "h6" : "h5"} 
            align="center" 
            gutterBottom
          >
            Driver Login
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="phone"
              label="Phone Number"
              name="phone"
              autoComplete="tel"
              autoFocus
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1234567890"
              size={isMobile ? "small" : "medium"}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size={isMobile ? "small" : "medium"}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
              size={isMobile ? "large" : "medium"}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
          </Box>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography 
              variant={isMobile ? "caption" : "body2"} 
              color="text.secondary"
            >
              Don't have an account? Contact your dispatcher
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default DriverLogin;