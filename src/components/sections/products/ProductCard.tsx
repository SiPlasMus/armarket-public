'use client';
// TODO: Implement in products page phase
// Planned: image, name, price (UZS), category badge, product badge, details button, hover animation

import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  locale?: string;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-surface-elevated border border-border rounded-2xl p-4">
      {/* Implementation in pages phase */}
      <p className="text-foreground-muted text-xs">{product.id}</p>
    </div>
  );
}
