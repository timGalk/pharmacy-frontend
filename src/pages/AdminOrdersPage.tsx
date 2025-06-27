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
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import type { Order, UpdateOrderStatusRequest } from '../types/OrderDTO';
import { orderService } from '../services/orderService';

const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState<UpdateOrderStatusRequest>({ status: 'PENDING' });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const allOrders = await orderService.getAllOrders();
      setOrders(allOrders);
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

  const handleUpdateStatus = (order: Order) => {
    setSelectedOrder(order);
    setStatusUpdate({ status: order.status });
    setStatusDialogOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder) return;

    try {
      setError(null);
      await orderService.updateOrderStatus(selectedOrder.id, statusUpdate);
      await loadOrders(); // Reload orders to get updated status
      setStatusDialogOpen(false);
      setSuccess('Order status updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order status');
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
          Order Management
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {orders.length === 0 ? (
        <Card>
          <CardContent>
            <Box textAlign="center" py={4}>
              <ShoppingCartIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Orders Found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                There are no orders in the system yet.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      #{order.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      User #{order.userId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(order.orderDate)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium" color="primary">
                      {formatPrice(order.totalAmount)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleViewOrder(order)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Update Status">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleUpdateStatus(order)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
              <Button onClick={() => setDialogOpen(false)}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Update Order Status
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Update the status for Order #{selectedOrder?.id}
          </Typography>
          
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusUpdate.status}
              label="Status"
              onChange={(e) => setStatusUpdate({ status: e.target.value as any })}
            >
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="CONFIRMED">Confirmed</MenuItem>
              <MenuItem value="SHIPPED">Shipped</MenuItem>
              <MenuItem value="DELIVERED">Delivered</MenuItem>
              <MenuItem value="CANCELLED">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleStatusUpdate}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminOrdersPage; 