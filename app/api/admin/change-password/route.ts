import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDB } from '@/lib/db';
import { getAdminSession } from '@/lib/authGuard';

export async function PATCH(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
  }

  const { currentPassword, newPassword } = await req.json().catch(() => ({}));

  if (!currentPassword || !newPassword || typeof newPassword !== 'string') {
    return NextResponse.json({ error: 'Mevcut ve yeni şifre gereklidir.' }, { status: 400 });
  }

  if (newPassword.length < 8) {
    return NextResponse.json({ error: 'Yeni şifre en az 8 karakter olmalıdır.' }, { status: 400 });
  }

  const db = await getDB();
  const admin = db.data.admins.find((a) => a.id === session.sub);
  if (!admin) {
    return NextResponse.json({ error: 'Yönetici bulunamadı.' }, { status: 404 });
  }

  const valid = bcrypt.compareSync(currentPassword, admin.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: 'Mevcut şifre hatalı.' }, { status: 401 });
  }

  admin.passwordHash = bcrypt.hashSync(newPassword, 10);
  await db.write();

  return NextResponse.json({ success: true });
}
