import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get cart from API
  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setCart(response.data.data);
      }
    } catch (err) {
      console.error('Fetch cart error:', err);
      setError(err.response?.data?.message || 'Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login to add items to cart');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/cart/add',
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setCart(response.data.data);
        return true;
      }
    } catch (err) {
      console.error('Add to cart error:', err);
      setError(err.response?.data?.message || 'Failed to add item to cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, quantity) => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(
        `http://localhost:5000/api/cart/update/${productId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setCart(response.data.data);
        return true;
      }
    } catch (err) {
      console.error('Update quantity error:', err);
      setError(err.response?.data?.message || 'Failed to update quantity');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/cart/remove/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setCart(response.data.data);
        return true;
      }
    } catch (err) {
      console.error('Remove from cart error:', err);
      setError(err.response?.data?.message || 'Failed to remove item');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.delete(
        'http://localhost:5000/api/cart/clear',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setCart(response.data.data);
        return true;
      }
    } catch (err) {
      console.error('Clear cart error:', err);
      setError(err.response?.data?.message || 'Failed to clear cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get cart count
  const getCartCount = () => {
    return cart?.totalItems || 0;
  };

  // Get cart total
  const getCartTotal = () => {
    return cart?.totalPrice || 0;
  };

  // Load cart on mount and clear on logout
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, []);

  // Listen for storage changes (logout in another tab)
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setCart(null);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value = {
    cart,
    loading,
    error,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartCount,
    getCartTotal
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
