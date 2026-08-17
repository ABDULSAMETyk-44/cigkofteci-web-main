import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { requireAdmin } from '@/lib/authGuard';
import { listArchiveMonths } from '@/lib/archive';

export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const db = await getDB();
  const { orders, contactMessages, franchiseApplications, notifications } = db.data;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const todayOrders = orders.filter((o) => new Date(o.createdAt) >= startOfToday);
  const todayRevenue = todayOrders
    .filter((o) => o.status !== 'iptal')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter((o) => o.status === 'yeni' || o.status === 'hazirlaniyor').length;
  const unreadMessages = contactMessages.filter((m) => m.status === 'yeni').length;
  const pendingFranchise = franchiseApplications.filter(
    (a) => a.status === 'yeni' || a.status === 'inceleniyor'
  ).length;
  const unreadNotifications = notifications.filter((n) => !n.isRead).length;

  const archiveMonths = listArchiveMonths();
  const archivedOrdersCount = archiveMonths.reduce((sum, m) => sum + m.count, 0);

  return NextResponse.json({
    totalOrders: orders.length,
    archivedOrdersCount,
    allTimeOrdersCount: orders.length + archivedOrdersCount,
    todayOrdersCount: todayOrders.length,
    todayRevenue,
    pendingOrders,
    totalMessages: contactMessages.length,
    unreadMessages,
    totalFranchiseApplications: franchiseApplications.length,
    pendingFranchise,
    unreadNotifications,
    recentOrders: orders.slice(0, 5),
    recentMessages: contactMessages.slice(0, 5),
    recentFranchise: franchiseApplications.slice(0, 5),
  });
}
