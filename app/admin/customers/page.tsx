"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, Loader2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const supabase = createClient();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, orders:orders(count)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">Customers</h2>
        <p className="text-sm md:text-base text-foreground/50 font-medium">Manage your registered boutique customers.</p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" size={20} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-border rounded-2xl py-3.5 md:py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary transition-all outline-none text-sm md:text-base"
          />
        </div>
        <button className="hidden md:flex bg-white border border-border px-6 py-4 rounded-2xl font-bold items-center gap-2 hover:bg-secondary transition-all text-foreground/60">
          <Filter size={20} /> Filters
        </button>
      </div>

      {/* Customers Table/Grid */}
      <div className="bg-white rounded-[24px] md:rounded-[32px] border border-border shadow-sm overflow-hidden">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/30 text-foreground/50 font-bold text-sm uppercase tracking-wider">
                <th className="px-8 py-6">Registered Name</th>
                <th className="px-8 py-6">Role</th>
                <th className="px-8 py-6">Orders</th>
                <th className="px-8 py-6">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-secondary/10 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0 overflow-hidden">
                        {customer.avatar_url ? (
                          <img src={customer.avatar_url} className="w-full h-full object-cover" alt="" />
                        ) : (
                          customer.full_name?.charAt(0).toUpperCase() || <User size={20} />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-lg">{customer.full_name || customer.email?.split('@')[0] || "Guest Customer"}</p>
                        <p className="text-xs text-foreground/50 font-medium">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      customer.role === 'admin' ? "bg-primary text-white" : "bg-secondary text-foreground/60"
                    )}>
                      {customer.role}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-bold">{customer.orders?.[0]?.count || 0} orders</span>
                  </td>
                  <td className="px-8 py-6 text-sm font-medium text-foreground/50">
                    {new Date(customer.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-border">
          {filteredCustomers.map((customer) => (
            <div key={customer.id} className="p-6 space-y-4">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0 overflow-hidden">
                    {customer.avatar_url ? (
                      <img src={customer.avatar_url} className="w-full h-full object-cover" alt="" />
                    ) : (
                      customer.full_name?.charAt(0).toUpperCase() || <User size={20} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-base truncate">{customer.full_name || "Guest Customer"}</p>
                    <p className="text-xs text-foreground/50 truncate">{customer.email}</p>
                  </div>
               </div>
               <div className="flex items-center justify-between pt-2">
                  <div className="flex flex-col gap-1">
                     <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Total Orders</span>
                     <span className="text-sm font-bold">{customer.orders?.[0]?.count || 0}</span>
                  </div>
                  <div className="flex flex-col gap-1 text-right">
                     <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Member Since</span>
                     <span className="text-xs font-bold text-foreground/60">{new Date(customer.created_at).toLocaleDateString()}</span>
                  </div>
               </div>
            </div>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <div className="p-12 text-center">
            <User className="mx-auto text-foreground/20 mb-4" size={48} />
            <p className="text-foreground/50 font-medium">No customers found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCustomersPage;
