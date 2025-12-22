import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Inquiry, Order } from './types';
import { mockInquiries } from './data';

// Extended types for the store
export interface PageContent {
  heroTitle?: string;
  heroDescription?: string;
  bodyContent?: string; // Tiptap HTML
}

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnailUrl?: string; // URL to image
  demoUrl?: string;
  category: "marketing" | "fandom" | "business";
  layoutId: "limited-marketing" | "growth-marketing" | "tech-solution" | "default"; // To identify which code layout to use
}

interface DataStore {
  inquiries: Inquiry[]; // Global list of inquiries
  orders: Order[];      // Global list of orders
  pageContents: Record<string, PageContent>; // key: subdomain
  templates: Template[]; // Registered templates
  
  addInquiry: (inquiry: Inquiry) => void;
  addOrder: (order: Order) => void;
  updatePageContent: (subdomain: string, content: PageContent) => void;
  
  // Template CRUD
  addTemplate: (template: Template) => void;
  updateTemplate: (id: string, updates: Partial<Template>) => void;
  deleteTemplate: (id: string) => void;
  
  getInquiriesByOwner: (ownerId: string) => Inquiry[];
  getOrdersByOwner: (ownerId: string) => Order[];
  getOrdersByBuyerEmail: (email: string) => Order[];
  getPageContent: (subdomain: string) => PageContent | undefined;
}

export const useDataStore = create<DataStore>()(
  persist(
    (set, get) => ({
      // Initialize with some mock data so it looks populated
      inquiries: [...mockInquiries],
      orders: [],
      pageContents: {},
      templates: [
        {
          id: "tpl-1",
          name: "LIMITED MARKETING",
          description: "프리미엄 1인 마케팅 에이전시를 위한 블랙 & 옐로우 하이엔드 테마",
          category: "marketing",
          demoUrl: "https://kkang.designd.co.kr/sites/fan1",
          layoutId: "limited-marketing",
        },
        {
          id: "tpl-2",
          name: "그로스 마케팅",
          description: "신뢰감을 주는 화이트&딥그린 컬러의 기업형 성장 마케팅 테마",
          category: "marketing",
          demoUrl: "https://kkang.designd.co.kr/sites/fan2",
          layoutId: "growth-marketing",
        },
        {
          id: "tpl-3",
          name: "도도마케팅 (테크형)",
          description: "데이터 사이언스와 인공지능 기반의 고도화된 기술 지향 마케팅 테마",
          category: "marketing",
          demoUrl: "https://kkang.designd.co.kr/sites/fan3",
          layoutId: "tech-solution",
        }
      ],

      addInquiry: (inquiry) => set((state) => ({ 
        inquiries: [inquiry, ...state.inquiries] 
      })),

      addOrder: (order) => set((state) => ({ 
        orders: [order, ...state.orders] 
      })),

      updatePageContent: (subdomain, content) => set((state) => ({
        pageContents: {
          ...state.pageContents,
          [subdomain]: { ...state.pageContents[subdomain], ...content }
        }
      })),

      addTemplate: (template) => set((state) => ({
        templates: [...state.templates, template]
      })),

      updateTemplate: (id, updates) => set((state) => ({
        templates: state.templates.map(t => t.id === id ? { ...t, ...updates } : t)
      })),

      deleteTemplate: (id) => set((state) => ({
        templates: state.templates.filter(t => t.id !== id)
      })),

      getInquiriesByOwner: (ownerId) => {
        return get().inquiries.filter(i => i.ownerId === ownerId);
      },

      getOrdersByOwner: (ownerId) => {
        return get().orders.filter(o => o.ownerId === ownerId);
      },

      getOrdersByBuyerEmail: (email) => {
        return get().orders.filter(o => o.buyerEmail === email);
      },

      getPageContent: (subdomain) => {
        return get().pageContents[subdomain];
      }
    }),
    {
      name: 'faneasy-data-storage', // key in localStorage
    }
  )
);
