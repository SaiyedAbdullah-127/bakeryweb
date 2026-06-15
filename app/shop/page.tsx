"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ShoppingCart, Cake, Star, ArrowRight, Loader2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/store/useCart";
import { createClient } from "@/utils/supabase/client";
import ProductQuickView from "@/components/shop/ProductQuickView";

const ProductCard = ({ product, delay, onQuickView }: any) => {
  const addItem = useCart((state) => state.addItem);
  const isOutOfStock = product.stock <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="group bg-white rounded-[24px] md:rounded-[32px] border border-border shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all p-3 md:p-4 relative cursor-pointer"
      onClick={() => onQuickView(product)}
    >
      <div className="relative aspect-square rounded-[20px] md:rounded-[24px] overflow-hidden bg-secondary/30 mb-4 md:mb-6">
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
            <div className="bg-white/90 backdrop-blur-md p-3 rounded-full text-primary shadow-xl scale-90 group-hover:scale-100 transition-transform">
               <Eye size={24} />
            </div>
         </div>

         <div className="absolute top-3 left-3 md:top-4 md:left-4 flex flex-col gap-1.5 md:gap-2">
            {product.is_daily_bake && (
              <div className="bg-white/90 backdrop-blur-md px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[9px] md:text-[10px] font-bold text-primary flex items-center gap-1 shadow-sm uppercase tracking-wider border border-primary/10 w-fit">
                <Star size={10} className="md:w-3 md:h-3" fill="currentColor" /> Daily Bake
              </div>
            )}
            {isOutOfStock && (
              <div className="bg-red-500 text-white px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[9px] md:text-[10px] font-bold flex items-center gap-1 shadow-md uppercase tracking-wider w-fit">
                Sold Out
              </div>
            )}
         </div>
      </div>
      
      <div className="px-1 md:px-2">
        <div className="flex justify-between items-start mb-1 md:mb-2">
           <h3 className="text-lg md:text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
             {product.name}
           </h3>
        </div>
        <div className="flex items-center justify-between mb-3 md:mb-4">
           <span className="font-extrabold text-base md:text-lg text-primary">Rs. {product.price}</span>
           <span className="text-[10px] md:text-xs font-bold text-foreground/30 uppercase tracking-widest">{product.category}</span>
        </div>
        <p className="text-foreground/50 text-xs md:text-sm font-medium mb-4 md:mb-6 line-clamp-2 min-h-[32px] md:min-h-[40px]">
           {product.description}
        </p>

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
             "w-full py-2.5 md:py-3 rounded-xl md:rounded-2xl font-bold text-sm md:text-base transition-all flex items-center justify-center gap-2 group/btn",
             isOutOfStock 
              ? "bg-secondary text-foreground/30 cursor-not-allowed" 
              : "bg-secondary text-primary hover:bg-primary hover:text-white"
           )}
        >
           {isOutOfStock ? (
             <>Sold Out</>
           ) : (
             <><ShoppingCart size={16} className="md:w-5 md:h-5" /> Add to Basket</>
           )}
        </button>
      </div>
    </motion.div>
  );
};


const ShopPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState(["All"]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  const supabase = createClient();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Supabase error fetching products:", error.message);
        throw error;
      }
      
      const allProducts = data || [];
      setProducts(allProducts);

      // Extract unique categories dynamically
      const uniqueCategories = ["All", ...Array.from(new Set(allProducts.map(p => p.category).filter(Boolean)))];
      setCategories(uniqueCategories);
      
    } catch (error: any) {
      console.error("Caught error in fetchProducts:", error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-white pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-6" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-8 mb-8 md:mb-12 text-center lg:text-left">
           <div>
             <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3 md:mb-4">
               Our <span className="text-primary">Bakery</span>
             </h1>
             <p className="text-xs sm:text-sm md:text-base text-foreground/50 font-medium max-w-lg mx-auto lg:mx-0">
               Browse our daily selection of artisan treats, crafted with the finest local ingredients and a whole lot of love.
             </p>
           </div>
           
           <div className="flex flex-wrap justify-center lg:justify-start gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-full font-bold text-[10px] sm:text-xs md:text-sm transition-all whitespace-nowrap",
                    activeCategory === cat 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "bg-secondary text-primary hover:bg-primary/10"
                  )}
                >
                  {cat}
                </button>
              ))}
           </div>
        </div>

        {/* Search & Results Info */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
           <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" size={18} />
              <input 
                type="text" 
                placeholder="Search for bread, cakes..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-secondary/30 border-none rounded-2xl py-3.5 md:py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-sm md:text-base"
              />
           </div>
           <p className="text-[10px] md:text-xs font-bold text-foreground/40 uppercase tracking-widest">
             Showing {filteredProducts.length} Products
           </p>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
             {filteredProducts.map((product, index) => (
               <ProductCard 
                 key={product.id} 
                 product={product} 
                 delay={index * 0.1} 
                 onQuickView={setSelectedProduct}
               />
             ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-secondary rounded-full flex items-center justify-center text-primary mx-auto mb-6">
              <Cake size={32} className="md:w-10 md:h-10" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold">No products found</h3>
            <p className="text-sm md:text-base text-foreground/50">Try adjusting your search or category filters.</p>
          </div>
        )}

        {/* Load More Placeholder */}
        <div className="mt-12 md:mt-20 text-center">
           <button className="w-full md:w-auto bg-white border-2 border-primary/20 text-foreground px-8 py-4 rounded-[20px] md:rounded-[24px] font-bold hover:bg-secondary transition-all">
             Load More Delights
           </button>
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

export default ShopPage;
