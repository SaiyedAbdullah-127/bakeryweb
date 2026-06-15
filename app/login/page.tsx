"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Dessert } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { isEmailAdmin } from "@/lib/constants";
import { useToast } from "@/lib/contexts/ToastContext";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  
  const router = useRouter();
  const supabase = createClient();

  const toggleAuth = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const redirectTo = searchParams?.get("redirect") || null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;

        if (redirectTo) {
          router.push(redirectTo);
          return;
        }

        if (isEmailAdmin(data.user?.email)) {
          router.push("/admin");
        } else {
          router.push("/shop");
        }
      } else {
        // Sign Up
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback${redirectTo ? `?next=${redirectTo}` : ''}`,
          },
        });

        if (signUpError) throw signUpError;

        showToast({
          type: 'success',
          title: 'Account Created',
          message: "You can now log in with your account."
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4 sm:px-6 py-12 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[32px] md:rounded-[40px] shadow-2xl shadow-primary/10 overflow-hidden border border-border"
      >
        <div className="p-6 md:p-12">
          {/* Header */}
          <div className="text-center mb-8 md:mb-10">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center bg-primary/10 text-primary mx-auto mb-6 shadow-lg shadow-primary/30 border border-primary/20"
            >
              <Dessert size={32} />
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {isLogin ? "Welcome Back!" : "Join The Sweet Boutique"}
            </h2>
            <p className="text-sm md:text-base text-foreground/50 mt-2">
              {isLogin
                ? "Your artisanal treats are just a login away."
                : "Create an account to start your sweet journey."}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-2xl mb-6 text-sm font-bold border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" size={20} />
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-secondary/50 border-none rounded-2xl py-3.5 md:py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary transition-all outline-none font-medium"
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" size={20} />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-secondary/50 border-none rounded-2xl py-3.5 md:py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary transition-all outline-none font-medium"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" size={20} />
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-secondary/50 border-none rounded-2xl py-3.5 md:py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary transition-all outline-none font-medium"
              />
            </div>


            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3.5 md:py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group mt-6 disabled:opacity-50"
            >
              {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
              {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="text-center mt-8 md:mt-10 text-foreground/50 font-medium text-sm md:text-base">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={toggleAuth}
              className="text-primary font-bold hover:underline"
            >
              {isLogin ? "Sign Up Free" : "Login Now"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
