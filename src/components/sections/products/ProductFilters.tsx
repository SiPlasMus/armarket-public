'use client';
// TODO: Implement in products page phase
// Planned: search input, sort selector, category filter, mobile bottom-sheet panel

import type { ProductFilters as Filters, SortOption } from '@/types';

interface ProductFiltersProps {
  filters: Filters;
  sort: SortOption;
  onFiltersChange: (f: Filters) => void;
  onSortChange: (s: SortOption) => void;
}

export function ProductFilters({}: ProductFiltersProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Implementation in pages phase */}
    </div>
  );
}
