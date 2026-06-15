"use client";

import React, { useState, useEffect } from "react";
import { Settings, User, Bell, Shield, Paintbrush, Globe, Save, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

const AdminSettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("Profile");
  const [settings, setSettings] = useState<any>({
    hero_title: "The Sweet Boutique",
    hero_subtitle: "Artisanal heritage sweets and bakers established since 1971.",
    logo_url: "https://i.pravatar.cc/150?u=admin",
    primary_color: "#FBBF24",
    secondary_color: "#FFFFFF",
    notifications: {
      email_alerts: true,
      order_updates: true,
      marketing: false
    },
    security: {
      two_factor: false,
      login_history: true
    }
  });

  const supabase = createClient();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (data && data.length > 0) {
        setSettings((prev: any) => ({ ...prev, ...data[0] }));
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const settingsToSave = {
        hero_title: settings.hero_title,
        hero_subtitle: settings.hero_subtitle,
        logo_url: settings.logo_url,
        primary_color: settings.primary_color,
        secondary_color: settings.secondary_color
      };

      let query;
      if (settings.id) {
        query = supabase
          .from('site_settings')
          .update(settingsToSave)
          .eq('id', settings.id);
      } else {
        query = supabase
          .from('site_settings')
          .insert([settingsToSave]);
      }

      const { error } = await query;
      
      if (error) throw error;
      alert("Settings saved successfully!");
      fetchSettings();
    } catch (error: any) {
      alert("Error saving settings: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  const navItems = [
    { icon: User, text: "Profile" },
    { icon: Bell, text: "Notifications" },
    { icon: Shield, text: "Security" },
    { icon: Paintbrush, text: "Appearance" },
    { icon: Globe, text: "General" },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h2 className="text-3xl font-bold">Settings</h2>
        <p className="text-foreground/50 font-medium">Manage your bakery profile and system preferences.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3">
           <div className="bg-white rounded-[32px] border border-border shadow-sm p-4 space-y-2 sticky top-32">
              {navItems.map((item, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveTab(item.text)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all",
                    activeTab === item.text ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-secondary text-foreground/50 hover:text-foreground"
                  )}
                >
                  <item.icon size={20} />
                  {item.text}
                </button>
              ))}
           </div>
        </div>

        <div className="lg:col-span-9 space-y-8">
           <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-border">
              {activeTab === "Profile" && (
                <div className="space-y-6">
                   <h3 className="text-2xl font-bold mb-8">Bakery Profile</h3>
                   <div className="flex items-center gap-8 mb-10">
                      <div className="w-24 h-24 rounded-[32px] bg-secondary flex items-center justify-center text-primary relative group cursor-pointer overflow-hidden">
                         <img src={settings.logo_url} className="w-full h-full object-cover" alt="Logo" />
                         <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Paintbrush size={24} className="text-white" />
                         </div>
                      </div>
                      <div>
                         <h4 className="font-bold text-xl">{settings.hero_title}</h4>
                         <p className="text-foreground/50 text-sm font-medium">Update your bakery logo and public name.</p>
                      </div>
                   </div>

                   <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-sm font-bold text-foreground/60 ml-2">Bakery Name</label>
                         <input 
                           value={settings.hero_title}
                           onChange={(e) => setSettings({...settings, hero_title: e.target.value})}
                           className="w-full bg-secondary/50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary transition-all outline-none font-medium"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-sm font-bold text-foreground/60 ml-2">Logo URL</label>
                         <input 
                           value={settings.logo_url}
                           onChange={(e) => setSettings({...settings, logo_url: e.target.value})}
                           className="w-full bg-secondary/50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary transition-all outline-none font-medium"
                         />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground/60 ml-2">Store Description</label>
                      <textarea 
                        rows={4}
                        value={settings.hero_subtitle}
                        onChange={(e) => setSettings({...settings, hero_subtitle: e.target.value})}
                        className="w-full bg-secondary/50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary transition-all outline-none font-medium resize-none"
                      />
                   </div>
                </div>
              )}

              {activeTab === "Notifications" && (
                <div className="space-y-6">
                   <h3 className="text-2xl font-bold mb-8">Notification Preferences</h3>
                   {[
                     { label: "Email Alerts", desc: "Receive emails for new orders", key: "email_alerts" },
                     { label: "Order Updates", desc: "Notify customers on status change", key: "order_updates" },
                     { label: "Marketing Emails", desc: "Send weekly newsletters", key: "marketing" }
                   ].map((item) => (
                     <div key={item.key} className="flex items-center justify-between p-4 bg-secondary/30 rounded-2xl">
                        <div>
                           <p className="font-bold">{item.label}</p>
                           <p className="text-xs text-foreground/50 font-medium">{item.desc}</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={settings.notifications?.[item.key]} 
                          onChange={(e) => setSettings({
                            ...settings, 
                            notifications: { ...settings.notifications, [item.key]: e.target.checked }
                          })}
                          className="w-6 h-6 rounded-lg border-2 border-primary text-primary focus:ring-primary"
                        />
                     </div>
                   ))}
                </div>
              )}

              {activeTab === "Security" && (
                <div className="space-y-6">
                   <h3 className="text-2xl font-bold mb-8">Security & Privacy</h3>
                   <div className="p-6 bg-amber-50 border border-amber-100 rounded-3xl mb-6">
                      <div className="flex items-center gap-3 text-amber-600 mb-2">
                         <Shield size={20} />
                         <span className="font-bold">Enhanced Protection</span>
                      </div>
                      <p className="text-amber-800/70 text-sm font-medium">Your data is secured using Supabase Row Level Security (RLS).</p>
                   </div>
                   <button className="w-full py-4 bg-secondary text-primary font-bold rounded-2xl hover:bg-primary hover:text-white transition-all">Change Admin Password</button>
                   <button className="w-full py-4 border-2 border-border text-foreground/60 font-bold rounded-2xl hover:border-primary hover:text-primary transition-all">Enable Two-Factor Authentication</button>
                </div>
              )}

              {activeTab === "Appearance" && (
                <div className="space-y-6">
                   <h3 className="text-2xl font-bold mb-8">Visual Theme</h3>
                   <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-sm font-bold text-foreground/60 ml-2">Primary Brand Color</label>
                         <div className="flex gap-4">
                            <input 
                              type="color"
                              value={settings.primary_color}
                              onChange={(e) => setSettings({...settings, primary_color: e.target.value})}
                              className="w-12 h-12 rounded-xl border-none cursor-pointer"
                            />
                            <input 
                              value={settings.primary_color}
                              onChange={(e) => setSettings({...settings, primary_color: e.target.value})}
                              className="flex-1 bg-secondary/50 border-none rounded-2xl py-3 px-6 font-mono"
                            />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-sm font-bold text-foreground/60 ml-2">Secondary Color</label>
                         <div className="flex gap-4">
                            <input 
                              type="color"
                              value={settings.secondary_color}
                              onChange={(e) => setSettings({...settings, secondary_color: e.target.value})}
                              className="w-12 h-12 rounded-xl border-none cursor-pointer"
                            />
                            <input 
                              value={settings.secondary_color}
                              onChange={(e) => setSettings({...settings, secondary_color: e.target.value})}
                              className="flex-1 bg-secondary/50 border-none rounded-2xl py-3 px-6 font-mono"
                            />
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === "General" && (
                <div className="space-y-6">
                   <h3 className="text-2xl font-bold mb-8">General Configuration</h3>
                   <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground/60 ml-2">Language</label>
                        <select className="w-full bg-secondary/50 border-none rounded-2xl py-4 px-6 font-medium outline-none">
                           <option>English</option>
                           <option>Spanish</option>
                           <option>French</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground/60 ml-2">Currency Display</label>
                        <select className="w-full bg-secondary/50 border-none rounded-2xl py-4 px-6 font-medium outline-none">
                           <option>PKR (Rs.)</option>
                           <option>USD ($)</option>
                        </select>
                      </div>
                   </div>
                </div>
              )}

              <div className="pt-10 flex justify-end">
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-primary text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-1 transition-all disabled:opacity-50"
                >
                   {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                   Save {activeTab}
                </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
