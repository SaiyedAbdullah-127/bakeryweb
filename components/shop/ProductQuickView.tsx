"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Star, Flame, Info, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/store/useCart";

interface ProductQuickViewProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

const ProductQuickView = ({ product, isOpen, onClose }: ProductQuickViewProps) => {
  const addItem = useCart((state) => state.addItem);
  const [added, setAdded] = React.useState(false);
  
  const isOutOfStock = product?.stock <= 0;

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url,
      category: product.category
    });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && product && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center sm:p-4 md:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl bg-white rounded-t-[40px] md:rounded-[48px] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[95vh] md:max-h-[85vh]"
          >
            {/* Close Button (Mobile Floating) */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-50 p-3 bg-white/90 backdrop-blur-md hover:bg-white rounded-full shadow-2xl transition-all border border-border md:hidden"
            >
              <X size={24} />
            </button>

            {/* Left: Image (Stays top on mobile, becomes left on desktop) */}
            <div className="w-full md:w-[45%] h-[40vh] md:h-auto bg-secondary/20 relative group shrink-0">
              <img
                src={product.image_url || "https://images.unsplash.com/photo-1596797038530-2c39fa802057?q=80&w=500&auto=format&fit=crop"}
                alt={product.name}
                className={cn(
                  "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105",
                  isOutOfStock && "grayscale"
                )}
              />
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                {product.is_daily_bake && (
                  <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-primary flex items-center gap-2 shadow-xl uppercase tracking-widest border border-primary/10 w-fit">
                    <Star size={14} fill="currentColor" /> Daily Bake
                  </div>
                )}
              </div>
              
              {/* Close Button (Desktop Only) */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 hidden md:flex p-3 bg-white/90 backdrop-blur-md hover:bg-white rounded-full shadow-xl transition-all border border-border group-hover:scale-110 active:scale-90"
              >
                <X size={24} />
              </button>
            </div>

            {/* Right: Info */}
            <div className="w-full md:w-[55%] p-8 md:p-14 overflow-y-auto custom-scrollbar flex flex-col">
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                   <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                     {product.category || "Artisanal"}
                   </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6 leading-tight tracking-tight">
                  {product.name}
                </h2>
                <div className="flex items-center gap-6">
                  <p className="text-4xl font-extrabold text-primary">Rs. {product.price}</p>
                  <div className="h-8 w-px bg-border hidden sm:block" />
                  {isOutOfStock ? (
                    <span className="text-red-500 font-bold text-xs bg-red-50 px-4 py-2 rounded-xl uppercase tracking-widest border border-red-100">Out of Stock</span>
                  ) : (
                    <div className="flex flex-col">
                       <span className="text-green-600 font-bold text-xs uppercase tracking-widest">{product.stock} Units Left</span>
                       <div className="w-full h-1 bg-secondary rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.min(product.stock, 100)}%` }} />
                       </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-10 flex-1">
                {/* Description */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5 text-foreground/30">
                    <Info size={18} />
                    <h4 className="text-xs font-bold uppercase tracking-[0.2em]">About this Treat</h4>
                  </div>
                  <p className="text-foreground/70 leading-relaxed text-lg font-medium">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Add to Cart Footer */}
              <div className="mt-12 pt-8 border-t border-border flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || added}
                  className={cn(
                    "flex-1 py-5 md:py-6 rounded-[28px] font-extrabold text-xl transition-all flex items-center justify-center gap-3 shadow-2xl relative overflow-hidden",
                    isOutOfStock
                      ? "bg-secondary text-foreground/20 cursor-not-allowed shadow-none"
                      : added 
                        ? "bg-green-500 text-white shadow-green-200"
                        : "bg-primary text-white shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-1 active:scale-95"
                  )}
                >
                  <AnimatePresence mode="wait">
                    {added ? (
                      <motion.div
                        key="added"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.5 }}
                        className="flex items-center gap-2"
                      >
                        <Check size={28} strokeWidth={3} />
                        Added to Basket
                      </motion.div>
                    ) : (
                      <motion.div
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-3"
                      >
                        {isOutOfStock ? (
                          "Unavailable"
                        ) : (
                          <>
                            <ShoppingCart size={24} />
                            Add to Basket
                            <ChevronRight size={20} className="opacity-50" />
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProductQuickView;
