# Cart to Order Integration Example

This document demonstrates the complete flow from adding items to cart to creating an order in the pharmacy system.

## Prerequisites

1. A user exists in the system (ID: 123)
2. Medicines exist in the system (IDs: 1, 2, 3)
3. User has a cart created

## Complete Flow Example

### Step 1: Create Cart for User
```bash
POST /api/carts/user/123
```

**Response:**
```json
{
  "id": 1,
  "userId": 123,
  "itemList": []
}
```

### Step 2: Add Items to Cart
```bash
POST /api/carts/items
Content-Type: application/json

{
  "cartId": 1,
  "medicineId": 1,
  "quantity": 2
}
```

```bash
POST /api/carts/items
Content-Type: application/json

{
  "cartId": 1,
  "medicineId": 2,
  "quantity": 1
}
```

**Cart after adding items:**
```json
{
  "id": 1,
  "userId": 123,
  "itemList": [
    {
      "id": 1,
      "medicine": {
        "id": 1,
        "name": "Aspirin",
        "description": "Pain reliever",
        "price": 5.99,
        "stockQuantity": 100,
        "expirationDate": "2025-12-31",
        "image": "aspirin.jpg"
      },
      "quantity": 2
    },
    {
      "id": 2,
      "medicine": {
        "id": 2,
        "name": "Vitamin C",
        "description": "Immune support",
        "price": 12.99,
        "stockQuantity": 50,
        "expirationDate": "2025-06-30",
        "image": "vitamin-c.jpg"
      },
      "quantity": 1
    }
  ]
}
```

### Step 3: Create Order from Cart
```bash
POST /api/orders
Content-Type: application/json

{
  "cartId": 1,
  "shippingAddress": "456 Oak Street, Springfield, IL 62701",
  "phoneNumber": "+1-555-123-4567",
  "customerName": "John Smith"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "userId": 123,
  "status": "PENDING",
  "totalAmount": 24.97,
  "shippingAddress": "456 Oak Street, Springfield, IL 62701",
  "phoneNumber": "+1-555-123-4567",
  "customerName": "John Smith",
  "items": [
    {
      "id": 1,
      "medicine": {
        "id": 1,
        "name": "Aspirin",
        "description": "Pain reliever",
        "price": 5.99,
        "stockQuantity": 98,
        "expirationDate": "2025-12-31",
        "image": "aspirin.jpg"
      },
      "quantity": 2,
      "unitPrice": 5.99,
      "totalPrice": 11.98
    },
    {
      "id": 2,
      "medicine": {
        "id": 2,
        "name": "Vitamin C",
        "description": "Immune support",
        "price": 12.99,
        "stockQuantity": 49,
        "expirationDate": "2025-06-30",
        "image": "vitamin-c.jpg"
      },
      "quantity": 1,
      "unitPrice": 12.99,
      "totalPrice": 12.99
    }
  ],
  "createdAt": "2024-01-15T14:30:00Z",
  "updatedAt": "2024-01-15T14:30:00Z"
}
```

### Step 4: Verify Cart is Cleared
```bash
GET /api/carts/1
```

**Response:**
```json
{
  "id": 1,
  "userId": 123,
  "itemList": []
}
```

### Step 5: Check Stock Updates
```bash
GET /api/medicines/1
```

**Response:**
```json
{
  "id": 1,
  "name": "Aspirin",
  "description": "Pain reliever",
  "price": 5.99,
  "stockQuantity": 98,
  "expirationDate": "2025-12-31",
  "image": "aspirin.jpg"
}
```

### Step 6: View User's Orders
```bash
GET /api/orders/user/123
```

**Response:**
```json
[
  {
    "id": 1,
    "userId": 123,
    "status": "PENDING",
    "totalAmount": 24.97,
    "shippingAddress": "456 Oak Street, Springfield, IL 62701",
    "phoneNumber": "+1-555-123-4567",
    "customerName": "John Smith",
    "items": [
      // ... order items
    ],
    "createdAt": "2024-01-15T14:30:00Z",
    "updatedAt": "2024-01-15T14:30:00Z"
  }
]
```

### Step 7: Update Order Status (Admin)
```bash
PATCH /api/orders/1/status
Content-Type: application/json

{
  "status": "CONFIRMED"
}
```

**Response:**
```json
{
  "id": 1,
  "userId": 123,
  "status": "CONFIRMED",
  "totalAmount": 24.97,
  // ... other fields
  "updatedAt": "2024-01-15T15:00:00Z"
}
```

## Key Points

### What Happens During Order Creation:
1. **Cart Validation**: System checks if cart exists and has items
2. **Stock Verification**: Ensures sufficient stock for all items
3. **Price Calculation**: Calculates total from cart items
4. **Order Creation**: Creates order with PENDING status
5. **Stock Reduction**: Updates medicine stock quantities
6. **Cart Clearing**: Removes all items from user's cart
7. **Order Items**: Creates order items with preserved prices

### Stock Management:
- **Before Order**: Aspirin (100), Vitamin C (50)
- **After Order**: Aspirin (98), Vitamin C (49)
- **If Cancelled**: Stock is restored to original quantities

### Transaction Safety:
- All operations are wrapped in transactions
- If any step fails, the entire operation is rolled back
- Stock cannot go below 0
- Cart is only cleared after successful order creation

## Error Scenarios

### Insufficient Stock
```bash
POST /api/orders
Content-Type: application/json

{
  "cartId": 1,
  "shippingAddress": "123 Main St",
  "phoneNumber": "+1234567890",
  "customerName": "John Doe"
}
```

**Response (500):**
```json
{
  "message": "Insufficient stock for medicine: Aspirin"
}
```

### Empty Cart
```bash
POST /api/orders
Content-Type: application/json

{
  "cartId": 1,
  "shippingAddress": "123 Main St",
  "phoneNumber": "+1234567890",
  "customerName": "John Doe"
}
```

**Response (500):**
```json
{
  "message": "Cannot create order from empty cart"
}
```

### Invalid Cart ID
```bash
POST /api/orders
Content-Type: application/json

{
  "cartId": 999,
  "shippingAddress": "123 Main St",
  "phoneNumber": "+1234567890",
  "customerName": "John Doe"
}
```

**Response (404):**
```json
{
  "message": "Cart with id 999 not found"
}
```

This integration ensures a seamless experience from cart to order while maintaining data integrity and proper stock management. 