// context/CartContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeCartItem as apiRemoveCartItem,
  clearCart as apiClearCart,
  CartItem,
} from "../services/cartService";

interface CartContextType {
  cartItems: CartItem[];
  totalPrice: number;
  addToCart: (bookId: string, quantity?: number) => Promise<void>;
  updateCartItem: (bookId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const fetchCart = async () => {
    try {
      const items = await getCart();
      setCartItems(items);
      calculateTotal(items);
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
    }
  };

  const calculateTotal = (items: CartItem[]) => {
    const total = items.reduce((sum, item) => sum + item.quantity * item.book.price, 0);
    setTotalPrice(total);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (bookId: string, quantity: number = 1) => {
    const items = await apiAddToCart(bookId, quantity);
    setCartItems(items);
    calculateTotal(items);
  };

  const updateCartItem = async (bookId: string, quantity: number) => {
    const items = await apiUpdateCartItem(bookId, quantity);
    setCartItems(items);
    calculateTotal(items);
  };

  const removeFromCart = async (cartItemId: string) => {
    const items = await apiRemoveCartItem(cartItemId);
    setCartItems(items);
    calculateTotal(items);
  };

  const clearCart = async () => {
    await apiClearCart();
    setCartItems([]);
    setTotalPrice(0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalPrice,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
