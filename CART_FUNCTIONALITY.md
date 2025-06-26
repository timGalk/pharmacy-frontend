# Cart Functionality Implementation

This document describes the cart functionality implemented for the pharmacy frontend application.

## Overview

The cart functionality allows users to:
- Add medicines to their cart
- View their cart contents
- Update item quantities
- Remove items from cart
- Clear the entire cart
- See real-time cart count in the navigation
- **Stock validation to prevent over-ordering**
- **Role-based access control**

## Role-Based Access Control

### **User Role Restrictions**
- **Customers**: Full cart access - can add, view, and manage cart items
- **Admins**: **No cart access** - cannot use cart functionality (system management only)
- **Pharmacists**: **No cart access** - cannot use cart functionality (inventory management only)

### **Access Control Implementation**
- Cart API calls are blocked for pharmacists and admins at the service level
- Cart UI elements are hidden for pharmacists and admins
- Role-based route protection prevents unauthorized access
- Clear error messages when non-customers attempt cart operations

### **Access Control Matrix:**

| Role | Cart Access | Cart Icon | Add to Cart | Cart Page | Dashboard Access |
|------|-------------|-----------|-------------|-----------|------------------|
| **Customer** | ✅ Full | ✅ Visible | ✅ Available | ✅ Accessible | Customer Dashboard |
| **Admin** | ❌ None | ❌ Hidden | ❌ Blocked | ❌ Blocked | Admin Dashboard |
| **Pharmacist** | ❌ None | ❌ Hidden | ❌ Blocked | ❌ Blocked | Pharmacist Dashboard |

## Components

### 1. Cart Types (`src/types/CartDTO.tsx`)
Defines TypeScript interfaces for cart-related data:
- `Medicine`: Medicine information
- `CartItem`: Individual cart item with medicine and quantity
- `Cart`: Complete cart with user ID and item list
- `AddItemToCartRequest`: Request payload for adding items
- `UpdateCartItemRequest`: Request payload for updating quantities

### 2. Cart Service (`src/services/cartService.ts`)
Handles all cart-related API operations with role validation:
- **Role validation**: Blocks pharmacists and admins from all cart operations
- `getCartByCartId()`: Get cart by cart ID
- `getCartByUserId()`: Get cart by user ID
- `createCartForUser()`: Create new cart for user
- `addItemToCart()`: Add item to cart
- `updateCartItemQuantity()`: Update item quantity
- `removeItemFromCart()`: Remove item from cart
- `clearCart()`: Clear all items from cart
- `getOrCreateUserCart()`: Helper method to get or create user cart
- `canUseCart()`: Check if current user can use cart functionality

### 3. Cart Page (`src/pages/CartPage.tsx`)
Main cart interface with role-based access:
- **Pharmacist restriction**: Shows error message for pharmacists
- Display cart items with images, names, descriptions, and prices
- Quantity controls with increment/decrement buttons
- **Stock validation preventing quantity updates beyond available stock**
- Remove individual items
- Clear entire cart with confirmation dialog
- Order summary with total calculation
- Responsive design using Box components (avoiding MUI v7 Grid issues)

### 4. Product Card (`src/components/ProductCard.tsx`)
Reusable component for displaying medicines with role-based features:
- Medicine image, name, description, and price
- **Dynamic "Add to Cart" button with role and stock validation**
- **Button hidden for pharmacists**
- **Stock status indicators (In Stock, Low Stock, Out of Stock)**
- **Current cart quantity display**
- **Button disabled when max quantity reached or out of stock**
- Consistent styling and layout

### 5. Updated Main Page (`src/pages/MainPage.tsx`)
Enhanced with cart functionality and role-based access:
- **Role-based navigation component for authenticated users**
- Real-time cart count in navigation badge (hidden for pharmacists)
- Load medicines from backend API
- **Stock validation before adding items to cart**
- **Role validation preventing pharmacists from adding to cart**
- Add medicines to cart with success/error notifications
- **Track current cart quantities for each medicine**
- **Informational alert for pharmacists about cart restrictions**
- Responsive grid layout using CSS Grid (avoiding MUI v7 Grid issues)

