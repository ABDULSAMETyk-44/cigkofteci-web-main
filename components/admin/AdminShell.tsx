'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { Notification } from '@/lib/types';

const navItems = [
  { href: '/admin', label: 'Panel', icon: '📊', exact: true },
  { href: '/admin/siparisler', label: 'Siparişler', icon: '🛒' },
  { href: '/admin/urunler', label: 'Ürünler', icon: '🍽️' },
  { href: '/admin/mesajlar', label: 'Mesajlar', icon: '✉️' },
  { href: '/admin/bayilik', label: 'Bayilik Başvuruları', icon: '🤝' },
  { href: '/admin/arsiv', label: 'Arşiv', icon: '🗄️' },
  { href: '/admin/bildirimler', label: 'Bildirimler', icon: '🔔' },
  { href: '/admin/site-ayarlari', label: 'Site Ayarları', icon: '🏪' },
  { href: '/admin/ayarlar', label: 'Hesap Ayarları', icon: '⚙️' },
];

const typeIcon: Record<Notification['type'], string> = {
  siparis: '🛒',
  mesaj: '✉️',
  bayilik: '🤝',
};

function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'az önce';
  if (mins < 60) return `${mins} dk önce`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} sa önce`;
  const days = Math.floor(hours / 24);
  return `${days} gün önce`;
}

export default function AdminShell({
  children,
  adminName,
  adminEmail,
}: {
  children: React.ReactNode;
  adminName: string;
  adminEmail: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data.notifications ?? []);
      setUnreadCount(data.unreadCount ?? 0);
    } catch {
      // sessizce geç - bağlantı sorunları arayüzü bozmasın
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000); // 20 sn'de bir kontrol et
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleMarkAllRead = async () => {
    await fetch('/api/notifications/read-all', { method: 'PATCH' });
    fetchNotifications();
  };

  const handleNotificationClick = async (n: Notification) => {
    if (!n.isRead) {
      await fetch(`/api/notifications/${n.id}`, { method: 'PATCH' });
    }
    setBellOpen(false);
    if (n.type === 'siparis') router.push('/admin/siparisler');
    else if (n.type === 'mesaj') router.push('/admin/mesajlar');
    else if (n.type === 'bayilik') router.push('/admin/bayilik');
    fetchNotifications();
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-gray-900 text-white transform transition-transform duration-300 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-800 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-xl font-black">
            🌯
          </div>
          <div>
            <div className="font-black text-lg leading-tight">Yönetici Paneli</div>
            <div className="text-xs text-gray-400">Adıyaman Çiğköfte</div>
          </div>
        </div>

        <nav className="px-3 py-4 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                  active
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.href === '/admin/bildirimler' && unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:text-white font-bold"
          >
            🌐 Siteyi Görüntüle
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:text-red-300 font-bold"
          >
            🚪 Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white shadow-sm px-4 sm:px-8 py-4 flex items-center justify-between">
          <button
            className="lg:hidden text-gray-700"
            onClick={() => setSidebarOpen(true)}
            aria-label="Menüyü Aç"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-4">
            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => setBellOpen((v) => !v)}
                className="relative w-11 h-11 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl transition-all"
                aria-label="Bildirimler"
              >
                🔔
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {bellOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setBellOpen(false)} />
                  <div className="absolute right-0 mt-2 w-96 max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-gray-100 z-20 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                      <span className="font-black text-gray-900">Bildirimler</span>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-xs font-bold text-red-600 hover:text-red-700"
                        >
                          Tümünü okundu işaretle
                        </button>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-10 text-center text-gray-400 text-sm">
                          Henüz bildirim yok.
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <button
                            key={n.id}
                            onClick={() => handleNotificationClick(n)}
                            className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-all flex gap-3 ${
                              !n.isRead ? 'bg-red-50/50' : ''
                            }`}
                          >
                            <span className="text-xl">{typeIcon[n.type]}</span>
                            <span className="flex-1 min-w-0">
                              <span className="block font-bold text-sm text-gray-900 truncate">
                                {n.title}
                              </span>
                              <span className="block text-xs text-gray-500 line-clamp-2">
                                {n.message}
                              </span>
                              <span className="block text-[11px] text-gray-400 mt-1">
                                {timeAgo(n.createdAt)}
                              </span>
                            </span>
                            {!n.isRead && <span className="w-2 h-2 rounded-full bg-red-600 mt-1.5 shrink-0" />}
                          </button>
                        ))
                      )}
                    </div>
                    <Link
                      href="/admin/bildirimler"
                      onClick={() => setBellOpen(false)}
                      className="block text-center py-3 text-sm font-bold text-red-600 hover:bg-gray-50"
                    >
                      Tüm bildirimleri görüntüle →
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* Admin info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-orange-600 text-white flex items-center justify-center font-black">
                {adminName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-bold text-gray-900 leading-tight">{adminName}</div>
                <div className="text-xs text-gray-500 leading-tight">{adminEmail}</div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
