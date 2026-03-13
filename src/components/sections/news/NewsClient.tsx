'use client';

import { useState, useEffect, useRef, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { NewsCard } from './NewsCard';
import { EmptyState } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Newspaper } from 'lucide-react';
import { fetchNews, fetchFeaturedNews } from '@/api/news';
import { staggerContainer, fadeInUp } from '@/lib/animations';
import type { NewsItem, NewsCategory } from '@/types';

type Filter = NewsCategory | 'all';
const FILTERS: Filter[] = ['all', 'news', 'promo', 'update'];
const PAGE_SIZE = 6;

const SKELETON_COUNT = 6;

function NewsCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-surface-elevated overflow-hidden animate-pulse">
      <div className="aspect-[16/9] bg-surface-alt" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 rounded bg-surface-alt" />
        <div className="h-4 w-full rounded bg-surface-alt" />
        <div className="h-4 w-3/4 rounded bg-surface-alt" />
        <div className="h-3 w-20 rounded bg-surface-alt mt-2" />
      </div>
    </div>
  );
}

export function NewsClient() {
  const t  = useTranslations('news');
  const tc = useTranslations('common');
  const tabsId = useId();

  const [active, setActive]           = useState<Filter>('all');
  const [items, setItems]             = useState<NewsItem[]>([]);
  const [featured, setFeatured]       = useState<NewsItem | null>(null);
  const [page, setPage]               = useState(1);
  const [hasMore, setHasMore]         = useState(false);
  const [loading, setLoading]         = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const reqIdRef = useRef(0);

  // Fetch featured once on mount
  useEffect(() => {
    fetchFeaturedNews().then(setFeatured).catch(() => {});
  }, []);

  // Reload list on filter change
  useEffect(() => {
    const reqId = ++reqIdRef.current;
    setLoading(true);

    fetchNews({ category: active, page: 1, limit: PAGE_SIZE })
      .then((res) => {
        if (reqId !== reqIdRef.current) return;
        setItems(res.data);
        setPage(1);
        setHasMore(res.hasMore);
      })
      .catch(() => {
        if (reqId !== reqIdRef.current) return;
        setItems([]);
        setHasMore(false);
      })
      .finally(() => {
        if (reqId === reqIdRef.current) setLoading(false);
      });
  }, [active]);

  async function handleLoadMore() {
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const res = await fetchNews({ category: active, page: nextPage, limit: PAGE_SIZE });
      setItems((prev) => [...prev, ...res.data]);
      setPage(nextPage);
      setHasMore(res.hasMore);
    } catch {
      // keep current state
    } finally {
      setLoadingMore(false);
    }
  }

  function handleFilter(f: Filter) {
    if (f === active) return;
    setActive(f);
  }

  // Show featured only on "all" tab and only if it exists
  const showFeatured = active === 'all' && featured != null;
  // Exclude featured from list to avoid duplication
  const listItems = showFeatured
    ? items.filter((n) => n.id !== featured!.id)
    : items;

  return (
    <div>
      {/* ── Page header ───────────────────────────────────────────── */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="mb-8">
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
            <span className="relative z-10">{t(`categories.${f}`)}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-5">
          {/* Featured skeleton */}
          {active === 'all' && (
            <div className="rounded-2xl border border-border bg-surface-elevated overflow-hidden animate-pulse">
              <div className="aspect-[16/7] bg-surface-alt" />
              <div className="p-4 space-y-3">
                <div className="h-3 w-16 rounded bg-surface-alt" />
                <div className="h-5 w-2/3 rounded bg-surface-alt" />
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => <NewsCardSkeleton key={i} />)}
          </div>
        </div>
      ) : (
        <>
          {/* ── Featured card (all tab only) ──────────────────────── */}
          <AnimatePresence mode="wait">
            {showFeatured && (
              <motion.div
                key="featured"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="mb-6"
              >
                <NewsCard item={featured!} featured />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Grid ──────────────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            {listItems.length === 0 && !showFeatured ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <EmptyState
                  icon={<Newspaper className="h-14 w-14" />}
                  title={t('noResults')}
                  description={tc('noResults')}
                  className="py-24"
                />
              </motion.div>
            ) : listItems.length > 0 ? (
              <motion.div
                key={active}
                variants={staggerContainer(0.06)}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {listItems.map((item) => (
                  <motion.div key={item.id} variants={fadeInUp}>
                    <NewsCard item={item} />
                  </motion.div>
                ))}
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* ── Load more ─────────────────────────────────────────── */}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <Button variant="secondary" size="md" loading={loadingMore} onClick={handleLoadMore}>
                {t('loadMore')}
              </Button>
            </div>
          )}

          {!hasMore && items.length > PAGE_SIZE && (
            <p className="text-center text-sm text-foreground-muted mt-8">
              — {items.length} {tc('all').toLowerCase()} —
            </p>
          )}
        </>
      )}
    </div>
  );
}
