import type { UserProfile, UpdateProfileRequest, ChangePasswordRequest } from '../types/UserProfileDTO';

const API_BASE_URL = 'http://localhost:8080/api';

export const userService = {
  // Get user profile by ID
  async getUserById(userId: number): Promise<UserProfile> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch user profile');
    }

    return response.json();
  },

  // Get current user profile (using stored user data as fallback)
  async getCurrentUserProfile(): Promise<UserProfile> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    // First try to get from stored user data
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.id) {
      // Try to get fresh data from API
      try {
        return await this.getUserById(user.id);
      } catch (error) {
        console.warn('Failed to fetch from API, using stored data:', error);
        // Return stored user data as fallback
        return {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          address: user.address || '',
          age: user.age || 0,
          email: user.email,
          phoneNumber: user.phoneNumber || '',
          roles: user.roles || [],
          active: user.active !== false,
          createdAt: user.createdAt || new Date().toISOString(),
          updatedAt: user.updatedAt || new Date().toISOString()
        };
      }
    }

    throw new Error('User ID not found');
  },

  // Update user profile
  async updateProfile(profileData: UpdateProfileRequest): Promise<UserProfile> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to update profile');
    }

    return response.json();
  },

  // Change password
  async changePassword(passwordData: ChangePasswordRequest): Promise<{ message: string }> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/users/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(passwordData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to change password');
    }

    return response.json();
  },

  // Get all users (for admin)
  async getAllUsers(): Promise<UserProfile[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch users');
    }

    return response.json();
  },

  // Update user status (for admin)
  async updateUserStatus(userId: number, active: boolean): Promise<UserProfile> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/users/${userId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ active })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to update user status');
    }

    return response.json();
  }
}; 