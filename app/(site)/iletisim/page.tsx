'use client';

import { useState, useEffect } from 'react';
import type { SiteSettings } from '@/lib/types';

export default function IletisimPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetch('/api/settings', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => setSettings(data.settings ?? null))
      .catch(() => {});
  }, []);

  const phone = settings?.phone ?? '0850 123 45 67';
  const email = settings?.email ?? 'info@cigkofte.com';
  const address = settings?.address ?? 'Malatya, Türkiye';
  const workingHoursWeekday = settings?.workingHoursWeekday ?? '10:00 - 22:00';
  const deliveryTimeText = settings?.deliveryTimeText ?? '30 dakika';
  const telHref = `tel:${phone.replace(/\s/g, '')}`;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Mesaj gönderilirken bir hata oluştu.');
        setIsSubmitting(false);
        return;
      }

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setTimeout(() => setSuccess(false), 6000);
    } catch {
      setError('Bağlantı hatası. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen pt-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="absolute top-10 right-10 text-8xl opacity-20 animate-float">💬</div>
        <div className="absolute bottom-10 left-10 text-7xl opacity-20 animate-float delay-500">📧</div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <div className="inline-block bg-yellow-400 text-purple-900 px-6 py-2 rounded-full font-bold text-sm mb-6 animate-bounce-slow">
            📞 7/24 Destek
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black mb-6 animate-scale-in">
            İletişim
          </h1>
          <p className="text-2xl text-purple-100 max-w-2xl mx-auto animate-fade-in delay-200">
            Size nasıl yardımcı olabiliriz?
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="animate-fade-in-left">
              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-2xl shadow-lg animate-bounce-slow">
                    ✉️
                  </div>
                  <h2 className="text-3xl font-black text-gray-900">
                    Mesaj Gönderin
                  </h2>
                </div>

                {success && (
                  <div className="mb-6 bg-green-50 border border-green-200 text-green-700 font-medium rounded-xl px-5 py-4">
                    ✅ Mesajınız alındı! En kısa sürede size dönüş yapacağız.
                  </div>
                )}
                {error && (
                  <div className="mb-6 bg-red-50 border border-red-200 text-red-700 font-medium rounded-xl px-5 py-4">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="animate-slide-up delay-100">
                    <label className="block text-gray-700 font-bold mb-2">Ad Soyad *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all text-gray-900"
                      placeholder="Adınız ve soyadınız"
                    />
                  </div>

                  <div className="animate-slide-up delay-200">
                    <label className="block text-gray-700 font-bold mb-2">E-posta *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all text-gray-900"
                      placeholder="ornek@email.com"
                    />
                  </div>

                  <div className="animate-slide-up delay-300">
                    <label className="block text-gray-700 font-bold mb-2">Telefon</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all text-gray-900"
                      placeholder="0555 123 45 67"
                    />
                  </div>

                  <div className="animate-slide-up delay-400">
                    <label className="block text-gray-700 font-bold mb-2">Konu *</label>
                    <select
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all text-gray-900"
                    >
                      <option value="">Konu seçin</option>
                      <option value="siparis">Sipariş Hakkında</option>
                      <option value="franchise">Franchise</option>
                      <option value="sikayet">Şikayet</option>
                      <option value="oneri">Öneri</option>
                      <option value="diger">Diğer</option>
                    </select>
                  </div>

                  <div className="animate-slide-up delay-500">
                    <label className="block text-gray-700 font-bold mb-2">Mesajınız *</label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all h-40 text-gray-900"
                      placeholder="Mesajınızı buraya yazın..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-5 rounded-xl font-black text-xl hover:from-purple-700 hover:to-pink-700 transition-all hover:scale-105 shadow-xl disabled:opacity-50 relative overflow-hidden group animate-slide-up delay-600"
                  >
                    <span className="relative z-10">
                      {isSubmitting ? '⏳ Gönderiliyor...' : '📨 Gönder'}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-6 animate-fade-in-right">
              {[
                {
                  icon: '📞',
                  title: 'Telefon',
                  content: [phone, `Pzt-Paz: ${workingHoursWeekday}`],
                  color: 'from-green-500 to-emerald-600',
                  action: telHref
                },
                {
                  icon: '📧',
                  title: 'E-posta',
                  content: [email],
                  color: 'from-blue-500 to-cyan-600',
                  action: `mailto:${email}`
                },
                {
                  icon: '📍',
                  title: 'Merkez Adres',
                  content: [address],
                  color: 'from-red-500 to-orange-600',
                  action: null
                },
                {
                  icon: '💬',
                  title: 'Sosyal Medya',
                  content: [
                    [settings?.instagramUrl && 'Instagram', settings?.facebookUrl && 'Facebook', settings?.twitterUrl && 'Twitter']
                      .filter(Boolean)
                      .join(' • ') || 'Yakında',
                  ],
                  color: 'from-purple-500 to-pink-600',
                  action: null
                }
              ].map((contact, idx) => (
                <div
                  key={idx}
                  className="group relative animate-slide-up"
                  style={{animationDelay: `${idx * 100}ms`}}
                >
                  <div className="absolute -inset-2 bg-gradient-to-r opacity-0 group-hover:opacity-20 rounded-3xl blur-xl transition-opacity"
                    style={{backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`}}
                  ></div>
                  
                  <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all border-2 border-transparent hover:border-purple-200">
                    <div className="flex items-start gap-6">
                      <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${contact.color} rounded-2xl flex items-center justify-center text-4xl shadow-lg group-hover:scale-125 group-hover:rotate-12 transition-all`}>
                        {contact.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-black text-gray-900 mb-3">{contact.title}</h3>
                        {contact.content.map((line, i) => (
                          <p key={i} className="text-gray-600 font-medium">
                            {contact.action && i === 0 ? (
                              <a href={contact.action} className="hover:text-purple-600 transition-colors">
                                {line}
                              </a>
                            ) : line}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <div className="text-6xl mb-4 animate-bounce-slow">🎯</div>
          <h2 className="text-3xl md:text-4xl font-black mb-3">
            Hemen Arayın, Sipariş Verin!
          </h2>
          <p className="text-xl text-orange-100 mb-6">
            Taptaze çiğköftemiz {deliveryTimeText} içinde kapınızda
          </p>
          <a
            href={telHref}
            className="inline-block bg-white text-red-600 px-12 py-5 rounded-full font-black text-xl hover:bg-gray-100 transition-all hover:scale-110 shadow-2xl"
          >
            📞 {phone}
          </a>
        </div>
      </section>
    </main>
  );
}