'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { NewsCard } from '@/components/sections/news/NewsCard';
import { DEMO_NEWS } from '@/lib/demo-data';
import { staggerContainer, fadeInUp, viewportOnce } from '@/lib/animations';

export default function NewsPreview() {
  const t  = useTranslations('news');
  const tc = useTranslations('common');

  const news = DEMO_NEWS.slice(0, 3);

  return (
    <section className="py-16 sm:py-20 bg-surface-alt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10"
        >
          <div>
            <motion.h2 variants={fadeInUp} className="text-2xl sm:text-3xl font-bold text-foreground">
              {t('preview.title')}
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-foreground-muted mt-1">
              {t('preview.subtitle')}
            </motion.p>
          </div>
          <motion.div variants={fadeInUp}>
            <Link
              href="/news"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline whitespace-nowrap"
            >
              {tc('viewAll')} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        </motion.div>

        {/* News grid */}
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {news.map((item, i) => (
            <motion.div key={item.id} variants={fadeInUp}>
              <NewsCard item={item} featured={i === 0} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
