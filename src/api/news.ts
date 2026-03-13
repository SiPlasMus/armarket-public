import { api } from '@/lib/api';
import type { NewsItem, NewsCategory, PaginatedResponse } from '@/types';

export async function fetchNews(params?: {
  category?: NewsCategory | 'all';
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<NewsItem>> {
  const { page = 1, limit = 6, category } = params ?? {};
  const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
  qs.set('category', category && category !== 'all' ? category : 'all');
  return api<PaginatedResponse<NewsItem>>(`/api/news?${qs}`);
}

export async function fetchNewsBySlug(slug: string): Promise<NewsItem | null> {
  try {
    return await api<NewsItem>(`/api/news/${encodeURIComponent(slug)}`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : '';
    if (!msg.includes('404')) console.error('[fetchNewsBySlug]', slug, msg);
    return null;
  }
}

export async function fetchFeaturedNews(): Promise<NewsItem | null> {
  return api<NewsItem | null>('/api/news/featured').catch(() => null);
}

export async function fetchLatestNews(limit = 4): Promise<NewsItem[]> {
  return api<NewsItem[]>(`/api/news/latest?limit=${limit}`).catch(() => []);
}
