'use client';

import { useEffect, useState, useCallback } from 'react';
import type { Order } from '@/lib/types';

interface ArchiveMonth {
  month: string;
  count: number;
  totalRevenue: number;
}

const statusLabels: Record<string, string> = {
  yeni: 'Yeni',
  hazirlaniyor: 'Hazırlanıyor',
  yolda: 'Yolda',
  'teslim-edildi': 'Teslim Edildi',
  iptal: 'İptal',
};

function formatMonth(month: string): string {
  const [year, m] = month.split('-');
  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
  ];
  const idx = parseInt(m, 10) - 1;
  return `${monthNames[idx] ?? m} ${year}`;
}

export default function AdminArchivePage() {
  const [months, setMonths] = useState<ArchiveMonth[]>([]);
  const [archiveAfterMonths, setArchiveAfterMonths] = useState(6);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [monthOrders, setMonthOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState('');

  const loadMonths = useCallback(async () => {
    const res = await fetch('/api/orders/archive', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      setMonths(data.months ?? []);
      setArchiveAfterMonths(data.archiveAfterMonths ?? 6);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadMonths();
  }, [loadMonths]);

  const openMonth = async (month: string) => {
    setSelectedMonth(month);
    setLoadingOrders(true);
    const res = await fetch(`/api/orders/archive/${month}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      setMonthOrders(data.orders ?? []);
    }
    setLoadingOrders(false);
  };

  const runArchiveNow = async () => {
    setRunning(true);
    setRunResult('');
    try {
      const res = await fetch('/api/orders/archive/run', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setRunResult(
          data.archivedCount > 0
            ? `${data.archivedCount} sipariş arşivlendi.`
            : 'Şu an arşivlenecek sipariş bulunmuyor.'
        );
        await loadMonths();
      } else {
        setRunResult(data.error || 'Arşivleme sırasında bir hata oluştu.');
      }
    } catch {
      setRunResult('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setRunning(false);
    }
  };

  if (selectedMonth) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedMonth(null)}
            className="text-gray-500 hover:text-gray-800 font-bold text-sm"
          >
            ← Geri
          </button>
          <div>
            <h1 className="text-2xl font-black text-gray-900">{formatMonth(selectedMonth)} Arşivi</h1>
            <p className="text-gray-500 text-sm">Bu aya ait arşivlenmiş siparişler (salt okunur).</p>
          </div>
        </div>

        {loadingOrders ? (
          <div className="text-gray-500">Yükleniyor...</div>
        ) : monthOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center text-gray-400">Kayıt bulunamadı.</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="px-5 py-3 text-left">Müşteri</th>
                    <th className="px-5 py-3 text-left">Telefon</th>
                    <th className="px-5 py-3 text-left">Toplam</th>
                    <th className="px-5 py-3 text-left">Tarih</th>
                    <th className="px-5 py-3 text-left">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {monthOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4 font-bold text-gray-900">{o.customerName}</td>
                      <td className="px-5 py-4 text-gray-600">{o.phone}</td>
                      <td className="px-5 py-4 font-black text-gray-900">{o.total.toFixed(0)}₺</td>
                      <td className="px-5 py-4 text-gray-500 text-xs">
                        {new Date(o.createdAt).toLocaleString('tr-TR')}
                      </td>
                      <td className="px-5 py-4 text-xs font-bold text-gray-600">
                        {statusLabels[o.status] ?? o.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Arşiv</h1>
          <p className="text-gray-500 mt-1">
            {archiveAfterMonths} aydan eski, sonuçlanmış (teslim edildi/iptal) siparişler otomatik olarak
            buraya taşınır. Bu, ana sipariş listesini hızlı ve düzenli tutar.
          </p>
        </div>
        <button
          onClick={runArchiveNow}
          disabled={running}
          className="px-5 py-3 rounded-xl font-black text-sm bg-gray-900 text-white hover:bg-gray-800 transition-all disabled:opacity-50"
        >
          {running ? 'Çalışıyor...' : '🗄️ Şimdi Arşivle'}
        </button>
      </div>

      {runResult && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium rounded-xl px-4 py-3">
          {runResult}
        </div>
      )}

      {loading ? (
        <div className="text-gray-500">Yükleniyor...</div>
      ) : months.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-12 text-center text-gray-400">
          Henüz arşivlenmiş sipariş bulunmuyor. Siparişler {archiveAfterMonths} ay boyunca ana listede
          kalır, ardından otomatik olarak arşive taşınır.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {months.map((m) => (
            <button
              key={m.month}
              onClick={() => openMonth(m.month)}
              className="text-left bg-white rounded-2xl shadow-md hover:shadow-xl p-6 transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-xl shadow-md">
                  🗄️
                </div>
                <div>
                  <div className="font-black text-gray-900">{formatMonth(m.month)}</div>
                  <div className="text-xs text-gray-400">{m.count} sipariş</div>
                </div>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400 font-bold uppercase">Toplam Ciro</span>
                <span className="font-black text-gray-900">{m.totalRevenue.toFixed(0)}₺</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
