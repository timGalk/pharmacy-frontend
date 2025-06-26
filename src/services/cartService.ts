import type { Cart, AddItemToCartRequest, UpdateCartItemRequest } from '../types/CartDTO';
import { authService } from './authService';

const API_BASE_URL = 'http://localhost:8080/api/carts';

class CartService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
  }

  private validateUserRole(): void {
    const user = authService.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Check if user is a pharmacist or admin (only USER role can use carts)
    if (authService.hasRole('pharmacist') || authService.hasRole('admin')) {
      throw new Error('Only users can use cart functionality');
    }
  }

  async getCartByCartId(cartId: number): Promise<Cart> {
    this.validateUserRole();
    
    const response = await fetch(`${API_BASE_URL}/${cartId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch cart: ${response.status}`);
    }
    
    return response.json();
  }

  async getCartByUserId(userId: number): Promise<Cart> {
    this.validateUserRole();
    
    const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user cart: ${response.status}`);
    }
    
    return response.json();
  }

  async createCartForUser(userId: number): Promise<Cart> {
    this.validateUserRole();
    
    const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create cart: ${response.status}`);
    }
    
    return response.json();
  }

  async addItemToCart(request: AddItemToCartRequest): Promise<Cart> {
    this.validateUserRole();
    
    const response = await fetch(`${API_BASE_URL}/items`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to add item to cart: ${response.status}`);
    }
    
    return response.json();
  }

  async updateCartItemQuantity(itemId: number, request: UpdateCartItemRequest): Promise<Cart> {
    this.validateUserRole();
    
    const response = await fetch(`${API_BASE_URL}/items/${itemId}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update cart item: ${response.status}`);
    }
    
    return response.json();
  }

  async removeItemFromCart(itemId: number): Promise<Cart> {
    this.validateUserRole();
    
    const response = await fetch(`${API_BASE_URL}/items/${itemId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to remove item from cart: ${response.status}`);
    }
    
    return response.json();
  }

  async clearCart(cartId: number): Promise<Cart> {
    this.validateUserRole();
    
    const response = await fetch(`${API_BASE_URL}/${cartId}/items`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to clear cart: ${response.status}`);
    }
    
    return response.json();
  }

  // Helper method to get or create cart for current user
  async getOrCreateUserCart(): Promise<Cart> {
    this.validateUserRole();
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    try {
      // Try to get existing cart
      return await this.getCartByUserId(userId);
    } catch (error) {
      // If cart doesn't exist, create one
      return await this.createCartForUser(userId);
    }
  }

  // Check if current user can use cart functionality
  canUseCart(): boolean {
    try {
      console.log('CartService.canUseCart() - Checking permissions...');
      const user = authService.getUser();
      console.log('CartService.canUseCart() - User:', user);
      console.log('CartService.canUseCart() - User roles:', user?.roles);
      
      if (!user) {
        console.log('CartService.canUseCart() - No user found');
        return false;
      }
      
      const isPharmacist = authService.hasRole('pharmacist');
      const isAdmin = authService.hasRole('admin');
      const isUser = authService.hasRole('user');
      
      console.log('CartService.canUseCart() - Is User:', isUser);
      console.log('CartService.canUseCart() - Is Pharmacist:', isPharmacist);
      console.log('CartService.canUseCart() - Is Admin:', isAdmin);
      
      if (isPharmacist || isAdmin) {
        console.log('CartService.canUseCart() - User is pharmacist or admin, cannot use cart');
        return false;
      }
      
      if (isUser) {
        console.log('CartService.canUseCart() - User has USER role, can use cart');
        return true;
      }
      
      console.log('CartService.canUseCart() - User cannot use cart');
      return false;
    } catch (error) {
      console.error('CartService.canUseCart() - Error:', error);
      return false;
    }
  }
}

export const cartService = new CartService(); 