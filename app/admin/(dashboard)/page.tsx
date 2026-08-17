'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Stats {
  totalOrders: number;
  archivedOrdersCount: number;
  allTimeOrdersCount: number;
  todayOrdersCount: number;
  todayRevenue: number;
  pendingOrders: number;
  totalMessages: number;
  unreadMessages: number;
  totalFranchiseApplications: number;
  pendingFranchise: number;
  unreadNotifications: number;
  recentOrders: { id: string; customerName: string; total: number; status: string; createdAt: string }[];
  recentMessages: { id: string; name: string; subject: string; createdAt: string }[];
  recentFranchise: { id: string; name: string; city: string; createdAt: string }[];
}

const statusLabels: Record<string, string> = {
  yeni: 'Yeni',
  hazirlaniyor: 'Hazırlanıyor',
  yolda: 'Yolda',
  'teslim-edildi': 'Teslim Edildi',
  iptal: 'İptal',
};

const statusColors: Record<string, string> = {
  yeni: 'bg-blue-100 text-blue-700',
  hazirlaniyor: 'bg-yellow-100 text-yellow-700',
  yolda: 'bg-purple-100 text-purple-700',
  'teslim-edildi': 'bg-green-100 text-green-700',
  iptal: 'bg-red-100 text-red-700',
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/stats', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-gray-500">Yükleniyor...</div>;
  }

  if (!stats) {
    return <div className="text-red-600">İstatistikler yüklenemedi.</div>;
  }

  const cards = [
    {
      label: 'Bugünkü Sipariş',
      value: stats.todayOrdersCount,
      icon: '🛒',
      color: 'from-red-500 to-orange-500',
      href: '/admin/siparisler',
    },
    {
      label: 'Bugünkü Ciro',
      value: `${stats.todayRevenue.toFixed(0)}₺`,
      icon: '💰',
      color: 'from-green-500 to-emerald-600',
      href: '/admin/siparisler',
    },
    {
      label: 'Bekleyen Sipariş',
      value: stats.pendingOrders,
      icon: '⏳',
      color: 'from-yellow-500 to-orange-500',
      href: '/admin/siparisler',
    },
    {
      label: 'Okunmamış Mesaj',
      value: stats.unreadMessages,
      icon: '✉️',
      color: 'from-purple-500 to-pink-600',
      href: '/admin/mesajlar',
    },
    {
      label: 'Bekleyen Bayilik Başvurusu',
      value: stats.pendingFranchise,
      icon: '🤝',
      color: 'from-blue-500 to-cyan-600',
      href: '/admin/bayilik',
    },
    {
      label: 'Toplam Sipariş',
      value: stats.totalOrders,
      icon: '📦',
      color: 'from-gray-700 to-gray-900',
      href: '/admin/siparisler',
    },
    {
      label: 'Arşivlenmiş Sipariş',
      value: stats.archivedOrdersCount,
      icon: '🗄️',
      color: 'from-slate-500 to-slate-700',
      href: '/admin/arsiv',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Panel</h1>
        <p className="text-gray-500 mt-1">Hoş geldiniz! İşletmenizin genel durumu aşağıda.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 flex items-center gap-4 group"
          >
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform shrink-0`}
            >
              {c.icon}
            </div>
            <div>
              <div className="text-2xl font-black text-gray-900">{c.value}</div>
              <div className="text-sm text-gray-500 font-medium">{c.label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-md p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-gray-900">Son Siparişler</h2>
            <Link href="/admin/siparisler" className="text-sm font-bold text-red-600 hover:text-red-700">
              Tümünü Gör →
            </Link>
          </div>
          {stats.recentOrders.length === 0 ? (
            <p className="text-gray-400 text-sm py-6 text-center">Henüz sipariş yok.</p>
          ) : (
            <div className="space-y-3">
              {stats.recentOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0">
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{o.customerName}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(o.createdAt).toLocaleString('tr-TR')}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-gray-900">{o.total.toFixed(0)}₺</span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColors[o.status]}`}>
                      {statusLabels[o.status]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-black text-gray-900 mb-4">Son Mesajlar</h2>
          {stats.recentMessages.length === 0 ? (
            <p className="text-gray-400 text-sm py-4 text-center">Henüz mesaj yok.</p>
          ) : (
            <div className="space-y-3 mb-6">
              {stats.recentMessages.map((m) => (
                <div key={m.id} className="border-b border-gray-50 pb-3 last:border-0">
                  <div className="font-bold text-gray-900 text-sm">{m.name}</div>
                  <div className="text-xs text-gray-500 truncate">{m.subject}</div>
                </div>
              ))}
            </div>
          )}
          <Link href="/admin/mesajlar" className="text-sm font-bold text-red-600 hover:text-red-700">
            Tüm mesajları gör →
          </Link>
        </div>
      </div>
    </div>
  );
}
