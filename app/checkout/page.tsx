"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/lib/store/useCart";
import { useRouter } from "next/navigation";
import { ShoppingBag, ChevronRight, CreditCard, Truck, ShieldCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/lib/contexts/ToastContext";

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const supabase = createClient();
  const { showToast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    phone: "",
  });

  useEffect(() => {
    setMounted(true);
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/login?redirect=/checkout");
    } else {
      setUser(session.user);
      // Pre-fill email if available
      setFormData(prev => ({ ...prev, email: session.user.email || "" }));
      setCheckingAuth(false);
    }
  };

  if (!mounted || checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  const total = totalPrice();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || !user) return;

    setLoading(true);

    try {
      // 1. Pre-check Stock
      const { data: latestProducts, error: stockCheckError } = await supabase
        .from('products')
        .select('id, stock, name')
        .in('id', items.map(i => i.id));

      if (stockCheckError) throw stockCheckError;

      for (const item of items) {
        const product = latestProducts.find(p => p.id === item.id);
        if (!product || product.stock < item.quantity) {
          showToast({
            type: 'error',
            title: 'Stock Error',
            message: `Sorry, "${item.name}" is now out of stock or has insufficient quantity.`
          });
          setLoading(false);
          return;
        }
      }

      // 2. Create Order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: user.id,
          total_amount: total,
          shipping_address: {
            full_name: `${formData.firstName} ${formData.lastName}`,
            address: formData.address,
            city: formData.city,
            phone: formData.phone
          },
          status: 'pending'
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // 3. Create Order Items
      const orderItemsData = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsData);

      if (itemsError) throw itemsError;

      // 4. Update Stock Levels
      const stockUpdates = items.map(item => {
        const currentStock = latestProducts.find(p => p.id === item.id)?.stock || 0;
        return supabase
          .from('products')
          .update({ stock: currentStock - item.quantity })
          .eq('id', item.id);
      });

      await Promise.all(stockUpdates);

      // 5. Success
      clearCart();
      router.push("/orders/status?id=" + order.id);
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Order Error',
        message: "Error placing order: " + error.message
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center text-primary mb-6">
          <ShoppingBag size={40} />
        </div>
        <h2 className="text-3xl font-bold mb-2">Your basket is empty</h2>
        <p className="text-foreground/50 mb-8 max-w-md">Looks like you haven't added any sweet treats to your basket yet.</p>
        <Link href="/shop" className="bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-primary/20">
          Go to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30 pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 md:gap-12">
        {/* Checkout Form */}
        <div className="lg:col-span-8 space-y-6 md:space-y-8 order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 md:p-12 rounded-[32px] md:rounded-[40px] shadow-sm border border-border"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Shipping Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-sm font-bold text-foreground/60 ml-2">First Name</label>
                  <input
                    required
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="John"
                    className="w-full bg-secondary/50 border-none rounded-2xl py-3.5 md:py-4 px-6 focus:ring-2 focus:ring-primary transition-all outline-none font-medium text-sm md:text-base"
                  />
                </div>
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-sm font-bold text-foreground/60 ml-2">Last Name</label>
                  <input
                    required
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Doe"
                    className="w-full bg-secondary/50 border-none rounded-2xl py-3.5 md:py-4 px-6 focus:ring-2 focus:ring-primary transition-all outline-none font-medium text-sm md:text-base"
                  />
                </div>
              </div>

              <div className="space-y-1.5 md:space-y-2">
                <label className="text-sm font-bold text-foreground/60 ml-2">Email Address</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className="w-full bg-secondary/50 border-none rounded-2xl py-3.5 md:py-4 px-6 focus:ring-2 focus:ring-primary transition-all outline-none font-medium opacity-70 text-sm md:text-base"
                  readOnly
                />
              </div>

              <div className="space-y-1.5 md:space-y-2">
                <label className="text-sm font-bold text-foreground/60 ml-2">Delivery Address</label>
                <input
                  required
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="123 Street, Area"
                  className="w-full bg-secondary/50 border-none rounded-2xl py-3.5 md:py-4 px-6 focus:ring-2 focus:ring-primary transition-all outline-none font-medium text-sm md:text-base"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-sm font-bold text-foreground/60 ml-2">City</label>
                  <input
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="w-full bg-secondary/50 border-none rounded-2xl py-3.5 md:py-4 px-6 focus:ring-2 focus:ring-primary transition-all outline-none font-medium text-sm md:text-base"
                  />
                </div>
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-sm font-bold text-foreground/60 ml-2">Phone Number</label>
                  <input
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="0300-1234567"
                    className="w-full bg-secondary/50 border-none rounded-2xl py-3.5 md:py-4 px-6 focus:ring-2 focus:ring-primary transition-all outline-none font-medium text-sm md:text-base"
                  />
                </div>
              </div>

              <div className="pt-4 md:pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-4 md:py-5 rounded-[20px] md:rounded-[24px] font-bold text-lg md:text-xl shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {loading ? "Processing Order..." : "Confirm & Place Order"}
                  {!loading && <CreditCard size={24} />}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3 md:gap-4">
             {[
               { icon: Truck, text: "Fast Delivery" },
               { icon: ShieldCheck, text: "Secure Payment" },
               { icon: ShoppingBag, text: "Fresh Baked" }
             ].map((item, i) => (
               <div key={i} className="bg-white/50 border border-border p-3 md:p-4 rounded-2xl md:rounded-3xl flex flex-col items-center gap-1.5 md:gap-2 text-center">
                  <item.icon size={20} className="text-primary md:w-6 md:h-6" />
                  <span className="text-[10px] md:text-xs font-bold text-foreground/60">{item.text}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4 order-1 lg:order-2">
          <div className="bg-white p-6 md:p-8 rounded-[32px] md:rounded-[40px] shadow-sm border border-border sticky top-24 md:top-32">
            <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Order Summary</h3>
            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8 max-h-[300px] md:max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 md:gap-4">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-secondary rounded-xl overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-xs md:text-sm leading-tight line-clamp-1">{item.name}</h4>
                    <p className="text-[10px] md:text-xs text-foreground/50 font-medium">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-xs md:text-sm">Rs. {item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 md:space-y-4 border-t border-border pt-4 md:pt-6">
              <div className="flex justify-between text-sm md:text-base font-medium">
                <span className="text-foreground/50">Subtotal</span>
                <span>Rs. {total}</span>
              </div>
              <div className="flex justify-between text-sm md:text-base font-medium">
                <span className="text-foreground/50">Delivery Fee</span>
                <span className="text-green-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-lg md:text-xl font-extrabold pt-3 md:pt-4 border-t border-dashed border-border">
                <span>Total</span>
                <span className="text-primary">Rs. {total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
