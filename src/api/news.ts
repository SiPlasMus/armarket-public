/**
 * News API — placeholder
 * Replace function bodies with real fetch calls when backend is ready.
 */
import type { NewsItem, NewsCategory, PaginatedResponse } from '@/types';
import { DEMO_NEWS, getNewsBySlug, getFeaturedNews } from '@/lib/demo-data';

export async function fetchNews(params?: {
  category?: NewsCategory | 'all';
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<NewsItem>> {
  const { page = 1, limit = 6, category } = params ?? {};

  // TODO: GET /api/news?page=&limit=&category=
  const filtered =
    !category || category === 'all'
      ? DEMO_NEWS
      : DEMO_NEWS.filter((n) => n.category === category);

  const start = (page - 1) * limit;

  return {
    data: filtered.slice(start, start + limit),
    total: filtered.length,
    page,
    limit,
    hasMore: start + limit < filtered.length,
  };
}

export async function fetchNewsBySlug(slug: string): Promise<NewsItem | null> {
  // TODO: GET /api/news/:slug
  return getNewsBySlug(slug) ?? null;
}

export async function fetchFeaturedNews(): Promise<NewsItem | null> {
  // TODO: GET /api/news/featured
  return getFeaturedNews() ?? null;
}

export async function fetchLatestNews(limit = 4): Promise<NewsItem[]> {
  // TODO: GET /api/news?limit=&sort=date_desc
  return DEMO_NEWS.slice(0, limit);
}
