import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  useMediaQuery,
  useTheme,
  Chip,
  Alert
} from '@mui/material';

const ResponsiveDesignTest = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  
  const [screenInfo, setScreenInfo] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenInfo({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getDeviceType = () => {
    if (isMobile) return 'Mobile';
    if (isTablet) return 'Tablet';
    if (isDesktop) return 'Desktop';
    return 'Unknown';
  };

  const getBreakpoint = () => {
    if (isMobile) return 'xs/sm (0-600px)';
    if (isTablet) return 'md (600px-900px)';
    if (isDesktop) return 'lg/xl (900px+)';
    return 'Unknown';
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Responsive Design Test
      </Typography>
      
      <Alert severity="info" sx={{ mb: 2 }}>
        Resize your browser window to test responsive behavior
      </Alert>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Current Device Information
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Chip 
              label={`Device Type: ${getDeviceType()}`} 
              color={isMobile ? "primary" : isTablet ? "secondary" : "success"} 
            />
            <Chip 
              label={`Breakpoint: ${getBreakpoint()}`} 
              color="info" 
            />
            <Chip 
              label={`Screen: ${screenInfo.width} Ã— ${screenInfo.height}`} 
              color="warning" 
            />
          </Box>
        </Box>
        
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Responsive Component Test
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            gap: 2,
            mt: 1
          }}>
            <Button 
              variant="contained" 
              fullWidth={isMobile}
              sx={{ flex: 1 }}
            >
              {isMobile ? 'Mobile Button' : 'Responsive Button 1'}
            </Button>
            <Button 
              variant="outlined" 
              fullWidth={isMobile}
              sx={{ flex: 1 }}
            >
              {isMobile ? 'Mobile Button' : 'Responsive Button 2'}
            </Button>
            <Button 
              variant="text" 
              fullWidth={isMobile}
              sx={{ flex: 1 }}
            >
              {isMobile ? 'Mobile Button' : 'Responsive Button 3'}
            </Button>
          </Box>
        </Box>
        
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Typography Test
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Typography variant={isMobile ? "h6" : "h4"} gutterBottom>
              Heading Text
            </Typography>
            <Typography variant={isMobile ? "body2" : "body1"}>
              This is body text that adapts to different screen sizes. On mobile devices, 
              the text and components are optimized for smaller screens with appropriate 
              sizing and spacing.
            </Typography>
          </Box>
        </Box>
        
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Layout Test
          </Typography>
          <Box sx={{ 
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 2,
            mt: 1
          }}>
            <Paper sx={{ 
              flex: 1, 
              p: isMobile ? 1 : 2,
              minHeight: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Typography variant={isMobile ? "body2" : "body1"}>
                Panel 1
              </Typography>
            </Paper>
            <Paper sx={{ 
              flex: 1, 
              p: isMobile ? 1 : 2,
              minHeight: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Typography variant={isMobile ? "body2" : "body1"}>
                Panel 2
              </Typography>
            </Paper>
            <Paper sx={{ 
              flex: 1, 
              p: isMobile ? 1 : 2,
              minHeight: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Typography variant={isMobile ? "body2" : "body1"}>
                Panel 3
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default ResponsiveDesignTest;