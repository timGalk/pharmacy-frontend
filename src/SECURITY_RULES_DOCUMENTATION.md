# Security Rules Documentation

This document describes the role-based access control (RBAC) implementation for the pharmacy application, specifically for cart and order operations.

## User Roles

The application supports three user roles:

1. **USER** - Regular customers who can browse medicines, manage carts, and place orders
2. **ADMIN** - Administrators with full system access and order management capabilities
3. **PHARMACIST** - Pharmacy staff with medicine management and order processing capabilities

## Access Control Matrix

### Cart Operations

| Operation | USER | ADMIN | PHARMACIST |
|-----------|------|-------|------------|
| Create cart | ✅ | ❌ | ❌ |
| View own cart | ✅ | ❌ | ❌ |
| Add items to cart | ✅ | ❌ | ❌ |
| Update cart items | ✅ | ❌ | ❌ |
| Remove items from cart | ✅ | ❌ | ❌ |
| Clear cart | ✅ | ❌ | ❌ |

### Order Operations

| Operation | USER | ADMIN | PHARMACIST |
|-----------|------|-------|------------|
| Create order from cart | ✅ | ❌ | ❌ |
| View own orders | ✅ | ✅ | ✅ |
| View all orders | ❌ | ✅ | ✅ |
| View orders by status | ❌ | ✅ | ✅ |
| Update order status | ❌ | ✅ | ✅ |
| Cancel orders | ❌ | ✅ | ✅ |

### Medicine Operations

| Operation | USER | ADMIN | PHARMACIST |
|-----------|------|-------|------------|
| View medicines | ✅ | ✅ | ✅ |
| Create medicines | ❌ | ✅ | ✅ |
| Update medicines | ❌ | ✅ | ✅ |
| Delete medicines | ❌ | ✅ | ✅ |

## Detailed Security Rules

### Cart Security

**Principle**: Only users can access carts, and only their own carts.

**Rules**:
- Users can create, view, modify, and clear their own carts
- Admin and Pharmacist roles are completely blocked from cart operations
- Users cannot access other users' carts
- All cart operations require authentication

**Implementation**:
```java
// CartSecurityService ensures:
// 1. Only USER role can access carts
// 2. Users can only access their own carts
// 3. Admin/Pharmacist get AccessDeniedException
```

### Order Security

**Principle**: Users can only access their own orders, while Admin and Pharmacist can access all orders.

**Rules**:
- Users can create orders from their own carts
- Users can view only their own orders
- Admin and Pharmacist can view all orders
- Admin and Pharmacist can update order statuses
- Admin and Pharmacist can cancel orders
- Users cannot modify order statuses

**Implementation**:
```java
// OrderSecurityService ensures:
// 1. Users can only access their own orders
// 2. Admin/Pharmacist can access all orders
// 3. Proper access control for order modifications
```

## API Endpoint Security

### Cart Endpoints

```
GET    /api/carts/{cartId}           - USER only, own cart
GET    /api/carts/user/{userId}      - USER only, own cart
POST   /api/carts/user/{userId}      - USER only, own cart
POST   /api/carts/items              - USER only, own cart
PATCH  /api/carts/items/{itemId}     - USER only, own cart
DELETE /api/carts/items/{itemId}     - USER only, own cart
DELETE /api/carts/{cartId}/items     - USER only, own cart
```

### Order Endpoints

```
POST   /api/orders                   - USER only
GET    /api/orders/{orderId}         - USER (own), ADMIN/PHARMACIST (all)
GET    /api/orders/user/{userId}     - USER (own), ADMIN/PHARMACIST (all)
GET    /api/orders/status/{status}   - ADMIN/PHARMACIST only
GET    /api/orders                   - ADMIN/PHARMACIST only
PATCH  /api/orders/{orderId}/status  - ADMIN/PHARMACIST only
POST   /api/orders/{orderId}/cancel  - ADMIN/PHARMACIST only
```

## Error Responses

### Access Denied (403 Forbidden)

**Cart Access Denied**:
```json
{
  "message": "Access denied: Admin and Pharmacist cannot access carts"
}
```

**Order Access Denied**:
```json
{
  "message": "Access denied: You can only access your own orders"
}
```

**Unauthorized Operation**:
```json
{
  "message": "Access denied: Only USER role can perform cart operations"
}
```

## Business Logic Implications

### Cart Restrictions

1. **Admin/Pharmacist Cannot Use Carts**: This prevents staff from accidentally creating orders for themselves
2. **User Isolation**: Users cannot see or modify other users' carts
3. **Order Creation Only**: The only way to create orders is through the cart system

### Order Management

1. **User Self-Service**: Users can view their own order history
2. **Staff Management**: Admin and Pharmacist can manage all orders
3. **Status Control**: Only staff can update order statuses
4. **Cancellation Control**: Only staff can cancel orders

### Workflow Security

1. **Order Creation**: Users must go through cart → order workflow
2. **Stock Management**: Stock is only reduced when orders are created
3. **Status Progression**: Only authorized staff can progress order status
4. **Data Integrity**: All operations are transactional

## Security Best Practices

### Authentication
- All endpoints require valid JWT authentication
- Token-based session management
- Stateless authentication

### Authorization
- Role-based access control at endpoint level
- Business logic level authorization checks
- Principle of least privilege

### Data Protection
- Users can only access their own data
- Staff can access all data for management purposes
- No cross-user data leakage

### Audit Trail
- All operations are logged
- Order status changes are tracked
- Cart operations are logged

## Testing Security Rules

### Test Cases for Cart Security

1. **User Cart Access**:
   ```bash
   # Should succeed
   GET /api/carts/1 (with USER token for cart owner)
   
   # Should fail
   GET /api/carts/1 (with ADMIN token)
   GET /api/carts/1 (with USER token for different user)
   ```

2. **Cart Operations**:
   ```bash
   # Should succeed for USER
   POST /api/carts/items (with USER token)
   
   # Should fail for ADMIN/PHARMACIST
   POST /api/carts/items (with ADMIN token)
   ```

### Test Cases for Order Security

1. **Order Access**:
   ```bash
   # Should succeed
   GET /api/orders/1 (with USER token for order owner)
   GET /api/orders/1 (with ADMIN token)
   
   # Should fail
   GET /api/orders/1 (with USER token for different user)
   ```

2. **Order Management**:
   ```bash
   # Should succeed for ADMIN/PHARMACIST
   PATCH /api/orders/1/status (with ADMIN token)
   
   # Should fail for USER
   PATCH /api/orders/1/status (with USER token)
   ```

## Implementation Notes

### Security Services
- `CartSecurityService`: Handles cart access control
- `OrderSecurityService`: Handles order access control
- Both services integrate with Spring Security

### Integration Points
- Security rules are enforced at both controller and service levels
- JWT authentication provides user context
- Role-based authorization at endpoint level
- Business logic authorization at service level

### Error Handling
- Consistent error responses for security violations
- Proper HTTP status codes (403 Forbidden)
- Meaningful error messages for debugging

This security implementation ensures that the pharmacy system maintains proper separation of concerns between user roles while providing the necessary functionality for each role to perform their duties effectively. 