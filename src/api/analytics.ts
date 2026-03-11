/**
 * Analytics API — placeholder
 * Frontend sends batched events here.
 * Backend stores them in DB / Redis / ClickHouse (TBD).
 */
import type { AnalyticsEvent } from '@/types';

// TODO: POST /api/analytics
export async function sendAnalyticsEvents(events: AnalyticsEvent[]): Promise<void> {
  if (process.env.NODE_ENV === 'development') {
    console.debug('[Analytics] Would send:', events);
    return;
  }

  await fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ events }),
    keepalive: true,
  });
}
