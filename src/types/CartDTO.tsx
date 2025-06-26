export interface Medicine {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  expirationDate: string;
  image: string;
}

export interface CartItem {
  id: number;
  medicine: Medicine;
  quantity: number;
}

export interface Cart {
  id: number;
  userId: number;
  itemList: CartItem[];
}

export interface AddItemToCartRequest {
  cartId: number;
  medicineId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
} 