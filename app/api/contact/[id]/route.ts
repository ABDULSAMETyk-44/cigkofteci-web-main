import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { requireAdmin } from '@/lib/authGuard';
import type { MessageStatus } from '@/lib/types';

const ALLOWED_STATUSES: MessageStatus[] = ['yeni', 'okundu', 'yanitlandi'];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const db = await getDB();
  const msg = db.data.contactMessages.find((m) => m.id === id);
  if (!msg) {
    return NextResponse.json({ error: 'Mesaj bulunamadı.' }, { status: 404 });
  }

  if (body.status && ALLOWED_STATUSES.includes(body.status)) {
    msg.status = body.status;
  } else if (body.status) {
    return NextResponse.json({ error: 'Geçersiz durum.' }, { status: 400 });
  }

  await db.write();
  return NextResponse.json({ success: true, message: msg });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const { id } = await params;
  const db = await getDB();
  const before = db.data.contactMessages.length;
  db.data.contactMessages = db.data.contactMessages.filter((m) => m.id !== id);
  if (db.data.contactMessages.length === before) {
    return NextResponse.json({ error: 'Mesaj bulunamadı.' }, { status: 404 });
  }
  await db.write();
  return NextResponse.json({ success: true });
}
