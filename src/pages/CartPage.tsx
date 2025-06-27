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
import { userService } from '../services/userService';
import type { Cart, CartItem } from '../types/CartDTO';
import { orderService } from '../services/orderService';
import type { CreateOrderRequest } from '../types/OrderDTO';
import type { UserProfile } from '../types/UserProfileDTO';

const CartPage = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [updatingItem, setUpdatingItem] = useState<number | null>(null);
  const [removingItem, setRemovingItem] = useState<number | null>(null);
  const [clearCartDialog, setClearCartDialog] = useState(false);
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    deliveryAddress: '',
    phoneNumber: ''
  });
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const cartData = await cartService.getOrCreateUserCart();
      setCart(cartData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async () => {
    try {
      setLoadingProfile(true);
      const profile = await userService.getCurrentUserProfile();
      setUserProfile(profile);
      // Pre-fill checkout form with user's profile data
      setCheckoutForm({
        deliveryAddress: profile.address || '',
        phoneNumber: profile.phoneNumber || ''
      });
    } catch (err) {
      console.error('Failed to load user profile:', err);
      // Don't show error to user, just use empty form
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      setUpdatingItem(itemId);
      setError(null);
      await cartService.updateCartItemQuantity(itemId, { quantity: newQuantity });
      await loadCart();
      setSuccess('Cart updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update cart');
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      setRemovingItem(itemId);
      setError(null);
      await cartService.removeItemFromCart(itemId);
      await loadCart();
      setSuccess('Item removed from cart!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item');
    } finally {
      setRemovingItem(null);
    }
  };

  const handleClearCart = async () => {
    if (!cart) return;
    
    try {
      setError(null);
      await cartService.clearCart(cart.id);
      await loadCart();
      setSuccess('Cart cleared successfully!');
      setTimeout(() => setSuccess(null), 3000);
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
      setSuccess('Order placed successfully! You can view your orders in the Orders section.');
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
    }
  };

  const handleOpenCheckout = () => {
    loadUserProfile(); // Load user profile when opening checkout
    setCheckoutDialogOpen(true);
  };

  const calculateTotal = () => {
    if (!cart || !cart.itemList) return 0;
    return cart.itemList.reduce((total: number, item: CartItem) => total + (item.medicine.price * item.quantity), 0);
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

  if (!cart || !cart.itemList || cart.itemList.length === 0) {
    return (
      <Box p={3}>
        <Box display="flex" alignItems="center" mb={3}>
          <ArrowBackIcon sx={{ mr: 1, cursor: 'pointer' }} onClick={() => navigate('/')} />
          <Typography variant="h4">Shopping Cart</Typography>
        </Box>
        
        <Card>
          <CardContent>
            <Box textAlign="center" py={4}>
              <ShoppingCartIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Your Cart is Empty
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Add some medicines to your cart to get started.
              </Typography>
              <Button variant="contained" color="primary" onClick={() => navigate('/')}>
                Continue Shopping
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" alignItems="center" mb={3}>
        <ArrowBackIcon sx={{ mr: 1, cursor: 'pointer' }} onClick={() => navigate('/')} />
        <Typography variant="h4">Shopping Cart</Typography>
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

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
        <Box>
          {cart.itemList.map((item) => (
            <Card key={item.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'auto 1fr auto' }, gap: 2, alignItems: 'center' }}>
                  <Box>
                    <img
                      src={item.medicine.image}
                      alt={item.medicine.name}
                      style={{
                        width: '100%',
                        height: 120,
                        objectFit: 'cover',
                        borderRadius: 8
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {item.medicine.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {item.medicine.description}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {formatPrice(item.medicine.price)}
                    </Typography>
                  </Box>
                  <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || updatingItem === item.id}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography variant="body1" sx={{ minWidth: 30, textAlign: 'center' }}>
                        {updatingItem === item.id ? <CircularProgress size={20} /> : item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.medicine.stockQuantity || updatingItem === item.id}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Stock: {item.medicine.stockQuantity}
                    </Typography>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={removingItem === item.id}
                    >
                      {removingItem === item.id ? <CircularProgress size={20} /> : <DeleteIcon />}
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Subtotal ({cart.itemList.length} items):</Typography>
                <Typography>{formatPrice(calculateTotal())}</Typography>
              </Box>
              
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography>Shipping:</Typography>
                <Typography>Free</Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box display="flex" justifyContent="space-between" mb={3}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary">
                  {formatPrice(calculateTotal())}
                </Typography>
              </Box>

              <Box display="flex" flexDirection="column" gap={1}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  startIcon={<PaymentIcon />}
                  onClick={handleOpenCheckout}
                >
                  Proceed to Checkout
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  onClick={() => setClearCartDialog(true)}
                >
                  Clear Cart
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Clear Cart Dialog */}
      <Dialog
        open={clearCartDialog}
        onClose={() => setClearCartDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Clear Cart
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to clear your cart? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearCartDialog(false)}>
            Cancel
          </Button>
          <Button
            color="error"
            onClick={() => {
              setClearCartDialog(false);
              handleClearCart();
            }}
          >
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
          
          {loadingProfile && (
            <Box display="flex" justifyContent="center" py={2}>
              <CircularProgress />
            </Box>
          )}
          
          <TextField
            fullWidth
            label="Delivery Address"
            multiline
            rows={3}
            value={checkoutForm.deliveryAddress}
            onChange={(e) => setCheckoutForm(prev => ({ ...prev, deliveryAddress: e.target.value }))}
            margin="normal"
            required
            disabled={loadingProfile}
          />
          
          <TextField
            fullWidth
            label="Phone Number"
            value={checkoutForm.phoneNumber}
            onChange={(e) => setCheckoutForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
            margin="normal"
            required
            disabled={loadingProfile}
          />

          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography>Total Amount:</Typography>
              <Typography variant="h6" color="primary">
                {formatPrice(calculateTotal())}
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
            disabled={loadingProfile}
          >
            Place Order
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CartPage; 