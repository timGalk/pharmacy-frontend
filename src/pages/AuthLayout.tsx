import { Box, Container } from '@mui/material';
import React from 'react';

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box
    sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0f7fa 0%, #f1f8e9 100%)',
      display: 'flex',
      alignItems: 'center',
    }}
  >
    <Container maxWidth="sm">{children}</Container>
  </Box>
);

export default AuthLayout;
