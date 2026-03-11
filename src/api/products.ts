/**
 * Products API — placeholder
 * Replace function bodies with real fetch calls when backend is ready.
 */
import type { Product, PaginatedResponse, ProductFilters, SortOption, PopularPeriod } from '@/types';
import { DEMO_PRODUCTS, getProductsByPeriod, getProductsByCategory, getProductById } from '@/lib/demo-data';

export async function fetchProducts(params: {
  filters?: ProductFilters;
  sort?: SortOption;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Product>> {
  const { page = 1, limit = 12 } = params;

  // TODO: GET /api/products?page=&limit=&sort=&...filters
  const start = (page - 1) * limit;
  const data = DEMO_PRODUCTS.slice(start, start + limit);

  return {
    data,
    total: DEMO_PRODUCTS.length,
    page,
    limit,
    hasMore: start + limit < DEMO_PRODUCTS.length,
  };
}

export async function fetchPopularProducts(
  period: PopularPeriod,
  limit = 8
): Promise<Product[]> {
  // TODO: GET /api/products/popular?period=&limit=
  return getProductsByPeriod(period, limit);
}

export async function fetchProductById(id: string): Promise<Product | null> {
  // TODO: GET /api/products/:id
  return getProductById(id) ?? null;
}

export async function fetchProductsByCategory(
  categoryId: string,
  limit = 8
): Promise<Product[]> {
  // TODO: GET /api/products?categoryId=&limit=
  return getProductsByCategory(categoryId, limit);
}
