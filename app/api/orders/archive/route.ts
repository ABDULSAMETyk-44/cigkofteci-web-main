import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/authGuard';
import { listArchiveMonths, getArchiveAfterMonths } from '@/lib/archive';

export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const months = listArchiveMonths();
  return NextResponse.json({ months, archiveAfterMonths: getArchiveAfterMonths() });
}
