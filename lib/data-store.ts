import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Inquiry, Order } from './types';
import { mockInquiries } from './data';

// Extended types for the store
interface DataStore {
  inquiries: Inquiry[]; // Global list of inquiries
  orders: Order[];      // Global list of orders
  
  addInquiry: (inquiry: Inquiry) => void;
  addOrder: (order: Order) => void;
  
  getInquiriesByOwner: (ownerId: string) => Inquiry[];
  getOrdersByOwner: (ownerId: string) => Order[];
  getOrdersByBuyerEmail: (email: string) => Order[];
}

export const useDataStore = create<DataStore>()(
  persist(
    (set, get) => ({
      // Initialize with some mock data so it looks populated
      inquiries: [...mockInquiries],
      orders: [],

      addInquiry: (inquiry) => set((state) => ({ 
        inquiries: [inquiry, ...state.inquiries] 
      })),

      addOrder: (order) => set((state) => ({ 
        orders: [order, ...state.orders] 
      })),

      getInquiriesByOwner: (ownerId) => {
        return get().inquiries.filter(i => i.ownerId === ownerId);
      },

      getOrdersByOwner: (ownerId) => {
        return get().orders.filter(o => o.ownerId === ownerId);
      },

      getOrdersByBuyerEmail: (email) => {
        return get().orders.filter(o => o.buyerEmail === email);
      }
    }),
    {
      name: 'faneasy-data-storage', // key in localStorage
    }
  )
);
