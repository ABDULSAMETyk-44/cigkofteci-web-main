import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { requireAdmin } from '@/lib/authGuard';

export async function PATCH(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const db = await getDB();
  db.data.notifications.forEach((n) => {
    n.isRead = true;
  });
  await db.write();
  return NextResponse.json({ success: true });
}
