"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Save, 
  Image as ImageIcon, 
  Loader2,
  Plus,
  Tag,
  Check,
  X,
  Flame,
  Star
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";
import { useToast } from "@/lib/contexts/ToastContext";

const NewProductPage = () => {
  const router = useRouter();
  const supabase = createClient();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    category_id: "",
    image_url: "",
    stock: "50",
    is_daily_bake: false
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) {
        console.error("Supabase error fetching categories:", error);
        throw error;
      }
      setCategories(data || []);
      if (data && data.length > 0 && !formData.category) {
        setFormData(prev => ({ 
          ...prev, 
          category: data[0].name,
          category_id: data[0].id
        }));
      }
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      showToast({
        type: 'error',
        title: 'Fetch Error',
        message: "Error fetching categories: " + (error.message || JSON.stringify(error))
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    if (name === 'category') {
      const selectedCat = categories.find(c => c.name === value);
      setFormData(prev => ({ 
        ...prev, 
        category: value,
        category_id: selectedCat?.id || "" 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: val }));
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name: newCategoryName.trim() }])
        .select()
        .single();
      
      if (error) {
        if (error.code === '23505') {
          showToast({
            type: 'warning',
            title: 'Category Exists',
            message: "This category already exists."
          });
        } else {
          throw error;
        }
        return;
      }

      setCategories(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      setFormData(prev => ({ 
        ...prev, 
        category: data.name,
        category_id: data.id
      }));
      setNewCategoryName("");
      setShowAddCategory(false);
      showToast({
        type: 'success',
        title: 'Category Added',
        message: "New category has been created successfully!"
      });
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Error',
        message: "Error adding category: " + error.message
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('products')
        .insert([{
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock)
        }]);
      
      if (error) throw error;
      showToast({
        type: 'success',
        title: 'Product Created',
        message: `${formData.name} has been added to your inventory.`
      });
      router.push("/admin/products");
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Error',
        message: "Error adding product: " + error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-10 pb-12 md:pb-20 px-4 md:px-0">
      {/* Header */}
      <div className="flex items-center gap-3 md:gap-6">
        <Link 
          href="/admin/products"
          className="p-3 hover:bg-secondary rounded-2xl transition-colors text-foreground/50 hover:text-foreground bg-white border border-border shadow-sm"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">Add New Treat</h2>
          <p className="text-sm md:text-lg text-foreground/50 font-medium">Fill in the details for your next bestseller.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-6 md:gap-10">
        {/* Left Column - Details */}
        <div className="lg:col-span-8 space-y-6 md:space-y-10">
          <div className="bg-white p-6 md:p-10 rounded-[32px] md:rounded-[48px] shadow-sm border border-border space-y-6 md:space-y-8">
            <div className="space-y-2 md:space-y-3">
              <label className="text-xs md:text-sm font-bold text-foreground/40 uppercase tracking-widest ml-1">Product Name</label>
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Signature Sourdough"
                className="w-full bg-secondary/30 border-none rounded-2xl py-4 md:py-5 px-6 md:px-8 focus:ring-2 focus:ring-primary transition-all outline-none font-bold text-lg md:text-xl placeholder:text-foreground/20"
              />
            </div>

            <div className="space-y-2 md:space-y-3">
              <label className="text-xs md:text-sm font-bold text-foreground/40 uppercase tracking-widest ml-1">Description</label>
              <textarea
                required
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Tell the story of this treat..."
                className="w-full bg-secondary/30 border-none rounded-2xl py-4 md:py-5 px-6 md:px-8 focus:ring-2 focus:ring-primary transition-all outline-none font-medium resize-none text-base md:text-lg placeholder:text-foreground/20"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-2 md:space-y-3">
                <label className="text-xs md:text-sm font-bold text-foreground/40 uppercase tracking-widest ml-1">Price (PKR)</label>
                <div className="relative">
                   <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-foreground/30">Rs.</span>
                   <input
                    required
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full bg-secondary/30 border-none rounded-2xl py-4 md:py-5 pl-14 pr-8 focus:ring-2 focus:ring-primary transition-all outline-none font-bold text-lg md:text-xl"
                  />
                </div>
              </div>
              <div className="space-y-2 md:space-y-3">
                <label className="text-xs md:text-sm font-bold text-foreground/40 uppercase tracking-widest ml-1">Stock Level</label>
                <input
                  required
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="50"
                  className="w-full bg-secondary/30 border-none rounded-2xl py-4 md:py-5 px-6 md:px-8 focus:ring-2 focus:ring-primary transition-all outline-none font-bold text-lg md:text-xl"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Right Column - Media & Category */}
        <div className="lg:col-span-4 space-y-6 md:space-y-10">
          <div className="bg-white p-6 md:p-8 rounded-[32px] md:rounded-[40px] shadow-sm border border-border space-y-6 md:space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs md:text-sm font-bold text-foreground/40 uppercase tracking-widest">Category</label>
                <button 
                  type="button"
                  onClick={() => setShowAddCategory(!showAddCategory)}
                  className="text-primary text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 bg-secondary/50 rounded-full hover:bg-primary hover:text-white transition-all"
                >
                  {showAddCategory ? <X size={14} /> : <Plus size={14} />}
                  {showAddCategory ? "Cancel" : "New"}
                </button>
              </div>

              {showAddCategory ? (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex gap-2">
                    <input
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="New category..."
                      className="flex-1 bg-secondary/30 border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-1 focus:ring-primary outline-none"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      className="bg-primary text-white p-3 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                    >
                      <Check size={20} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/30" size={18} />
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-secondary/30 border-none rounded-2xl py-4 md:py-5 pl-14 pr-8 focus:ring-2 focus:ring-primary transition-all outline-none font-bold text-base md:text-lg appearance-none cursor-pointer"
                  >
                    {categories.length > 0 ? (
                      categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))
                    ) : (
                      <option disabled>No categories found</option>
                    )}
                  </select>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <label className="text-xs md:text-sm font-bold text-foreground/40 uppercase tracking-widest ml-1">Product Image</label>
              <div className="aspect-square rounded-[32px] md:rounded-[40px] bg-secondary/20 flex flex-col items-center justify-center text-foreground/20 border-4 border-dashed border-border/50 overflow-hidden relative group transition-all hover:border-primary/20">
                {formData.image_url ? (
                  <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center shadow-sm mb-4">
                       <ImageIcon size={32} />
                    </div>
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-center px-6">No Image Selected</span>
                  </>
                )}
              </div>
              <input
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="Paste direct image link..."
                className="w-full bg-secondary/30 border-none rounded-xl py-3 px-5 focus:ring-2 focus:ring-primary transition-all outline-none font-medium text-[10px] md:text-xs placeholder:text-foreground/20"
              />
            </div>

            <div className="flex items-center gap-4 p-5 md:p-6 bg-secondary/20 rounded-3xl border border-primary/5">
              <div className="relative">
                 <input
                  type="checkbox"
                  name="is_daily_bake"
                  id="is_daily_bake"
                  checked={formData.is_daily_bake}
                  onChange={handleChange}
                  className="w-6 h-6 rounded-lg border-none text-primary focus:ring-primary cursor-pointer transition-transform active:scale-90"
                />
              </div>
              <label htmlFor="is_daily_bake" className="flex flex-col cursor-pointer select-none">
                <span className="text-sm md:text-base font-bold text-foreground/80 flex items-center gap-1.5">
                   Daily Bake <Star size={14} className="text-primary" fill="currentColor" />
                </span>
                <span className="text-[10px] md:text-xs font-medium text-foreground/40">Feature on the homepage specialties</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-5 md:py-6 rounded-[28px] md:rounded-[32px] font-extrabold text-xl md:text-2xl shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
              Save Product
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewProductPage;
