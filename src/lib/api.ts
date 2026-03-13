/**
 * Shared fetch helper for AR Market backend API.
 *
 * Usage:
 *   import { api } from '@/lib/api';
 *   const data = await api<Product[]>('/api/products?limit=8');
 *   const item = await api<NewsItem>('/api/news/my-slug');
 *   await api('/api/analytics', { method: 'POST', body: { events } });
 *
 * Set NEXT_PUBLIC_API_BASE in .env.local
 */

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';

// Extended init that accepts plain objects as body (no need to JSON.stringify manually)
export interface ApiInit extends Omit<RequestInit, 'body'> {
  body?: Record<string, unknown> | unknown[] | string | FormData | URLSearchParams | Blob | ArrayBuffer | null;
}

function prepareBody(raw: ApiInit['body']): { serialized: BodyInit | undefined; isJson: boolean } {
  if (raw === undefined || raw === null) {
    return { serialized: undefined, isJson: false };
  }
  if (
    typeof raw === 'string' ||
    raw instanceof FormData ||
    raw instanceof URLSearchParams ||
    raw instanceof Blob ||
    raw instanceof ArrayBuffer
  ) {
    return { serialized: raw, isJson: false };
  }
  return { serialized: JSON.stringify(raw), isJson: true };
}

export async function api<T>(path: string, init?: ApiInit): Promise<T> {
  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
  const { serialized, isJson } = prepareBody(init?.body);

  const res = await fetch(url, {
    ...init,
    body: serialized,
    headers: {
      ...(isJson ? { 'Content-Type': 'application/json' } : {}),
      ...(API_KEY ? { 'x-api-key': API_KEY } : {}),
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }

  const contentType = res.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return res.text() as unknown as T;
  }
  return res.json() as Promise<T>;
}
