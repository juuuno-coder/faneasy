import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // 'basic', 'pro', 'master'
  name: string;
  price: number; // One-time fee
  monthly: number; // Monthly fee
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalPrice: () => number;
  totalMonthly: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i.id === item.id);
        
        if (existingItem) {
            // Usually you only need 1 of each plan, but for "cart" logic we might allow duplicates or just cap at 1.
            // Let's cap at 1 for plans to avoid confusion, or treat as generic products. 
            // The user said "put 3 products", implying distinct ones.
            return; 
        }

        set({ items: [...currentItems, { ...item, quantity: 1 }] });
      },
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),
      clearCart: () => set({ items: [] }),
      totalPrice: () => get().items.reduce((sum, item) => sum + item.price, 0),
      totalMonthly: () => get().items.reduce((sum, item) => sum + item.monthly, 0),
    }),
    {
      name: 'faneasy-cart',
    }
  )
);
