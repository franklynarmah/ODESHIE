import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api.js';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'odeshie_cart';

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Load cart from backend if logged in, else from localStorage
  const loadCart = useCallback(async () => {
    if (user) {
      try {
        setLoading(true);
        const res = await api.get('/api/cart');
        setCartItems(res.data);
      } catch (err) {
        console.error('Failed to load cart:', err);
      } finally {
        setLoading(false);
      }
    } else {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        try {
          setCartItems(JSON.parse(saved));
        } catch {
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    }
  }, [user]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Save to localStorage for guest users
  useEffect(() => {
    if (!user) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = async (product, quantity = 1, color = null, size = null) => {
    if (user) {
      try {
        await api.post('/api/cart', {
          product_id: product.id,
          quantity,
          color,
          size
        });
        await loadCart();
      } catch (err) {
        console.error('Failed to add to cart:', err);
        throw err;
      }
    } else {
      // Guest cart in localStorage
      setCartItems(prev => {
        const existing = prev.find(
          item => item.product_id === product.id && item.color === color && item.size === size
        );
        if (existing) {
          return prev.map(item =>
            item.product_id === product.id && item.color === color && item.size === size
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [
          ...prev,
          {
            id: Date.now(),
            product_id: product.id,
            name: product.name,
            price: product.price,
            original_price: product.original_price,
            discount_percent: product.discount_percent,
            image_url: product.image_url,
            category: product.category,
            quantity,
            color,
            size
          }
        ];
      });
    }
  };

  const removeFromCart = async (itemId) => {
    if (user) {
      try {
        await api.delete(`/api/cart/${itemId}`);
        await loadCart();
      } catch (err) {
        console.error('Failed to remove from cart:', err);
        throw err;
      }
    } else {
      setCartItems(prev => prev.filter(item => item.id !== itemId));
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;

    if (user) {
      try {
        await api.put(`/api/cart/${itemId}`, { quantity });
        await loadCart();
      } catch (err) {
        console.error('Failed to update quantity:', err);
        throw err;
      }
    } else {
      setCartItems(prev =>
        prev.map(item => item.id === itemId ? { ...item, quantity } : item)
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
    if (!user) {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      cartTotal,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      loadCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export default CartContext;
