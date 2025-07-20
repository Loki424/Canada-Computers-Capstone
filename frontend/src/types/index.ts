export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image_url: string;
  stock: number;
  averageRating?: number;
  reviews?: Review[];
}

export interface Category {
  _id: string;
  name: string;
  description: string;
}

export interface Review {
  _id: string;
  user: {
    name: string;
  };
  rating: number;
  comment: string;
  created_at?: string;
}

export interface ProductsData {
  products: Product[];
}

export interface ProductData {
  product: Product;
}

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface AuthPayload {
  token: string;
  user: User;
}

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  _id: string;
  user: User;
  items: CartItem[];
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface OrderItem {
  _id: string;
  product: Product;
  quantity: number;
  price_at_time: number;
}

export interface Order {
  _id: string;
  user: User;
  items: OrderItem[];
  total: number;
  status: string;
  shipping_address: Address;
  order_date: string;
  created_at: string;
  updated_at: string;
}

export interface CheckoutInput {
  shippingAddress: Address;
  paymentMethod: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  nameOnCard: string;
}

export interface CheckoutResult {
  success: boolean;
  order?: Order;
  message?: string;
}