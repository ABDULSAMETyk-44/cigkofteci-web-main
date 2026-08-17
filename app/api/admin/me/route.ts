import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/authGuard';

export async function GET(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Oturum bulunamadı.' }, { status: 401 });
  }
  return NextResponse.json({ admin: session });
}
