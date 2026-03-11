'use client';
// TODO: Implement in news page phase
// Planned: category filter tabs, news grid, load more, empty state

import type { NewsItem, NewsCategory } from '@/types';
import { NewsCard } from './NewsCard';

interface NewsListProps {
  items: NewsItem[];
  activeCategory?: NewsCategory | 'all';
  onCategoryChange?: (c: NewsCategory | 'all') => void;
  loading?: boolean;
}

export function NewsList({ items, loading }: NewsListProps) {
  if (loading) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map((item) => (
        <NewsCard key={item.id} item={item} />
      ))}
    </div>
  );
}
