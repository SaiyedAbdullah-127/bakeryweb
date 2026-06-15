"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  LogOut, 
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import MobileSidebar from "@/components/layout/MobileSidebar";

import { createClient } from "@/utils/supabase/client";
import { isEmailAdmin } from "@/lib/constants";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      }
    };

    setHasMounted(true);
    handleResize();
    window.addEventListener("resize", handleResize);

    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/login");
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      setIsAuthorized(profileData?.role === 'admin' || isEmailAdmin(session.user.email));
    };

    fetchProfile();

    return () => window.removeEventListener("resize", handleResize);
  }, [supabase, router]);

  const menuItems = [
    { name: "Overview", icon: LayoutDashboard, href: "/admin" },
    { name: "Products", icon: Package, href: "/admin/products" },
    { name: "Orders", icon: ShoppingBag, href: "/admin/orders" },
    { name: "Customers", icon: Users, href: "/admin/customers" },
  ];

  const userLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Best Sellers", href: "/best-sellers" },
    { name: "Our Story", href: "/about" },
  ];

  const dashboardLinks = menuItems;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
         <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/20 flex">

      {/* Mobile Sidebar Drawer (reusable) */}
      {hasMounted && isMobile && (
        <MobileSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          userItems={userLinks}
          adminItems={dashboardLinks}
          pathname={pathname}
          isAdmin={true}
          isDashboardOpen={isDashboardOpen}
          onDashboardToggle={() => setIsDashboardOpen((open) => !open)}
        />
      )}

      {/* Desktop Sidebar (hidden on mobile to avoid overlap with MobileSidebar) */}
      <aside 
        className={cn(
          "hidden lg:flex bg-white border-r border-border transition-all duration-300 z-50 lg:static lg:inset-y-0 lg:left-0 lg:shadow-none",
          isSidebarOpen ? "lg:w-64" : "lg:w-20",
        )}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-6 flex items-center justify-between">
            <AnimatePresence mode="wait">
              {isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-bold text-xl tracking-tight"
                >
                  Admin<span className="text-primary">Panel</span>
                </motion.div>
              )}
            </AnimatePresence>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-secondary rounded-xl transition-colors lg:hidden"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group relative",
                    isActive ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-secondary text-foreground/60 hover:text-foreground"
                  )}
                >
                  <item.icon size={22} className={cn("shrink-0", isActive ? "text-white" : "group-hover:text-primary")} />
                  <AnimatePresence mode="wait">
                    {isSidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="font-semibold whitespace-nowrap"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isActive && (
                    <motion.div 
                      layoutId="active-indicator"
                      className="absolute right-2 w-1.5 h-6 bg-white rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-border">
            <button 
              onClick={() => {
                localStorage.removeItem("auth-user");
                window.location.href = "/";
              }}
              className="flex items-center gap-4 px-4 py-3 w-full rounded-2xl hover:bg-red-50 text-red-500 transition-all font-semibold"
            >
              <LogOut size={22} />
              {isSidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden h-screen">
        {/* Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-secondary/5">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
