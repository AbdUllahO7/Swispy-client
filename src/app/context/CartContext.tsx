'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string; // unique cart line item id
  productId?: string;
  boxId?: string;
  name: string;
  nameAr?: string;
  price: number;
  quantity: number;
  image?: string;
  selectedOption?: string;
  note?: string;
  itemType: 'product' | 'box' | 'custom_box';
  customBoxDetails?: {
    size: number;
    items: Array<{ name: string; quantity: number }>;
    message?: string;
  };
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isCustomBoxOpen: boolean;
  setIsCustomBoxOpen: (open: boolean) => void;
  isGiftOpen: boolean;
  setIsGiftOpen: (open: boolean) => void;
  isEventOpen: boolean;
  setIsEventOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCustomBoxOpen, setIsCustomBoxOpen] = useState(false);
  const [isGiftOpen, setIsGiftOpen] = useState(false);
  const [isEventOpen, setIsEventOpen] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('swispy_cart');
      if (saved) setCart(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('swispy_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  const addToCart = (newItem: Omit<CartItem, 'id'>) => {
    const id = `${newItem.productId || newItem.boxId || 'item'}-${newItem.selectedOption || ''}-${Date.now()}`;
    setCart((prev) => {
      // Check for exact matching item (same productId and same selectedOption, non-custom box)
      if (newItem.itemType !== 'custom_box') {
        const existingIdx = prev.findIndex(
          (i) => (i.productId && i.productId === newItem.productId) || (i.boxId && i.boxId === newItem.boxId) && i.selectedOption === newItem.selectedOption
        );
        if (existingIdx > -1) {
          const updated = [...prev];
          updated[existingIdx].quantity += newItem.quantity;
          return updated;
        }
      }
      return [...prev, { ...newItem, id }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const clearCart = () => setCart([]);

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isCustomBoxOpen,
        setIsCustomBoxOpen,
        isGiftOpen,
        setIsGiftOpen,
        isEventOpen,
        setIsEventOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
