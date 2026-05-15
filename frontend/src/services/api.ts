import axios from 'axios';
import { Product, AuthResponse, CartItem, Order } from '../types';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const register = async (data: {
  email: string;
  password: string;
  name: string;
  address?: string;
  phone?: string;
}): Promise<AuthResponse> => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

// Product APIs
export const getProducts = async (category?: string, search?: string): Promise<Product[]> => {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (search) params.append('search', search);
  
  const response = await api.get(`/products?${params.toString()}`);
  return response.data;
};

export const getProduct = async (id: string): Promise<Product> => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const addReview = async (productId: string, rating: number, comment: string, userName: string) => {
  const response = await api.post(`/products/${productId}/reviews`, { rating, comment, userName });
  return response.data;
};

// Cart APIs
export const getCart = async (): Promise<CartItem[]> => {
  const response = await api.get('/cart');
  return response.data;
};

export const addToCart = async (productId: string, quantity: number) => {
  const response = await api.post('/cart/add', { productId, quantity });
  return response.data;
};

export const updateCart = async (productId: string, quantity: number) => {
  const response = await api.put('/cart/update', { productId, quantity });
  return response.data;
};

export const removeFromCart = async (productId: string) => {
  const response = await api.delete(`/cart/remove/${productId}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await api.delete('/cart/clear');
  return response.data;
};

// Order APIs
export const createOrder = async (shippingAddress: string, paymentMethod: string): Promise<Order> => {
  const response = await api.post('/orders', { shippingAddress, paymentMethod });
  return response.data;
};

export const getOrders = async (): Promise<Order[]> => {
  const response = await api.get('/orders');
  return response.data;
};

export const getOrder = async (id: string): Promise<Order> => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};
