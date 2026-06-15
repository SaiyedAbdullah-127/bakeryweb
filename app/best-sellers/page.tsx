"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ShoppingCart, ArrowRight, Award, Loader2, Cake, ShoppingBag, Eye, Heart } from "lucide-react";
import { useCart } from "@/lib/store/useCart";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import ProductQuickView from "@/components/shop/ProductQuickView";

const BestSellerCard = ({ product, index, onQuickView }: any) => {
  const addItem = useCart((state) => state.addItem);
  const isOutOfStock = product.stock <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group bg-white rounded-[40px] border border-border shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all p-4 md:p-8 relative cursor-pointer"
      onClick={() => onQuickView(product)}
    >
      <div className="relative aspect-square rounded-[32px] md:rounded-[40px] overflow-hidden bg-secondary/30 mb-6 md:mb-10">
         <img 
           src={product.image_url || "https://images.unsplash.com/photo-1596797038530-2c39fa802057?q=80&w=500&auto=format&fit=crop"} 
           alt={product.name}
           className={cn(
             "w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110",
             isOutOfStock && "grayscale"
           )}
         />
         
         {/* Premium Overlay */}
         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-white/95 backdrop-blur-md px-6 py-3 rounded-2xl text-primary font-bold shadow-2xl scale-90 group-hover:scale-100 transition-all flex items-center gap-2">
               <Eye size={20} /> View Details
            </div>
         </div>

         <div className="absolute top-5 left-5 md:top-8 md:left-8 flex flex-col gap-2">
            <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-full text-[10px] md:text-xs font-bold text-primary flex items-center gap-2 shadow-xl uppercase tracking-[0.15em] border border-primary/10 w-fit">
              <Award size={16} fill="currentColor" /> Signature
            </div>
            {isOutOfStock && (
              <div className="bg-red-500 text-white px-4 py-2 rounded-full text-[10px] md:text-xs font-bold flex items-center gap-2 shadow-xl uppercase tracking-[0.15em] w-fit">
                Out of Stock
              </div>
            )}
         </div>
         
         <div className="absolute bottom-5 right-5 md:bottom-8 md:right-8">
            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-2xl">
               <Star size={24} fill="currentColor" />
            </div>
         </div>
      </div>
      
      <div className="space-y-4 md:space-y-6 px-1 md:px-2">
        <div className="flex flex-col gap-2">
           <div className="flex items-center justify-between">
              <span className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-[0.2em]">{product.category}</span>
              <div className="flex items-center gap-1.5 text-foreground/30">
                 <ShoppingBag size={14} />
                 <span className="text-[10px] font-bold">{product.salesCount} Sold</span>
              </div>
           </div>
           <h3 className="text-2xl md:text-4xl font-extrabold text-foreground group-hover:text-primary transition-colors line-clamp-1 tracking-tight">
             {product.name}
           </h3>
        </div>
        
        <p className="text-foreground/50 text-sm md:text-lg font-medium leading-relaxed line-clamp-2 min-h-[40px] md:min-h-[56px]">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-secondary">
           <span className="font-extrabold text-2xl md:text-3xl text-primary">Rs. {product.price}</span>
           <button 
             onClick={(e) => {
               e.stopPropagation();
               addItem({
                 id: product.id,
                 name: product.name,
                 price: product.price,
                 image: product.image_url,
                 category: product.category
               });
             }}
             disabled={isOutOfStock}
             className={cn(
               "p-4 rounded-2xl transition-all shadow-xl",
               isOutOfStock
                 ? "bg-secondary text-foreground/20 cursor-not-allowed shadow-none"
                 : "bg-primary text-white shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 active:scale-95"
             )}
           >
             <ShoppingCart size={24} />
           </button>
        </div>
      </div>
    </motion.div>
  );
};

const BestSellersPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchBestSellers();
  }, []);

  const fetchBestSellers = async () => {
    try {
      const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select('product_id');
      
      if (itemsError) throw itemsError;

      const counts: Record<string, number> = {};
      orderItems?.forEach(item => {
        counts[item.product_id] = (counts[item.product_id] || 0) + 1;
      });

      const sortedIds = Object.keys(counts)
        .filter(id => counts[id] > 0)
        .sort((a, b) => counts[b] - counts[a]);

      if (sortedIds.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      const { data: popularProducts, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .in('id', sortedIds.slice(0, 12)); 
      
      if (productsError) throw productsError;

      const finalProducts = (popularProducts || [])
        .map(p => ({ ...p, salesCount: counts[p.id] || 0 }))
        .sort((a, b) => b.salesCount - a.salesCount);

      setProducts(finalProducts);

    } catch (error: any) {
      console.error("Error fetching best sellers:", error.message || error);
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
    <>
    <div className="min-h-screen bg-white pt-24 md:pt-40 pb-16 md:pb-32 px-4 md:px-6" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
           <motion.div
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-secondary text-primary font-bold text-xs md:text-sm mb-6 md:mb-8 border border-primary/20 shadow-sm"
           >
             <Star size={16} fill="currentColor" />
             <span className="uppercase tracking-[0.2em]">The Artisanal Hall of Fame</span>
           </motion.div>
           <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter mb-6 md:mb-10 text-foreground">
             Our <span className="text-primary italic">Best</span> Sellers
           </h1>
           <p className="text-lg md:text-2xl text-foreground/40 max-w-3xl mx-auto font-medium leading-relaxed">
             A live ranking of our signature treats, loved by our community for generations.
           </p>
        </div>

        {/* Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 max-w-6xl mx-auto">
             {products.map((product, index) => (
               <BestSellerCard 
                 key={product.id} 
                 product={product} 
                 index={index} 
                 onQuickView={setSelectedProduct}
               />
             ))}
          </div>
        ) : (
          <div className="py-24 text-center max-w-md mx-auto bg-secondary/20 rounded-[48px] p-12 border border-secondary">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-primary mx-auto mb-8 shadow-xl">
              <ShoppingBag size={48} />
            </div>
            <h3 className="text-3xl font-extrabold mb-4">The Hall is Empty</h3>
            <p className="text-foreground/50 font-medium mb-10 leading-relaxed text-lg">Our community is still deciding the favorites. Be the first to place an order!</p>
            <Link href="/shop" className="inline-flex items-center gap-3 bg-primary text-white px-10 py-5 rounded-2xl font-extrabold text-xl shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all">
               Browse Shop <ArrowRight size={20} />
            </Link>
          </div>
        )}

        {/* Premium CTA */}
        <div className="mt-24 md:mt-40 bg-foreground rounded-[48px] md:rounded-[64px] p-10 md:p-24 text-center text-white shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full -mr-[250px] -mt-[250px] blur-3xl group-hover:bg-primary/20 transition-colors duration-1000" />
           <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary/5 rounded-full -ml-[150px] -mb-[150px] blur-3xl" />
           
           <div className="relative z-10 flex flex-col items-center">
             <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 border border-white/10">
                <Heart size={32} className="text-primary" fill="currentColor" />
             </div>
             <h2 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight">Crave more <span className="text-primary">tradition</span>?</h2>
             <p className="text-white/50 text-lg md:text-2xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
               Discover our full range of artisanal sweets, daily bakes, and savory treats delivered straight to your door.
             </p>
             <Link 
               href="/shop" 
               className="w-full sm:w-auto inline-flex items-center justify-center gap-4 bg-primary text-foreground px-12 py-6 rounded-[28px] font-extrabold text-2xl hover:bg-white transition-all hover:-translate-y-2 shadow-2xl shadow-primary/10"
             >
               Explore Full Menu <ArrowRight size={24} />
             </Link>
           </div>
        </div>
      </div>
    </div>

    <ProductQuickView 
      product={selectedProduct} 
      isOpen={!!selectedProduct} 
      onClose={() => setSelectedProduct(null)} 
    />
    </>
  );
};

export default BestSellersPage;
