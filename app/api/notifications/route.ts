import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { requireAdmin } from '@/lib/authGuard';

export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const db = await getDB();
  const unreadCount = db.data.notifications.filter((n) => !n.isRead).length;
  return NextResponse.json({
    notifications: db.data.notifications.slice(0, 50),
    unreadCount,
  });
}
