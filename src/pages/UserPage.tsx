import React from 'react';
import { Box, Typography, Avatar, Card, CardContent, Grid, Button } from '@mui/material';

const mockUser = {
  name: "Jane Doe",
  email: "jane.doe@email.com",
  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  address: "123 Main St, Springfield",
  phone: "(555) 123-4567",
  memberSince: "2022-03-15",
  orders: [
    { id: 1, date: "2024-05-01", item: "Ibuprofen 400mg", status: "Delivered" },
    { id: 2, date: "2024-04-15", item: "Vitamin D3", status: "Shipped" },
  ]
};

export default function UserPage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f9f9f9', py: 6 }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={6}>
          <Card sx={{ borderRadius: 4, p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                src={mockUser.avatar}
                alt={mockUser.name}
                sx={{ width: 80, height: 80, mr: 3 }}
              />
              <Box>
                <Typography variant="h5" fontWeight={600}>
                  {mockUser.name}
                </Typography>
                <Typography color="text.secondary">{mockUser.email}</Typography>
                <Typography color="text.secondary" fontSize={14}>
                  Member since: {new Date(mockUser.memberSince).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
            <CardContent sx={{ bgcolor: '#f5f5f5', borderRadius: 2, mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={500}>Contact Info</Typography>
              <Typography fontSize={15}>{mockUser.address}</Typography>
              <Typography fontSize={15}>{mockUser.phone}</Typography>
            </CardContent>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
              Recent Orders
            </Typography>
            {mockUser.orders.length === 0 ? (
              <Typography color="text.secondary">No recent orders.</Typography>
            ) : (
              <Box>
                {mockUser.orders.map(order => (
                  <Box
                    key={order.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 1,
                      borderBottom: '1px solid #eee',
                    }}
                  >
                    <Box>
                      <Typography fontWeight={500}>{order.item}</Typography>
                      <Typography fontSize={13} color="text.secondary">
                        {new Date(order.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Typography fontSize={14} color={order.status === "Delivered" ? "green" : "orange"}>
                      {order.status}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 4, borderRadius: 3, textTransform: 'none' }}
              fullWidth
            >
              Edit Profile
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
