import { User, Product, Order } from '../types';

// In-memory database
export const users: User[] = [];
export const products: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 199.99,
    category: 'Electronics',
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    rating: 4.5,
    reviews: []
  },
  {
    id: '2',
    name: 'Smart Watch',
    description: 'Feature-rich smartwatch with fitness tracking',
    price: 299.99,
    category: 'Electronics',
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    rating: 4.7,
    reviews: []
  },
  {
    id: '3',
    name: 'Laptop Stand',
    description: 'Ergonomic aluminum laptop stand',
    price: 49.99,
    category: 'Accessories',
    stock: 100,
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    rating: 4.3,
    reviews: []
  },
  {
    id: '4',
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical keyboard with blue switches',
    price: 129.99,
    category: 'Electronics',
    stock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
    rating: 4.6,
    reviews: []
  },
  {
    id: '5',
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with precision tracking',
    price: 39.99,
    category: 'Electronics',
    stock: 80,
    imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500',
    rating: 4.4,
    reviews: []
  },
  {
    id: '6',
    name: 'USB-C Hub',
    description: '7-in-1 USB-C hub with multiple ports',
    price: 59.99,
    category: 'Accessories',
    stock: 60,
    imageUrl: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500',
    rating: 4.2,
    reviews: []
  },
  {
    id: '7',
    name: 'Portable Charger',
    description: '20000mAh portable power bank',
    price: 34.99,
    category: 'Accessories',
    stock: 120,
    imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500',
    rating: 4.5,
    reviews: []
  },
  {
    id: '8',
    name: 'Webcam HD',
    description: '1080p HD webcam with built-in microphone',
    price: 79.99,
    category: 'Electronics',
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500',
    rating: 4.1,
    reviews: []
  }
];
export const orders: Order[] = [];
export const carts: Map<string, Map<string, number>> = new Map();
