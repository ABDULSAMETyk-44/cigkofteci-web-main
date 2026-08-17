'use client';

import { useState, useEffect } from 'react';
import type { SiteSettings } from '@/lib/types';

const avantajlar = [
  { icon: '🌯', title: 'Kanıtlanmış Lezzet', desc: '15+ yıllık tarif ve marka bilinirliği' },
  { icon: '📚', title: 'Eğitim & Destek', desc: 'Personel eğitimi ve operasyonel destek' },
  { icon: '📦', title: 'Merkezi Tedarik', desc: 'Standart kalite için merkezi hammadde tedariki' },
  { icon: '📈', title: 'Pazarlama Desteği', desc: 'Ulusal kampanyalar ve dijital pazarlama' },
];

const budgetOptions = [
  '250.000₺ - 500.000₺',
  '500.000₺ - 1.000.000₺',
  '1.000.000₺ - 2.000.000₺',
  '2.000.000₺ ve üzeri',
];

const experienceOptions = [
  'Gıda sektöründe deneyimim yok',
  '1-3 yıl gıda/perakende deneyimi',
  '3-10 yıl gıda/perakende deneyimi',
  '10+ yıl gıda/perakende deneyimi',
];

export default function BayilikPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    investmentBudget: budgetOptions[0],
    experience: experienceOptions[0],
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetch('/api/settings', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => setSettings(data.settings ?? null))
      .catch(() => {});
  }, []);

  const phone = settings?.phone ?? '0850 123 45 67';
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/franchise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Başvuru gönderilirken bir hata oluştu.');
        setIsSubmitting(false);
        return;
      }

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        city: '',
        investmentBudget: budgetOptions[0],
        experience: experienceOptions[0],
        message: '',
      });
    } catch {
      setError('Bağlantı hatası. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen pt-20 bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-red-950 to-orange-950 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
              backgroundSize: '40px 40px',
            }}
          ></div>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="inline-block bg-yellow-400 text-orange-900 px-6 py-2 rounded-full font-bold text-sm mb-6">
            🤝 Bayilik / Franchise
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black mb-6">Ekibimize Katılın</h1>
          <p className="text-xl text-orange-100 max-w-2xl mx-auto">
            Türkiye&apos;nin sevilen çiğköfte markasıyla kendi işinizin patronu olun.
            Deneyimli ekibimiz her adımda yanınızda.
          </p>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {avantajlar.map((a) => (
              <div key={a.title} className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="text-4xl mb-3">{a.icon}</div>
                <h3 className="font-black text-gray-900 mb-1">{a.title}</h3>
                <p className="text-sm text-gray-500">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-10 pb-24">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                📝
              </div>
              <h2 className="text-3xl font-black text-gray-900">Bayilik Başvuru Formu</h2>
            </div>

            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 font-medium rounded-xl px-5 py-4">
                ✅ Başvurunuz alındı! Bayilik ekibimiz en kısa sürede sizinle iletişime geçecek.
              </div>
            )}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 font-medium rounded-xl px-5 py-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">Ad Soyad *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-all text-gray-900"
                    placeholder="Adınız ve soyadınız"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2">Telefon *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-all text-gray-900"
                    placeholder="0555 123 45 67"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">E-posta *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-all text-gray-900"
                    placeholder="ornek@email.com"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2">Şehir *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-all text-gray-900"
                    placeholder="Bayilik açmak istediğiniz şehir"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">Yatırım Bütçesi</label>
                  <select
                    value={formData.investmentBudget}
                    onChange={(e) => setFormData({ ...formData, investmentBudget: e.target.value })}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-all text-gray-900"
                  >
                    {budgetOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2">Sektör Deneyimi</label>
                  <select
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-all text-gray-900"
                  >
                    {experienceOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">Mesajınız</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-all h-32 text-gray-900"
                  placeholder="Bize kendinizden ve hedeflerinizden bahsedin (opsiyonel)"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-5 rounded-xl font-black text-xl hover:from-red-700 hover:to-orange-700 transition-all hover:scale-105 shadow-xl disabled:opacity-50"
              >
                {isSubmitting ? '⏳ Gönderiliyor...' : '📨 Başvuruyu Gönder'}
              </button>
            </form>
          </div>

          <p className="text-center text-gray-500 text-sm mt-6">
            Başvurunuzla ilgili sorularınız için{' '}
            <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-red-600 font-bold hover:underline">
              {phone}
            </a>{' '}
            numaralı hattımızdan bize ulaşabilirsiniz.
          </p>
        </div>
      </section>
    </main>
  );
}
