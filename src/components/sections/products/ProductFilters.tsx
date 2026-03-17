'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { Search, SlidersHorizontal, X, Check, ChevronDown, ScanBarcode } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { slideInBottom, backdropVariants } from '@/lib/animations';
import type { ProductFilters as Filters, SortOption } from '@/types';
import type { UiCategory } from '@/lib/armarketApi';
import { BarcodeScannerModal } from './BarcodeScannerModal';

interface ProductFiltersProps {
  filters: Filters;
  sort: SortOption;
  total: number;
  categories: UiCategory[];
  onFiltersChange: (f: Filters) => void;
  onSortChange: (s: SortOption) => void;
}

const SORT_KEYS: SortOption[] = ['popular', 'newest', 'priceAsc', 'priceDesc'];

export function ProductFilters({
  filters,
  sort,
  total,
  categories,
  onFiltersChange,
  onSortChange,
}: ProductFiltersProps) {
  const t      = useTranslations('products');
  const tc     = useTranslations('common');
  const locale = useLocale() as 'uz' | 'ru';

  const searchRef = useRef<HTMLInputElement>(null);

  const [searchInput,  setSearchInput]  = useState(filters.search ?? '');
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [scannerOpen,  setScannerOpen]  = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  // Debounce search → call onFiltersChange after 320ms idle
  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange({ ...filters, search: searchInput || undefined });
    }, 320);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const activeFilterCount = [filters.groupCode != null, filters.inStock].filter(Boolean).length;

  function setGroup(groupCode: number | undefined) {
    onFiltersChange({ ...filters, groupCode });
  }
  function toggleInStock() {
    onFiltersChange({ ...filters, inStock: !filters.inStock });
  }
  function clearAll() {
    setSearchInput('');
    onFiltersChange({ search: undefined, groupCode: undefined, inStock: false });
  }

  const hasActive = !!(filters.search || filters.groupCode != null || filters.inStock);

  // ─── Shared: category chip row ────────────────────────────────────────────
  const CategoryChips = () => (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
      <button
        onClick={() => setGroup(undefined)}
        className={cn(
          'shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors duration-150',
          filters.groupCode == null
            ? 'bg-brand text-brand-fg'
            : 'bg-surface-alt border border-border text-foreground-muted hover:text-foreground hover:border-brand/30'
        )}
      >
        {tc('all')}
      </button>
      {categories.map((cat) => {
        const name   = locale === 'ru' ? cat.nameRu : cat.name;
        const active = filters.groupCode === cat.groupCode;
        return (
          <button
            key={cat.groupCode}
            onClick={() => setGroup(active ? undefined : cat.groupCode)}
            className={cn(
              'shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors duration-150 flex items-center gap-1.5',
              active
                ? 'bg-brand text-brand-fg'
                : 'bg-surface-alt border border-border text-foreground-muted hover:text-foreground hover:border-brand/30'
            )}
          >
            {active && <Check className="h-3 w-3" />}
            {name}
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        {/* Row 1: Search + filter controls */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted pointer-events-none" />
            <input
              ref={searchRef}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder={t('search')}
              className={cn(
                'w-full h-10 pl-10 rounded-xl text-sm',
                'bg-surface-alt border border-border text-foreground placeholder:text-foreground-muted',
                'hover:border-brand/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-[var(--ring)]',
                'transition-colors duration-150',
                (searchInput || inputFocused) ? 'pr-10' : 'pr-4'
              )}
            />
            {/* Right-side icon: X when typing, scanner icon when focused (mobile only) */}
            {searchInput ? (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : inputFocused ? (
              <button
                onMouseDown={(e) => {
                  e.preventDefault();           // keep icon visible (block blur)
                  searchRef.current?.blur();    // dismiss keyboard
                  setScannerOpen(true);
                }}
                className="md:hidden absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-brand transition-colors"
                aria-label="Barkod skaner"
              >
                <ScanBarcode className="h-4 w-4" />
              </button>
            ) : null}
          </div>

          {/* Mobile: Filter button */}
          <button
            onClick={() => setMobileOpen(true)}
            className={cn(
              'md:hidden relative flex items-center gap-1.5 h-10 px-3.5 rounded-xl text-sm font-medium',
              'border border-border bg-surface-alt text-foreground-muted hover:text-foreground',
              'transition-colors duration-150'
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-4.5 w-4.5 flex items-center justify-center rounded-full bg-brand text-brand-fg text-[10px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Desktop: Sort + In-Stock */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggleInStock}
              className={cn(
                'flex items-center gap-2 h-10 px-3.5 rounded-xl text-sm font-medium border transition-colors duration-150',
                filters.inStock
                  ? 'bg-brand/10 border-brand/40 text-brand'
                  : 'bg-surface-alt border-border text-foreground-muted hover:text-foreground hover:border-brand/30'
              )}
            >
              <span
                className={cn(
                  'h-4 w-4 rounded flex items-center justify-center border transition-colors',
                  filters.inStock ? 'bg-brand border-brand' : 'border-border'
                )}
              >
                {filters.inStock && <Check className="h-2.5 w-2.5 text-white" />}
              </span>
              {tc('inStock')}
            </button>

            <div className="relative">
              <select
                value={sort}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className={cn(
                  'h-10 pl-3 pr-8 rounded-xl text-sm appearance-none cursor-pointer',
                  'bg-surface-alt border border-border text-foreground',
                  'hover:border-brand/30 focus:outline-none focus:ring-2 focus:ring-[var(--ring)]',
                  'transition-colors duration-150'
                )}
              >
                {SORT_KEYS.map((k) => (
                  <option key={k} value={k}>{t(`sortOptions.${k}`)}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-muted pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Row 2: Category chips */}
        {categories.length > 0 && <CategoryChips />}

        {/* Row 3: Result count + clear */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-foreground-muted">
            {locale === 'ru' ? `${total} товаров` : `${total} ta mahsulot`}
          </p>
          {hasActive && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1 text-xs text-brand hover:underline"
            >
              <X className="h-3 w-3" />
              {locale === 'ru' ? 'Сбросить' : 'Tozalash'}
            </button>
          )}
        </div>
      </div>

      {/* ── Barcode scanner modal (mobile only) ─────────────────────────── */}
      <BarcodeScannerModal
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScan={(barcode) => {
          setSearchInput(barcode);
          setScannerOpen(false);
        }}
      />

      {/* ── Mobile filter bottom sheet ───────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="filter-backdrop"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              key="filter-panel"
              variants={slideInBottom}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed bottom-0 left-0 right-0 z-50 bg-surface-elevated rounded-t-3xl shadow-theme-lg max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-center pt-3 pb-1">
                <div className="h-1 w-10 bg-border rounded-full" />
              </div>

              <div className="px-5 py-4 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">
                    {t('filterTitle')}
                    {activeFilterCount > 0 && (
                      <span className="ml-2 text-xs bg-brand text-brand-fg px-2 py-0.5 rounded-full">
                        {activeFilterCount}
                      </span>
                    )}
                  </h3>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded-xl text-foreground-muted hover:text-foreground hover:bg-surface-alt"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Sort */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">{t('sortLabel')}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {SORT_KEYS.map((k) => (
                      <button
                        key={k}
                        onClick={() => onSortChange(k)}
                        className={cn(
                          'px-3 py-2.5 rounded-xl text-sm font-medium border transition-colors duration-150',
                          sort === k
                            ? 'bg-brand text-brand-fg border-brand'
                            : 'bg-surface-alt border-border text-foreground-muted'
                        )}
                      >
                        {t(`sortOptions.${k}`)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category (only if available) */}
                {categories.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-3">
                      {t('filters.category')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setGroup(undefined)}
                        className={cn(
                          'px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors duration-150',
                          filters.groupCode == null
                            ? 'bg-brand text-brand-fg border-brand'
                            : 'bg-surface-alt border-border text-foreground-muted'
                        )}
                      >
                        {tc('all')}
                      </button>
                      {categories.map((cat) => {
                        const name   = locale === 'ru' ? cat.nameRu : cat.name;
                        const active = filters.groupCode === cat.groupCode;
                        return (
                          <button
                            key={cat.groupCode}
                            onClick={() => setGroup(active ? undefined : cat.groupCode)}
                            className={cn(
                              'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors',
                              active
                                ? 'bg-brand text-brand-fg border-brand'
                                : 'bg-surface-alt border-border text-foreground-muted'
                            )}
                          >
                            {active && <Check className="h-3 w-3" />}
                            {name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* In-stock toggle */}
                <button
                  onClick={toggleInStock}
                  className={cn(
                    'flex items-center justify-between w-full px-4 py-3.5 rounded-2xl border transition-colors',
                    filters.inStock
                      ? 'bg-brand/10 border-brand/40'
                      : 'bg-surface-alt border-border'
                  )}
                >
                  <span className={cn('text-sm font-medium', filters.inStock ? 'text-brand' : 'text-foreground')}>
                    {tc('inStock')}
                  </span>
                  <div
                    className={cn(
                      'relative w-10 h-6 rounded-full transition-colors duration-200',
                      filters.inStock ? 'bg-brand' : 'bg-border'
                    )}
                  >
                    <div
                      className={cn(
                        'absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200',
                        filters.inStock ? 'translate-x-5' : 'translate-x-1'
                      )}
                    />
                  </div>
                </button>

                {/* Actions */}
                <div className="flex gap-2 pb-2">
                  <Button variant="secondary" size="md" className="flex-1" onClick={clearAll}>
                    {locale === 'ru' ? 'Сбросить' : 'Tozalash'}
                  </Button>
                  <Button variant="primary" size="md" className="flex-1" onClick={() => setMobileOpen(false)}>
                    {locale === 'ru' ? `Показать (${total})` : `Ko'rsatish (${total})`}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
