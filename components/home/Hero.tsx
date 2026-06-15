"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-[calc(100vh-80px)] lg:min-h-screen flex items-center overflow-hidden bg-white pt-20 md:pt-24 lg:pt-20">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 rounded-l-[100px] -z-10 hidden lg:block" />
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute -top-20 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-12 lg:py-0">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-secondary text-primary font-bold text-[10px] sm:text-xs md:text-sm mb-6 border border-primary/20">
            <Star size={14} className="md:w-4 md:h-4" fill="currentColor" />
            <span>Legendary Artisanal Heritage since 1971</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.2] lg:leading-[1.1] mb-6">
            Authentic <span className="text-primary italic">Heritage</span><br />
            Sweets & <span className="text-primary">Bakers</span>.
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg text-foreground/70 mb-8 max-w-lg leading-relaxed mx-auto lg:mx-0">
            From the iconic traditional treats to generational heritage recipes, experience the authentic taste of our renowned confectionery. Established by our family in 1971.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 px-4 sm:px-0">
            <Link
              href="/shop"
              className="w-full sm:w-auto bg-primary text-white px-8 py-3.5 md:py-4 rounded-2xl font-bold text-base md:text-lg flex items-center justify-center gap-2 shadow-xl shadow-primary/30 hover:shadow-primary/40 transition-all hover:-translate-y-1"
            >
              Shop Now <ArrowRight size={20} />
            </Link>
            <Link
              href="/best-sellers"
              className="w-full sm:w-auto bg-white border-2 border-primary/20 text-foreground px-8 py-3.5 md:py-4 rounded-2xl font-bold text-base md:text-lg hover:bg-secondary transition-all flex items-center justify-center"
            >
              View Best Sellers
            </Link>
          </div>

          <div className="mt-12 flex items-center gap-6 justify-center lg:justify-start">
            <div className="flex -space-x-4">
           
              
            </div>
            <div>
              
            </div>
          </div>
        </motion.div>

        {/* Visual Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring" }}
          className="relative hidden lg:block"
        >
          <div className="relative z-10 w-full aspect-square rounded-[40px] overflow-hidden shadow-2xl shadow-primary/20 border-8 border-white">
            <img 
              src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop" 
              alt="Freshly baked bread"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Floating Badges */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -top-6 -right-6 z-20 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-border"
          >
            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold">
              100%
            </div>
            <div>
              <p className="text-xs font-bold text-foreground/50">Ingredients</p>
              <p className="text-sm font-bold">All Natural</p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -bottom-6 -left-6 z-20 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-border"
          >
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">
              2h
            </div>
            <div>
              <p className="text-xs font-bold text-foreground/50">Delivery</p>
              <p className="text-sm font-bold">Ultra Fast</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
