"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Cake,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/lib/contexts/ToastContext";

const ProductsPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { showToast } = useToast();
  
  const supabase = createClient();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error("Error fetching products:", error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to hide this product? It will no longer be visible to customers, but will remain in your records for existing orders.")) return;

    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: false })
        .eq('id', id);
      
      if (error) throw error;

      setProducts(products.map(p => p.id === id ? { ...p, is_active: false } : p));
      showToast({
        type: 'success',
        title: 'Product Hidden',
        message: "Product has been successfully hidden from customers."
      });
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Error',
        message: "Error hiding product: " + error.message
      });
    }
  };

  const filteredProducts = products.filter(p => 
    (p.is_active !== false) && (
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
    )
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Products</h2>
          <p className="text-sm md:text-base text-foreground/50 font-medium">Manage your bakery inventory and pricing.</p>
        </div>
        <Link 
          href="/admin/products/new"
          className="bg-primary text-white px-6 py-3.5 md:py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-1 transition-all text-sm md:text-base"
        >
          <Plus size={20} /> Add New Product
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full bg-white border border-border rounded-2xl py-3.5 md:py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary transition-all outline-none text-sm md:text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="hidden md:flex bg-white border border-border px-6 py-4 rounded-2xl font-bold items-center gap-2 hover:bg-secondary transition-all text-foreground/60">
          <Filter size={20} /> Filters
        </button>
      </div>

      {/* Products Display */}
      <div className="bg-white rounded-[24px] md:rounded-[32px] border border-border shadow-sm overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/30 text-foreground/50 font-bold text-sm uppercase tracking-wider">
                <th className="px-8 py-6">Product</th>
                <th className="px-8 py-6">Category</th>
                <th className="px-8 py-6">Price</th>
                <th className="px-8 py-6">Stock</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-secondary/10 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-primary shrink-0 overflow-hidden">
                        {product.image_url ? (
                          <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Cake size={24} />
                        )}
                      </div>
                      <span className="font-bold text-lg">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-4 py-1.5 rounded-full bg-secondary/50 text-primary font-bold text-sm">
                      {product.category || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-bold">Rs. {product.price}</td>
                  <td className="px-8 py-6 font-semibold">{product.stock} units</td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/admin/products/edit/${product.id}`}
                        className="p-2 hover:bg-secondary rounded-xl text-foreground/40 hover:text-primary transition-colors"
                      >
                        <Edit size={20} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 hover:bg-red-50 rounded-xl text-foreground/40 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-border">
          {filteredProducts.map((product) => (
            <div key={product.id} className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-primary shrink-0 overflow-hidden">
                  {product.image_url ? (
                    <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Cake size={28} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-lg truncate">{product.name}</h4>
                  <p className="text-sm font-bold text-primary">Rs. {product.price}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Category</span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-secondary text-primary w-fit">{product.category || 'None'}</span>
                </div>
                <div className="flex flex-col gap-1 text-right">
                  <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">In Stock</span>
                  <span className="text-sm font-bold">{product.stock} units</span>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Link 
                  href={`/admin/products/edit/${product.id}`}
                  className="flex-1 bg-secondary text-primary font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  <Edit size={18} /> Edit
                </Link>
                <button 
                  onClick={() => handleDelete(product.id)}
                  className="flex-1 bg-red-50 text-red-500 font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} /> Hide
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="p-12 text-center">
            <Cake className="mx-auto text-foreground/20 mb-4" size={48} />
            <p className="text-foreground/50 font-medium">No products found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
