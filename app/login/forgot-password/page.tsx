"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Dessert, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/lib/contexts/ToastContext";
import { cn } from "@/lib/utils";

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const { showToast } = useToast();
  
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/login/reset-password`,
      });
      
      if (error) throw error;

      showToast({
        type: 'success',
        title: 'Email Sent',
        message: "Check your email for the password reset link! Be sure to check your spam folder."
      });
      setEmail("");
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Error',
        message: err.message
      });
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
              Forgot Password?
            </h2>
            <p className="text-sm md:text-base text-foreground/50 mt-2">
              Enter your email and we'll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3.5 md:py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group mt-6 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
              {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="text-center mt-8 md:mt-10">
            <Link 
              href="/login"
              className="text-primary font-bold hover:underline flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} />
              Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
