'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Syncs the Zustand theme store → data-theme attribute on <html>.
 * The inline script in layout.tsx handles the initial paint (no FOUC).
 * This component handles changes made after hydration.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return <>{children}</>;
}
