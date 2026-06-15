"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Loader2, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchOrders();

    // Subscribe to real-time changes for the user's orders
    const subscription = supabase
      .channel('user-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'delivered':
        return { color: 'bg-green-100 text-green-600', text: 'Delivered' };
      case 'shipped':
        return { color: 'bg-blue-100 text-blue-600', text: 'On the way' };
      case 'processing':
        return { color: 'bg-primary/10 text-primary', text: 'Preparing' };
      case 'cancelled':
        return { color: 'bg-red-100 text-red-600', text: 'Cancelled' };
      default:
        return { color: 'bg-amber-100 text-amber-600', text: 'Order Placed' };
    }
  };

  const fetchOrders = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/login";
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30 pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold mb-2">My Orders</h1>
          <p className="text-foreground/50 font-medium">Track and manage your recent purchases.</p>
        </div>

        {orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[40px] p-12 text-center border border-border shadow-sm"
          >
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
              <ShoppingBag size={40} />
            </div>
            <h2 className="text-2xl font-bold mb-4">No orders yet</h2>
            <p className="text-foreground/50 font-medium mb-8">Ready to taste our heritage? Start shopping now!</p>
            <Link 
              href="/shop" 
              className="inline-block bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
            >
              Go to Shop
            </Link>
          </motion.div>
        ) : (
          <div className="bg-white rounded-[32px] border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-secondary/30 text-foreground/50 font-bold text-sm uppercase tracking-wider">
                    <th className="px-8 py-6">Order ID</th>
                    <th className="px-8 py-6">Date</th>
                    <th className="px-8 py-6">Status</th>
                    <th className="px-8 py-6">Total</th>
                    <th className="px-8 py-6 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-secondary/10 transition-colors">
                      <td className="px-8 py-6">
                        <span className="font-bold text-primary text-xs">#{order.id.split('-')[0]}</span>
                      </td>
                      <td className="px-8 py-6 text-sm font-medium text-foreground/50">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-6">
                        <span className={cn(
                          "text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-wider transition-colors duration-500",
                          getStatusDisplay(order.status).color
                        )}>
                          {getStatusDisplay(order.status).text}
                        </span>
                      </td>
                      <td className="px-8 py-6 font-bold">Rs. {order.total_amount}</td>
                      <td className="px-8 py-6 text-right">
                        <Link 
                          href={`/orders/status?id=${order.id}`}
                          className="inline-flex p-2 bg-secondary rounded-xl text-foreground/30 hover:text-primary transition-colors"
                        >
                          <ChevronRight size={20} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
