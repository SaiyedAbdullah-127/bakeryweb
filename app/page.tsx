"use client";

import Hero from "@/components/home/Hero";
import Link from "next/link";
import { ShoppingCart, Star, ArrowRight, Loader2, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";
import ProductQuickView from "@/components/shop/ProductQuickView";

const FeaturedCard = ({ product, index, onQuickView }: any) => {
  const isOutOfStock = product.stock <= 0;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-white p-4 md:p-6 rounded-[28px] md:rounded-[32px] shadow-sm border border-border group hover:shadow-xl hover:shadow-primary/10 transition-all text-left relative cursor-pointer"
      onClick={() => onQuickView(product)}
    >
      <div className="aspect-square bg-secondary rounded-[20px] md:rounded-2xl mb-4 overflow-hidden relative border border-secondary">
        <img 
          src={product.image_url || "https://images.unsplash.com/photo-1596797038530-2c39fa802057?q=80&w=500&auto=format&fit=crop"} 
          alt={product.name} 
          className={cn(
            "w-full h-full object-cover group-hover:scale-110 transition-transform duration-500",
            isOutOfStock && "grayscale"
          )} 
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-md p-2 rounded-full text-primary shadow-xl scale-90 group-hover:scale-100 transition-transform">
               <Eye size={20} />
            </div>
        </div>

        <div className="absolute top-3 left-3 md:top-4 md:left-4 flex flex-col gap-1.5 md:gap-2">
          {product.is_daily_bake && (
            <span className="bg-white/90 backdrop-blur-md px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[9px] md:text-[10px] font-bold text-primary flex items-center gap-1 shadow-sm uppercase tracking-wider w-fit">
              <Star size={10} className="md:w-3 md:h-3" fill="currentColor" /> Daily Bake
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-red-500 text-white px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[9px] md:text-[10px] font-bold shadow-md uppercase tracking-wider w-fit">
              Out of Stock
            </span>
          )}
        </div>
      </div>
      <div className="flex justify-between items-start mb-1 md:mb-2 min-h-[28px]">
        <h3 className="text-lg md:text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
        <span className="font-extrabold text-primary shrink-0 ml-2 text-base md:text-lg">Rs. {product.price}</span>
      </div>
      <p className="text-foreground/50 text-xs md:text-sm font-medium mb-4 md:mb-6 line-clamp-2 min-h-[32px] md:min-h-[40px] leading-relaxed">{product.description}</p>
      
      <button 
        className={cn(
          "w-full py-2.5 md:py-3 rounded-xl md:rounded-2xl font-bold text-sm md:text-base flex items-center justify-center gap-2 transition-all",
          isOutOfStock 
            ? "bg-secondary text-foreground/30 cursor-not-allowed" 
            : "bg-secondary text-primary hover:bg-primary hover:text-white"
        )}
      >
        {isOutOfStock ? "Sold Out" : <><ShoppingCart size={16} className="md:w-5 md:h-5" /> Add to Basket</>}
      </button>
    </motion.div>
  );
};

export default function Home() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, order_items(id)')
          .eq('is_active', true)
          .limit(20);
        
        if (error) throw error;
        
        // Sort by sales count or daily bake
        const sorted = (data || [])
          .sort((a: any, b: any) => {
            if (a.is_daily_bake && !b.is_daily_bake) return -1;
            if (!a.is_daily_bake && b.is_daily_bake) return 1;
            const aSales = a.order_items?.length || 0;
            const bSales = b.order_items?.length || 0;
            return bSales - aSales;
          })
          .slice(0, 3);
        
        setFeatured(sorted);
      } catch (error: any) {
        console.error("Error fetching featured products:", error.message || error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <>
    <div className="flex flex-col" suppressHydrationWarning>
      <Hero />
      
      {/* Featured Products */}
      <section className="py-12 md:py-24 bg-secondary/30 px-4 md:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 uppercase tracking-tight">Our <span className="text-primary">Daily Specialties</span></h2>
          <p className="text-xs md:text-base text-foreground/60 max-w-2xl mx-auto mb-8 md:mb-12 font-medium leading-relaxed px-2">
            Every morning we prepare our most loved artisanal sweets and fresh daily bakes using generational heritage recipes.
          </p>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-primary" size={40} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {featured.map((p, i) => (
                <FeaturedCard 
                  key={p.id} 
                  product={p} 
                  index={i} 
                  onQuickView={setSelectedProduct}
                />
              ))}
            </div>
          )}

          <div className="mt-10 md:mt-16 px-4">
             <Link 
               href="/shop" 
               className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border-2 border-primary/20 text-foreground px-8 py-4 md:px-10 md:py-4 rounded-xl md:rounded-[24px] font-bold hover:bg-secondary transition-all shadow-sm text-sm md:text-base"
             >
               View Full Menu <ArrowRight size={18} className="md:w-5 md:h-5" />
             </Link>
          </div>
        </div>
      </section>
    </div>

    <ProductQuickView 
      product={selectedProduct} 
      isOpen={!!selectedProduct} 
      onClose={() => setSelectedProduct(null)} 
    />
    </>
  );
}
