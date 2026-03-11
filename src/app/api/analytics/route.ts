import { NextRequest, NextResponse } from 'next/server';
import type { AnalyticsEvent } from '@/types';

// TODO: Store events in DB / Redis / ClickHouse
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { events: AnalyticsEvent[] };
    // placeholder — log for now
    if (process.env.NODE_ENV === 'development') {
      console.log('[API/analytics] received', body.events.length, 'events');
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 });
  }
}
