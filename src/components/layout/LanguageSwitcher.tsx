'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useAnalytics } from '@/hooks/useAnalytics';
import { cn } from '@/lib/utils';
import type { Locale } from '@/types';

const LOCALES: { id: Locale; label: string }[] = [
  { id: 'uz', label: "O'Z" },
  { id: 'ru', label: 'RU' },
];

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const { track } = useAnalytics();

  function handleSwitch(nextLocale: Locale) {
    if (nextLocale === locale) return;
    track('language_changed', { from: locale, to: nextLocale });
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <div
      className={cn(
        'flex items-center gap-0.5 p-0.5 rounded-xl bg-surface-alt border border-border',
        className
      )}
    >
      {LOCALES.map((loc) => (
        <button
          key={loc.id}
          onClick={() => handleSwitch(loc.id)}
          className={cn(
            'h-7 px-2.5 rounded-lg text-xs font-semibold transition-colors duration-150',
            locale === loc.id
              ? 'bg-brand text-brand-fg'
              : 'text-foreground-muted hover:text-foreground'
          )}
          aria-label={loc.id === 'uz' ? "O'zbek tili" : 'Русский язык'}
        >
          {loc.label}
        </button>
      ))}
    </div>
  );
}