### 6. Role-Based Navigation (`src/components/RoleBasedNavigation.tsx`)
New component providing role-specific navigation:
- **Welcome message with user name and role**
- **Role-specific dashboard buttons**
- **Descriptive text for each role's capabilities**
- Only shows for authenticated users

## Stock Validation Features

### **Preventing Over-Ordering**
- Users cannot add more items than available stock
- Real-time validation against current cart quantity + stock quantity
- Clear error messages when stock limits are reached

### **Visual Indicators**
- **Stock Status Chips**: Show "In Stock", "Low Stock" (≤5 units), or "Out of Stock"
- **Button States**: 
  - "Add to Cart" - Normal state
  - "Max Quantity" - When cart quantity equals stock
  - "Out of Stock" - When stock is 0
  - "Not Available" - For pharmacists
- **Current Cart Quantity**: Shows how many units are already in cart

### **Cart Management Validation**
- Increment buttons disabled when at maximum stock quantity
- Quantity input validation against stock limits
- Error messages for invalid quantity updates

## API Integration

The cart functionality integrates with the backend cart API endpoints:

- `GET /api/carts/{cartId}` - Get cart by ID
- `GET /api/carts/user/{userId}` - Get cart by user ID
- `POST /api/carts/user/{userId}` - Create cart for user
- `POST /api/carts/items` - Add item to cart
- `PATCH /api/carts/items/{itemId}` - Update item quantity
- `DELETE /api/carts/items/{itemId}` - Remove item from cart
- `DELETE /api/carts/{cartId}/items` - Clear cart

## Authentication & Authorization

- Cart operations require user authentication
- JWT tokens are automatically included in API requests
- Unauthenticated users are prompted to log in when trying to add items
- **Role-based access control prevents unauthorized cart usage**
- **Only customers can use cart functionality**

## Features

### Real-time Cart Count
- Cart badge in navigation shows current item count
- Updates automatically when items are added/removed
- Resets to 0 when user logs out
- **Hidden for non-customers**

### Role-Based Access
- **Customers**: Full cart functionality
- **Admins**: No cart access with clear messaging
- **Pharmacists**: No cart access with clear messaging

### Stock Management
- **Prevents users from exceeding available stock**
- **Real-time stock validation on both main page and cart page**
- **Visual feedback for stock status and limits**
- **Automatic button state management based on stock availability**

### User Experience
- Success/error notifications for cart operations
- Loading states during API calls
- Confirmation dialogs for destructive actions
- Responsive design for mobile and desktop
- **Clear feedback when stock limits are reached**
- **Role-specific navigation and messaging**

### Error Handling
- Graceful handling of API errors
- User-friendly error messages
- Fallback behavior when cart operations fail
- **Stock validation error messages**
- **Role-based access error messages**

## Usage

1. **Adding Items**: Users can click "Add to Cart" on any medicine card (if stock available and role allows)
2. **Viewing Cart**: Click the cart icon in the navigation (only available for customers)
3. **Managing Cart**: Use quantity controls or remove buttons in cart page
4. **Stock Awareness**: Users can see stock status and current cart quantities
5. **Role Navigation**: Use role-specific dashboard buttons for additional functionality
6. **Checkout**: "Proceed to Checkout" button (placeholder for future implementation)

## Technical Notes

- Uses Material-UI v7 with Box components instead of Grid to avoid compatibility issues
- TypeScript interfaces ensure type safety
- Responsive design using CSS Grid and Flexbox
- JWT authentication integration with automatic token handling
- **Real-time stock validation with user-friendly feedback**
- **State management for cart quantities and stock status**
- **Role-based access control with service-level validation**
- **Protected routes with role-specific permissions**