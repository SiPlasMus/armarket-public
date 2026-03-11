'use client';

import { motion } from 'framer-motion';
import { NewsCard } from './NewsCard';
import { staggerContainer, fadeInUp } from '@/lib/animations';
import type { NewsItem } from '@/types';

interface NewsListProps {
  items: NewsItem[];
  loading?: boolean;
}

export function NewsList({ items, loading }: NewsListProps) {
  if (loading) return null;

  return (
    <motion.div
      variants={staggerContainer(0.06)}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
    >
      {items.map((item) => (
        <motion.div key={item.id} variants={fadeInUp}>
          <NewsCard item={item} />
        </motion.div>
      ))}
    </motion.div>
  );
}
