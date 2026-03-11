'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Package } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton, EmptyState } from '@/components/ui';
import { staggerContainer } from '@/lib/animations';
import { Button } from '@/components/ui/Button';
import type { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  loadingMore?: boolean;
}

const SKELETON_COUNT = 8;

export function ProductGrid({
  products,
  loading = false,
  hasMore = false,
  onLoadMore,
  loadingMore = false,
}: ProductGridProps) {
  const t  = useTranslations('products');
  const tc = useTranslations('common');

  // ── Loading state ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // ── Empty state ─────────────────────────────────────────────────────────
  if (products.length === 0) {
    return (
      <EmptyState
        icon={<Package className="h-14 w-14" />}
        title={t('noResults')}
        description={tc('noResults')}
        className="py-24"
      />
    );
  }

  // ── Product grid ────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">
      <motion.div
        variants={staggerContainer(0.04)}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {products.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.25 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Load more */}
      {hasMore && onLoadMore && (
        <div className="flex justify-center pt-2">
          <Button
            variant="secondary"
            size="md"
            loading={loadingMore}
            onClick={onLoadMore}
          >
            {tc('loadMore')}
          </Button>
        </div>
      )}

      {/* All shown indicator */}
      {!hasMore && products.length > 0 && (
        <p className="text-center text-sm text-foreground-muted py-2">
          — {products.length} {' '}
          {products.length === 1
            ? (tc('noResults'))
            : (tc('all').toLowerCase())} —
        </p>
      )}
    </div>
  );
}
