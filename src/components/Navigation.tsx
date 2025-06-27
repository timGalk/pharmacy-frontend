import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Chip,
} from '@mui/material';
import {
  AccountCircle,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getUser();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDashboard = () => {
    const primaryRole = authService.getPrimaryRole();
    const roleRedirects: { [key: string]: string } = {
      admin: '/admin/dashboard',
      pharmacist: '/pharmacist/dashboard',
      customer: '/customer/dashboard'
    };
    navigate(roleRedirects[primaryRole || 'customer'] || '/home');
    handleClose();
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/home');
    handleClose();
  };

  if (!user) return null;

  return (
    <AppBar position="static" sx={{ bgcolor: '#fff', color: '#333' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          HealthHub Pharmacy
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Welcome, {authService.getFullName()}
          </Typography>
          <Chip 
            label={authService.getPrimaryRole()?.toUpperCase() || 'USER'} 
            size="small" 
            color="primary" 
            variant="outlined" 
          />
          <IconButton
            size="large"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleDashboard}>
              <DashboardIcon sx={{ mr: 1 }} />
              Dashboard
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <PersonIcon sx={{ mr: 1 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
          {authService.isAuthenticated() && (
            <>
              {authService.hasRole('USER') && (
                <>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/cart"
                    startIcon={<ShoppingCartIcon />}
                  >
                    Cart {authService.getCartCount() > 0 && `(${authService.getCartCount()})`}
                  </Button>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/orders"
                    startIcon={<ShoppingCartIcon />}
                  >
                    My Orders
                  </Button>
                </>
              )}
              <Button
                color="inherit"
                component={Link}
                to="/profile"
              >
                Profile
              </Button>
              {(authService.hasRole('ADMIN') || authService.hasRole('PHARMACIST')) && (
                <Button
                  color="inherit"
                  component={Link}
                  to="/admin/orders"
                >
                  Manage Orders
                </Button>
              )}
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation; 