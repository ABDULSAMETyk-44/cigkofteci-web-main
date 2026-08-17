import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { requireAdmin } from '@/lib/authGuard';
import type { OrderStatus } from '@/lib/types';

const ALLOWED_STATUSES: OrderStatus[] = ['yeni', 'hazirlaniyor', 'yolda', 'teslim-edildi', 'iptal'];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const db = await getDB();
  const order = db.data.orders.find((o) => o.id === id);
  if (!order) {
    return NextResponse.json({ error: 'Sipariş bulunamadı.' }, { status: 404 });
  }

  if (body.status && ALLOWED_STATUSES.includes(body.status)) {
    order.status = body.status;
    order.updatedAt = new Date().toISOString();
  } else if (body.status) {
    return NextResponse.json({ error: 'Geçersiz sipariş durumu.' }, { status: 400 });
  }

  await db.write();
  return NextResponse.json({ success: true, order });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const { id } = await params;
  const db = await getDB();
  const before = db.data.orders.length;
  db.data.orders = db.data.orders.filter((o) => o.id !== id);
  if (db.data.orders.length === before) {
    return NextResponse.json({ error: 'Sipariş bulunamadı.' }, { status: 404 });
  }
  await db.write();
  return NextResponse.json({ success: true });
}
