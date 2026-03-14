'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { cn, formatPrice } from '@/lib/utils';
import { useAnalytics } from '@/hooks/useAnalytics';
import type { UiProductCard } from '@/lib/armarketApi';

interface ProductCardProps {
  product: UiProductCard;
}

export function ProductCard({ product }: ProductCardProps) {
  const t      = useTranslations('products');
  const tc     = useTranslations('common');
  const locale = useLocale() as 'uz' | 'ru';
  const { track } = useAnalytics();

  const name      = locale === 'ru' ? product.nameRu : product.name;
  const price     = formatPrice(product.price, locale);
  const showImage = product.image !== null;

  function handleClick() {
    track('product_card_click', { productId: product.id });
  }

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22, ease: [0, 0, 0.2, 1] }}
      className="group relative flex flex-col bg-surface-elevated border border-border rounded-2xl overflow-hidden shadow-theme-sm hover:shadow-theme-md transition-shadow duration-200"
    >
      {/* Stretched link — makes the entire card tappable on mobile */}
      <Link
        href={`/products/${product.id}`}
        onClick={handleClick}
        className="absolute inset-0 z-10 rounded-2xl focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:outline-none"
        aria-label={name}
      />

      {/* ── Image (only for items with 478* barcodes) ── */}
      {showImage && (
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-alt">
          <ImageWithFallback
            src={product.image}
            alt={name}
            fill
            className="group-hover:scale-105 transition-transform duration-300"
            fallbackText={name}
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-surface-elevated/60 backdrop-blur-[2px] flex items-center justify-center">
              <span className="text-foreground-muted text-xs font-medium bg-surface-elevated px-3 py-1 rounded-full border border-border">
                {tc('outOfStock')}
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── Body ──────────────────────────── */}
      <div className="flex flex-col flex-1 p-3.5">
        {product.categoryName && (
          <p className="text-[11px] text-foreground-muted uppercase tracking-wide mb-1 line-clamp-1">
            {locale === 'ru' ? product.categoryNameRu : product.categoryName}
          </p>
        )}

        <p className="text-foreground font-medium text-sm leading-snug line-clamp-2 group-hover:text-brand transition-colors mb-2">
          {name}
        </p>

        <div className="mt-auto space-y-2.5">
          <p className="text-brand font-bold text-base leading-none">{price}</p>
          {/* Visual "details" row — card's stretched link handles navigation */}
          <div className={cn(
            'w-full inline-flex items-center justify-center font-medium text-sm h-8 px-3 rounded-xl',
            'bg-surface-alt text-foreground border border-border',
            'group-hover:bg-border transition-colors duration-200',
          )}>
            {t('details')}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
