"use client";

import { createContext, useState, useEffect, useContext } from "react";

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cart");
      if (stored) {
        setCart(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage on cart change
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cart, isInitialized]);

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item._id === product._id);
      if (existing) {
        return prevCart.map((item) =>
          item._id === product._id
            ? { ...item, qty: (item.qty || 1) + (Number(quantity) || 1) }
            : item
        );
      } else {
        return [
          ...prevCart,
          {
            ...product,
            _id: product._id,
            name: product.name,
            price: product.price,
            image: product.image || (product.images && product.images[0]) || "",
            stock: product.stock,
            qty: Number(quantity) || 1,
            advancePayment: product.advancePayment,
            advanceAmount: product.advanceAmount,
          },
        ];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, qty: (item.qty || 1) + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item._id === id ? { ...item, qty: (item.qty || 1) - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item._id === id ? { ...item, qty: quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem("cart");
    } catch (e) {
      console.error("Failed to clear cart from localStorage", e);
    }
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.qty || 1),
    0
  );

  const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
