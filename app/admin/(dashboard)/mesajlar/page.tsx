'use client';

import { useEffect, useState, useCallback } from 'react';
import type { ContactMessage, MessageStatus } from '@/lib/types';

const statusLabels: Record<MessageStatus, string> = {
  yeni: 'Yeni',
  okundu: 'Okundu',
  yanitlandi: 'Yanıtlandı',
};

const statusColors: Record<MessageStatus, string> = {
  yeni: 'bg-blue-100 text-blue-700 border-blue-200',
  okundu: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  yanitlandi: 'bg-green-100 text-green-700 border-green-200',
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const load = useCallback(async () => {
    const res = await fetch('/api/contact', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      setMessages(data.messages ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id: string, status: MessageStatus) => {
    const res = await fetch(`/api/contact/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const data = await res.json();
      setMessages((prev) => prev.map((m) => (m.id === id ? data.message : m)));
      setSelected((prev) => (prev && prev.id === id ? data.message : prev));
    }
  };

  const openMessage = (m: ContactMessage) => {
    setSelected(m);
    if (m.status === 'yeni') {
      updateStatus(m.id, 'okundu');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Mesajlar</h1>
        <p className="text-gray-500 mt-1">İletişim formundan gelen mesajları görüntüleyin.</p>
      </div>

      {loading ? (
        <div className="text-gray-500">Yükleniyor...</div>
      ) : messages.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-12 text-center text-gray-400">
          Henüz mesaj bulunmuyor.
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {/* Mobil kart görünümü */}
          <div className="md:hidden divide-y divide-gray-50">
            {messages.map((m) => (
              <button
                key={m.id}
                onClick={() => openMessage(m)}
                className={`w-full text-left px-4 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors ${
                  m.status === 'yeni' ? 'font-bold' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <span className="text-gray-900 text-sm">{m.name}</span>
                  <span className={`shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full border ${statusColors[m.status]}`}>
                    {statusLabels[m.status]}
                  </span>
                </div>
                <div className="text-xs text-gray-500 truncate mb-1">{m.subject}</div>
                <div className="text-[11px] text-gray-400">{new Date(m.createdAt).toLocaleString('tr-TR')}</div>
              </button>
            ))}
          </div>

          {/* Masaüstü tablo görünümü */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-5 py-3 text-left">Ad Soyad</th>
                  <th className="px-5 py-3 text-left">Konu</th>
                  <th className="px-5 py-3 text-left">Tarih</th>
                  <th className="px-5 py-3 text-left">Durum</th>
                  <th className="px-5 py-3 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {messages.map((m) => (
                  <tr key={m.id} className={`hover:bg-gray-50 transition-colors ${m.status === 'yeni' ? 'font-bold' : ''}`}>
                    <td className="px-5 py-4 text-gray-900">{m.name}</td>
                    <td className="px-5 py-4 text-gray-600 max-w-xs truncate">{m.subject}</td>
                    <td className="px-5 py-4 text-gray-500 text-xs">
                      {new Date(m.createdAt).toLocaleString('tr-TR')}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${statusColors[m.status]}`}>
                        {statusLabels[m.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => openMessage(m)}
                        className="text-red-600 hover:text-red-700 font-bold text-xs"
                      >
                        Görüntüle →
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
              <h3 className="text-xl font-black text-gray-900">Mesaj Detayı</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700 text-2xl">
                ×
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <div className="text-xs text-gray-400 font-bold uppercase mb-1">Gönderen</div>
                <div className="font-bold text-gray-900">{selected.name}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 font-bold uppercase mb-1">E-posta</div>
                <a href={`mailto:${selected.email}`} className="font-bold text-red-600">
                  {selected.email}
                </a>
              </div>
              {selected.phone && (
                <div>
                  <div className="text-xs text-gray-400 font-bold uppercase mb-1">Telefon</div>
                  <a href={`tel:${selected.phone}`} className="font-bold text-red-600">
                    {selected.phone}
                  </a>
                </div>
              )}
              <div>
                <div className="text-xs text-gray-400 font-bold uppercase mb-1">Konu</div>
                <div className="text-gray-700">{selected.subject}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 font-bold uppercase mb-1">Mesaj</div>
                <div className="text-gray-700 bg-gray-50 rounded-xl p-4 whitespace-pre-wrap">{selected.message}</div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                  className="px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-red-600 to-orange-600 text-white"
                >
                  ✉️ E-posta ile Yanıtla
                </a>
                <button
                  onClick={() => updateStatus(selected.id, 'yanitlandi')}
                  className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                    selected.status === 'yanitlandi'
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  ✓ Yanıtlandı Olarak İşaretle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
