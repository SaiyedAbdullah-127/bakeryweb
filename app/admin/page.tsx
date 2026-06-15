"use client";

import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-border shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group"
  >
    <div className="flex items-center justify-between mb-6">
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl md:rounded-3xl bg-secondary/50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
        <Icon size={24} className="md:w-7 md:h-7" />
      </div>
      <div className={cn(
        "flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full",
        trend === "up" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
      )}>
        {trend === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {trendValue}%
      </div>
    </div>
    <p className="text-foreground/40 font-bold text-xs uppercase tracking-widest">{title}</p>
    <h3 className="text-3xl md:text-4xl font-extrabold mt-2 tracking-tight">{value}</h3>
  </motion.div>
);

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeOrders: 0,
    totalCustomers: 0,
    avgOrderValue: 0,
    revenueTrend: 0,
    ordersTrend: 0,
    customersTrend: 0,
    avgTrend: 0,
    recentOrders: [] as any[]
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*, profiles(full_name, email)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;

      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

      const currentPeriodOrders = orders?.filter(o => new Date(o.created_at) > sevenDaysAgo) || [];
      const previousPeriodOrders = orders?.filter(o => {
        const date = new Date(o.created_at);
        return date <= sevenDaysAgo && date > fourteenDaysAgo;
      }) || [];

      const calculateTrend = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
      };

      // Total Stats
      const totalRevenue = orders
        ?.filter(o => o.status !== 'cancelled')
        .reduce((acc, o) => acc + Number(o.total_amount), 0) || 0;
      const totalCustomers = new Set(orders?.map(o => o.user_id)).size;
      const activeOrdersCount = orders?.filter(o => o.status === 'pending' || o.status === 'processing').length || 0;
      const avgOrderValueTotal = orders && orders.length > 0 ? totalRevenue / orders.length : 0;

      // Current Period Stats
      const currentRevenue = currentPeriodOrders
        .filter(o => o.status !== 'cancelled')
        .reduce((acc, o) => acc + Number(o.total_amount), 0);
      const currentCustomers = new Set(currentPeriodOrders.map(o => o.user_id)).size;
      const currentOrdersCount = currentPeriodOrders.length;
      const currentAvgValue = currentOrdersCount > 0 ? currentRevenue / currentOrdersCount : 0;

      // Previous Period Stats
      const previousRevenue = previousPeriodOrders
        .filter(o => o.status !== 'cancelled')
        .reduce((acc, o) => acc + Number(o.total_amount), 0);
      const previousCustomers = new Set(previousPeriodOrders.map(o => o.user_id)).size;
      const previousOrdersCount = previousPeriodOrders.length;
      const previousAvgValue = previousOrdersCount > 0 ? previousRevenue / previousOrdersCount : 0;

      setStats({
        totalRevenue,
        activeOrders: activeOrdersCount,
        totalCustomers,
        avgOrderValue: avgOrderValueTotal,
        revenueTrend: Number(calculateTrend(currentRevenue, previousRevenue).toFixed(1)),
        ordersTrend: Number(calculateTrend(currentOrdersCount, previousOrdersCount).toFixed(1)),
        customersTrend: Number(calculateTrend(currentCustomers, previousCustomers).toFixed(1)),
        avgTrend: Number(calculateTrend(currentAvgValue, previousAvgValue).toFixed(1)),
        recentOrders: orders?.slice(0, 5) || []
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  const { totalRevenue, activeOrders, totalCustomers, avgOrderValue, recentOrders, revenueTrend, ordersTrend, customersTrend, avgTrend } = stats;

  return (
    <div className="space-y-8 md:space-y-12">
      {/* Welcome Section */}
      <div className="text-center sm:text-left">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Dashboard Overview</h2>
        <p className="text-base md:text-lg text-foreground/40 font-medium mt-2">The latest insights from your artisanal bakery.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        <StatsCard 
          title="Total Revenue" 
          value={`Rs. ${totalRevenue.toLocaleString()}`} 
          icon={DollarSign} 
          trend={revenueTrend >= 0 ? "up" : "down"} 
          trendValue={Math.abs(revenueTrend)} 
          delay={0.1}
        />
        <StatsCard 
          title="Active Orders" 
          value={activeOrders.toString()} 
          icon={ShoppingBag} 
          trend={ordersTrend >= 0 ? "up" : "down"} 
          trendValue={Math.abs(ordersTrend)} 
          delay={0.2}
        />
        <StatsCard 
          title="Customers" 
          value={totalCustomers.toString()} 
          icon={Users} 
          trend={customersTrend >= 0 ? "up" : "down"} 
          trendValue={Math.abs(customersTrend)} 
          delay={0.3}
        />
        <StatsCard 
          title="Avg. Order" 
          value={`Rs. ${avgOrderValue.toFixed(0)}`} 
          icon={TrendingUp} 
          trend={avgTrend >= 0 ? "up" : "down"} 
          trendValue={Math.abs(avgTrend)} 
          delay={0.4}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-1 gap-8">
        <div className="bg-white rounded-[32px] md:rounded-[48px] border border-border shadow-sm overflow-hidden">
          <div className="p-8 md:p-10 border-b border-border flex items-center justify-between bg-secondary/10">
            <h3 className="text-xl md:text-2xl font-bold flex items-center gap-3">
               <ShoppingBag className="text-primary" />
               Recent Orders
            </h3>
            <Link href="/admin/orders" className="bg-white px-5 py-2 rounded-xl text-primary font-bold text-sm shadow-sm hover:shadow-md transition-all border border-primary/10">View All Orders</Link>
          </div>
          <div className="p-4 md:p-10">
             {recentOrders.length === 0 ? (
               <div className="text-center py-20">
                  <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center text-primary/30 mx-auto mb-6">
                     <ShoppingBag size={40} />
                  </div>
                  <p className="text-lg text-foreground/40 font-medium max-w-xs mx-auto">No orders yet. Your boutique is waiting for its first customer!</p>
               </div>
             ) : (
               <div className="space-y-4">
                 {recentOrders.map((order) => (
                   <div key={order.id} className="flex items-center justify-between p-5 md:p-6 bg-white border border-border rounded-3xl hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all group">
                      <div className="flex items-center gap-4 md:gap-6 min-w-0">
                         <div className="w-12 h-12 md:w-14 md:h-14 bg-secondary text-primary rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 shadow-inner group-hover:bg-primary group-hover:text-white transition-colors">
                            #{order.id.split('-')[0].substring(0, 4).toUpperCase()}
                         </div>
                         <div className="min-w-0">
                            <p className="font-extrabold text-base md:text-lg truncate text-foreground">{order.shipping_address?.full_name || order.profiles?.full_name || 'Anonymous Guest'}</p>
                            <p className="text-xs md:text-sm text-foreground/40 font-bold uppercase tracking-wider">{new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                         </div>
                      </div>
                      <div className="text-right shrink-0">
                         <p className="font-extrabold text-lg md:text-xl text-foreground">Rs. {order.total_amount}</p>
                         <div className={cn(
                           "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mt-1",
                           order.status === 'delivered' ? 'bg-green-50 text-green-600' : 
                           order.status === 'cancelled' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                         )}>
                            <div className={cn(
                              "w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse",
                              order.status === 'delivered' ? 'bg-green-600' : 
                              order.status === 'cancelled' ? 'bg-red-600' : 'bg-orange-600'
                            )} />
                            {order.status}
                         </div>
                      </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
