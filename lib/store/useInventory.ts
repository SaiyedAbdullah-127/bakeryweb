import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string | number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  image: string;
  description: string;
  tag?: string;
}

interface InventoryStore {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string | number, product: Partial<Product>) => void;
  deleteProduct: (id: string | number) => void;
}

const initialProducts: Product[] = [
  { 
    id: 1, 
    name: "Iconic Sweet Yogurt", 
    category: "Sweets", 
    price: 450, 
    stock: 50, 
    status: "In Stock",
    tag: "Best Seller",
    image: "https://images.unsplash.com/photo-1596797038530-2c39fa802057?q=80&w=500&auto=format&fit=crop",
    description: "Our legendary artisanal sweet yogurt, a traditional heritage recipe."
  },
  { 
    id: 2, 
    name: "Signature Heritage Sweets", 
    category: "Sweets", 
    price: 1200, 
    stock: 30, 
    status: "In Stock",
    tag: "Signature",
    image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=500&auto=format&fit=crop",
    description: "Delicate, syrup-soaked artisanal sweets made fresh every morning."
  },
  { 
    id: 3, 
    name: "Premium Nimco Mix", 
    category: "Savories", 
    price: 600, 
    stock: 100, 
    status: "In Stock",
    tag: "Daily Fresh",
    image: "https://images.unsplash.com/photo-1601004890684-d8cbf343c92c?q=80&w=500&auto=format&fit=crop",
    description: "A crunchy, savory assortment of our best-selling Nimco snacks.",
  },
];

export const useInventory = create<InventoryStore>()(
  persist(
    (set) => ({
      products: initialProducts,
      addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
      updateProduct: (id, updatedProduct) => set((state) => ({
        products: state.products.map((p) => 
          p.id === id ? { ...p, ...updatedProduct } : p
        )
      })),
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter((p) => p.id !== id)
      })),
    }),
    {
      name: 'bakery-inventory',
    }
  )
);
