'use client';

import { useThemeStore } from '@/store/themeStore';
import { THEMES } from '@/lib/themes';
import type { Theme } from '@/types';

export function useTheme() {
  const { theme, setTheme, _hydrated } = useThemeStore();

  return {
    theme,
    setTheme,
    themes: THEMES,
    isHydrated: _hydrated,
    isDark: theme === 'dark',
  };
}

export type { Theme };
