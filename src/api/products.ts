import type { Product, PaginatedResponse, ProductFilters, SortOption, PopularPeriod } from '@/types';
import { api } from '@/lib/api';

export async function fetchProducts(params: {
  filters?: ProductFilters;
  sort?: SortOption;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Product>> {
  const { page = 1, limit = 12, sort, filters } = params;
  const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (sort) qs.set('sort', sort);
  if (filters?.categoryId) qs.set('categoryId', filters.categoryId);
  if (filters?.minPrice != null) qs.set('minPrice', String(filters.minPrice));
  if (filters?.maxPrice != null) qs.set('maxPrice', String(filters.maxPrice));
  if (filters?.inStock != null) qs.set('inStock', String(filters.inStock));
  if (filters?.search) qs.set('search', filters.search);
  return api<PaginatedResponse<Product>>(`/api/products?${qs}`);
}

export async function fetchPopularProducts(period: PopularPeriod, limit = 8): Promise<Product[]> {
  return api<Product[]>(`/api/products/popular?period=${period}&limit=${limit}`);
}

export async function fetchProductById(id: string): Promise<Product | null> {
  return api<Product>(`/api/products/${encodeURIComponent(id)}`).catch(() => null);
}

export async function fetchProductsByCategory(categoryId: string, limit = 8): Promise<Product[]> {
  return api<Product[]>(`/api/products?categoryId=${encodeURIComponent(categoryId)}&limit=${limit}`)
    .then((res) => (Array.isArray(res) ? res : (res as PaginatedResponse<Product>).data));
}
