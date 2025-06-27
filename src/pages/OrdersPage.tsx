import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Cancel as CancelIcon,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import type { Order } from '../types/OrderDTO';
import { orderService } from '../services/orderService';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const userOrders = await orderService.getUserOrders();
      setOrders(userOrders);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      setError(null);
      await orderService.cancelOrder(orderId);
      await loadOrders(); // Reload orders to get updated status
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel order');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'CONFIRMED':
        return 'info';
      case 'SHIPPED':
        return 'primary';
      case 'DELIVERED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" alignItems="center" mb={3}>
        <ShoppingCartIcon sx={{ mr: 1 }} />
        <Typography variant="h4">
          My Orders
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {orders.length === 0 ? (
        <Card>
          <CardContent>
            <Box textAlign="center" py={4}>
              <ShoppingCartIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Orders Yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You haven't placed any orders yet. Start shopping to see your orders here.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {orders.map((order) => (
            <Grid item xs={12} key={order.id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box>
                      <Typography variant="h6">
                        Order #{order.id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(order.orderDate)}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        label={order.status}
                        color={getStatusColor(order.status)}
                        size="small"
                      />
                      <Typography variant="h6" color="primary">
                        {formatPrice(order.totalAmount)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      {order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}
                    </Typography>
                    <Box display="flex" gap={1}>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleViewOrder(order)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      {order.status === 'PENDING' && (
                        <Tooltip title="Cancel Order">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleCancelOrder(order.id)}
                          >
                            <CancelIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Order Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedOrder && (
          <>
            <DialogTitle>
              Order #{selectedOrder.id} Details
            </DialogTitle>
            <DialogContent>
              <Box mb={3}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Order Date
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(selectedOrder.orderDate)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label={selectedOrder.status}
                      color={getStatusColor(selectedOrder.status)}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Delivery Address
                    </Typography>
                    <Typography variant="body1">
                      {selectedOrder.deliveryAddress}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Phone Number
                    </Typography>
                    <Typography variant="body1">
                      {selectedOrder.phoneNumber}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              <Typography variant="h6" gutterBottom>
                Order Items
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Medicine</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrder.orderItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <img
                              src={item.medicine.image}
                              alt={item.medicine.name}
                              style={{
                                width: 40,
                                height: 40,
                                objectFit: 'cover',
                                borderRadius: 4,
                                marginRight: 12
                              }}
                            />
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {item.medicine.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {item.medicine.description}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          {item.quantity}
                        </TableCell>
                        <TableCell align="right">
                          {formatPrice(item.price)}
                        </TableCell>
                        <TableCell align="right">
                          {formatPrice(item.price * item.quantity)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Typography variant="h6">
                          Total Amount
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="h6" color="primary">
                          {formatPrice(selectedOrder.totalAmount)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
            <DialogActions>
              {selectedOrder.status === 'PENDING' && (
                <Button
                  color="error"
                  onClick={() => {
                    setDialogOpen(false);
                    handleCancelOrder(selectedOrder.id);
                  }}
                >
                  Cancel Order
                </Button>
              )}
              <Button onClick={() => setDialogOpen(false)}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default OrdersPage; 