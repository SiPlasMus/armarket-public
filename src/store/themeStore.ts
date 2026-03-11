'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DEFAULT_THEME, THEME_STORAGE_KEY } from '@/lib/themes';
import type { Theme } from '@/types';

interface ThemeStore {
  theme: Theme;
  _hydrated: boolean;
  setTheme: (theme: Theme) => void;
  _setHydrated: (v: boolean) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: DEFAULT_THEME,
      _hydrated: false,

      setTheme: (theme) => {
        set({ theme });
        // Apply to DOM immediately (also handled by ThemeProvider, belt+suspenders)
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', theme);
        }
      },

      _setHydrated: (v) => set({ _hydrated: v }),
    }),
    {
      name: THEME_STORAGE_KEY,
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') return localStorage;
        // SSR-safe no-op storage
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      partialize: (state) => ({ theme: state.theme }),
      onRehydrateStorage: () => (state) => {
        state?._setHydrated(true);
        if (state?.theme && typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', state.theme);
        }
      },
    }
  )
);
