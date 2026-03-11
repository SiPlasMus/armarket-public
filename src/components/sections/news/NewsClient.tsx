'use client';

import { useState, useMemo, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { NewsCard } from './NewsCard';
import { EmptyState } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Newspaper } from 'lucide-react';
import { DEMO_NEWS } from '@/lib/demo-data';
import { staggerContainer, fadeInUp } from '@/lib/animations';
import type { NewsCategory } from '@/types';

type Filter = NewsCategory | 'all';

const PAGE_SIZE = 6;

const FILTERS: Filter[] = ['all', 'news', 'promo', 'update'];

export function NewsClient() {
  const t  = useTranslations('news');
  const tc = useTranslations('common');

  // header rendered here so motion works (client component needed)

  const tabsId = useId();
  const [active, setActive]           = useState<Filter>('all');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(
    () => (active === 'all' ? DEMO_NEWS : DEMO_NEWS.filter((n) => n.category === active)),
    [active],
  );

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const featured = active === 'all' ? DEMO_NEWS.find((n) => n.featured) : undefined;
  const rest     = visible.filter((n) => n !== featured);

  function handleFilter(f: Filter) {
    setActive(f);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <div>
      {/* ── Page header ───────────────────────────────────────────── */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t('title')}</h1>
        <p className="text-foreground-muted mt-1">{t('subtitle')}</p>
      </motion.div>

      {/* ── Category tabs ─────────────────────────────────────────── */}
      <div className="flex gap-2 flex-wrap mb-8">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => handleFilter(f)}
            className="relative px-4 py-2 text-sm font-medium rounded-full transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            style={{ color: active === f ? 'var(--surface)' : 'var(--foreground-muted)' }}
          >
            {active === f && (
              <motion.span
                layoutId={`${tabsId}-pill`}
                className="absolute inset-0 bg-brand rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">
              {t(`categories.${f}`)}
            </span>
          </button>
        ))}
      </div>

      {/* ── Featured card (all tab only) ──────────────────────────── */}
      <AnimatePresence mode="wait">
        {featured && (
          <motion.div
            key="featured"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <NewsCard item={featured} featured />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Grid ──────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {rest.length === 0 && !featured ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EmptyState
              icon={<Newspaper className="h-14 w-14" />}
              title={t('noResults')}
              description={tc('noResults')}
              className="py-24"
            />
          </motion.div>
        ) : rest.length > 0 ? (
          <motion.div
            key={active}
            variants={staggerContainer(0.06)}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {rest.map((item) => (
              <motion.div key={item.id} variants={fadeInUp}>
                <NewsCard item={item} />
              </motion.div>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* ── Load more ─────────────────────────────────────────────── */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button
            variant="secondary"
            size="md"
            onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
          >
            {t('loadMore')}
          </Button>
        </div>
      )}

      {/* ── All shown ─────────────────────────────────────────────── */}
      {!hasMore && filtered.length > PAGE_SIZE && (
        <p className="text-center text-sm text-foreground-muted mt-8">
          — {filtered.length} {tc('all').toLowerCase()} —
        </p>
      )}
    </div>
  );
}
