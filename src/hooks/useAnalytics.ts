'use client';

import { useCallback } from 'react';
import { useLocale } from 'next-intl';
import { useThemeStore } from '@/store/themeStore';
import { usePreferencesStore } from '@/store/preferencesStore';
import { trackEvent } from '@/lib/analytics';
import type { AnalyticsEventName, Locale, Theme } from '@/types';

export function useAnalytics() {
  const locale = useLocale() as Locale;
  const theme = useThemeStore((s) => s.theme);
  const analyticsConsent = usePreferencesStore((s) => s.analyticsConsent);

  const track = useCallback(
    (name: AnalyticsEventName, props?: Record<string, string | number | boolean>) => {
      if (!analyticsConsent && name !== 'cookie_accepted' && name !== 'cookie_rejected') {
        return;
      }
      trackEvent(name, props, { locale, theme: theme as Theme });
    },
    [locale, theme, analyticsConsent]
  );

  return { track };
}
