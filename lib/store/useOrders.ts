import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Order {
  id: string;
  customerName: string;
  email: string;
  items: any[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  date: string;
  address: string;
}

interface OrderStore {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
}

export const useOrders = create<OrderStore>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      updateOrderStatus: (id, status) => set((state) => ({
        orders: state.orders.map((order) => 
          order.id === id ? { ...order, status } : order
        )
      })),
    }),
    {
      name: 'bakery-orders',
    }
  )
);
