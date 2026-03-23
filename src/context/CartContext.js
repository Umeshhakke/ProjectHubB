import React, { createContext, useContext, useEffect, useState } from 'react';
import API from '../api/axios';
import { getUserId } from '../utils/auth';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const fetchCart = async () => {
    const userId = getUserId();
    if (!userId) return setCartCount(0);

    try {
      const res = await API.get(`/cart/${userId}`);
      setCartCount(Array.isArray(res.data) ? res.data.length : 0);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);