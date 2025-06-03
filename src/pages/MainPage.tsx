import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  InputBase,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Container,
  IconButton,
  Link,
  Box,
  useTheme,
  useMediaQuery,
  alpha,
  Stack,
  Divider,
  TextField,
} from '@mui/material';
import {
  Search as SearchIcon,
  Menu as MenuIcon,
  AccountCircle,
  LocalPharmacy as LocalPharmacyIcon,
  Chat as ChatIcon,
  CloudUpload as CloudUploadIcon,
  LocalShipping as LocalShippingIcon,
  Favorite as FavoriteIcon,
  Star as StarIcon,
  ArrowForward as ArrowForwardIcon,
  Send as SendIcon,
  LocalHospital as LocalHospitalIcon,
  FitnessCenter as FitnessCenterIcon,
  Restaurant as RestaurantIcon,
} from '@mui/icons-material';

const HealthHubPharmacy = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const categories = [
    { name: 'Pain Relief', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop' },
    { name: 'Antibiotics', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop' },
    { name: 'Vitamins', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop' },
    { name: 'Skin Care', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop' },
    { name: 'Digestive Health', image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?q=80&w=1998&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Respiratory Care', image: 'https://images.unsplash.com/photo-1737984954770-7ddbe3fe3698?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  ];

  const featuredProducts = [
    {
      name: 'Vitamin D3 1000IU',
      price: '$19.99',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop',
      category: 'Vitamins',
    },
    {
      name: 'Omega-3 Fish Oil',
      price: '$24.99',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop',
      category: 'Supplements',
    },
    {
      name: 'Probiotic Complex',
      price: '$29.99',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop',
      category: 'Digestive Health',
    },
  ];

  const healthTips = [
    {
      title: 'Stay Hydrated',
      description: 'Drink at least 8 glasses of water daily for optimal health.',
      icon: <LocalHospitalIcon />,
    },
    {
      title: 'Exercise Regularly',
      description: '30 minutes of moderate exercise daily can improve your health.',
      icon: <FitnessCenterIcon />,
    },
    {
      title: 'Eat Balanced Diet',
      description: 'Include fruits, vegetables, and whole grains in your diet.',
      icon: <RestaurantIcon />,
    },
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #e3f2fd 0%, #90caf9 100%)',
      fontFamily: 'Roboto, Arial, sans-serif',
    }}>
      <AppBar 
        position="sticky" 
        color="default" 
        elevation={0} 
        sx={{ 
          borderBottom: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'blur(8px)',
          bgcolor: alpha('#fff', 0.8),
        }}
      >
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalPharmacyIcon color="primary" sx={{ fontSize: 32 }} />
            <Typography 
              variant="h6" 
              color="primary" 
              sx={{ 
                fontWeight: 700,
                letterSpacing: '-0.5px',
              }}
            >
              HealthHub
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          {!isMobile && (
            <InputBase
              placeholder="Search medicines..."
              startAdornment={<SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />}
              sx={{
                bgcolor: alpha('#f1f5f9', 0.8),
                borderRadius: 2,
                px: 2,
                py: 0.5,
                width: 300,
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: '#f1f5f9',
                },
                '&:focus-within': {
                  bgcolor: '#fff',
                  boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
                },
              }}
            />
          )}
          <Button
            variant="contained"
            startIcon={<AccountCircle />}
            sx={{ 
              ml: 2,
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              fontWeight: 600,
              background: 'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)',
              boxShadow: '0 4px 20px 0 rgba(25, 118, 210, 0.15)',
              transition: 'all 0.3s',
              '&:hover': {
                background: 'linear-gradient(90deg, #1565c0 0%, #42a5f5 100%)',
                boxShadow: '0 6px 24px 0 rgba(25, 118, 210, 0.2)',
              },
            }}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Paper 
          elevation={8}
          sx={{ 
            p: 4, 
            mb: 6, 
            bgcolor: '#fff',
            borderRadius: 5,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <InputBase
            fullWidth
            placeholder="Search for medicines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startAdornment={<SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />}
            sx={{
              bgcolor: '#f8fafc',
              borderRadius: 2,
              px: 2,
              py: 1.5,
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: '#f1f5f9',
              },
              '&:focus-within': {
                bgcolor: '#fff',
                boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
              },
            }}
          />
        </Paper>

        <Typography 
          variant="h4" 
          sx={{ 
            mb: 4, 
            fontWeight: 700,
            color: '#1976d2',
            letterSpacing: '-0.5px',
          }}
        >
          Categories
        </Typography>

        <Grid container spacing={3} sx={{ mb: 8 }}>
          {categories.map((category, index) => (
            <Grid item xs={6} sm={4} md={2} key={index}>
              <Card 
                elevation={8}
                sx={{ 
                  bgcolor: '#fff',
                  borderRadius: 5,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 32px 0 rgba(31, 38, 135, 0.15)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="160"
                  image={category.image}
                  alt={category.name}
                  sx={{ 
                    objectFit: 'cover',
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                  }}
                />
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600,
                      color: 'text.primary',
                    }}
                  >
                    {category.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography 
          variant="h4" 
          sx={{ 
            mb: 4, 
            fontWeight: 700,
            color: '#1976d2',
            letterSpacing: '-0.5px',
          }}
        >
          Featured Products
        </Typography>

        <Grid container spacing={3} sx={{ mb: 8 }}>
          {featuredProducts.map((product, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                elevation={8}
                sx={{ 
                  bgcolor: '#fff',
                  borderRadius: 5,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 32px 0 rgba(31, 38, 135, 0.15)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                  sx={{ 
                    objectFit: 'cover',
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                  }}
                />
                <CardContent sx={{ p: 3 }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600,
                      color: 'text.primary',
                      mb: 1,
                    }}
                  >
                    {product.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {product.category}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <StarIcon sx={{ color: '#ffc107', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {product.rating}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="h6" 
                    color="primary"
                    sx={{ fontWeight: 700 }}
                  >
                    {product.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography 
          variant="h4" 
          sx={{ 
            mb: 4, 
            fontWeight: 700,
            color: '#1976d2',
            letterSpacing: '-0.5px',
          }}
        >
          Services
        </Typography>

        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={3} 
          sx={{ mb: 8 }}
        >
          {[
            { icon: <ChatIcon />, label: 'Online Consultations' },
            { icon: <CloudUploadIcon />, label: 'Prescription Upload' },
            { icon: <LocalShippingIcon />, label: 'Delivery Options' },
          ].map((service, index) => (
            <Button
              key={index}
              variant="outlined"
              startIcon={service.icon}
              sx={{ 
                borderRadius: 3,
                textTransform: 'none',
                px: 4,
                py: 2,
                borderWidth: 2,
                fontWeight: 600,
                fontSize: 16,
                transition: 'all 0.3s',
                '&:hover': {
                  borderWidth: 2,
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(25, 118, 210, 0.15)',
                  background: 'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)',
                  color: '#fff',
                },
              }}
            >
              {service.label}
            </Button>
          ))}
        </Stack>

        <Typography 
          variant="h4" 
          sx={{ 
            mb: 4, 
            fontWeight: 700,
            color: '#1976d2',
            letterSpacing: '-0.5px',
          }}
        >
          Health Tips
        </Typography>

        <Grid container spacing={3} sx={{ mb: 8 }}>
          {healthTips.map((tip, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Paper
                elevation={8}
                sx={{
                  p: 3,
                  borderRadius: 5,
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 32px 0 rgba(31, 38, 135, 0.15)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      bgcolor: 'primary.main',
                      borderRadius: 2,
                      p: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {tip.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {tip.title}
                  </Typography>
                </Box>
                <Typography color="text.secondary">
                  {tip.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 5,
            background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
            color: '#fff',
            mb: 8,
          }}
        >
          <Stack spacing={3} alignItems="center" textAlign="center">
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Stay Updated with Health Tips
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: 600 }}>
              Subscribe to our newsletter for the latest health tips, product updates, and exclusive offers.
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ width: '100%', maxWidth: 500 }}
            >
              <TextField
                fullWidth
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  bgcolor: alpha('#fff', 0.1),
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': {
                      borderColor: alpha('#fff', 0.3),
                    },
                    '&:hover fieldset': {
                      borderColor: alpha('#fff', 0.5),
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#fff',
                    },
                  },
                }}
              />
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                sx={{
                  bgcolor: '#fff',
                  color: 'primary.main',
                  px: 4,
                  '&:hover': {
                    bgcolor: alpha('#fff', 0.9),
                  },
                }}
              >
                Subscribe
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>

      <Box 
        component="footer" 
        sx={{ 
          bgcolor: alpha('#fff', 0.8),
          borderTop: '1px solid',
          borderColor: 'divider',
          py: 6,
          mt: 'auto',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Container maxWidth="lg">
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={6} 
            justifyContent="center" 
            alignItems="center"
            sx={{ mb: 3 }}
          >
            <Link 
              href="#" 
              color="text.secondary" 
              underline="hover"
              sx={{ 
                fontWeight: 600,
                transition: 'color 0.2s',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              About
            </Link>
            <Link 
              href="#" 
              color="text.secondary" 
              underline="hover"
              sx={{ 
                fontWeight: 600,
                transition: 'color 0.2s',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              Help
            </Link>
            <Link 
              href="#" 
              color="text.secondary" 
              underline="hover"
              sx={{ 
                fontWeight: 600,
                transition: 'color 0.2s',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              Terms
            </Link>
          </Stack>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            align="center"
            sx={{ fontWeight: 600 }}
          >
            © 2024 HealthHub Pharmacy
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default HealthHubPharmacy;
