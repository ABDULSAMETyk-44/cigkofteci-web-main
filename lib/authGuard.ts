import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, SESSION_COOKIE_NAME, type SessionPayload } from './auth';

/**
 * API route'larını admin girişi olmadan erişilemez hale getirir.
 * Geçerli bir oturum yoksa 401 döner, varsa null döner (devam edilebilir).
 */
export async function requireAdmin(req: NextRequest): Promise<NextResponse | null> {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const payload = await verifySessionToken(token);
  if (!payload) {
    return NextResponse.json(
      { error: 'Yetkisiz erişim. Lütfen yönetici girişi yapın.' },
      { status: 401 }
    );
  }
  return null;
}

export async function getAdminSession(req: NextRequest): Promise<SessionPayload | null> {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}
