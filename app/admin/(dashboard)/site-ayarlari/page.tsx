'use client';

import { useEffect, useState, useRef } from 'react';
import type { SiteSettings } from '@/lib/types';

type FormState = SiteSettings;

export default function AdminSiteSettingsPage() {
  const [form, setForm] = useState<FormState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/settings', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => setForm(data.settings))
      .finally(() => setLoading(false));
  }, []);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const uploadImage = async (
    file: File,
    field: 'logoUrl' | 'heroImageUrl',
    setUploading: (v: boolean) => void
  ) => {
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('/api/settings/upload-image', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Görsel yüklenemedi.');
      } else {
        update(field, data.url);
      }
    } catch {
      setError('Görsel yüklenirken bağlantı hatası oluştu.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setError('');
    setSuccess(false);
    setSaving(true);

    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Ayarlar kaydedilemedi.');
      } else {
        setForm(data.settings);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);
      }
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) {
    return <div className="text-gray-500">Yükleniyor...</div>;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Site Ayarları</h1>
        <p className="text-gray-500 mt-1">
          Ana sayfa görseli, logo, iletişim bilgileri ve sipariş ayarlarını buradan yönetin. Yaptığınız
          değişiklikler kaydettiğiniz an sitede canlı olarak görünür.
        </p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm font-medium rounded-xl px-4 py-3">
          ✅ Ayarlar başarıyla kaydedildi.
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo & Hero Image */}
        <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">
          <h2 className="text-lg font-black text-gray-900">Görseller</h2>

          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm">Site Logosu</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                {form.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl">🌯</span>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], 'logoUrl', setUploadingLogo)}
                  className="block w-full text-xs text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
                {uploadingLogo && <p className="text-xs text-orange-600 font-medium">Yükleniyor...</p>}
                {form.logoUrl && !uploadingLogo && (
                  <button
                    type="button"
                    onClick={() => update('logoUrl', '')}
                    className="text-xs font-bold text-red-600 hover:text-red-700"
                  >
                    Logoyu kaldır (varsayılan ikon kullanılsın)
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm">Ana Sayfa Kapak Görseli</label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-16 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                {form.heroImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.heroImageUrl} alt="Kapak" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">🖼️</span>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  ref={heroInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], 'heroImageUrl', setUploadingHero)}
                  className="block w-full text-xs text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
                {uploadingHero && <p className="text-xs text-orange-600 font-medium">Yükleniyor...</p>}
                {form.heroImageUrl && !uploadingHero && (
                  <button
                    type="button"
                    onClick={() => update('heroImageUrl', '')}
                    className="text-xs font-bold text-red-600 hover:text-red-700"
                  >
                    Görseli kaldır (renkli arka plan kullanılsın)
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-bold mb-1.5 text-sm">Başlık (1. Satır)</label>
              <input
                type="text"
                value={form.heroTitleLine1}
                onChange={(e) => update('heroTitleLine1', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none text-gray-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-1.5 text-sm">Başlık (2. Satır — vurgulu)</label>
              <input
                type="text"
                value={form.heroTitleLine2}
                onChange={(e) => update('heroTitleLine2', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none text-gray-900 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-1.5 text-sm">Alt Başlık</label>
            <textarea
              value={form.heroSubtitle}
              onChange={(e) => update('heroSubtitle', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none text-gray-900 text-sm h-20"
            />
          </div>
        </div>

        {/* İletişim Bilgileri */}
        <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
          <h2 className="text-lg font-black text-gray-900">İletişim Bilgileri</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-bold mb-1.5 text-sm">Telefon</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none text-gray-900 text-sm"
                placeholder="0850 123 45 67"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-1.5 text-sm">WhatsApp (opsiyonel)</label>
              <input
                type="text"
                value={form.whatsapp}
                onChange={(e) => update('whatsapp', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none text-gray-900 text-sm"
                placeholder="0555 123 45 67"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-1.5 text-sm">E-posta</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none text-gray-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-1.5 text-sm">Şehir</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => update('city', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none text-gray-900 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-1.5 text-sm">Adres</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => update('address', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none text-gray-900 text-sm"
            />
          </div>
        </div>

        {/* Sosyal Medya */}
        <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
          <h2 className="text-lg font-black text-gray-900">Sosyal Medya</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-bold mb-1.5 text-sm">📘 Facebook</label>
              <input
                type="url"
                value={form.facebookUrl}
                onChange={(e) => update('facebookUrl', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none text-gray-900 text-sm"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-1.5 text-sm">📸 Instagram</label>
              <input
                type="url"
                value={form.instagramUrl}
                onChange={(e) => update('instagramUrl', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none text-gray-900 text-sm"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-1.5 text-sm">🐦 Twitter / X</label>
              <input
                type="url"
                value={form.twitterUrl}
                onChange={(e) => update('twitterUrl', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none text-gray-900 text-sm"
                placeholder="https://x.com/..."
              />
            </div>
          </div>
        </div>

        {/* Çalışma Saatleri */}
        <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
          <h2 className="text-lg font-black text-gray-900">Çalışma Saatleri</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-bold mb-1.5 text-sm">Hafta İçi</label>
              <input
                type="text"
                value={form.workingHoursWeekday}
                onChange={(e) => update('workingHoursWeekday', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none text-gray-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-1.5 text-sm">Cumartesi</label>
              <input
                type="text"
                value={form.workingHoursSaturday}
                onChange={(e) => update('workingHoursSaturday', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none text-gray-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-1.5 text-sm">Pazar</label>
              <input
                type="text"
                value={form.workingHoursSunday}
                onChange={(e) => update('workingHoursSunday', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none text-gray-900 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Sipariş Ayarları */}
        <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
          <h2 className="text-lg font-black text-gray-900">Sipariş Ayarları</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-bold mb-1.5 text-sm">Teslimat Süresi Metni</label>
              <input
                type="text"
                value={form.deliveryTimeText}
                onChange={(e) => update('deliveryTimeText', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none text-gray-900 text-sm"
                placeholder="30 dakika"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-1.5 text-sm">Minimum Sipariş Tutarı (₺)</label>
              <input
                type="number"
                min="0"
                value={form.minOrderTotal}
                onChange={(e) => update('minOrderTotal', Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none text-gray-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-1.5 text-sm">Ücretsiz Teslimat Eşiği (₺)</label>
              <input
                type="number"
                min="0"
                value={form.freeDeliveryThreshold}
                onChange={(e) => update('freeDeliveryThreshold', Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none text-gray-900 text-sm"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving || uploadingLogo || uploadingHero}
          className="px-8 py-4 rounded-xl font-black text-sm bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700 transition-all shadow-lg disabled:opacity-50"
        >
          {saving ? 'Kaydediliyor...' : '💾 Değişiklikleri Kaydet'}
        </button>
      </form>
    </div>
  );
}
