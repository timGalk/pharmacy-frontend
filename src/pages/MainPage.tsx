import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button,
  InputBase, Grid, Card, CardMedia,
  CardContent, Container, Box, useTheme, useMediaQuery,
  IconButton, Badge
} from '@mui/material';
import {
  Search as SearchIcon,
  AccountCircle,
  LocalPharmacy as LocalPharmacyIcon,
  ShoppingCart as ShoppingCartIcon,
  Article as ArticleIcon
} from '@mui/icons-material';

const HealthHubPharmacy = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState(2); // Mock number of items
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const categories = [
    { name: 'Pain Relief', img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300' },
    { name: 'Antibiotics', img: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300' },
    { name: 'Vitamins', img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300' },
  ];

  const featuredProducts = [
    { name: 'Ibuprofen 400mg', img: 'https://images.unsplash.com/photo-1603398938378-4b2b20f3c69a?w=300', price: '$8.99' },
    { name: 'Vitamin D3', img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300', price: '$12.50' },
  ];

  const blogPosts = [
    { title: '5 Tips for Cold Season', snippet: 'Stay safe and healthy during flu season with these simple tips.', img: 'https://images.unsplash.com/photo-1588776814546-44d2bb6e95de?w=300' },
    { title: 'Daily Vitamins Guide', snippet: 'Learn which vitamins you really need each day.', img: 'https://images.unsplash.com/photo-1578496481135-adaaa4c7c1b0?w=300' },
  ];

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
            <IconButton onClick={() => navigate('/cart')}>
              <Badge badgeContent={cartItems} color="error">
                <ShoppingCartIcon color="action" />
              </Badge>
            </IconButton>
            <Button
              variant="contained"
              startIcon={<AccountCircle />}
              onClick={() => navigate('/login')}
              sx={{ ml: 2, borderRadius: 3, textTransform: 'none' }}
            >
              Login
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 4 }}>
        <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>Categories</Typography>
        <Grid container spacing={2}>
          {categories.map((cat, idx) => (
            <Grid item xs={12} sm={4} key={idx}>
              <Card sx={{ borderRadius: 2 }}>
                <CardMedia component="img" height="140" image={cat.img} alt={cat.name} />
                <CardContent>
                  <Typography variant="body1" fontWeight={500}>{cat.name}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h5" fontWeight={600} sx={{ mt: 5, mb: 2 }}>Featured Products</Typography>
        <Grid container spacing={2}>
          {featuredProducts.map((prod, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card sx={{ borderRadius: 2 }}>
                <CardMedia component="img" height="140" image={prod.img} alt={prod.name} />
                <CardContent>
                  <Typography variant="body1" fontWeight={500}>{prod.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{prod.price}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h5" fontWeight={600} sx={{ mt: 5, mb: 2 }}>Health Blog</Typography>
        <Grid container spacing={2}>
          {blogPosts.map((post, idx) => (
            <Grid item xs={12} sm={6} key={idx}>
              <Card sx={{ borderRadius: 2 }}>
                <CardMedia component="img" height="140" image={post.img} alt={post.title} />
                <CardContent>
                  <Typography variant="body1" fontWeight={500}>{post.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{post.snippet}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HealthHubPharmacy;