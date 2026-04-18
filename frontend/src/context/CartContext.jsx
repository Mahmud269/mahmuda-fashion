import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) return setCart({ items: [] });
    try {
      setLoading(true);
      const { data } = await axios.get('/api/cart');
      setCart(data);
    } catch {
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, quantity = 1, size = '', color = '') => {
    const { data } = await axios.post('/api/cart', { productId, quantity, size, color });
    setCart(data);
  };

  const updateItem = async (itemId, quantity) => {
    const { data } = await axios.put(`/api/cart/${itemId}`, { quantity });
    setCart(data);
  };

  const removeItem = async (itemId) => {
    const { data } = await axios.delete(`/api/cart/${itemId}`);
    setCart(data);
  };

  const clearCart = async () => {
    await axios.delete('/api/cart');
    setCart({ items: [] });
  };

  const cartCount = cart.items?.reduce((acc, i) => acc + i.quantity, 0) || 0;
  const cartTotal = cart.items?.reduce((acc, i) => {
    const price = i.product?.discountPrice > 0 ? i.product.discountPrice : i.product?.price || 0;
    return acc + price * i.quantity;
  }, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateItem, removeItem, clearCart, cartCount, cartTotal, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
