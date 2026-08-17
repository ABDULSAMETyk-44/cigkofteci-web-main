import Link from 'next/link';
import type { SiteSettings } from '@/lib/types';

interface FooterProps {
  settings: SiteSettings;
}

export default function Footer({ settings }: FooterProps) {
  const socialLinks = [
    { icon: '📘', url: settings.facebookUrl },
    { icon: '📸', url: settings.instagramUrl },
    { icon: '🐦', url: settings.twitterUrl },
  ].filter((s) => s.url);

  const telHref = `tel:${settings.phone.replace(/\s/g, '')}`;

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-500 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl animate-pulse-slow delay-500"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <span className="text-5xl group-hover:rotate-12 transition-transform">🌯</span>
              <div>
                <h3 className="text-3xl font-black text-white group-hover:text-yellow-400 transition-colors">
                  ADIYAMAN ÇİĞKÖFTE
                </h3>
                <p className="text-orange-400 text-xs font-bold">2010'den beri</p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Geleneksel lezzetin modern adresi. 15 yılı aşkın deneyimimizle hizmetinizdeyiz.
            </p>
            
            {/* Social Media */}
            {socialLinks.length > 0 && (
              <div className="flex gap-3 pt-4">
                {socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-white/10 hover:bg-gradient-to-br hover:from-red-500 hover:to-orange-500 rounded-xl flex items-center justify-center text-2xl transition-all hover:scale-110 hover:rotate-12 animate-fade-in"
                    style={{animationDelay: `${idx * 100}ms`}}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            )}
          </div>
          
          {/* Quick Links */}
          <div className="animate-fade-in delay-200">
            <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="text-2xl">🔗</span>
              Hızlı Linkler
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Menü', href: '/menu' },
                { name: 'Hakkımızda', href: '/hakkimizda' },
                { name: 'Şubeler', href: '/subeler' },
                { name: 'İletişim', href: '/iletisim' }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link 
                    href={link.href}
                    className="group text-gray-400 hover:text-white transition-all flex items-center gap-2"
                  >
                    <span className="text-red-500 group-hover:translate-x-2 transition-transform">→</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div className="animate-fade-in delay-300">
            <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="text-2xl">📞</span>
              İletişim
            </h4>
            <ul className="space-y-4">
              <li className="group cursor-pointer">
                <a href={telHref} className="flex items-center gap-3 text-gray-400 group-hover:text-white transition-colors">
                  <span className="text-2xl group-hover:scale-125 transition-transform">📱</span>
                  <div>
                    <div className="font-bold">Telefon</div>
                    <div className="text-sm">{settings.phone}</div>
                  </div>
                </a>
              </li>
              <li className="group cursor-pointer">
                <a href={`mailto:${settings.email}`} className="flex items-center gap-3 text-gray-400 group-hover:text-white transition-colors">
                  <span className="text-2xl group-hover:scale-125 transition-transform">📧</span>
                  <div>
                    <div className="font-bold">E-posta</div>
                    <div className="text-sm">{settings.email}</div>
                  </div>
                </a>
              </li>
              <li className="group cursor-pointer">
                <div className="flex items-center gap-3 text-gray-400 group-hover:text-white transition-colors">
                  <span className="text-2xl group-hover:scale-125 transition-transform">📍</span>
                  <div>
                    <div className="font-bold">Adres</div>
                    <div className="text-sm">{settings.address}</div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          
          {/* Working Hours */}
          <div className="animate-fade-in delay-400">
            <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="text-2xl">⏰</span>
              Çalışma Saatleri
            </h4>
            <div className="space-y-3">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-red-500/50 transition-all hover:scale-105 cursor-pointer">
                <div className="font-bold text-yellow-400">Hafta İçi</div>
                <div className="text-gray-400 text-sm">{settings.workingHoursWeekday}</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-red-500/50 transition-all hover:scale-105 cursor-pointer">
                <div className="font-bold text-yellow-400">Cumartesi</div>
                <div className="text-gray-400 text-sm">{settings.workingHoursSaturday}</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-red-500/50 transition-all hover:scale-105 cursor-pointer">
                <div className="font-bold text-yellow-400">Pazar</div>
                <div className="text-gray-400 text-sm">{settings.workingHoursSunday}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8 animate-fade-in delay-600">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center">
              &copy; 2026 <span className="text-red-500 font-bold">Adıyaman Çiğköfte</span>. Tüm hakları saklıdır.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-sm">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Gizlilik Politikası
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Kullanım Koşulları
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Bottom Line */}
      <div className="h-2 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500"></div>
    </footer>
  );
}