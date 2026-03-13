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
    <section className="py-12 sm:py-16 bg-surface-alt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <motion.h2 variants={fadeInUp} className="text-2xl font-bold text-foreground">
              {t('title')}
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-foreground-muted mt-1 text-sm">
              {t('subtitle')}
            </motion.p>
          </div>
          <motion.div variants={fadeInUp}>
            <Link
              href="/products"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline"
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
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
          >
            {categories.map((cat) => {
              const name = locale === 'ru' ? cat.nameRu : cat.name;
              return (
                <motion.div key={cat.groupCode} variants={fadeInUp}>
                  <Link
                    href={`/products?groupCode=${cat.groupCode}`}
                    className="group flex flex-col items-center gap-3 p-4 sm:p-5 bg-surface-elevated border border-border rounded-2xl shadow-theme-sm hover:shadow-theme-md hover:border-brand/30 transition-all duration-200"
                  >
                    <div className="h-12 w-12 rounded-2xl bg-brand-subtle group-hover:bg-brand/15 transition-colors flex items-center justify-center">
                      <Package className="h-6 w-6 text-brand" />
                    </div>
                    <p className="text-center text-foreground font-medium text-sm leading-tight line-clamp-2">
                      {name}
                    </p>
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
          className="flex justify-center mt-6 sm:hidden"
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
          >
            {t('viewAll')} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
