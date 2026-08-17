'use client';

import { useEffect, useState, useCallback } from 'react';
import type { Order, OrderStatus } from '@/lib/types';

const statusLabels: Record<OrderStatus, string> = {
  yeni: 'Yeni',
  hazirlaniyor: 'Hazırlanıyor',
  yolda: 'Yolda',
  'teslim-edildi': 'Teslim Edildi',
  iptal: 'İptal',
};

const statusColors: Record<OrderStatus, string> = {
  yeni: 'bg-blue-100 text-blue-700 border-blue-200',
  hazirlaniyor: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  yolda: 'bg-purple-100 text-purple-700 border-purple-200',
  'teslim-edildi': 'bg-green-100 text-green-700 border-green-200',
  iptal: 'bg-red-100 text-red-700 border-red-200',
};

const filterOptions: { value: OrderStatus | 'hepsi'; label: string }[] = [
  { value: 'hepsi', label: 'Tümü' },
  { value: 'yeni', label: 'Yeni' },
  { value: 'hazirlaniyor', label: 'Hazırlanıyor' },
  { value: 'yolda', label: 'Yolda' },
  { value: 'teslim-edildi', label: 'Teslim Edildi' },
  { value: 'iptal', label: 'İptal' },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | 'hepsi'>('hepsi');
  const [selected, setSelected] = useState<Order | null>(null);

  const load = useCallback(async () => {
    const res = await fetch('/api/orders', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      setOrders(data.orders ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id: string, status: OrderStatus) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const data = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === id ? data.order : o)));
      setSelected((prev) => (prev && prev.id === id ? data.order : prev));
    }
  };

  const filtered = filter === 'hepsi' ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Siparişler</h1>
          <p className="text-gray-500 mt-1">Gelen siparişleri görüntüleyin ve durumlarını güncelleyin.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              filter === opt.value
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-gray-500">Yükleniyor...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-12 text-center text-gray-400">
          Bu filtreye uygun sipariş bulunamadı.
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {/* Mobil kart görünümü */}
          <div className="md:hidden divide-y divide-gray-50">
            {filtered.map((o) => (
              <button
                key={o.id}
                onClick={() => setSelected(o)}
                className="w-full text-left px-4 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <span className="font-bold text-gray-900 text-sm">{o.customerName}</span>
                  <span
                    className={`shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full border ${statusColors[o.status]}`}
                  >
                    {statusLabels[o.status]}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mb-2">{o.phone}</div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {o.items.reduce((s, it) => s + it.quantity, 0)} ürün ·{' '}
                    {new Date(o.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                  <span className="font-black text-gray-900">{o.total.toFixed(0)}₺</span>
                </div>
              </button>
            ))}
          </div>

          {/* Masaüstü tablo görünümü */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-5 py-3 text-left">Müşteri</th>
                  <th className="px-5 py-3 text-left">Telefon</th>
                  <th className="px-5 py-3 text-left">Ürün Adedi</th>
                  <th className="px-5 py-3 text-left">Toplam</th>
                  <th className="px-5 py-3 text-left">Tarih</th>
                  <th className="px-5 py-3 text-left">Durum</th>
                  <th className="px-5 py-3 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-bold text-gray-900">{o.customerName}</td>
                    <td className="px-5 py-4 text-gray-600">{o.phone}</td>
                    <td className="px-5 py-4 text-gray-600">
                      {o.items.reduce((s, it) => s + it.quantity, 0)} ürün
                    </td>
                    <td className="px-5 py-4 font-black text-gray-900">{o.total.toFixed(0)}₺</td>
                    <td className="px-5 py-4 text-gray-500 text-xs">
                      {new Date(o.createdAt).toLocaleString('tr-TR')}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full border ${statusColors[o.status]}`}
                      >
                        {statusLabels[o.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setSelected(o)}
                        className="text-red-600 hover:text-red-700 font-bold text-xs"
                      >
                        Detay →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-xl font-black text-gray-900">Sipariş Detayı</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700 text-2xl">
                ×
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <div className="text-xs text-gray-400 font-bold uppercase mb-1">Müşteri</div>
                <div className="font-bold text-gray-900">{selected.customerName}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 font-bold uppercase mb-1">Telefon</div>
                <a href={`tel:${selected.phone}`} className="font-bold text-red-600">
                  {selected.phone}
                </a>
              </div>
              <div>
                <div className="text-xs text-gray-400 font-bold uppercase mb-1">Adres</div>
                <div className="text-gray-700">{selected.address}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 font-bold uppercase mb-1">Ödeme Yöntemi</div>
                <div className="text-gray-700">{selected.paymentMethod}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 font-bold uppercase mb-2">Ürünler</div>
                <div className="space-y-2">
                  {selected.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-sm bg-gray-50 rounded-lg px-3 py-2">
                      <span>
                        {it.quantity} × {it.name}
                      </span>
                      <span className="font-bold">{(it.unitPrice * it.quantity).toFixed(0)}₺</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-3 pt-3 border-t border-gray-100 font-black text-lg">
                  <span>Toplam</span>
                  <span className="text-red-600">{selected.total.toFixed(0)}₺</span>
                </div>
              </div>
              {selected.notes && (
                <div>
                  <div className="text-xs text-gray-400 font-bold uppercase mb-1">Sipariş Notu</div>
                  <div className="text-gray-700 italic">{selected.notes}</div>
                </div>
              )}
              <div>
                <div className="text-xs text-gray-400 font-bold uppercase mb-2">Durum Güncelle</div>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(statusLabels) as OrderStatus[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selected.id, s)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                        selected.status === s
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {statusLabels[s]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
