import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/authGuard';
import { getArchivedOrders } from '@/lib/archive';

export async function GET(req: NextRequest, { params }: { params: Promise<{ month: string }> }) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const { month } = await params;
  const orders = getArchivedOrders(month);
  return NextResponse.json({ orders, month });
}
