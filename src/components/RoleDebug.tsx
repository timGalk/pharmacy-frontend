import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { authService } from '../services/authService';

const RoleDebug: React.FC = () => {
  const user = authService.getUser();
  const isAuthenticated = authService.isAuthenticated();
  const isUser = authService.hasRole('user');
  const isAdmin = authService.hasRole('admin');
  const isPharmacist = authService.hasRole('pharmacist');

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Paper sx={{ p: 2, mb: 2, bgcolor: '#f0f8ff' }}>
      <Typography variant="h6" sx={{ mb: 1 }}>Debug Information</Typography>
      <Box sx={{ fontFamily: 'monospace', fontSize: '12px' }}>
        <div>User ID: {user?.id}</div>
        <div>Email: {user?.email}</div>
        <div>Roles: {JSON.stringify(user?.roles)}</div>
        <div>Is User: {isUser.toString()}</div>
        <div>Is Admin: {isAdmin.toString()}</div>
        <div>Is Pharmacist: {isPharmacist.toString()}</div>
        <div>Primary Role: {authService.getPrimaryRole()}</div>
      </Box>
    </Paper>
  );
};

export default RoleDebug; 