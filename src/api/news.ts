import type { NewsItem, NewsCategory, PaginatedResponse } from '@/types';
import { api } from '@/lib/api';

export async function fetchNews(params?: {
  category?: NewsCategory | 'all';
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<NewsItem>> {
  const { page = 1, limit = 6, category } = params ?? {};
  const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (category && category !== 'all') qs.set('category', category);
  return api<PaginatedResponse<NewsItem>>(`/api/news?${qs}`);
}

export async function fetchNewsBySlug(slug: string): Promise<NewsItem | null> {
  return api<NewsItem>(`/api/news/${encodeURIComponent(slug)}`).catch(() => null);
}

export async function fetchFeaturedNews(): Promise<NewsItem | null> {
  return api<NewsItem>('/api/news/featured').catch(() => null);
}

export async function fetchLatestNews(limit = 4): Promise<NewsItem[]> {
  return api<NewsItem[]>(`/api/news/latest?limit=${limit}`);
}
