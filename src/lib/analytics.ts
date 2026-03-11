import type { AnalyticsEvent, AnalyticsEventName, Locale, Theme } from '@/types';

// ─────────────────────────────────────────────
// Event queue — buffer events, flush in batches
// ─────────────────────────────────────────────

const QUEUE_SIZE_LIMIT = 10;
const FLUSH_INTERVAL_MS = 30_000; // 30s

let queue: AnalyticsEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flush();
    flushTimer = null;
  }, FLUSH_INTERVAL_MS);
}

async function flush() {
  if (queue.length === 0) return;
  const events = [...queue];
  queue = [];

  try {
    // TODO: Replace with actual backend endpoint
    if (process.env.NODE_ENV === 'development') {
      console.debug('[Analytics] flush', events);
      return;
    }

    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events }),
      keepalive: true,
    });
  } catch {
    // Re-queue on failure (silently)
    queue = [...events, ...queue].slice(0, 50);
  }
}

// Flush on page hide/unload
if (typeof window !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush();
  });
}

// ─────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────

export function trackEvent(
  name: AnalyticsEventName,
  props?: AnalyticsEvent['props'],
  context?: { locale: Locale; theme: Theme }
) {
  const event: AnalyticsEvent = {
    name,
    props,
    timestamp: Date.now(),
    locale: context?.locale ?? 'uz',
    theme: context?.theme ?? 'red',
  };

  queue.push(event);

  if (queue.length >= QUEUE_SIZE_LIMIT) {
    flush();
  } else {
    scheduleFlush();
  }
}

export function trackPageView(
  path: string,
  context?: { locale: Locale; theme: Theme }
) {
  trackEvent('page_view', { path }, context);
}
