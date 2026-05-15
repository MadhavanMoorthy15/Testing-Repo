import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from '../types';
import { getCart, addToCart as addToCartApi, updateCart as updateCartApi, removeFromCart as removeFromCartApi } from '../services/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: CartItem[];
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateCartItem: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  getCartTotal: () => number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { isAuthenticated } = useAuth();

  const refreshCart = async () => {
    if (isAuthenticated) {
      try {
        const cartData = await getCart();
        setCart(cartData);
      } catch (error) {
        console.error('Failed to fetch cart:', error);
      }
    }
  };

  useEffect(() => {
    refreshCart();
  }, [isAuthenticated]);

  const addToCart = async (productId: string, quantity: number) => {
    await addToCartApi(productId, quantity);
    await refreshCart();
  };

  const updateCartItem = async (productId: string, quantity: number) => {
    await updateCartApi(productId, quantity);
    await refreshCart();
  };

  const removeFromCart = async (productId: string) => {
    await removeFromCartApi(productId);
    await refreshCart();
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateCartItem,
      removeFromCart,
      getCartTotal,
      refreshCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
