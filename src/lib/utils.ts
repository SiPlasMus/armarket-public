import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Locale } from '@/types';

// ─────────────────────────────────────────────
// Install: npm install clsx tailwind-merge
// ─────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format UZS price: 1500000 → "1 500 000 so'm"
export function formatPrice(amount: number, locale: Locale = 'uz'): string {
  const formatted = new Intl.NumberFormat('uz-UZ', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(amount);

  const suffix = locale === 'ru' ? ' сум' : ' so\'m';
  return formatted + suffix;
}

// Truncate text to N chars
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

// Get localized field value
export function localizeField(
  uz: string,
  ru: string,
  locale: Locale
): string {
  return locale === 'ru' ? ru : uz;
}

// Slugify string
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .trim();
}

// Format date for display
export function formatDate(dateStr: string, locale: Locale): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'uz-UZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Clamp a value between min and max
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
