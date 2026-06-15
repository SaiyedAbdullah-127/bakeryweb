"use client";

import React from "react";
import Link from "next/link";
import { Mail, MapPin, Phone, Camera, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Shop",
      links: [
        { name: "All Products", href: "/shop" },
        { name: "Best Sellers", href: "/best-sellers" },
        { name: "About Us", href: "/about" },
      ],
    },
    {
      title: "Account",
      links: [
        { name: "Sign In", href: "/login" },
        { name: "My Orders", href: "/orders" },
        { name: "Order Status", href: "/orders/status" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Contact Us", href: "#" },
        { name: "WhatsApp", href: "https://wa.me/923229693243" },
       
      ],
    },
  ];

  return (
    <footer className="bg-gradient-to-b from-secondary/30 to-secondary/5 border-t border-border">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
        {/* Top Section - Brand & Description */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12 pb-12 border-b border-border/30">
          <div className="md:col-span-1">
            <h3 className="text-xl md:text-2xl font-bold mb-3">
              The<span className="text-primary"> Boutique</span>
            </h3>
            <p className="text-sm md:text-base text-foreground/60 leading-relaxed">
              Freshly prepared artisan sweets and daily bakes using traditional recipes and premium ingredients.
            </p>
          </div>

          {/* Footer Links Grid */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-bold uppercase tracking-widest text-foreground mb-5">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-sm text-foreground/70 hover:text-primary transition-colors font-medium"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Middle Section - Contact & Social */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-border/30">
          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground mb-5">
              Get In Touch
            </h4>
            <div className="space-y-4">
              <a
                href="tel:+923311388890"
                className="flex items-center gap-3 text-foreground/70 hover:text-primary transition-colors"
              >
                <Phone size={18} className="text-primary shrink-0" />
                <span className="text-sm font-medium">+92 331 1388890</span>
              </a>
              <a
                href="https://wa.me/923229693243"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-foreground/70 hover:text-primary transition-colors"
              >
                <Phone size={18} className="text-green-500 shrink-0" />
                <span className="text-sm font-medium">WhatsApp</span>
              </a>
              <div className="flex items-start gap-3 text-foreground/70">
                <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                <span className="text-sm font-medium leading-relaxed">
                  Karachi, Pakistan
                </span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground mb-5">
              Follow Us
            </h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-12 h-12 rounded-2xl bg-secondary hover:bg-primary/10 text-primary hover:text-primary transition-all flex items-center justify-center border border-border hover:border-primary/30"
              >
                <Camera size={20} />
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-2xl bg-secondary hover:bg-primary/10 text-primary hover:text-primary transition-all flex items-center justify-center border border-border hover:border-primary/30"
              >
                <MessageCircle size={20} />
              </a>
              <a
                href="https://wa.me/923311388890"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-2xl bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700 transition-all flex items-center justify-center border border-green-200"
              >
                <Phone size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs md:text-sm text-foreground/40 font-medium text-center sm:text-left">
            &copy; {currentYear} The Sweet Boutique. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-foreground/40">
            <Link href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <span className="text-border/50">•</span>
            <Link href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <span className="text-border/50">•</span>
            <Link href="#" className="hover:text-primary transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
