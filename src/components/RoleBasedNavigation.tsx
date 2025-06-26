import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Typography } from '@mui/material';
import { authService } from '../services/authService';

const RoleBasedNavigation: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  const primaryRole = authService.getPrimaryRole();

  if (!isAuthenticated) {
    return null;
  }

  const getRoleSpecificActions = () => {
    switch (primaryRole) {
      case 'admin':
        return (
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/admin/dashboard')}
              sx={{ borderRadius: 2 }}
            >
              Admin Dashboard
            </Button>
            <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
              System management (no cart access)
            </Typography>
          </Box>
        );
      
      case 'pharmacist':
        return (
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/pharmacist/dashboard')}
              sx={{ borderRadius: 2 }}
            >
              Pharmacist Dashboard
            </Button>
            <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
              Inventory management (no cart access)
            </Typography>
          </Box>
        );
      
      case 'user':
        return (
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/customer/dashboard')}
              sx={{ borderRadius: 2 }}
            >
              User Dashboard
            </Button>
            <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
              View orders and profile
            </Typography>
          </Box>
        );
      
      default:
        return null;
    }
  };

  return (
    <Box sx={{ 
      bgcolor: 'background.paper', 
      p: 2, 
      borderRadius: 2, 
      border: '1px solid',
      borderColor: 'divider',
      mb: 2 
    }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Welcome, {authService.getFullName()}!
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Role: {primaryRole ? primaryRole.charAt(0).toUpperCase() + primaryRole.slice(1) : 'Unknown'}
      </Typography>
      {getRoleSpecificActions()}
    </Box>
  );
};

export default RoleBasedNavigation; 