"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/store/useCart";
import Link from "next/link";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                 <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary rounded-xl flex items-center justify-center text-white">
                    <ShoppingBag size={20} className="sm:w-[22px]" />
                 </div>
                 <h2 className="text-lg sm:text-xl font-bold">Your Basket ({totalItems()})</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 sm:p-2 hover:bg-secondary rounded-xl transition-colors"
              >
                <X size={22} className="sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                   <div className="w-16 h-16 sm:w-20 sm:h-20 bg-secondary rounded-full flex items-center justify-center text-primary mb-4 opacity-50">
                      <ShoppingBag size={32} className="sm:w-10" />
                   </div>
                   <h3 className="text-base sm:text-lg font-bold">Your basket is empty</h3>
                   <p className="text-sm text-foreground/50 mt-2 font-medium">Add some artisan treats to get started!</p>
                   <button 
                     onClick={onClose}
                     className="mt-6 text-primary font-bold hover:underline"
                   >
                     Browse Shop
                   </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-3 sm:gap-4 group">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-secondary/50 overflow-hidden shrink-0 border border-border">
                       <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                       <div>
                         <div className="flex justify-between items-start">
                            <h4 className="font-bold text-base sm:text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">{item.name}</h4>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="text-foreground/30 hover:text-red-500 transition-colors p-1"
                            >
                               <Trash2 size={16} className="sm:w-[18px]" />
                            </button>
                         </div>
                         <p className="text-primary font-extrabold text-sm sm:text-base mt-0.5 sm:mt-1">Rs. {item.price}</p>
                       </div>
                       
                       <div className="flex items-center justify-between mt-1 sm:mt-2">
                          <div className="flex items-center gap-2 sm:gap-3 bg-secondary px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg sm:rounded-xl">
                             <button 
                               onClick={() => updateQuantity(item.id, item.quantity - 1)}
                               className="text-primary hover:scale-120 transition-transform p-1"
                             >
                               <Minus size={14} className="sm:w-4" />
                             </button>
                             <span className="font-bold text-xs sm:text-sm min-w-[16px] text-center">{item.quantity}</span>
                             <button 
                               onClick={() => updateQuantity(item.id, item.quantity + 1)}
                               className="text-primary hover:scale-120 transition-transform p-1"
                             >
                               <Plus size={14} className="sm:w-4" />
                             </button>
                          </div>
                          <p className="font-bold text-xs sm:text-sm">Rs. {item.price * item.quantity}</p>
                       </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 sm:p-8 border-t border-border bg-secondary/10">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                   <span className="text-sm sm:text-base text-foreground/50 font-bold">Subtotal</span>
                   <span className="text-xl sm:text-2xl font-extrabold text-primary">Rs. {totalPrice()}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-1 transition-all group"
                >
                  Checkout Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <p className="text-center mt-4 text-xs text-foreground/40 font-bold uppercase tracking-widest">
                  Shipping & taxes calculated at checkout
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
