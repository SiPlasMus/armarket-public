'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ProductFilters } from './ProductFilters';
import { ProductGrid } from './ProductGrid';
import { fetchProducts, fetchPopularProducts, fetchCategories } from '@/lib/armarketApi';
import { fadeInUp } from '@/lib/animations';
import type { ProductFilters as Filters, SortOption } from '@/types';
import type { UiProductCard, UiPopularProduct, UiCategory } from '@/lib/armarketApi';

interface ProductsClientProps {
  initialGroupCode?: number;
}

const PAGE_SIZE = 12;

export default function ProductsClient({ initialGroupCode }: ProductsClientProps) {
  const t = useTranslations('products');

  const [products, setProducts]       = useState<UiProductCard[]>([]);
  const [categories, setCategories]   = useState<UiCategory[]>([]);
  const [page, setPage]               = useState(1);
  const [hasMore, setHasMore]         = useState(false);
  const [loading, setLoading]         = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    groupCode: initialGroupCode,
    search: undefined,
    inStock: false,
  });
  const [sort, setSort] = useState<SortOption>(() => {
    if (typeof window === 'undefined') return 'popular';
    return (localStorage.getItem('ar-market-sort') as SortOption) ?? 'popular';
  });

  // Stores full filtered popular list for client-side load-more
  const popularAllRef = useRef<UiPopularProduct[]>([]);
  const reqIdRef      = useRef(0);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  // Reload page 1 whenever filters or sort changes
  useEffect(() => {
    const reqId = ++reqIdRef.current;
    setLoading(true);

    (async () => {
      try {
        if (sort === 'popular') {
          // Fetch all popular, filter client-side, paginate client-side
          const all = await fetchPopularProducts({ period: 'week', limit: 500 });
          if (reqId !== reqIdRef.current) return;

          let filtered: UiPopularProduct[] = all;
          if (filters.search) {
            const q = filters.search.toLowerCase();
            filtered = filtered.filter(
              (p) => p.name.toLowerCase().includes(q) || p.nameRu.toLowerCase().includes(q)
            );
          }
          if (filters.groupCode != null) filtered = filtered.filter((p) => p.groupCode === filters.groupCode);
          if (filters.inStock)           filtered = filtered.filter((p) => p.inStock);

          popularAllRef.current = filtered; // store for load-more
          setProducts(filtered.slice(0, PAGE_SIZE));
          setHasMore(filtered.length > PAGE_SIZE);
          setPage(1);
        } else {
          const res = await fetchProducts({
            page: 1,
            limit: PAGE_SIZE,
            search: filters.search || undefined,
            groupCode: filters.groupCode,
            onlyInStock: filters.inStock || undefined,
          });
          if (reqId !== reqIdRef.current) return;
          setProducts(res.products);
          setHasMore(res.hasMore);
          setPage(1);
        }
      } catch {
        if (reqId !== reqIdRef.current) return;
        setProducts([]);
        setHasMore(false);
      } finally {
        if (reqId === reqIdRef.current) setLoading(false);
      }
    })();
  }, [filters, sort]);

  async function handleLoadMore() {
    const nextPage = page + 1;

    if (sort === 'popular') {
      // Client-side pagination from cached popular list
      const start = (nextPage - 1) * PAGE_SIZE;
      const slice = popularAllRef.current.slice(start, start + PAGE_SIZE);
      setProducts((prev) => [...prev, ...slice]);
      setHasMore(start + PAGE_SIZE < popularAllRef.current.length);
      setPage(nextPage);
      return;
    }

    setLoadingMore(true);
    try {
      const res = await fetchProducts({
        page: nextPage,
        limit: PAGE_SIZE,
        search: filters.search || undefined,
        groupCode: filters.groupCode,
        onlyInStock: filters.inStock || undefined,
      });
      setProducts((prev) => [...prev, ...res.products]);
      setHasMore(res.hasMore);
      setPage(res.page);
    } catch {
      // keep current state on error
    } finally {
      setLoadingMore(false);
    }
  }

  // Client-side price sort applied on top of whatever backend returned
  const displayed = sort === 'priceAsc'
    ? [...products].sort((a, b) => a.price - b.price)
    : sort === 'priceDesc'
    ? [...products].sort((a, b) => b.price - a.price)
    : products;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="relative mb-8 overflow-hidden rounded-[2rem] border border-border bg-[linear-gradient(140deg,color-mix(in_srgb,var(--brand)_10%,var(--surface))_0%,var(--surface-elevated)_58%,var(--surface-alt)_100%)] p-6 shadow-theme-sm sm:p-8"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-12 top-0 h-40 w-40 rounded-full bg-brand/10 blur-3xl" />
          <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-yellow-400/10 blur-3xl" />
        </div>
        <div className="relative">
          <div className="mb-3 inline-flex rounded-full border border-brand/20 bg-brand/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-brand">
            Product flow
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t('title')}</h1>
          <p className="mt-1 max-w-2xl text-foreground-muted">{t('subtitle')}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-surface-elevated/80 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-foreground-muted">Mode</div>
              <div className="mt-2 text-lg font-semibold text-foreground">Live catalog</div>
            </div>
            <div className="rounded-2xl border border-border bg-surface-elevated/80 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-foreground-muted">Sort</div>
              <div className="mt-2 text-lg font-semibold text-foreground">{sort}</div>
            </div>
            <div className="rounded-2xl border border-border bg-surface-elevated/80 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-foreground-muted">Visible</div>
              <div className="mt-2 text-lg font-semibold text-foreground">{displayed.length}</div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-8"
      >
        <ProductFilters
          filters={filters}
          sort={sort}
          total={products.length}
          categories={categories}
          onFiltersChange={setFilters}
          onSortChange={(s) => { localStorage.setItem('ar-market-sort', s); setSort(s); }}
        />
      </motion.div>

      <ProductGrid
        products={displayed}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        loadingMore={loadingMore}
      />
    </div>
  );
}
