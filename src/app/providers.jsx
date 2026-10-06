"use client";

import { CartProvider } from "../context/CartContext";
import { WishlistProvider } from "../context/WishlistContext";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }) {
  return (
    <CartProvider>
      <WishlistProvider>
        {children}
        <Toaster position="top-right" />
      </WishlistProvider>
    </CartProvider>
  );
}
