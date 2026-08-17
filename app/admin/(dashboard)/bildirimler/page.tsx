'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Notification } from '@/lib/types';

const typeIcon: Record<Notification['type'], string> = {
  siparis: '🛒',
  mesaj: '✉️',
  bayilik: '🤝',
};

const typeLabel: Record<Notification['type'], string> = {
  siparis: 'Sipariş',
  mesaj: 'Mesaj',
  bayilik: 'Bayilik',
};

export default function AdminNotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch('/api/notifications', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      setNotifications(data.notifications ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const markAllRead = async () => {
    await fetch('/api/notifications/read-all', { method: 'PATCH' });
    load();
  };

  const handleClick = async (n: Notification) => {
    if (!n.isRead) {
      await fetch(`/api/notifications/${n.id}`, { method: 'PATCH' });
    }
    if (n.type === 'siparis') router.push('/admin/siparisler');
    else if (n.type === 'mesaj') router.push('/admin/mesajlar');
    else if (n.type === 'bayilik') router.push('/admin/bayilik');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Bildirimler</h1>
          <p className="text-gray-500 mt-1">Siparişler, mesajlar ve bayilik başvurularına dair tüm bildirimler.</p>
        </div>
        <button
          onClick={markAllRead}
          className="px-4 py-2 rounded-xl text-sm font-bold bg-white border border-gray-200 hover:bg-gray-50 text-gray-700"
        >
          Tümünü Okundu İşaretle
        </button>
      </div>

      {loading ? (
        <div className="text-gray-500">Yükleniyor...</div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-12 text-center text-gray-400">
          Henüz bildirim bulunmuyor.
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md divide-y divide-gray-50 overflow-hidden">
          {notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => handleClick(n)}
              className={`w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors flex items-start gap-4 ${
                !n.isRead ? 'bg-red-50/40' : ''
              }`}
            >
              <span className="text-2xl">{typeIcon[n.type]}</span>
              <span className="flex-1 min-w-0">
                <span className="flex items-center gap-2">
                  <span className="font-black text-gray-900">{n.title}</span>
                  <span className="text-[10px] font-bold uppercase text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {typeLabel[n.type]}
                  </span>
                </span>
                <span className="block text-sm text-gray-600 mt-0.5">{n.message}</span>
                <span className="block text-xs text-gray-400 mt-1">
                  {new Date(n.createdAt).toLocaleString('tr-TR')}
                </span>
              </span>
              {!n.isRead && <span className="w-2.5 h-2.5 rounded-full bg-red-600 mt-1.5 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
