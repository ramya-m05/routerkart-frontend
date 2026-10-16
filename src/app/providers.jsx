"use client";

import { CartProvider } from "../context/CartContext";
import { WishlistProvider } from "../context/WishlistContext";
import { Toaster } from "react-hot-toast";
import SignInPrompt from "../components/SignInPrompt";

export default function Providers({ children }) {
  return (
    <CartProvider>
      <WishlistProvider>
        {children}
        <SignInPrompt />
        <Toaster position="top-right" />
      </WishlistProvider>
    </CartProvider>
  );
}
