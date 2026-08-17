'use client';

import { useEffect, useState, useCallback } from 'react';
import type { FranchiseApplication, FranchiseStatus } from '@/lib/types';

const statusLabels: Record<FranchiseStatus, string> = {
  yeni: 'Yeni',
  inceleniyor: 'İnceleniyor',
  onaylandi: 'Onaylandı',
  reddedildi: 'Reddedildi',
};

const statusColors: Record<FranchiseStatus, string> = {
  yeni: 'bg-blue-100 text-blue-700 border-blue-200',
  inceleniyor: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  onaylandi: 'bg-green-100 text-green-700 border-green-200',
  reddedildi: 'bg-red-100 text-red-700 border-red-200',
};

export default function AdminFranchisePage() {
  const [applications, setApplications] = useState<FranchiseApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<FranchiseApplication | null>(null);

  const load = useCallback(async () => {
    const res = await fetch('/api/franchise', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      setApplications(data.applications ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id: string, status: FranchiseStatus) => {
    const res = await fetch(`/api/franchise/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const data = await res.json();
      setApplications((prev) => prev.map((a) => (a.id === id ? data.application : a)));
      setSelected((prev) => (prev && prev.id === id ? data.application : prev));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Bayilik Başvuruları</h1>
        <p className="text-gray-500 mt-1">Franchise / bayilik başvurularını görüntüleyin ve değerlendirin.</p>
      </div>

      {loading ? (
        <div className="text-gray-500">Yükleniyor...</div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-12 text-center text-gray-400">
          Henüz bayilik başvurusu bulunmuyor.
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {/* Mobil kart görünümü */}
          <div className="md:hidden divide-y divide-gray-50">
            {applications.map((a) => (
              <button
                key={a.id}
                onClick={() => setSelected(a)}
                className="w-full text-left px-4 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <span className="font-bold text-gray-900 text-sm">{a.name}</span>
                  <span className={`shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full border ${statusColors[a.status]}`}>
                    {statusLabels[a.status]}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mb-1">
                  {a.city} · {a.investmentBudget}
                </div>
                <div className="text-[11px] text-gray-400">{new Date(a.createdAt).toLocaleString('tr-TR')}</div>
              </button>
            ))}
          </div>

          {/* Masaüstü tablo görünümü */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-5 py-3 text-left">Ad Soyad</th>
                  <th className="px-5 py-3 text-left">Şehir</th>
                  <th className="px-5 py-3 text-left">Bütçe</th>
                  <th className="px-5 py-3 text-left">Tarih</th>
                  <th className="px-5 py-3 text-left">Durum</th>
                  <th className="px-5 py-3 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {applications.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-bold text-gray-900">{a.name}</td>
                    <td className="px-5 py-4 text-gray-600">{a.city}</td>
                    <td className="px-5 py-4 text-gray-600">{a.investmentBudget}</td>
                    <td className="px-5 py-4 text-gray-500 text-xs">
                      {new Date(a.createdAt).toLocaleString('tr-TR')}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${statusColors[a.status]}`}>
                        {statusLabels[a.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setSelected(a)}
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

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-xl font-black text-gray-900">Başvuru Detayı</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700 text-2xl">
                ×
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <div className="text-xs text-gray-400 font-bold uppercase mb-1">Ad Soyad</div>
                <div className="font-bold text-gray-900">{selected.name}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 font-bold uppercase mb-1">E-posta</div>
                <a href={`mailto:${selected.email}`} className="font-bold text-red-600">
                  {selected.email}
                </a>
              </div>
              <div>
                <div className="text-xs text-gray-400 font-bold uppercase mb-1">Telefon</div>
                <a href={`tel:${selected.phone}`} className="font-bold text-red-600">
                  {selected.phone}
                </a>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-400 font-bold uppercase mb-1">Şehir</div>
                  <div className="text-gray-700">{selected.city}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-bold uppercase mb-1">Yatırım Bütçesi</div>
                  <div className="text-gray-700">{selected.investmentBudget}</div>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 font-bold uppercase mb-1">Sektör Deneyimi</div>
                <div className="text-gray-700">{selected.experience}</div>
              </div>
              {selected.message && (
                <div>
                  <div className="text-xs text-gray-400 font-bold uppercase mb-1">Mesaj</div>
                  <div className="text-gray-700 bg-gray-50 rounded-xl p-4 whitespace-pre-wrap">
                    {selected.message}
                  </div>
                </div>
              )}

              <div>
                <div className="text-xs text-gray-400 font-bold uppercase mb-2">Durum Güncelle</div>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(statusLabels) as FranchiseStatus[]).map((s) => (
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
