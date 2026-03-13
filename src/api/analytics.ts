import type { AnalyticsEvent } from '@/types';
import { api } from '@/lib/api';

export async function sendAnalyticsEvents(events: AnalyticsEvent[]): Promise<void> {
  if (process.env.NODE_ENV === 'development') {
    console.debug('[Analytics] Would send:', events);
    return;
  }
  await api<void>('/api/analytics', {
    method: 'POST',
    body: { events },
    keepalive: true,
  });
}
