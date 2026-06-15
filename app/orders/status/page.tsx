"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { CheckCircle, Package, Truck, Home, ArrowRight, Loader2 } from "lucide-react";

const StatusContent = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (orderId) {
      fetchOrder();
      
      // Subscribe to real-time changes
      const subscription = supabase
        .channel(`order-status-${orderId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'orders',
            filter: `id=eq.${orderId}`
          },
          (payload) => {
            setOrder(payload.new);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
      
      if (error) throw error;
      setOrder(data);
    } catch (error) {
      console.error("Error fetching order:", error);
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

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Order not found</h2>
          <Link href="/shop" className="text-primary hover:underline mt-4 inline-block font-bold">Return to Shop</Link>
        </div>
      </div>
    );
  }

  const getStatusInfo = () => {
    switch (order?.status) {
      case 'delivered':
        return { title: "Order Delivered!", sub: "Your heritage treats have reached their destination." };
      case 'shipped':
        return { title: "Order Shipped!", sub: "Your sweets are on their way to you." };
      case 'cancelled':
        return { title: "Order Cancelled", sub: "This order has been cancelled." };
      default:
        return { title: "Order Confirmed!", sub: "Thank you for your purchase. We're preparing your treats." };
    }
  };

  const statusInfo = getStatusInfo();
  const statusSteps = [
    { key: 'preparing', icon: Package, text: "Preparing", statuses: ['pending', 'processing', 'shipped', 'delivered'] },
    { key: 'shipped', icon: Truck, text: "On the way", statuses: ['shipped', 'delivered'] },
    { key: 'delivered', icon: Home, text: "Delivered", statuses: ['delivered'] }
  ];

  return (
    <div className="min-h-screen bg-secondary/30 pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-border text-center"
        >
          <div className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6",
            order.status === 'cancelled' ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
          )}>
            <CheckCircle size={40} />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-2">{statusInfo.title}</h2>
          <p className="text-foreground/50 font-medium mb-8">
            {statusInfo.sub} <span className="text-primary font-bold text-xs">#{order.id.split('-')[0]}</span>
          </p>

          {order.status !== 'cancelled' && (
            <div className="grid grid-cols-3 gap-4 mb-12 relative">
               {/* Progress Line */}
               <div className="absolute top-6 left-[15%] right-[15%] h-1 bg-secondary -z-0 hidden sm:block">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ 
                      width: order.status === 'delivered' ? '100%' : 
                             order.status === 'shipped' ? '50%' : '0%' 
                    }}
                    className="h-full bg-primary"
                  />
               </div>
               
               {statusSteps.map((step, i) => {
                 const isActive = step.statuses.includes(order.status);
                 return (
                   <div key={i} className="flex flex-col items-center gap-3 relative z-10">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                        isActive ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-secondary text-foreground/30'
                      )}>
                         <step.icon size={24} />
                      </div>
                      <span className={cn(
                        "text-xs font-bold transition-colors duration-500",
                        isActive ? 'text-primary' : 'text-foreground/30'
                      )}>{step.text}</span>
                   </div>
                 );
               })}
            </div>
          )}

          <div className="bg-secondary/50 rounded-3xl p-6 mb-8 text-left space-y-4">
             <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-foreground/50">Total Amount</span>
                <span className="text-lg font-bold">Rs. {order.total_amount}</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-foreground/50">Delivery Address</span>
                <span className="text-sm font-bold truncate max-w-[200px]">{order.shipping_address?.address}, {order.shipping_address?.city}</span>
             </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
             <Link 
               href="/shop" 
               className="flex-1 bg-secondary text-primary py-4 rounded-2xl font-bold hover:bg-primary hover:text-white transition-all"
             >
               Continue Shopping
             </Link>
             <Link 
               href="/" 
               className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
             >
               Back to Home <ArrowRight size={20} />
             </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const OrderStatusPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    }>
      <StatusContent />
    </Suspense>
  );
};

export default OrderStatusPage;
