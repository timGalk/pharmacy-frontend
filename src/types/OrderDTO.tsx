export interface OrderItem {
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

export interface Order {
  id: number;
  userId: number;
  orderItems: OrderItem[];
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  orderDate: string;
  deliveryAddress: string;
  phoneNumber: string;
}

export interface CreateOrderRequest {
  cartId: number;
  deliveryAddress: string;
  phoneNumber: string;
}

export interface UpdateOrderStatusRequest {
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
} 