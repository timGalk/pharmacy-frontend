import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  age: number;
  email: string;
  phoneNumber: string;
  roles: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Function to decode JWT token (without verification for now)
function decodeJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>(`${API_URL}/login`, credentials);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        
        // Get full user profile
        try {
          const userResponse = await axios.get(`${API_URL}/profile`, {
            headers: {
              'Authorization': `Bearer ${response.data.token}`
            }
          });
          
          if (userResponse.data) {
            localStorage.setItem('user', JSON.stringify(userResponse.data));
          }
        } catch (profileError) {
          console.warn('Could not fetch user profile:', profileError);
          // Fallback to JWT data
          const decodedToken = decodeJWT(response.data.token);
          if (decodedToken) {
            const user: User = {
              id: parseInt(decodedToken.sub),
              firstName: decodedToken.firstName || 'User',
              lastName: decodedToken.lastName || '',
              address: decodedToken.address || '',
              age: decodedToken.age || 0,
              email: decodedToken.email,
              phoneNumber: decodedToken.phoneNumber || '',
              roles: decodedToken.roles || [],
              active: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            localStorage.setItem('user', JSON.stringify(user));
          }
        }
        
        return response.data;
      } else {
        throw new Error('No token received from server');
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Login failed');
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getUser(): User | null {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;
      
      const user = JSON.parse(userStr);
      // Validate that we have the expected user structure
      if (user && typeof user === 'object' && user.id && user.email && user.roles) {
        return user;
      }
      return null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      // Clear invalid data
      localStorage.removeItem('user');
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getUser();
  },

  // Get the primary role (first role in the array)
  getPrimaryRole(): string | null {
    const user = this.getUser();
    return user?.roles?.[0] || null;
  },

  // Check if user has a specific role
  hasRole(role: string): boolean {
    const user = this.getUser();
    if (!user?.roles) return false;
    return user.roles.some(r => r.toLowerCase() === role.toLowerCase());
  },

  // Check if user has any of the specified roles
  hasAnyRole(roles: string[]): boolean {
    const user = this.getUser();
    if (!user?.roles) return false;
    return user.roles.some(userRole => 
      roles.some(role => userRole.toLowerCase() === role.toLowerCase())
    );
  },

  // Get user's full name
  getFullName(): string {
    const user = this.getUser();
    return user ? `${user.firstName} ${user.lastName}` : '';
  },

  // Debug method to check what's in localStorage
  debugStorage() {
    console.log('Token:', localStorage.getItem('token'));
    console.log('User string:', localStorage.getItem('user'));
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      console.log('Parsed user:', user);
    } catch (error) {
      console.error('Error parsing user:', error);
    }
  }
}; 