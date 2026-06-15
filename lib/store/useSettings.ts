import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Settings {
  bakeryName: string;
  contactEmail: string;
  storeDescription: string;
  logo: string;
}

interface SettingsStore {
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
}

const defaultSettings: Settings = {
  bakeryName: "The Sweet Boutique",
  contactEmail: "info@sweetboutique.com",
  storeDescription: "Artisanal heritage sweets and bakers established since 1971.",
  logo: "https://i.pravatar.cc/150?u=admin",
};

export const useSettings = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (updated) => set((state) => ({ 
        settings: { ...state.settings, ...updated } 
      })),
    }),
    {
      name: 'bakery-settings',
    }
  )
);
