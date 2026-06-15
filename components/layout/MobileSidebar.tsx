"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
 
 type MenuItem = { name: string; href: string; icon?: any };
 
 type Props = {
  isOpen: boolean;
  onClose: () => void;
  userItems: MenuItem[];
  adminItems: MenuItem[];
  pathname: string | null | undefined;
  isAdmin?: boolean;
  isDashboardOpen: boolean;
  onDashboardToggle: () => void;
};

const MobileSidebar: React.FC<Props> = ({
  isOpen,
  onClose,
  userItems,
  adminItems,
  pathname,
  isAdmin,
  isDashboardOpen,
  onDashboardToggle,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          />

          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[100] shadow-2xl lg:hidden flex flex-col"
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10 text-primary border border-primary/20">
                  <span className="font-bold">S</span>
                </div>
                <span className="text-lg font-bold tracking-tight uppercase">The<span className="text-primary"> Boutique</span></span>
              </Link>
              <button onClick={onClose} className="p-2 hover:bg-secondary rounded-xl transition-colors">
                <ArrowRight size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-foreground/40 mb-3 font-semibold">Browse</p>
                <div className="space-y-2">
                  {userItems.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={onClose}
                      className={cn(
                        "text-lg font-bold py-4 px-5 rounded-2xl transition-all flex items-center justify-between group",
                        pathname === link.href ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-secondary text-foreground/80"
                      )}
                    >
                      {link.name}
                      <ArrowRight size={18} className={cn(pathname === link.href ? "opacity-100" : "opacity-0 group-hover:opacity-100")} />
                    </Link>
                  ))}
                </div>
              </div>

              {isAdmin && (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={onDashboardToggle}
                    className="w-full flex items-center justify-between text-lg font-bold py-4 px-5 rounded-2xl transition-all bg-secondary/50 hover:bg-secondary"
                  >
                    <span>Dashboard</span>
                    <ChevronRight
                      size={20}
                      className={cn(
                        "transition-transform duration-300",
                        isDashboardOpen ? "rotate-90" : "rotate-0"
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {isDashboardOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2 overflow-hidden"
                      >
                        {adminItems.map((link) => (
                          <Link
                            key={link.name}
                            href={link.href}
                            onClick={onClose}
                            className={cn(
                              "block text-base font-semibold py-3 px-5 rounded-2xl transition-all",
                              pathname === link.href ? "bg-primary text-white" : "hover:bg-secondary text-foreground/80"
                            )}
                          >
                            {link.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <div className="h-px bg-border my-6" />
            </div>

            <div className="p-6 border-t border-border bg-secondary/10">
              <p className="text-center text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em]">The Sweet Boutique &copy; 2026</p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;
