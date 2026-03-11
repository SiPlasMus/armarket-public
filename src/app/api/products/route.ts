import { NextRequest, NextResponse } from 'next/server';
import { DEMO_PRODUCTS } from '@/lib/demo-data';

// TODO: Replace with real DB query
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = parseInt(searchParams.get('limit') ?? '12');
  const start = (page - 1) * limit;

  return NextResponse.json({
    data: DEMO_PRODUCTS.slice(start, start + limit),
    total: DEMO_PRODUCTS.length,
    page,
    limit,
    hasMore: start + limit < DEMO_PRODUCTS.length,
  });
}
