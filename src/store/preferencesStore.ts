'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type ConsentStatus = 'accepted' | 'rejected' | null;

interface PreferencesStore {
  cookieConsent: ConsentStatus;
  analyticsConsent: boolean;
  bannerDismissed: boolean;

  acceptAll: () => void;
  rejectNonEssential: () => void;
  setAnalyticsConsent: (v: boolean) => void;
  dismissBanner: () => void;
  resetConsent: () => void;
}

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      cookieConsent: null,
      analyticsConsent: false,
      bannerDismissed: false,

      acceptAll: () =>
        set({ cookieConsent: 'accepted', analyticsConsent: true, bannerDismissed: true }),

      rejectNonEssential: () =>
        set({ cookieConsent: 'rejected', analyticsConsent: false, bannerDismissed: true }),

      setAnalyticsConsent: (v) => set({ analyticsConsent: v }),

      dismissBanner: () => set({ bannerDismissed: true }),

      resetConsent: () =>
        set({ cookieConsent: null, analyticsConsent: false, bannerDismissed: false }),
    }),
    {
      name: 'ar-market-preferences',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') return localStorage;
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);
