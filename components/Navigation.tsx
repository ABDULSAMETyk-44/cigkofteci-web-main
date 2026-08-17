'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { SiteSettings } from '@/lib/types';

interface NavigationProps {
  settings: SiteSettings;
}

export default function Navigation({ settings }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: 'Ana Sayfa', href: '/' },
    { name: 'Menü', href: '/menu' },
    { name: 'Hakkımızda', href: '/hakkimizda' },
    { name: 'Şubeler', href: '/subeler' },
    { name: 'Bayilik', href: '/bayilik' },
    { name: 'İletişim', href: '/iletisim' }
  ];

  return (
    // Sabit renk için: arka planı beyaz (bg-white) ve gölgeyi (shadow-lg) sabitliyoruz
    <nav className="fixed w-full top-0 z-50 transition-all duration-300 bg-white shadow-lg py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3 group">
             <div className="w-14 h-14 rounded-xl transform group-hover:rotate-12 transition-transform overflow-hidden shrink-0 bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center">
    {settings.logoUrl ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={settings.logoUrl}
        alt="Logo"
        className="w-full h-full object-cover"
      />
    ) : (
      <span className="text-3xl">🌯</span>
    )}
  </div>
            <div>
              <span className="text-2xl font-black text-red-600">
                ADIYAMAN ÇİĞKÖFTE
              </span>
              {/* mt-1 ile yazıyı 2 cm (yaklaşık) aşağı itiyoruz */}
              <div className="text-xs text-orange-500 font-bold mt-1">Halil Gençalp ile 2010'den beri</div>
            </div>
          </Link>

          {/* Desktop Menu - Renkler artık sabit */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="font-bold transition-all hover:scale-110 text-gray-700 hover:text-red-600"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <Link
            href="/siparis"
            className="hidden md:block bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-3 rounded-full font-bold hover:from-red-600 hover:to-orange-600 transition-all hover:scale-105 shadow-lg"
          >
            🛒 Sipariş Ver
          </Link>

          {/* Mobile Menu Button - Renk sabit */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden focus:outline-none text-gray-700"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 bg-white rounded-2xl shadow-xl p-6">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-3 text-gray-700 hover:text-red-600 font-bold hover:translate-x-2 transition-all"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/siparis"
              className="block mt-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-full font-bold text-center hover:from-red-600 hover:to-orange-600"
              onClick={() => setIsOpen(false)}
            >
              🛒 Sipariş Ver
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}