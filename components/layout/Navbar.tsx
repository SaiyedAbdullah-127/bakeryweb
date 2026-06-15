"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, User, Menu, X, LogOut, LayoutDashboard, ShoppingBag, Dessert, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/store/useCart";
import CartDrawer from "@/components/cart/CartDrawer";
import { createClient } from "@/utils/supabase/client";
import { isEmailAdmin } from "@/lib/constants";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const totalItems = useCart((state) => state.totalItems());

  // Hide global navbar when inside admin dashboard routes


  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Initial session and auth change combined listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();
        setProfile(profileData);
      } else {
        setProfile(null);
      }
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Best Sellers", href: "/best-sellers" },
    { name: "Our Story", href: "/about" },
  ];

  const isAdmin = profile?.role === 'admin' || isEmailAdmin(user?.email);

  return (
    <>
    <nav
      suppressHydrationWarning
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-3 md:px-6 py-3 md:py-4",
        isScrolled || isMobileMenuOpen ? "bg-white/95 backdrop-blur-md shadow-sm py-2 md:py-3" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 md:gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 sm:gap-1.5 group shrink min-w-0">
          <motion.div
            whileHover={{ rotate: 15 }}
            className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-primary/10 text-primary border border-primary/20 shrink-0"
          >
            <Dessert size={14} className="sm:w-5 sm:h-5" />
          </motion.div>
          <span className="text-sm sm:text-base md:text-2xl font-bold tracking-tight text-foreground whitespace-nowrap overflow-hidden uppercase truncate">
           The<span className="text-primary"> Boutique </span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-10 flex-1 justify-center px-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-sm font-bold transition-all relative group whitespace-nowrap tracking-wide",
                pathname === link.href ? "text-primary" : "text-foreground/70 hover:text-primary"
              )}
            >
              {link.name}
              <span className={cn(
                "absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 bg-primary rounded-full transition-all duration-300",
                pathname === link.href ? "w-1.5" : "w-0 group-hover:w-1.5"
              )} />
            </Link>
          ))}
        </div>

        {/* Icons & Profile */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-5 shrink-0">
          {mounted && isAdmin && (
            <Link
              href="/admin"
              className="hidden lg:flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl font-bold text-xs hover:bg-primary hover:text-white transition-all border border-primary/10"
            >
              <LayoutDashboard size={14} />
              Admin
            </Link>
          )}

          <button 
            onClick={() => setIsCartOpen(true)}
            className="p-2 hover:bg-secondary rounded-xl md:rounded-2xl transition-all relative shrink-0 group"
          >
            <ShoppingCart size={20} className="sm:w-6 sm:h-6 text-foreground/80 group-hover:text-primary transition-colors" />
            {mounted && totalItems > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1 right-1 bg-primary text-white text-[8px] sm:text-[9px] w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center font-bold border-2 border-white shadow-lg"
              >
                {totalItems}
              </motion.span>
            )}
          </button>
          
          <div className="flex items-center h-8 sm:h-10 border-l border-border ml-1 pl-2 sm:ml-2 sm:pl-5 gap-1 sm:gap-3">
            {mounted && (
              <>
                {user ? (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="hidden sm:flex flex-col items-end leading-tight select-none">
                      <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest">{profile?.role || 'user'}</span>
                      <span className="text-sm font-bold text-foreground truncate max-w-[120px]">
                        {profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0]}
                      </span>
                    </div>
                    
                    <div className="relative group/profile">
                      <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-secondary flex items-center justify-center text-primary border border-border group-hover/profile:border-primary/20 transition-all">
                        <User size={18} className="sm:w-5 sm:h-5" />
                      </button>
                      
                      {/* Dropdown Menu */}
                      <div className="absolute right-0 top-full pt-2 opacity-0 translate-y-2 pointer-events-none group-hover/profile:opacity-100 group-hover/profile:translate-y-0 group-hover/profile:pointer-events-auto transition-all duration-200 z-[60]">
                        <div className="bg-white rounded-2xl shadow-2xl border border-border p-2 w-48 overflow-hidden">
                           <div className="px-4 py-3 border-b border-border/50 mb-1">
                              <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Account</p>
                              <p className="text-xs font-bold truncate">{user.email}</p>
                           </div>
                           <Link href="/orders" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-bold text-foreground/70 hover:bg-secondary rounded-xl transition-colors">
                              <ShoppingBag size={18} />
                              My Orders
                           </Link>
                           {isAdmin && (
                             <Link href="/admin" className="lg:hidden flex items-center gap-2.5 px-4 py-2.5 text-sm font-bold text-primary hover:bg-primary/5 rounded-xl transition-colors">
                                <LayoutDashboard size={18} />
                                Dashboard
                             </Link>
                           )}
                           <button 
                             onClick={handleSignOut}
                             className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors mt-1"
                           >
                              <LogOut size={18} />
                              Sign Out
                           </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link 
                    href="/login" 
                    className="flex items-center gap-1.5 sm:gap-2 bg-primary text-white px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all"
                  >
                    <User size={16} className="sm:w-[18px]" />
                    <span className="hidden xs:inline sm:inline">Sign In</span>
                  </Link>
                )}
              </>
            )}

            <button
              className="md:hidden p-2 hover:bg-secondary rounded-xl transition-colors shrink-0"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

    </nav>

    {/* Mobile Sidebar Drawer (moved outside nav to fix stacking context on mobile) */}
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[70] md:hidden shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10 text-primary border border-primary/20">
                  <Dessert size={18} />
                </div>
                <span className="text-lg font-bold tracking-tight uppercase">
                  The<span className="text-primary"> Boutique</span>
                </span>
              </Link>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-secondary rounded-xl transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "text-lg font-bold py-4 px-5 rounded-2xl transition-all flex items-center justify-between group",
                    pathname === link.href ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-secondary text-foreground/80"
                  )}
                >
                  {link.name}
                  <ArrowRight size={18} className={cn(pathname === link.href ? "opacity-100" : "opacity-0 group-hover:opacity-100")} />
                </Link>
              ))}
              
              {mounted && isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-bold text-primary py-4 px-5 rounded-2xl hover:bg-primary/10 transition-all flex items-center justify-between group"
                >
                  Dashboard
                  <LayoutDashboard size={18} />
                </Link>
              )}

              <div className="h-px bg-border my-6" />

              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 px-5 py-2">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl border border-primary/20">
                      {profile?.full_name?.charAt(0) || user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                       <p className="font-bold text-lg truncate">{profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0]}</p>
                       <p className="text-xs text-foreground/50 truncate uppercase tracking-widest font-bold">{profile?.role || 'User'}</p>
                    </div>
                  </div>
                  <Link
                    href="/orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-bold py-4 px-5 rounded-2xl hover:bg-secondary transition-all flex items-center justify-between"
                  >
                    My Orders
                    <ShoppingBag size={18} />
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full bg-red-50 text-red-500 py-4 rounded-2xl text-center font-bold flex items-center justify-center gap-2 mt-4 hover:bg-red-100 transition-colors"
                  >
                    <LogOut size={20} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full bg-primary text-white py-4 rounded-2xl text-center font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mt-4"
                >
                  <User size={20} />
                  Login / Register
                </Link>
              )}
            </div>
            
            <div className="p-6 border-t border-border bg-secondary/10">
              <p className="text-center text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em]">
                The Sweet Boutique &copy; 2026
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>

    <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
