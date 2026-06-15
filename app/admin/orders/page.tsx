"use client";

import React, { useState, useEffect } from "react";
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  Loader2 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/lib/contexts/ToastContext";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const { showToast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, profiles(full_name, email)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select();
      
      if (error) {
        console.error("Database error:", error);
        showToast({
          type: 'error',
          title: 'Update Failed',
          message: `Failed to update status: ${error.message}`
        });
        return;
      }

      if (!data || data.length === 0) {
        // This is the common failure point
        console.error("No rows returned. This means the UPDATE was rejected by Supabase RLS policies.");
        showToast({
          type: 'error',
          title: 'Permission Denied',
          message: "The database rejected this change. Your admin role might not be active."
        });
        return;
      }

      setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
      showToast({
        type: 'success',
        title: 'Status Updated',
        message: `Order status changed to ${status}`
      });
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "text-green-600 bg-green-50";
      case "cancelled": return "text-red-600 bg-red-50";
      case "shipped": return "text-blue-600 bg-blue-50";
      case "processing": return "text-primary bg-primary/10";
      default: return "text-amber-600 bg-amber-50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered": return <CheckCircle size={16} />;
      case "cancelled": return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">Orders</h2>
        <p className="text-foreground/50 font-medium">Manage and track customer orders.</p>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[32px] border border-border shadow-sm overflow-hidden">
        {orders.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center text-primary mx-auto mb-6">
              <ShoppingBag size={40} />
            </div>
            <h3 className="text-2xl font-bold mb-2">No orders yet</h3>
            <p className="text-foreground/50 max-w-sm mx-auto">When customers place orders, they will appear here in real-time.</p>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-primary/10">
            <table className="w-full text-left border-collapse min-w-[800px] lg:min-w-full">
              <thead>
                <tr className="bg-secondary/30 text-foreground/50 font-bold text-sm uppercase tracking-wider">
                  <th className="px-4 sm:px-8 py-6">Order ID</th>
                  <th className="px-4 sm:px-8 py-6">Customer</th>
                  <th className="px-4 sm:px-8 py-6">Total</th>
                  <th className="px-4 sm:px-8 py-6">Status</th>
                  <th className="px-4 sm:px-8 py-6">Date</th>
                  <th className="px-4 sm:px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-secondary/10 transition-colors">
                    <td className="px-4 sm:px-8 py-4 sm:py-6">
                      <span className="font-bold text-primary text-[10px] sm:text-xs truncate max-w-[80px] sm:max-w-[100px] block">#{order.id.split('-')[0]}</span>
                    </td>
                    <td className="px-4 sm:px-8 py-4 sm:py-6">
                      <div className="min-w-[120px]">
                        <p className="font-bold text-sm sm:text-base">{order.profiles?.full_name || order.shipping_address?.full_name || 'Customer'}</p>
                        <p className="text-[10px] sm:text-xs text-foreground/50 truncate max-w-[150px]">{order.profiles?.email}</p>
                      </div>
                    </td>
                    <td className="px-4 sm:px-8 py-4 sm:py-6 font-bold text-sm sm:text-base whitespace-nowrap">Rs. {order.total_amount}</td>
                    <td className="px-4 sm:px-8 py-4 sm:py-6">
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full font-bold text-[9px] sm:text-[10px] uppercase tracking-wider whitespace-nowrap",
                        getStatusColor(order.status)
                      )}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </div>
                    </td>
                    <td className="px-4 sm:px-8 py-4 sm:py-6 text-xs sm:text-sm font-medium text-foreground/50 whitespace-nowrap">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 sm:px-8 py-4 sm:py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <select 
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="bg-secondary/50 border-none rounded-xl py-1.5 px-2 sm:py-2 sm:px-3 text-[10px] sm:text-xs font-bold outline-none focus:ring-1 focus:ring-primary min-w-[100px]"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
