'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { staggerContainer, fadeInUp, viewportOnce } from '@/lib/animations';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function CTABanner() {
  const t = useTranslations('cta');
  const { track } = useAnalytics();

  return (
    <section className="py-16 sm:py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="relative overflow-hidden rounded-3xl bg-brand px-8 py-14 sm:px-14 sm:py-16 text-center"
        >
          {/* ── Decorative background ── */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            {/* Dot grid */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)',
                backgroundSize: '28px 28px',
              }}
            />
            {/* Animated blobs */}
            <motion.div
              animate={{ x: [0, 20, 0], y: [0, -15, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white/10"
              style={{ filter: 'blur(40px)' }}
            />
            <motion.div
              animate={{ x: [0, -15, 0], y: [0, 20, 0], scale: [1, 1.08, 1] }}
              transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-white/10"
              style={{ filter: 'blur(40px)' }}
            />
            {/* Rings */}
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
              className="absolute -bottom-28 -right-28 w-72 h-72 rounded-full border border-white/10"
            />
          </div>

          {/* ── Content ── */}
          <div className="relative z-10">
            <motion.div variants={fadeInUp}>
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-white/20 mx-auto mb-6">
                <ShoppingBag className="h-7 w-7 text-white" />
              </div>
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight"
            >
              {t('title')}
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-white/75 text-base sm:text-lg max-w-xl mx-auto mb-8"
            >
              {t('subtitle')}
            </motion.p>

            <motion.div variants={fadeInUp}>
              <Button
                variant="white"
                size="lg"
                href="/products"
                rightIcon={<ArrowRight className="h-4 w-4" />}
                onClick={() => track('cta_clicked', { location: 'cta_banner' })}
              >
                {t('button')}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
