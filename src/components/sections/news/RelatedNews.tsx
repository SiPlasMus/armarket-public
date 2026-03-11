'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { NewsCard } from './NewsCard';
import { staggerContainer, fadeInUp, viewportOnce } from '@/lib/animations';
import type { NewsItem } from '@/types';

interface RelatedNewsProps {
  items: NewsItem[];
}

export function RelatedNews({ items }: RelatedNewsProps) {
  const t = useTranslations('news');

  if (items.length === 0) return null;

  return (
    <section className="mt-16 pt-10 border-t border-border">
      <motion.h2
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="text-xl font-bold text-foreground mb-6"
      >
        {t('relatedArticles')}
      </motion.h2>
      <motion.div
        variants={staggerContainer(0.07)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {items.map((item) => (
          <motion.div key={item.id} variants={fadeInUp}>
            <NewsCard item={item} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
