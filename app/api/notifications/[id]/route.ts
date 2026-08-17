import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { requireAdmin } from '@/lib/authGuard';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const { id } = await params;
  const db = await getDB();
  const notif = db.data.notifications.find((n) => n.id === id);
  if (!notif) {
    return NextResponse.json({ error: 'Bildirim bulunamadı.' }, { status: 404 });
  }
  notif.isRead = true;
  await db.write();
  return NextResponse.json({ success: true, notification: notif });
}
