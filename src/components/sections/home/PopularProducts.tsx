'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { ProductCard } from '@/components/sections/products/ProductCard';
import { ProductCardSkeleton } from '@/components/ui';
import { fetchPopularProducts } from '@/lib/armarketApi';
import { viewportOnce, staggerContainer, fadeInUp } from '@/lib/animations';
import type { PopularPeriod } from '@/types';
import type { UiPopularProduct } from '@/lib/armarketApi';

const PERIODS: { id: PopularPeriod; tKey: 'today' | 'thisWeek' | 'thisMonth' }[] = [
  { id: 'day',   tKey: 'today'     },
  { id: 'week',  tKey: 'thisWeek'  },
  { id: 'month', tKey: 'thisMonth' },
];

type CubicBezier = [number, number, number, number];
const EASE_OUT: CubicBezier = [0.32, 0.72, 0, 1];

const slideVariants = {
  enter:  (dir: number) => ({ x: dir > 0 ? '20%' : '-20%', opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.4, ease: EASE_OUT as CubicBezier } },
  exit:   (dir: number) => ({
    x: dir > 0 ? '-20%' : '20%',
    opacity: 0,
    transition: { duration: 0.25, ease: 'easeIn' as const },
  }),
};

export default function PopularProducts() {
  const t  = useTranslations('common');
  const tp = useTranslations('products.popular');

  const [active, setActive]       = useState<PopularPeriod>('week');
  const [direction, setDirection] = useState<1 | -1>(1);
  const [products, setProducts]   = useState<UiPopularProduct[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchPopularProducts({ period: active, limit: 8 })
      .then((data) => { if (!cancelled) { setProducts(data); setLoading(false); } })
      .catch(() => { if (!cancelled) { setProducts([]); setLoading(false); } });
    return () => { cancelled = true; };
  }, [active]);

  function switchPeriod(period: PopularPeriod) {
    const prevIdx = PERIODS.findIndex((p) => p.id === active);
    const nextIdx = PERIODS.findIndex((p) => p.id === period);
    if (prevIdx === nextIdx) return;
    setDirection(nextIdx > prevIdx ? 1 : -1);
    setActive(period);
  }

  return (
    <section className="py-16 sm:py-20 bg-surface overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ─────────────────────────── */}
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8"
        >
          <div>
            <motion.h2 variants={fadeInUp} className="text-2xl sm:text-3xl font-bold text-foreground">
              {tp('title')}
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-foreground-muted mt-1 text-sm">
              {tp('subtitle')}
            </motion.p>
          </div>
          <motion.div variants={fadeInUp}>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline whitespace-nowrap"
            >
              {t('viewAll')} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        </motion.div>

        {/* ── Period tabs ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-0.5 p-1 bg-surface-alt border border-border rounded-2xl">
            {PERIODS.map((period) => (
              <button
                key={period.id}
                onClick={() => switchPeriod(period.id)}
                className="relative px-4 py-2 text-sm font-medium rounded-xl transition-colors duration-150 z-10"
                style={{
                  color: active === period.id ? 'var(--brand-fg)' : 'var(--foreground-muted)',
                }}
              >
                {active === period.id && (
                  <motion.span
                    layoutId="popular-tab-pill"
                    className="absolute inset-0 bg-brand rounded-xl"
                    style={{ zIndex: -1 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                  />
                )}
                {t(period.tKey)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Product grid ── */}
        <div className="relative overflow-hidden">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : (
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={active}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {products.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
}
