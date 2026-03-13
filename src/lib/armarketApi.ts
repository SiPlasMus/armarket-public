/**
 * AR Market backend API — types, mappers, fetch functions.
 * Backend: ASP.NET + SAP Business One (HANA)
 * All backend responses are PascalCase → mapped to camelCase UI models here.
 */
import { api } from '@/lib/api';

// ─── API Response Types (PascalCase from backend) ─────────────────────────────

export type ArMarketProductApi = {
  Id: string;
  NameUz: string;
  NameRu: string;
  Price: number | null;
  Currency: string | null;
  GroupCode: number | null;
  GroupName: string | null;
  OnHand: number | null;
  InStock: boolean;
  Image: string | null;
  Barcodes: string[] | null;
};

export type ArMarketPagedResponseApi<T> = {
  Data: T[];
  Page: number;
  Limit: number;
  HasMore: boolean;
};

export type ArMarketProductDetailsApi = {
  Id: string;
  NameUz: string;
  NameRu: string;
  Price: number | null;
  Currency: string | null;
  GroupCode: number | null;
  GroupName: string | null;
  OnHand: number | null;
  InStock: boolean;
  Barcodes: string[] | null;
  MxikCode: string | null;
  MxikName: string | null;
  TaxGroupName: string | null;
  TaxClassName: string | null;
  TaxPositionName: string | null;
  TaxSubPositionName: string | null;
  BrandName: string | null;
  InternationalCode: string | null;
  AttributeName: string | null;
  Images: string[];
};

export type ArMarketPopularProductApi = {
  Id: string;
  NameUz: string;
  NameRu: string;
  Price: number | null;
  Currency: string | null;
  GroupCode: number | null;
  GroupName: string | null;
  OnHand: number | null;
  InStock: boolean;
  Image: string | null;
  Barcodes: string[] | null;
  SoldQty: number;
};

// ─── UI Models (camelCase for frontend) ───────────────────────────────────────

export type UiProductCard = {
  id: string;
  name: string;
  nameRu: string;
  price: number;
  currency: string;
  groupCode: number;
  categoryName: string;
  categoryNameRu: string;
  onHand: number;
  inStock: boolean;
  image: string | null;
  barcodes: string[];
};

/** Returns true if any barcode starts with "478" — only those have tax API images */
export function has478Barcode(barcodes: string[] | null | undefined): boolean {
  return barcodes?.some((b) => b.startsWith('478')) ?? false;
}

export type UiPopularProduct = UiProductCard & {
  soldQty: number;
};

export type UiProductDetails = {
  id: string;
  name: string;
  nameRu: string;
  price: number;
  currency: string;
  groupCode: number;
  categoryName: string;
  categoryNameRu: string;
  onHand: number;
  inStock: boolean;
  barcodes: string[];
  images: string[];
  mainImage: string | null;
  mxikCode: string | null;
  mxikName: string | null;
  brandName: string | null;
  internationalCode: string | null;
  attributeName: string | null;
  taxGroupName: string | null;
  taxClassName: string | null;
  taxPositionName: string | null;
  taxSubPositionName: string | null;
};

// Future: when /api/armarket/categories endpoint is ready
export type UiCategory = {
  groupCode: number;
  name: string;
  nameRu: string;
};

// ─── Mappers ──────────────────────────────────────────────────────────────────

export function mapProductCard(x: ArMarketProductApi): UiProductCard {
  return {
    id: x.Id,
    name: x.NameUz,
    nameRu: x.NameRu,
    price: x.Price ?? 0,
    currency: x.Currency ?? 'UZS',
    groupCode: x.GroupCode ?? 0,
    categoryName: x.GroupName ?? '',
    categoryNameRu: x.GroupName ?? '',
    onHand: x.OnHand ?? 0,
    inStock: x.InStock,
    image: x.Image,
    barcodes: x.Barcodes ?? [],
  };
}

export function mapPopularProduct(x: ArMarketPopularProductApi): UiPopularProduct {
  return {
    id: x.Id,
    name: x.NameUz,
    nameRu: x.NameRu,
    price: x.Price ?? 0,
    currency: x.Currency ?? 'UZS',
    groupCode: x.GroupCode ?? 0,
    categoryName: x.GroupName ?? '',
    categoryNameRu: x.GroupName ?? '',
    onHand: x.OnHand ?? 0,
    inStock: x.InStock,
    image: x.Image,
    barcodes: x.Barcodes ?? [],
    soldQty: x.SoldQty ?? 0,
  };
}

