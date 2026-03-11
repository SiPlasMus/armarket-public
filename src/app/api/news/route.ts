import { NextRequest, NextResponse } from 'next/server';
import { DEMO_NEWS } from '@/lib/demo-data';

// TODO: Replace with real DB query
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const category = searchParams.get('category');
  const limit = parseInt(searchParams.get('limit') ?? '6');

  const filtered = category && category !== 'all'
    ? DEMO_NEWS.filter((n) => n.category === category)
    : DEMO_NEWS;

  return NextResponse.json({
    data: filtered.slice(0, limit),
    total: filtered.length,
  });
}
