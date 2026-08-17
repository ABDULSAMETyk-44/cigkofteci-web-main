import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/authGuard';
import { archiveOldOrders } from '@/lib/archive';

export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const body = await req.json().catch(() => ({}));
  const monthsThreshold = typeof body.monthsThreshold === 'number' ? body.monthsThreshold : undefined;

  const result = await archiveOldOrders(monthsThreshold);
  return NextResponse.json({ success: true, ...result });
}