export function mapProductDetails(x: ArMarketProductDetailsApi): UiProductDetails {
  const images = x.Images ?? [];
  return {
    id: x.Id,
    name: x.NameUz,
    nameRu: x.NameRu,
    price: x.Price ?? 0,
    currency: x.Currency ?? 'UZS',
    groupCode: x.GroupCode ?? 0,
    categoryName: x.GroupName ?? '',
    categoryNameRu: x.GroupName ?? '',
    onHand: x.OnHand ?? 0,
    inStock: x.InStock,
    barcodes: x.Barcodes ?? [],
    images,
    mainImage: images[0] ?? null,
    mxikCode: x.MxikCode ?? null,
    mxikName: x.MxikName ?? null,
    brandName: x.BrandName ?? null,
    internationalCode: x.InternationalCode ?? null,
    attributeName: x.AttributeName ?? null,
    taxGroupName: x.TaxGroupName ?? null,
    taxClassName: x.TaxClassName ?? null,
    taxPositionName: x.TaxPositionName ?? null,
    taxSubPositionName: x.TaxSubPositionName ?? null,
  };
}

// ─── Fetch Functions ──────────────────────────────────────────────────────────

export async function fetchProducts(params: {
  page?: number;
  limit?: number;
  search?: string;
  groupCode?: number;
  onlyInStock?: boolean;
  whsCode?: string;
  priceListId?: number;
}): Promise<{ products: UiProductCard[]; page: number; hasMore: boolean }> {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.limit) qs.set('limit', String(params.limit));
  if (params.search) qs.set('search', params.search);
  if (params.groupCode != null) qs.set('groupCode', String(params.groupCode));
  if (params.onlyInStock) qs.set('onlyInStock', 'true');
  if (params.whsCode) qs.set('whsCode', params.whsCode);
  if (params.priceListId != null) qs.set('priceListId', String(params.priceListId));

  const res = await api<ArMarketPagedResponseApi<ArMarketProductApi>>(
    `/api/armarket/products?${qs}`
  );
  return { products: res.Data.map(mapProductCard), page: res.Page, hasMore: res.HasMore };
}

export async function fetchProductById(itemCode: string): Promise<UiProductDetails | null> {
  try {
    const data = await api<ArMarketProductDetailsApi>(
      `/api/armarket/products/${encodeURIComponent(itemCode)}`
    );
    return mapProductDetails(data);
  } catch (err) {
    // Genuine 404 → return null (page will show not-found)
    // Any other error → return null but don't escalate (show graceful error in page)
    const msg = err instanceof Error ? err.message : '';
    if (!msg.includes('404')) {
      console.error('[fetchProductById] Backend error for', itemCode, msg);
    }
    return null;
  }
}

export async function fetchPopularProducts(params?: {
  period?: 'day' | 'week' | 'month';
  limit?: number;
  whsCode?: string;
  priceListId?: number;
}): Promise<UiPopularProduct[]> {
  const qs = new URLSearchParams();
  if (params?.period) qs.set('period', params.period);
  if (params?.limit != null) qs.set('limit', String(params.limit));
  if (params?.whsCode) qs.set('whsCode', params.whsCode);
  if (params?.priceListId != null) qs.set('priceListId', String(params.priceListId));

  const suffix = qs.toString() ? `?${qs}` : '';
  const data = await api<ArMarketPopularProductApi[]>(`/api/armarket/products/popular${suffix}`);
  return data.map(mapPopularProduct);
}

type ItemGroupApi = { GroupCode: number; GroupName: string; ItemsCount: number };

export async function fetchCategories(): Promise<UiCategory[]> {
  const data = await api<ItemGroupApi[]>('/api/Items/groups?top=50&skip=0');
  return data.map((g) => ({
    groupCode: g.GroupCode,
    name: g.GroupName,
    nameRu: g.GroupName, // SAP has single name field; same for both locales
  }));
}
