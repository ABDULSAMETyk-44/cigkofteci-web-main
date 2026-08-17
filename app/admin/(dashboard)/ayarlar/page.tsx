'use client';

import { useState } from 'react';

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Yeni şifreler eşleşmiyor.' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Şifre değiştirilemedi.' });
      } else {
        setMessage({ type: 'success', text: 'Şifreniz başarıyla güncellendi.' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch {
      setMessage({ type: 'error', text: 'Bağlantı hatası. Lütfen tekrar deneyin.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Hesap Ayarları</h1>
        <p className="text-gray-500 mt-1">Hesap ve bildirim ayarlarınızı buradan yönetin.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-black text-gray-900 mb-4">Şifre Değiştir</h2>

        {message && (
          <div
            className={`mb-4 rounded-xl px-4 py-3 text-sm font-medium ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm">Mevcut Şifre</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-all text-gray-900"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm">Yeni Şifre</label>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-all text-gray-900"
              placeholder="En az 8 karakter"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm">Yeni Şifre (Tekrar)</label>
            <input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-all text-gray-900"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-xl font-black hover:from-red-700 hover:to-orange-700 transition-all disabled:opacity-50"
          >
            {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-black text-gray-900 mb-3">E-posta Bildirimleri</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Yeni sipariş, mesaj ve bayilik başvurusu geldiğinde bu panelde anında bildirim
          görürsünüz. Ayrıca sunucudaki <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">.env</code> dosyasına
          SMTP bilgilerinizi (posta sunucusu) ve <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">NOTIFY_EMAIL</code> adresinizi
          girerseniz, aynı bildirimler e-posta olarak da gönderilir. Kurulum adımları proje
          içindeki <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">.env.example</code> ve{' '}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">README.md</code> dosyalarında anlatılmaktadır.
        </p>
      </div>
    </div>
  );
}
