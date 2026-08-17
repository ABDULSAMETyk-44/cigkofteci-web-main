'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { categories } from '@/lib/products';
import type { Product } from '@/lib/types';

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => setProducts(data.products ?? []))
      .finally(() => setLoading(false));
  }, []);

  const categoriesWithItems = categories
    .map((cat) => ({
      ...cat,
      items: products.filter((p) => p.categoryKey === cat.key && p.isActive),
    }))
    .filter((cat) => cat.items.length > 0);

  return (
    <main className="min-h-screen pt-20 bg-gradient-to-b from-orange-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-600 via-orange-600 to-red-700 text-white py-24 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        {/* Floating Food Icons */}
        <div className="absolute top-10 left-10 text-6xl opacity-30 animate-float">🌯</div>
        <div className="absolute top-20 right-20 text-5xl opacity-30 animate-float delay-300">🥙</div>
        <div className="absolute bottom-10 left-1/4 text-7xl opacity-30 animate-float delay-500">🍅</div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <div className="inline-block bg-yellow-400 text-red-900 px-6 py-2 rounded-full font-bold text-sm mb-6 animate-bounce-slow">
            🍽️ Lezzetli Seçenekler
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black mb-6 animate-scale-in">
            Menümüz
          </h1>
          <p className="text-2xl text-orange-100 max-w-2xl mx-auto animate-fade-in delay-200">
            Taptaze ve lezzetli ürünlerimizi keşfedin
          </p>
        </div>

        {/* Wave Bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16">
            <path d="M0 120L50 110C100 100 200 80 300 70C400 60 500 60 600 70C700 80 800 100 900 110C1000 120 1100 120 1150 120H1200V120H0Z" fill="#fff5f0"/>
          </svg>
        </div>
      </section>

      {/* Menu Categories */}
      <section className="py-16 -mt-1">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="text-center text-gray-400 py-20">Menü yükleniyor...</div>
          ) : categoriesWithItems.length === 0 ? (
            <div className="text-center text-gray-400 py-20">Şu anda menüde ürün bulunmuyor.</div>
          ) : (
            categoriesWithItems.map((category, categoryIdx) => (
              <div
                key={category.key}
                className="mb-20 animate-fade-in"
                style={{ animationDelay: `${categoryIdx * 100}ms` }}
              >
                {/* Category Header */}
                <div className="relative mb-12">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-20 h-20 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center text-4xl shadow-lg animate-bounce-slow`}>
                      {category.icon}
                    </div>
                    <div>
                      <h2 className="text-4xl font-black text-gray-900">
                        {category.name}
                      </h2>
                      <div className={`h-1 w-32 bg-gradient-to-r ${category.color} rounded-full mt-2`}></div>
                    </div>
                  </div>
                </div>

                {/* Items Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.items.map((item, itemIdx) => (
                    <div
                      key={item.id}
                      className="group relative animate-slide-up hover-glow"
                      style={{ animationDelay: `${categoryIdx * 100 + itemIdx * 50}ms` }}
                    >
                      {item.isPopular && (
                        <div className="absolute -top-3 -right-3 bg-yellow-400 text-red-900 px-3 py-1 rounded-full font-bold text-xs z-10 shadow-lg animate-pulse-slow">
                          ⭐ Popüler
                        </div>
                      )}

                      <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-transparent hover:border-red-200 h-full">
                        {/* Gradient Top or Image */}
                        {item.imageUrl ? (
                          <div className="h-40 overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                        ) : (
                          <div className={`h-3 bg-gradient-to-r ${category.color}`}></div>
                        )}

                        <div className="p-6">
                          {/* Icon and Name */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                {!item.imageUrl && (
                                  <span className="text-4xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                                    {item.emoji}
                                  </span>
                                )}
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                                  {item.name}
                                </h3>
                              </div>
                              <p className="text-gray-600 text-sm leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                          </div>

                          {/* Price and Button */}
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                            <div className="text-3xl font-black text-red-600 group-hover:scale-110 transition-transform">
                              {item.price}₺
                            </div>
                            <Link
                              href="/siparis"
                              className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-5 py-2 rounded-xl font-bold hover:from-red-700 hover:to-orange-700 transition-all hover:scale-110 shadow-md text-sm"
                            >
                              Sipariş Ver
                            </Link>
                          </div>
                        </div>

                        {/* Hover Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-16 bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl p-12 text-white text-center shadow-2xl relative overflow-hidden animate-scale-in">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '30px 30px'
              }}></div>
            </div>

            <div className="relative z-10">
              <div className="text-7xl mb-6 animate-bounce-slow">🎉</div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black mb-4">
                Özel Kampanyalar
              </h2>
              <p className="text-xl mb-8 text-orange-100 max-w-2xl mx-auto">
                Her gün yeni fırsatlar ve lezzetler sizleri bekliyor!
              </p>

              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {[
                  { icon: '🎁', title: 'İlk Sipariş', desc: '%15 İndirim' },
                  { icon: '🔥', title: 'Kombo Menü', desc: '2 Al 1 Öde' },
                  { icon: '⚡', title: 'Hızlı Teslimat', desc: 'Bedava Kargo' }
                ].map((offer, idx) => (
                  <div
                    key={idx}
                    className="glass rounded-2xl p-6 hover:bg-white/30 transition-all cursor-pointer group animate-fade-in"
                    style={{animationDelay: `${idx * 100}ms`}}
                  >
                    <div className="text-5xl mb-3 group-hover:scale-125 transition-transform">
                      {offer.icon}
                    </div>
                    <div className="font-bold text-lg mb-1">{offer.title}</div>
                    <div className="text-yellow-300 font-black text-xl">{offer.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center animate-fade-in">
          <div className="text-6xl mb-6 animate-float">🌯</div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Hemen Sipariş Verin!
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Lezzetli çiğköftelerimiz 30 dakika içinde kapınızda
          </p>
          <Link
            href="/siparis"
            className="group inline-block bg-gradient-to-r from-red-600 to-orange-600 text-white px-12 py-5 rounded-full font-black text-xl hover:from-red-700 hover:to-orange-700 transition-all hover:scale-110 shadow-2xl relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Sipariş Ver
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          </Link>
        </div>
      </section>
    </main>
  );
}
