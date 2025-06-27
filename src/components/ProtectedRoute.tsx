import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [], 
  redirectTo = '/login' 
}) => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getUser();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && user && !authService.hasAnyRole(allowedRoles)) {
    // Redirect to appropriate dashboard based on user's primary role
    const primaryRole = authService.getPrimaryRole();
    const roleRedirects: { [key: string]: string } = {
      ADMIN: '/admin',
      PHARMACIST: '/pharmacist',
      USER: '/customer'
    };
    return <Navigate to={roleRedirects[primaryRole || 'USER'] || '/'} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 