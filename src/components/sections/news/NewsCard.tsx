'use client';
// TODO: Implement in news page phase
// Planned: cover image/placeholder, category badge, title, summary, date, read more link

import type { NewsItem } from '@/types';

interface NewsCardProps {
  item: NewsItem;
  locale?: string;
  featured?: boolean;
}

export function NewsCard({ item }: NewsCardProps) {
  return (
    <div className="bg-surface-elevated border border-border rounded-2xl p-4">
      {/* Implementation in pages phase */}
      <p className="text-foreground-muted text-xs">{item.slug}</p>
    </div>
  );
}
