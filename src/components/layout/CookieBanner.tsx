'use client';

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie } from 'lucide-react';
import { usePreferencesStore } from '@/store/preferencesStore';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Button } from '@/components/ui/Button';
import { slideInBottom } from '@/lib/animations';

export function CookieBanner() {
  const t = useTranslations('cookies');
  const { bannerDismissed, acceptAll, rejectNonEssential } = usePreferencesStore();
  const { track } = useAnalytics();

  function handleAccept() {
    acceptAll();
    track('cookie_accepted');
  }

  function handleReject() {
    rejectNonEssential();
    track('cookie_rejected');
  }

  return (
    <AnimatePresence>
      {!bannerDismissed && (
        <motion.div
          key="cookie-banner"
          variants={slideInBottom}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-6 md:max-w-sm"
        >
          <div className="bg-surface-elevated border border-border rounded-2xl shadow-theme-lg p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="shrink-0 mt-0.5 text-brand">
                <Cookie className="h-5 w-5" />
              </div>
              <p className="text-sm text-foreground-muted leading-relaxed">
                {t('message')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                className="flex-1"
                onClick={handleAccept}
              >
                {t('accept')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={handleReject}
              >
                {t('reject')}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
