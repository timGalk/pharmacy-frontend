import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { authService } from '../services/authService';

const RoleDebug: React.FC = () => {
  const user = authService.getUser();
  const isAuthenticated = authService.isAuthenticated();
  const isUser = authService.hasRole('USER');
  const isAdmin = authService.hasRole('ADMIN');
  const isPharmacist = authService.hasRole('PHARMACIST');

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
        <div>Is USER: {isUser.toString()}</div>
        <div>Is ADMIN: {isAdmin.toString()}</div>
        <div>Is PHARMACIST: {isPharmacist.toString()}</div>
        <div>Primary Role: {authService.getPrimaryRole()}</div>
        <div>Has Any Role (USER, ADMIN, PHARMACIST): {authService.hasAnyRole(['USER', 'ADMIN', 'PHARMACIST']).toString()}</div>
      </Box>
    </Paper>
  );
};

export default RoleDebug; 