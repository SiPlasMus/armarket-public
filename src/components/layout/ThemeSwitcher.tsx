'use client';

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useAnalytics } from '@/hooks/useAnalytics';
import { cn } from '@/lib/utils';

const swatchBorders: Record<string, string> = {
  red:    'border-red-600',
  green:  'border-green-600',
  yellow: 'border-yellow-500',
  dark:   'border-gray-700',
};

export function ThemeSwitcher() {
  const t = useTranslations('themes');
  const { theme, setTheme, themes } = useTheme();
  const { track } = useAnalytics();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handleSelect(id: string) {
    setTheme(id as Parameters<typeof setTheme>[0]);
    track('theme_changed', { theme: id });
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={t('title')}
        title={t('title')}
        className={cn(
          'flex items-center gap-1.5 h-9 px-2.5 rounded-xl',
          'text-foreground-muted hover:text-foreground hover:bg-surface-alt',
          'transition-colors duration-150'
        )}
      >
        <Palette className="h-4 w-4" />
        {/* Active theme swatch */}
        <span
          className="h-3 w-3 rounded-full border-2 border-border"
          style={{ backgroundColor: themes.find((t) => t.id === theme)?.color }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute right-0 top-full mt-2 z-50',
              'bg-surface-elevated border border-border rounded-2xl shadow-theme-lg',
              'p-2 min-w-[140px]'
            )}
          >
            {themes.map((th) => (
              <button
                key={th.id}
                onClick={() => handleSelect(th.id)}
                className={cn(
                  'flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm',
                  'transition-colors duration-150',
                  theme === th.id
                    ? 'bg-brand-subtle text-brand font-medium'
                    : 'text-foreground hover:bg-surface-alt'
                )}
              >
                <span
                  className={cn('h-4 w-4 rounded-full border-2 shrink-0', swatchBorders[th.id])}
                  style={{ backgroundColor: th.color }}
                />
                {t(th.id as 'red' | 'green' | 'yellow' | 'dark')}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
