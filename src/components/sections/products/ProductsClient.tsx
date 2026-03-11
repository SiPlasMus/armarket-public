'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ProductFilters } from './ProductFilters';
import { ProductGrid } from './ProductGrid';
import { DEMO_PRODUCTS } from '@/lib/demo-data';
import { fadeInUp } from '@/lib/animations';
import type { ProductFilters as Filters, SortOption } from '@/types';

interface ProductsClientProps {
  initialCategory?: string;
}

const PAGE_SIZE = 12;

// ─── Client-side filter + sort logic ─────────────────────────────────────────
function applyFilters(filters: Filters, sort: SortOption) {
  let result = [...DEMO_PRODUCTS];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.nameRu.toLowerCase().includes(q)
    );
  }
  if (filters.categoryId) {
    result = result.filter((p) => p.categoryId === filters.categoryId);
  }
  if (filters.inStock) {
    result = result.filter((p) => p.inStock);
  }

  switch (sort) {
    case 'popular':
      result.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
      break;
    case 'newest':
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case 'priceAsc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'priceDesc':
      result.sort((a, b) => b.price - a.price);
      break;
  }

  return result;
}

export default function ProductsClient({ initialCategory }: ProductsClientProps) {
  const t = useTranslations('products');

  const [filters, setFilters] = useState<Filters>({
    categoryId: initialCategory,
    search: '',
    inStock: false,
  });
  const [sort, setSort] = useState<SortOption>('popular');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const allFiltered = useMemo(() => applyFilters(filters, sort), [filters, sort]);
  const visible = allFiltered.slice(0, visibleCount);
  const hasMore = visibleCount < allFiltered.length;

  function handleFiltersChange(next: Filters) {
    setFilters(next);
    setVisibleCount(PAGE_SIZE); // reset pagination on filter change
  }

  function handleSortChange(next: SortOption) {
    setSort(next);
    setVisibleCount(PAGE_SIZE);
  }

  function handleLoadMore() {
    setVisibleCount((v) => v + PAGE_SIZE);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* ── Page header ─────────────────────────────────────────────── */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          {t('title')}
        </h1>
        <p className="text-foreground-muted mt-1">{t('subtitle')}</p>
      </motion.div>

      {/* ── Filters ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-8"
      >
        <ProductFilters
          filters={filters}
          sort={sort}
          total={allFiltered.length}
          onFiltersChange={handleFiltersChange}
          onSortChange={handleSortChange}
        />
      </motion.div>

      {/* ── Grid ────────────────────────────────────────────────────── */}
      <ProductGrid
        products={visible}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
}
