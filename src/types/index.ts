// ─────────────────────────────────────────────
// Theme & Locale
// ─────────────────────────────────────────────

export type Theme = 'red' | 'green' | 'yellow' | 'dark';
export type Locale = 'uz' | 'ru';

// ─────────────────────────────────────────────
// Product UI types (from armarketApi)
// ─────────────────────────────────────────────

export type { UiProductCard, UiPopularProduct, UiProductDetails, UiCategory } from '@/lib/armarketApi';

// ─────────────────────────────────────────────
// News
// ─────────────────────────────────────────────

export type NewsCategory = 'news' | 'promo' | 'update';

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  titleRu: string;
  summary: string;
  summaryRu: string;
  content?: string;
  contentRu?: string;
  image?: string;
  date: string;
  category: NewsCategory;
  featured?: boolean;
}

// ─────────────────────────────────────────────
// Filters & Sort
// ─────────────────────────────────────────────

// Sort is frontend-only for now; backend doesn't yet support a sort param
export type SortOption = 'popular' | 'newest' | 'priceAsc' | 'priceDesc';

export interface ProductFilters {
  groupCode?: number;
  inStock?: boolean;
  search?: string;
}

// day/week/month matches backend param values
export type PopularPeriod = 'day' | 'week' | 'month';

// ─────────────────────────────────────────────
// Analytics
// ─────────────────────────────────────────────

export type AnalyticsEventName =
  | 'page_view'
  | 'product_card_click'
  | 'product_detail_open'
  | 'search_used'
  | 'filter_used'
  | 'theme_changed'
  | 'language_changed'
  | 'news_opened'
  | 'contact_click_phone'
  | 'contact_click_telegram'
  | 'cta_clicked'
  | 'cookie_accepted'
  | 'cookie_rejected'
  | 'load_more_clicked';

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  props?: Record<string, string | number | boolean>;
  timestamp: number;
  locale: Locale;
  theme: Theme;
}

// ─────────────────────────────────────────────
// API Response
// ─────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  data: T | null;
  error?: string;
  ok: boolean;
}

// ─────────────────────────────────────────────
// Contact Form
// ─────────────────────────────────────────────

export interface ContactFormData {
  name: string;
  phone: string;
  message: string;
}
