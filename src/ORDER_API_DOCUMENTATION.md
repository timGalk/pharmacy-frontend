# Order API Documentation

This document describes the REST API endpoints for order management in the pharmacy application.

## Base URL
All order endpoints are prefixed with `/api/orders`

## Order Status Flow
Orders follow this status progression:
- **PENDING** → **CONFIRMED** → **PROCESSING** → **SHIPPED** → **DELIVERED**
- Orders can be **CANCELLED** at any point before **DELIVERED**
- **REFUNDED** status is available for completed orders

## Endpoints

### 1. Create Order from Cart
**POST** `/api/orders`

Creates a new order from a user's cart. This will:
- Calculate total amount from cart items
- Check stock availability
- Update medicine stock quantities
- Clear the cart after successful order creation

**Request Body:**
```json
{
  "cartId": 1,
  "shippingAddress": "123 Main St, City, Country",
  "phoneNumber": "+1234567890",
  "customerName": "John Doe"
}
```

**Validation:**
- `cartId`: Required, must be a valid cart ID
- `shippingAddress`: Required, max 500 characters
- `phoneNumber`: Required, valid phone format
- `customerName`: Required, max 100 characters

**Response (201 Created):**
```json
{
  "id": 1,
  "userId": 123,
  "status": "PENDING",
  "totalAmount": 25.97,
  "shippingAddress": "123 Main St, City, Country",
  "phoneNumber": "+1234567890",
  "customerName": "John Doe",
  "items": [
    {
      "id": 1,
      "medicine": {
        "id": 1,
        "name": "Aspirin",
        "description": "Pain reliever",
        "price": 5.99,
        "stockQuantity": 95,
        "expirationDate": "2025-12-31",
        "image": "aspirin.jpg"
      },
      "quantity": 2,
      "unitPrice": 5.99,
      "totalPrice": 11.98
    }
  ],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### 2. Get Order by ID
**GET** `/api/orders/{orderId}`

Retrieves a specific order by its ID.

**Path Parameters:**
- `orderId` (Long): The ID of the order

**Response:** Order DTO (same as above)

### 3. Get Orders by User ID
**GET** `/api/orders/user/{userId}`

Retrieves all orders for a specific user.

**Path Parameters:**
- `userId` (Long): The ID of the user

**Response:**
```json
[
  {
    "id": 1,
    "userId": 123,
    "status": "PENDING",
    "totalAmount": 25.97,
    // ... other order fields
  },
  {
    "id": 2,
    "userId": 123,
    "status": "DELIVERED",
    "totalAmount": 15.50,
    // ... other order fields
  }
]
```

### 4. Get Orders by Status
**GET** `/api/orders/status/{status}`

Retrieves all orders with a specific status.

**Path Parameters:**
- `status` (OrderStatus): The status to filter by (PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED)

**Response:** Array of Order DTOs

### 5. Get All Orders (Admin)
**GET** `/api/orders`

Retrieves all orders in the system (typically for admin use).

**Response:** Array of Order DTOs

### 6. Update Order Status
**PATCH** `/api/orders/{orderId}/status`

Updates the status of an order. When cancelling an order, stock quantities are automatically restored.

**Path Parameters:**
- `orderId` (Long): The ID of the order

**Request Body:**
```json
{
  "status": "CONFIRMED"
}
```

**Validation:**
- `status`: Required, must be a valid OrderStatus enum value

**Response:** Updated Order DTO

### 7. Cancel Order
**POST** `/api/orders/{orderId}/cancel`

Cancels an order and restores stock quantities.

**Path Parameters:**
- `orderId` (Long): The ID of the order

**Response:** Updated Order DTO with CANCELLED status

## Error Responses

### 404 Not Found
```json
{
  "message": "Order with id 1 not found"
}
```

### 400 Bad Request
```json
{
  "message": "Validation failed",
  "errors": [
    "Shipping address is required"
  ]
}
```

### 500 Internal Server Error
```json
{
  "message": "Cannot create order from empty cart"
}
```

```json
{
  "message": "Insufficient stock for medicine: Aspirin"
}
```

```json
{
  "message": "Cannot update status of DELIVERED order"
}
```

## Business Logic

### Order Creation Process:
1. **Cart Validation**: Ensures cart exists and is not empty
2. **Stock Check**: Verifies sufficient stock for all items
3. **Price Calculation**: Calculates total amount from cart items
4. **Order Creation**: Creates order with PENDING status
5. **Stock Update**: Reduces stock quantities for ordered items
6. **Cart Clear**: Clears the user's cart after successful order

### Status Management:
- **PENDING**: Initial status when order is created
- **CONFIRMED**: Admin confirms the order
- **PROCESSING**: Order is being prepared
- **SHIPPED**: Order has been shipped
- **DELIVERED**: Order has been delivered
- **CANCELLED**: Order cancelled (stock restored)
- **REFUNDED**: Order refunded after delivery

### Stock Management:
- Stock is reduced when order is created
- Stock is restored when order is cancelled
- Stock cannot be reduced below 0

## Usage Examples

### Complete Order Flow:

1. **Add items to cart:**
   ```bash
   POST /api/carts/items
   Content-Type: application/json
   
   {
     "cartId": 1,
     "medicineId": 1,
     "quantity": 2
   }
   ```

2. **Create order from cart:**
   ```bash
   POST /api/orders
   Content-Type: application/json
   
   {
     "cartId": 1,
     "shippingAddress": "123 Main St, City, Country",
     "phoneNumber": "+1234567890",
     "customerName": "John Doe"
   }
   ```

3. **View order:**
   ```bash
   GET /api/orders/1
   ```

4. **Update order status (admin):**
   ```bash
   PATCH /api/orders/1/status
   Content-Type: application/json
   
   {
     "status": "CONFIRMED"
   }
   ```

5. **View user's orders:**
   ```bash
   GET /api/orders/user/123
   ```

6. **Cancel order (if needed):**
   ```bash
   POST /api/orders/1/cancel
   ```

## Integration with Cart System

The order system is tightly integrated with the cart system:
- Orders are created directly from carts
- Cart is automatically cleared after successful order creation
- Stock quantities are managed across both systems
- Order items preserve the exact prices and quantities from the cart

## Security Considerations

- Orders are associated with specific users
- Only the order owner or admin can view order details
- Status updates should be restricted to admin users
- Stock management is transactional to prevent race conditions 