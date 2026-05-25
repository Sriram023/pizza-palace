import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'pp_cart';
const SIZE_MULT = { Small: 0.85, Medium: 1, Large: 1.2 };

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const keyOf = (pizzaId, size) => `${pizzaId}__${size}`;

  const addItem = (pizza, size = 'Medium', qty = 1) => {
    setItems((prev) => {
      const key = keyOf(pizza._id, size);
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => i.key === key ? { ...i, qty: i.qty + qty } : i);
      }
      return [
        ...prev,
        {
          key,
          pizzaId: pizza._id,
          name: pizza.name,
          imageUrl: pizza.imageUrl,
          basePrice: pizza.price,
          size,
          qty,
          unitPrice: Math.round(pizza.price * (SIZE_MULT[size] || 1) * 100) / 100,
        },
      ];
    });
  };

  const updateQty = (key, qty) => {
    if (qty <= 0) return removeItem(key);
    setItems((prev) => prev.map((i) => i.key === key ? { ...i, qty } : i));
  };

  const removeItem = (key) => setItems((prev) => prev.filter((i) => i.key !== key));
  const clear = () => setItems([]);

  const totals = useMemo(() => {
    const subtotal = items.reduce((s, i) => s + i.unitPrice * i.qty, 0);
    const tax = Math.round(subtotal * 0.05 * 100) / 100;
    const deliveryFee = items.length ? 40 : 0;
    const grand = Math.round((subtotal + tax + deliveryFee) * 100) / 100;
    const count = items.reduce((s, i) => s + i.qty, 0);
    return { subtotal, tax, deliveryFee, grand, count };
  }, [items]);

  return (
    <CartContext.Provider value={{ items, addItem, updateQty, removeItem, clear, totals }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);