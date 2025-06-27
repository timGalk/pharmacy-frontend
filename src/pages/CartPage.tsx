import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Card, CardContent,
  Grid, Button, IconButton, TextField, Divider,
  Alert, CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogActions
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  ArrowBack as ArrowBackIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';
import { cartService } from '../services/cartService';
import { authService } from '../services/authService';
import type { Cart, CartItem } from '../types/CartDTO';
import { orderService } from '../services/orderService';
import type { CreateOrderRequest } from '../types/OrderDTO';

const CartPage = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingItem, setUpdatingItem] = useState<number | null>(null);
  const [removingItem, setRemovingItem] = useState<number | null>(null);
  const [clearCartDialog, setClearCartDialog] = useState(false);
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    deliveryAddress: '',
    phoneNumber: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const userCart = await cartService.getOrCreateUserCart();
      setCart(userCart);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      setUpdatingItem(itemId);
      
      // Find the cart item to get medicine info
      const cartItem = cart?.itemList.find(item => item.id === itemId);
      if (!cartItem) {
        setError('Item not found in cart');
        return;
      }
      
      // Validate against stock quantity
      if (newQuantity > cartItem.medicine.stockQuantity) {
        setError(`Cannot update quantity. Only ${cartItem.medicine.stockQuantity} units available in stock.`);
        return;
      }
      
      const updatedCart = await cartService.updateCartItemQuantity(itemId, { quantity: newQuantity });
      setCart(updatedCart);
      setError(null); // Clear any previous errors
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update quantity');
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      setRemovingItem(itemId);
      const updatedCart = await cartService.removeItemFromCart(itemId);
      setCart(updatedCart);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item');
    } finally {
      setRemovingItem(null);
    }
  };

  const handleClearCart = async () => {
    if (!cart) return;
    
    try {
      await cartService.clearCart(cart.id);
      setCart({ ...cart, itemList: [] });
      setClearCartDialog(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear cart');
    }
  };

  const handleCheckout = async () => {
    if (!checkoutForm.deliveryAddress.trim() || !checkoutForm.phoneNumber.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setError(null);
      const orderData: CreateOrderRequest = {
        cartId: cart?.id || 0,
        deliveryAddress: checkoutForm.deliveryAddress,
        phoneNumber: checkoutForm.phoneNumber
      };

      await orderService.createOrder(orderData);
      await cartService.clearCart(cart?.id || 0);
      await loadCart();
      setCheckoutDialogOpen(false);
      setCheckoutForm({ deliveryAddress: '', phoneNumber: '' });
      setError('Order placed successfully! You can view your orders in the Orders section.');
      setTimeout(() => setError(null), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
    }
  };

  const calculateTotal = () => {
    if (!cart) return 0;
    return cart.itemList.reduce((total, item) => {
      return total + (item.medicine.price * item.quantity);
    }, 0);
  };

  const getTotalItems = () => {
    if (!cart) return 0;
    return cart.itemList.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading your cart...</Typography>
      </Container>
    );
  }

  if (!authService.isAuthenticated()) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="warning">
          Please log in to view your cart.
        </Alert>
      </Container>
    );
  }

  if (authService.hasRole('pharmacist') || authService.hasRole('admin')) {
    return (
      <Container sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <ShoppingCartIcon sx={{ mr: 1 }} />
          <Typography variant="h4" component="h1">
            Shopping Cart
          </Typography>
        </Box>
        <Alert severity="error">
          Only users can use cart functionality. {authService.hasRole('pharmacist') 
            ? 'Please use your pharmacist dashboard to manage inventory.' 
            : 'Please use your admin dashboard to manage the system.'
          }
        </Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <ShoppingCartIcon sx={{ mr: 1 }} />
        <Typography variant="h4" component="h1">
          Shopping Cart
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {!cart || cart.itemList.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <ShoppingCartIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Your cart is empty
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{ borderRadius: 2 }}
          >
            Continue Shopping
          </Button>
        </Card>
      ) : (
        <>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            <Box sx={{ flex: { md: 2 } }}>
              {cart.itemList.map((item) => (
                <Card key={item.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'center' }}>
                      <Box sx={{ width: { xs: '100%', sm: '25%' } }}>
                        <img
                          src={item.medicine.image}
                          alt={item.medicine.name}
                          style={{
                            width: '100%',
                            height: 100,
                            objectFit: 'cover',
                            borderRadius: 8
                          }}
                        />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="h6" component="h3">
                          {item.medicine.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.medicine.description}
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                          ${item.medicine.price.toFixed(2)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={updatingItem === item.id || item.quantity <= 1}
                          size="small"
                        >
                          <RemoveIcon />
                        </IconButton>
                        <TextField
                          value={item.quantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value) && value > 0) {
                              handleQuantityChange(item.id, value);
                            }
                          }}
                          size="small"
                          sx={{ width: 60, mx: 1 }}
                          inputProps={{ min: 1, style: { textAlign: 'center' } }}
                        />
                        <IconButton
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={updatingItem === item.id || item.quantity >= item.medicine.stockQuantity}
                          size="small"
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        Max: {item.medicine.stockQuantity} units
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="h6" color="primary">
                          ${(item.medicine.price * item.quantity).toFixed(2)}
                        </Typography>
                        <IconButton
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={removingItem === item.id}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>

            <Box sx={{ flex: { md: 1 }, minWidth: { md: 300 } }}>
              <Card sx={{ p: 3, position: 'sticky', top: 20 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Order Summary
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Items ({getTotalItems()}):</Typography>
                  <Typography>${calculateTotal().toFixed(2)}</Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6">Total:</Typography>
                  <Typography variant="h6" color="primary">
                    ${calculateTotal().toFixed(2)}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  startIcon={<PaymentIcon />}
                  onClick={() => setCheckoutDialogOpen(true)}
                >
                  Proceed to Checkout
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  color="error"
                  sx={{ borderRadius: 2 }}
                  onClick={() => setClearCartDialog(true)}
                >
                  Clear Cart
                </Button>
              </Card>
            </Box>
          </Box>

          <Dialog open={clearCartDialog} onClose={() => setClearCartDialog(false)}>
            <DialogTitle>Clear Cart</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to remove all items from your cart?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setClearCartDialog(false)}>Cancel</Button>
              <Button onClick={handleClearCart} color="error" variant="contained">
                Clear Cart
              </Button>
            </DialogActions>
          </Dialog>

          {/* Checkout Dialog */}
          <Dialog
            open={checkoutDialogOpen}
            onClose={() => setCheckoutDialogOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              Checkout Information
            </DialogTitle>
            <DialogContent>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Please provide your delivery information to complete your order.
              </Typography>
              
              <TextField
                fullWidth
                label="Delivery Address"
                multiline
                rows={3}
                value={checkoutForm.deliveryAddress}
                onChange={(e) => setCheckoutForm(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                margin="normal"
                required
              />
              
              <TextField
                fullWidth
                label="Phone Number"
                value={checkoutForm.phoneNumber}
                onChange={(e) => setCheckoutForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                margin="normal"
                required
              />

              <Box mt={3}>
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography>Total Amount:</Typography>
                  <Typography variant="h6" color="primary">
                    ${calculateTotal().toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setCheckoutDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCheckout}
              >
                Place Order
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Container>
  );
};

export default CartPage; 