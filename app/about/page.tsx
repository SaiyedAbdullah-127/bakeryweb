"use client";

import React from "react";
import { motion } from "framer-motion";
import { History, Award, Users, MapPin, Heart } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white pt-24 md:pt-32 pb-12 md:pb-20" suppressHydrationWarning>
      {/* Hero Section */}
      <section className="px-4 md:px-6 mb-12 md:mb-24">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-primary font-bold text-xs md:text-sm mb-4 md:mb-6"
          >
            <History size={16} />
            <span>Legacy since 1971</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-4 md:mb-8 uppercase"
          >
            The Story of <span className="text-primary">Our Boutique</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-xl text-foreground/60 max-w-3xl mx-auto leading-relaxed px-2"
          >
            Preserving cultural roots through the sweetness of tradition, from our heritage to your home.
          </motion.p>
        </div>
      </section>

      {/* Main Story Content */}
      <section className="px-4 md:px-6 mb-20 md:mb-32">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative order-2 md:order-1"
          >
            <div className="aspect-[4/5] bg-secondary rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl">
               <img 
                 src="https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?q=80&w=1000&auto=format&fit=crop" 
                 alt="Traditional Sweets" 
                 className="w-full h-full object-cover"
               />
            </div>
            <div className="absolute -bottom-6 -right-6 md:-bottom-8 md:-right-8 bg-white p-4 md:p-8 rounded-[24px] md:rounded-[32px] shadow-xl border border-border">
               <p className="text-3xl md:text-4xl font-extrabold text-primary mb-0.5 md:mb-1">50+</p>
               <p className="font-bold text-foreground/50 uppercase tracking-widest text-[9px] md:text-xs">Years of Excellence</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4 md:space-y-6 order-1 md:order-2 text-center md:text-left"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Our Artisanal Legacy</h2>
            <div className="space-y-4 text-base md:text-lg text-foreground/70 leading-relaxed">
              <p>
                The Sweet Boutique was established by our family, who brought traditional generational recipes with them. We sought to preserve our cultural roots through the sweetness of our heritage.
              </p>
              <p>
                Starting with recipes passed down over generations, we have worked tirelessly to maintain the authentic taste and quality of our signature treats. Our iconic recipes have become a cornerstone of our identity.
              </p>
              <p className="hidden md:block">
                Today, we have expanded into a massive enterprise across the city, becoming one of the most renowned confectioneries, known for our commitment to tradition and quality.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats/Details Grid */}
      <section className="bg-secondary/30 py-16 md:py-24 px-4 md:px-6 mb-20 md:mb-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 text-center">
             <div className="space-y-3 md:space-y-4">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-2xl flex items-center justify-center text-primary mx-auto shadow-sm">
                   <Award size={28} className="md:w-8 md:h-8" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold">Iconic Recipes</h3>
                <p className="text-sm md:text-base text-foreground/60 font-medium">Traditional recipes preserved for generations with modern quality standards.</p>
             </div>
             <div className="space-y-3 md:space-y-4">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-2xl flex items-center justify-center text-primary mx-auto shadow-sm">
                   <Users size={28} className="md:w-8 md:h-8" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold">Family Heritage</h3>
                <p className="text-sm md:text-base text-foreground/60 font-medium">Owned and operated with love by our family since 1971.</p>
             </div>
             <div className="space-y-3 md:space-y-4">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-2xl flex items-center justify-center text-primary mx-auto shadow-sm">
                   <MapPin size={28} className="md:w-8 md:h-8" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold">Citywide Presence</h3>
                <p className="text-sm md:text-base text-foreground/60 font-medium">Multiple branches across the city to serve our loyal customers.</p>
             </div>
          </div>
        </div>
      </section>

      {/* Cultural Significance Section */}
      <section className="px-4 md:px-6 pb-12 md:pb-20">
         <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
            <div className="inline-flex items-center justify-center gap-2 text-primary">
               <Heart size={24} fill="currentColor" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Cultural Significance</h2>
            <p className="text-lg md:text-xl text-foreground/70 leading-relaxed italic px-4">
              "Because traditional treats are central to cultural celebrations, we see our highest demand during events like national holidays and family gatherings. Our business has grown beyond just a bakery into a symbol of sweet cultural heritage."
            </p>
            <div className="pt-4 md:pt-8">
               <p className="font-bold text-base md:text-lg">Our Founder</p>
               <p className="text-foreground/50 font-medium uppercase tracking-widest text-[10px] md:text-xs mt-1">Proprietor, The Sweet Boutique</p>
            </div>
         </div>
      </section>
    </div>
  );
};

export default AboutPage;
