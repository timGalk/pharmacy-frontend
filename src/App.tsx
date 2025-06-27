import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navigation from './components/Navigation';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import ResgisterPage from './pages/ResgisterPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminPage from './pages/AdminPage';
import PharmacistPage from './pages/PharmacistPage';
import CustomerDashboard from './pages/CustomerDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import RoleDebug from './components/RoleDebug';
import { authService } from './services/authService';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<ResgisterPage />} />
        <Route path="/debug" element={<RoleDebug />} />
        
        {/* Protected routes with role-based access */}
        <Route 
          path="/cart" 
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/orders" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'PHARMACIST']}>
              <AdminOrdersPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/pharmacist" 
          element={
            <ProtectedRoute allowedRoles={['PHARMACIST']}>
              <PharmacistPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/customer" 
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <CustomerDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
