import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const AdminPage: React.FC = () => {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="body1">
            Welcome to the Admin Dashboard. This page is under construction.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminPage;
