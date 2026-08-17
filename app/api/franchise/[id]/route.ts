import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { requireAdmin } from '@/lib/authGuard';
import type { FranchiseStatus } from '@/lib/types';

const ALLOWED_STATUSES: FranchiseStatus[] = ['yeni', 'inceleniyor', 'onaylandi', 'reddedildi'];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const db = await getDB();
  const application = db.data.franchiseApplications.find((a) => a.id === id);
  if (!application) {
    return NextResponse.json({ error: 'Başvuru bulunamadı.' }, { status: 404 });
  }

  if (body.status && ALLOWED_STATUSES.includes(body.status)) {
    application.status = body.status;
  } else if (body.status) {
    return NextResponse.json({ error: 'Geçersiz durum.' }, { status: 400 });
  }

  await db.write();
  return NextResponse.json({ success: true, application });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const { id } = await params;
  const db = await getDB();
  const before = db.data.franchiseApplications.length;
  db.data.franchiseApplications = db.data.franchiseApplications.filter((a) => a.id !== id);
  if (db.data.franchiseApplications.length === before) {
    return NextResponse.json({ error: 'Başvuru bulunamadı.' }, { status: 404 });
  }
  await db.write();
  return NextResponse.json({ success: true });
}
