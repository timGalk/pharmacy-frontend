# Order and Profile Functionality

This document describes the order management system and user profile functionality implemented in the pharmacy frontend application.

## Order System

### Overview
The order system allows users to create orders from their cart and manage order status. It includes role-based access control where:
- **Users (USER role)**: Can create orders, view their own orders, and cancel pending orders
- **Admins and Pharmacists**: Can view all orders and update order status

### Order Types and Interfaces

#### OrderItem
```typescript
interface OrderItem {
  id: number;
  medicine: {
    id: number;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    expirationDate: string;
    image: string;
  };
  quantity: number;
  price: number;
}
```

#### Order
```typescript
interface Order {
  id: number;
  userId: number;
  orderItems: OrderItem[];
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  orderDate: string;
  deliveryAddress: string;
  phoneNumber: string;
}
```

### Order Status Flow
1. **PENDING**: Order created, waiting for confirmation
2. **CONFIRMED**: Order confirmed by admin/pharmacist
3. **SHIPPED**: Order shipped to customer
4. **DELIVERED**: Order delivered to customer
5. **CANCELLED**: Order cancelled (can only be cancelled when PENDING)

### API Endpoints

#### Order Service (`src/services/orderService.ts`)
- `createOrder(orderData)`: Create order from cart
- `getUserOrders()`: Get current user's orders
- `getAllOrders()`: Get all orders (admin/pharmacist only)
- `getOrderById(orderId)`: Get specific order details
- `updateOrderStatus(orderId, statusData)`: Update order status (admin/pharmacist only)
- `cancelOrder(orderId)`: Cancel order (user only)

### Components

#### OrdersPage (`src/pages/OrdersPage.tsx`)
- Displays user's order history
- Shows order status with color-coded chips
- Allows viewing detailed order information
- Enables cancellation of pending orders
- Responsive design with Material-UI components

#### AdminOrdersPage (`src/pages/AdminOrdersPage.tsx`)
- Displays all orders in a table format
- Allows admins/pharmacists to view order details
- Provides status update functionality
- Shows order statistics and management tools

#### CartPage Integration
- Added checkout functionality to create orders
- Collects delivery address and phone number
- Validates form data before order creation
- Clears cart after successful order placement

## Profile System

### Overview
The profile system allows users to view and edit their personal information, including all fields from the UserCreateDTO structure.

### Profile Types and Interfaces

#### UserProfile
```typescript
interface UserProfile {
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
```

#### UpdateProfileRequest
```typescript
interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  address: string;
  age: number;
  email: string;
  phoneNumber: string;
}
```

#### ChangePasswordRequest
```typescript
interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
```

### API Endpoints

#### User Service (`src/services/userService.ts`)
- `getUserProfile()`: Get current user's profile
- `updateProfile(profileData)`: Update user profile
- `changePassword(passwordData)`: Change user password
- `getAllUsers()`: Get all users (admin only)
- `updateUserStatus(userId, active)`: Update user status (admin only)

### Components

#### ProfilePage (`src/pages/ProfilePage.tsx`)
- Displays user profile information
- Allows editing of personal details
- Provides password change functionality
- Shows user roles and account status
- Responsive design with Material-UI components

### Profile Features
- **Personal Information**: First name, last name, address, age, email, phone number
- **Account Information**: User roles, account status, member since date
- **Password Management**: Secure password change with current password verification
- **Form Validation**: Client-side validation for all input fields
- **Success/Error Feedback**: User-friendly notifications for all operations

## Navigation Integration

### Updated Navigation (`src/components/Navigation.tsx`)
- Added "Profile" link for all authenticated users
- Added "My Orders" link for users with USER role
- Added "Manage Orders" link for admins and pharmacists
- Cart count display in navigation

### Role-Based Navigation (`src/components/RoleBasedNavigation.tsx`)
- Updated to include Profile and Orders links
- Role-specific dashboard access
- Clear role-based messaging

## Security and Validation

### Role-Based Access Control
- **USER role**: Can access profile, orders, and cart
- **ADMIN role**: Can access profile, manage all orders, and user management
- **PHARMACIST role**: Can access profile and manage orders

### Form Validation
- Required field validation
- Email format validation
- Phone number format validation (regex: `^\\+?[0-9]{7,15}$`)
- Age validation (0-150)
- Password strength requirements (8-100 characters)
- Password confirmation matching

### Authentication
- JWT token-based authentication
- Protected routes with role-based access
- Automatic token refresh handling
- Secure password change with current password verification

## UI/UX Features

### Material-UI Integration
- Consistent design language
- Responsive grid layouts
- Color-coded status indicators
- Interactive dialogs and forms
- Loading states and error handling

### User Experience
- Intuitive navigation flow
- Clear success/error messaging
- Confirmation dialogs for destructive actions
- Real-time form validation
- Responsive design for all screen sizes

## Backend Integration

### Expected Backend Endpoints
The frontend expects the following backend endpoints:

#### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/user` - Get user's orders
- `GET /api/orders` - Get all orders (admin/pharmacist)
- `GET /api/orders/{id}` - Get order by ID
- `PUT /api/orders/{id}/status` - Update order status
- `PUT /api/orders/{id}/cancel` - Cancel order

#### User Profile
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password
- `GET /api/users` - Get all users (admin)
- `PUT /api/users/{id}/status` - Update user status (admin)

### Data Validation
The frontend implements client-side validation matching the backend UserCreateDTO validation:
- First name: Required, max 50 characters
- Last name: Required, max 50 characters
- Address: Required, max 255 characters
- Age: 0-150 range
- Email: Required, valid email format
- Password: 8-100 characters
- Phone: Required, valid phone format (7-15 digits, optional +)

## Future Enhancements

### Potential Features
- Order tracking with real-time updates
- Email notifications for order status changes
- Order history export functionality
- Advanced user management for admins
- Profile picture upload
- Two-factor authentication
- Order reviews and ratings
- Wishlist functionality

### Technical Improvements
- Real-time order status updates using WebSocket
- Offline order viewing capability
- Advanced search and filtering for orders
- Bulk order operations for admins
- Order analytics and reporting
- Integration with payment gateways 