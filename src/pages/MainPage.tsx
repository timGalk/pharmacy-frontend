import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button,
  InputBase, Card, CardMedia,
  CardContent, Container, Box, useTheme, useMediaQuery,
  IconButton, Badge, Alert, Snackbar
} from '@mui/material';
import {
  Search as SearchIcon,
  AccountCircle,
  LocalPharmacy as LocalPharmacyIcon,
  ShoppingCart as ShoppingCartIcon,
  Article as ArticleIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { authService } from '../services/authService';
import { cartService } from '../services/cartService';
import ProductCard from '../components/ProductCard';
import RoleBasedNavigation from '../components/RoleBasedNavigation';
import CartPreview from '../components/CartPreview';
import RoleDebug from '../components/RoleDebug';
import type { Medicine, Cart } from '../types/CartDTO';

const HealthHubPharmacy = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState(0);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [cartQuantities, setCartQuantities] = useState<{ [medicineId: number]: number }>({});
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const user = authService.getUser();
  const isAuthenticated = authService.isAuthenticated();
  const isPharmacist = authService.hasRole('pharmacist');
  const isAdmin = authService.hasRole('admin');
  const isUser = authService.hasRole('user');
  const canUseCart = cartService.canUseCart();

  // Debug logging
  console.log('User:', user);
  console.log('Is Authenticated:', isAuthenticated);
  console.log('Is User:', isUser);
  console.log('Is Admin:', isAdmin);
  console.log('Is Pharmacist:', isPharmacist);
  console.log('Can Use Cart:', canUseCart);
  console.log('User Roles:', user?.roles);

  // More robust role checking - USER role can use cart
  const canAddToCart = isAuthenticated && !isPharmacist && !isAdmin && (isUser || canUseCart);

  const categories = [
    { name: 'Pain Relief', img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300' },
    { name: 'Antibiotics', img: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300' },
    { name: 'Vitamins', img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300' },
  ];

  const blogPosts = [
    { title: '5 Tips for Cold Season', snippet: 'Stay safe and healthy during flu season with these simple tips.', img: 'https://images.unsplash.com/photo-1588776814546-44d2bb6e95de?w=300' },
    { title: 'Daily Vitamins Guide', snippet: 'Learn which vitamins you really need each day.', img: 'https://images.unsplash.com/photo-1578496481135-adaaa4c7c1b0?w=300' },
  ];

  useEffect(() => {
    loadMedicines();
    if (isAuthenticated && canUseCart) {
      loadCartCount();
    }
  }, [isAuthenticated, canUseCart]);

  const loadMedicines = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/medicines');
      if (response.ok) {
        const data = await response.json();
        setMedicines(data);
      }
    } catch (error) {
      console.error('Failed to load medicines:', error);
    }
  };

  const loadCartCount = async () => {
    try {
      const userCart = await cartService.getOrCreateUserCart();
      const totalItems = userCart.itemList.reduce((total, item) => total + item.quantity, 0);
      setCartItems(totalItems);
      setCart(userCart);
      
      // Update cart quantities for each medicine
      const quantities: { [medicineId: number]: number } = {};
      userCart.itemList.forEach(item => {
        quantities[item.medicine.id] = item.quantity;
      });
      setCartQuantities(quantities);
    } catch (error) {
      console.error('Failed to load cart count:', error);
    }
  };

  const handleAddToCart = async (medicine: Medicine, quantity: number = 1) => {
    if (!isAuthenticated) {
      setSnackbar({
        open: true,
        message: 'Please log in to add items to cart',
        severity: 'error'
      });
      return;
    }

    if (isPharmacist || isAdmin) {
      setSnackbar({
        open: true,
        message: 'Only users can use cart functionality',
        severity: 'error'
      });
      return;
    }

    try {
      setLoading(true);
      
      // Get current cart to check existing quantity
      const cart = await cartService.getOrCreateUserCart();
      const existingItem = cart.itemList.find(item => item.medicine.id === medicine.id);
      const currentQuantity = existingItem ? existingItem.quantity : 0;
      const newQuantity = currentQuantity + quantity;
      
      // Validate against stock quantity
      if (newQuantity > medicine.stockQuantity) {
        setSnackbar({
          open: true,
          message: `Cannot add ${quantity} items. Only ${medicine.stockQuantity - currentQuantity} more units available.`,
          severity: 'error'
        });
        return;
      }
      
      await cartService.addItemToCart({
        cartId: cart.id,
        medicineId: medicine.id,
        quantity: quantity
      });
      
      // Update cart count
      await loadCartCount();
      
      setSnackbar({
        open: true,
        message: `${quantity} ${quantity === 1 ? 'unit' : 'units'} of ${medicine.name} added to cart!`,
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Failed to add item to cart',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async (itemId: number) => {
    try {
      const updatedCart = await cartService.removeItemFromCart(itemId);
      setCart(updatedCart);
      await loadCartCount();
      
      setSnackbar({
        open: true,
        message: 'Item removed from cart',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to remove item from cart',
        severity: 'error'
      });
    }
  };

  const handleClearCart = async () => {
    if (!cart) return;
    
    try {
      await cartService.clearCart(cart.id);
      setCart({ ...cart, itemList: [] });
      await loadCartCount();
      
      setSnackbar({
        open: true,
        message: 'Cart cleared successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to clear cart',
        severity: 'error'
      });
    }
  };

  const handleLoginClick = () => {
    if (isAuthenticated) {
      // Redirect to appropriate dashboard based on primary role
      const primaryRole = authService.getPrimaryRole();
      const roleRedirects: { [key: string]: string } = {
        admin: '/admin/dashboard',
        pharmacist: '/pharmacist/dashboard',
        customer: '/customer/dashboard'
      };
      navigate(roleRedirects[primaryRole || 'customer'] || '/home');
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    authService.logout();
    setCartItems(0);
    navigate('/home');
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f9f9f9' }}>
      <AppBar position="sticky" sx={{ bgcolor: '#fff', borderBottom: '1px solid #ddd' }} elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocalPharmacyIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" color="primary">HealthHub</Typography>
          </Box>
          {!isMobile && (
            <InputBase
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              startAdornment={<SearchIcon sx={{ mr: 1, color: 'grey.600' }} />}
              sx={{ px: 2, py: 0.5, bgcolor: '#eee', borderRadius: 2, width: 240 }}
            />
          )}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => navigate('/blog')}>
              <ArticleIcon color="action" />
            </IconButton>
            {canUseCart && (
              <IconButton onClick={() => navigate('/cart')}>
                <Badge badgeContent={cartItems} color="error">
                  <ShoppingCartIcon color="action" />
                </Badge>
              </IconButton>
            )}
            <Button
              variant="contained"
              onClick={isAuthenticated ? handleLogout : handleLoginClick}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                px: 3,
                py: 1,
                fontWeight: 600,
                bgcolor: '#4F46E5',
                fontSize: '14px',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#4338CA',
                  boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                },
              }}
            >
              {isAuthenticated ? `Sign Out (${authService.getFullName()})` : 'Sign In'}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 4 }}>
        {isAuthenticated && <RoleBasedNavigation />}
        {isAuthenticated && <RoleDebug />}
        
        <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>Categories</Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          {categories.map((cat, idx) => (
            <Box key={idx} sx={{ flex: 1 }}>
              <Card sx={{ borderRadius: 2 }}>
                <CardMedia component="img" height="140" image={cat.img} alt={cat.name} />
                <CardContent>
                  <Typography variant="body1" fontWeight={500}>{cat.name}</Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

        <Typography variant="h5" fontWeight={600} sx={{ mt: 5, mb: 2 }}>Available Medicines</Typography>
        {(isPharmacist || isAdmin) && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {isPharmacist 
              ? 'As a pharmacist, you can view medicines but cannot use cart functionality. Use your dashboard to manage inventory.'
              : 'As an admin, you can view medicines but cannot use cart functionality. Use your dashboard to manage the system.'
            }
          </Alert>
        )}
        
        {/* Debug panel - remove this in production */}
        {isAuthenticated && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Debug Info: Authenticated={isAuthenticated.toString()}, 
            User={isUser.toString()}, 
            Admin={isAdmin.toString()}, 
            Pharmacist={isPharmacist.toString()}, 
            CanUseCart={canUseCart.toString()}, 
            CanAddToCart={canAddToCart.toString()}
          </Alert>
        )}
        
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: 'repeat(2, 1fr)', 
              md: 'repeat(3, 1fr)' 
            }, 
            gap: 2,
            flex: 1
          }}>
            {medicines.map((medicine) => (
              <ProductCard
                key={medicine.id}
                medicine={medicine}
                onAddToCart={handleAddToCart}
                loading={loading}
                currentCartQuantity={cartQuantities[medicine.id] || 0}
                canAddToCart={canAddToCart}
              />
            ))}
          </Box>
          
          {canAddToCart && cart && (
            <Box sx={{ width: 300, display: { xs: 'none', lg: 'block' } }}>
              <CartPreview
                items={cart.itemList}
                onRemoveItem={handleRemoveFromCart}
                onViewCart={() => navigate('/cart')}
                onClearCart={handleClearCart}
              />
            </Box>
          )}
        </Box>

        <Typography variant="h5" fontWeight={600} sx={{ mt: 5, mb: 2 }}>Health Blog</Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          {blogPosts.map((post, idx) => (
            <Box key={idx} sx={{ flex: 1 }}>
              <Card sx={{ borderRadius: 2 }}>
                <CardMedia component="img" height="140" image={post.img} alt={post.title} />
                <CardContent>
                  <Typography variant="body1" fontWeight={500}>{post.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{post.snippet}</Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HealthHubPharmacy;