'use client';

import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { ArrowRight, Calendar } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { useAnalytics } from '@/hooks/useAnalytics';
import type { NewsItem } from '@/types';

interface NewsCardProps {
  item: NewsItem;
  featured?: boolean;
}

const catVariants = {
  news:   'brand',
  promo:  'warning',
  update: 'success',
} as const;

const catLabels: Record<string, { uz: string; ru: string }> = {
  news:   { uz: 'Yangilik',     ru: 'Новость'      },
  promo:  { uz: 'Aksiya',       ru: 'Акция'         },
  update: { uz: 'Yangilanish',  ru: 'Обновление'   },
};

export function NewsCard({ item, featured = false }: NewsCardProps) {
  const locale = useLocale() as 'uz' | 'ru';
  const { track } = useAnalytics();

  const title   = locale === 'ru' ? item.titleRu   : item.title;
  const summary = locale === 'ru' ? item.summaryRu : item.summary;
  const catLabel = catLabels[item.category]?.[locale] ?? item.category;
  const readMore = locale === 'ru' ? 'Читать' : "O'qish";

  function handleClick() {
    track('news_opened', { newsId: item.id, slug: item.slug });
  }

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22, ease: [0, 0, 0.2, 1] }}
      className="group flex flex-col bg-surface-elevated border border-border rounded-2xl overflow-hidden shadow-theme-sm hover:shadow-theme-md transition-shadow duration-200"
    >
      {/* ── Cover ─────────────────────────── */}
      <Link
        href={`/news/${item.slug}`}
        onClick={handleClick}
        className={`relative block overflow-hidden bg-surface-alt ${featured ? 'aspect-[16/7]' : 'aspect-[16/9]'}`}
      >
        <ImageWithFallback
          src={item.image}
          alt={title}
          fill
          className="group-hover:scale-105 transition-transform duration-300"
          fallbackText={title}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        {/* Date — bottom left */}
        <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 text-white/90 text-xs">
          <Calendar className="h-3 w-3 shrink-0" />
          {formatDate(item.date, locale)}
        </div>
      </Link>

      {/* ── Body ──────────────────────────── */}
      <div className="flex flex-col flex-1 p-4">
        <div className="mb-2.5">
          <Badge variant={catVariants[item.category] ?? 'brand'} size="sm">
            {catLabel}
          </Badge>
        </div>

        <Link
          href={`/news/${item.slug}`}
          onClick={handleClick}
          className="text-foreground font-semibold leading-snug line-clamp-2 hover:text-brand transition-colors mb-2"
        >
          {title}
        </Link>

        <p className="text-foreground-muted text-sm leading-relaxed line-clamp-3 flex-1">
          {summary}
        </p>

        <Link
          href={`/news/${item.slug}`}
          onClick={handleClick}
          className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline mt-3 self-start"
        >
          {readMore}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </motion.article>
  );
}
