import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

// Next.js 16: middleware.ts dosya kuralı kullanımdan kaldırıldı, yerine
// proxy.ts geldi (bkz. https://nextjs.org/docs/messages/middleware-to-proxy).
// Bu dosya, admin sayfalarına girişsiz erişimi engelleyip login sayfasına
// yönlendiren bir KULLANICI DENEYİMİ kolaylığıdır — gerçek yetkilendirme
// kontrolü burada değil, her API route'unda (requireAdmin) ve admin
// layout'unda ayrıca ve bağımsız olarak yapılır. Böylece bu katman
// atlansa/bypass edilse bile veriler korunmaya devam eder.
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminArea = pathname.startsWith('/admin') && pathname !== '/admin/login';

  if (isAdminArea) {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const payload = await verifySessionToken(token);

    if (!payload) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
