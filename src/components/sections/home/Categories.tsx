'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Package, ArrowRight } from 'lucide-react';
import { fetchCategories } from '@/lib/armarketApi';
import { staggerContainer, fadeInUp, viewportOnce } from '@/lib/animations';
import type { UiCategory } from '@/lib/armarketApi';

const SKELETON_COUNT = 5;

export default function Categories() {
  const t      = useTranslations('categories');
  const locale = useLocale() as 'uz' | 'ru';

  const [categories, setCategories] = useState<UiCategory[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(data.slice(0, 8))) // show top 8 on home page
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="relative overflow-hidden border-y border-border bg-surface-alt py-14 sm:py-18">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-48 w-48 rounded-full bg-brand/8 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-orange-400/8 blur-3xl" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="relative z-10 flex items-end justify-between gap-4 mb-8"
        >
          <div>
            <motion.div
              variants={fadeInUp}
              className="mb-3 inline-flex rounded-full border border-brand/20 bg-brand/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-brand"
            >
              Curated flow
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-2xl font-bold text-foreground sm:text-3xl">
              {t('title')}
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-foreground-muted mt-1 max-w-xl text-sm sm:text-base">
              {t('subtitle')}
            </motion.p>
          </div>
          <motion.div variants={fadeInUp}>
            <Link
              href="/products"
              className="relative z-20 hidden sm:inline-flex items-center gap-2 rounded-full border border-border bg-surface-elevated px-4 py-2 text-sm font-medium text-foreground shadow-theme-sm transition-colors hover:border-brand/30 hover:text-brand"
            >
              {t('viewAll')} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-3 p-4 sm:p-5 bg-surface-elevated border border-border rounded-2xl animate-pulse"
              >
                <div className="h-12 w-12 rounded-2xl bg-surface-alt" />
                <div className="h-3 w-20 rounded bg-surface-alt" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={staggerContainer(0.07)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="relative z-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
          >
            {categories.map((cat) => {
              const name = locale === 'ru' ? cat.nameRu : cat.name;
              return (
                <motion.div key={cat.groupCode} variants={fadeInUp}>
                  <Link
                    href={`/products?groupCode=${cat.groupCode}`}
                    className="relative z-20 group flex min-h-[168px] flex-col items-start justify-between rounded-[1.75rem] border border-border bg-surface-elevated p-4 shadow-theme-sm transition-all duration-200 hover:-translate-y-1 hover:border-brand/30 hover:shadow-theme-md sm:p-5"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-subtle text-brand transition-colors group-hover:bg-brand/15">
                      <Package className="h-6 w-6 text-brand" />
                    </div>
                    <div className="w-full">
                      <p className="text-foreground font-medium text-sm leading-tight line-clamp-2 sm:text-base">
                        {name}
                      </p>
                      <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground-muted transition-colors group-hover:text-brand">
                        <span>{locale === 'ru' ? 'Открыть' : 'Ochish'}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Mobile view-all */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="relative z-10 flex justify-center mt-6 sm:hidden"
        >
          <Link
            href="/products"
            className="relative z-20 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-elevated px-4 py-2 text-sm font-medium text-foreground shadow-theme-sm transition-colors hover:border-brand/30 hover:text-brand"
          >
            {t('viewAll')} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
