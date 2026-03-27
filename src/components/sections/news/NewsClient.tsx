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
  const t = useTranslations('news');
  const tc = useTranslations('common');
  const tabsId = useId();

  const [active, setActive] = useState<Filter>('all');
  const [items, setItems] = useState<NewsItem[]>([]);
  const [featured, setFeatured] = useState<NewsItem | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const reqIdRef = useRef(0);

  useEffect(() => {
    fetchFeaturedNews().then(setFeatured).catch(() => {});
  }, []);

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

  const showFeatured = active === 'all' && featured != null;
  const listItems = showFeatured ? items.filter((n) => n.id !== featured!.id) : items;

  return (
    <div>
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="relative mb-8 overflow-hidden rounded-[2rem] border border-border bg-[linear-gradient(145deg,color-mix(in_srgb,var(--brand)_9%,var(--surface))_0%,var(--surface-elevated)_60%,var(--surface-alt)_100%)] p-6 shadow-theme-sm sm:p-8"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-10 top-0 h-44 w-44 rounded-full bg-brand/10 blur-3xl" />
          <div className="absolute left-0 top-10 h-28 w-28 rounded-full bg-orange-400/10 blur-3xl" />
        </div>
        <div className="relative">
          <div className="mb-3 inline-flex rounded-full border border-brand/20 bg-brand/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-brand">
            News stream
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t('title')}</h1>
          <p className="mt-1 max-w-2xl text-foreground-muted">{t('subtitle')}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {FILTERS.map((f) => (
              <div
                key={f}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] ${
                  active === f
                    ? 'border-brand/25 bg-brand/10 text-brand'
                    : 'border-border bg-surface-elevated text-foreground-muted'
                }`}
              >
                {t(`categories.${f}`)}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

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

          {hasMore && (
            <div className="flex justify-center mt-8">
              <Button variant="secondary" size="md" loading={loadingMore} onClick={handleLoadMore}>
                {t('loadMore')}
              </Button>
            </div>
          )}

          {!hasMore && items.length > PAGE_SIZE && (
            <p className="text-center text-sm text-foreground-muted mt-8">
              - {items.length} {tc('all').toLowerCase()} -
            </p>
          )}
        </>
      )}
    </div>
  );
}
