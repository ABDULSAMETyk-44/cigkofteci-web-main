import Link from 'next/link';

export default function HakkimizdaPage() {
  return (
    <main className="min-h-screen pt-20 bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-red-600 via-orange-600 to-red-700 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <div className="absolute top-10 right-10 text-8xl opacity-20 animate-float">📖</div>
        <div className="absolute bottom-10 left-10 text-7xl opacity-20 animate-float delay-500">🌯</div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <div className="inline-block bg-yellow-400 text-red-900 px-6 py-2 rounded-full font-bold text-sm mb-6 animate-bounce-slow">
            🏆 15 Yıllık Deneyim
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black mb-6 animate-scale-in">
            Hakkımızda
          </h1>
          <p className="text-2xl text-orange-100 max-w-2xl mx-auto animate-fade-in delay-200">
            Geleneksel lezzetin modern hikayesi
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gradient-to-b from-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <div className="relative animate-fade-in-left">
              <div className="absolute -inset-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl opacity-20 blur-3xl animate-pulse-slow"></div>
              
              <div className="relative bg-gradient-to-br from-red-500 to-orange-600 rounded-3xl p-12 text-white shadow-2xl hover:scale-105 transition-transform duration-500">
                <div className="absolute top-0 right-0 text-9xl opacity-10 animate-rotate">🌯</div>
                
                <div className="relative z-10">
                  <div className="text-8xl mb-6 animate-bounce-slow">📖</div>
                  <h2 className="text-4xl font-black mb-6">Hikayemiz</h2>
                  <p className="text-lg leading-relaxed opacity-95 mb-4">
                    2010 yılında küçük bir dükkanda başlayan yolculuğumuz, bugün 50'den fazla 
                    şube ile Türkiye'nin dört bir yanına yayıldı.
                  </p>
                  <p className="text-lg leading-relaxed opacity-95">
                    Babadan oğula geçen geleneksel tariflerimizi modern hijyen standartlarıyla 
                    birleştirerek, hem nostaljik hem de çağdaş bir lezzet deneyimi sunuyoruz.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6 animate-fade-in-right">
              <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center text-4xl shadow-lg animate-bounce-slow">
                    🎯
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-3">Misyonumuz</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Türk mutfağının bu eşsiz lezzetini en doğal haliyle, 
                      her yaştan insana ulaştırmak ve sağlıklı beslenme kültürünü yaygınlaştırmak.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center text-4xl shadow-lg animate-bounce-slow delay-200">
                    🔭
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-3">Vizyonumuz</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Türkiye'nin en sevilen çiğköfte markası olarak, 
                      uluslararası arenada da ülkemizi en iyi şekilde temsil etmek.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center text-4xl shadow-lg animate-bounce-slow delay-400">
                    💎
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-3">Değerlerimiz</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Kalite, doğallık, müşteri memnuniyeti ve sürekli gelişim 
                      ilkelerimizin temel taşlarıdır.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-orange-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-center mb-16 animate-fade-in">
            Rakamlarla Biz
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { num: '25+', label: 'Yıllık Deneyim', icon: '📅' },
              { num: '50+', label: 'Şube', icon: '🏪' },
              { num: '1000+', label: 'Günlük Müşteri', icon: '👥' },
              { num: '100%', label: 'Doğal', icon: '🌿' }
            ].map((stat, idx) => (
              <div 
                key={idx}
                className="glass rounded-3xl p-8 text-center hover:bg-white/30 transition-all cursor-pointer group animate-scale-in"
                style={{animationDelay: `${idx * 100}ms`}}
              >
                <div className="text-6xl mb-4 group-hover:scale-125 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-3xl sm:text-5xl md:text-6xl font-black mb-2 group-hover:scale-110 transition-transform">
                  {stat.num}
                </div>
                <div className="text-lg font-bold text-orange-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Neden <span className="gradient-text">Biz?</span>
            </h2>
            <div className="w-24 h-2 bg-gradient-to-r from-red-500 to-orange-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🌿',
                title: 'Doğallık',
                desc: 'Hiçbir katkı maddesi kullanmadan, sadece doğal malzemelerle üretim yapıyoruz.',
                color: 'from-green-400 to-emerald-500'
              },
              {
                icon: '✨',
                title: 'Kalite',
                desc: 'En kaliteli bulgur, domates ve baharatları özenle seçiyor, her gün taze üretiyoruz.',
                color: 'from-yellow-400 to-orange-500'
              },
              {
                icon: '❤️',
                title: 'Müşteri Memnuniyeti',
                desc: 'Müşterilerimizin memnuniyeti bizim için her şeyden önemli. Size en iyisini sunmak için çalışıyoruz.',
                color: 'from-red-400 to-pink-500'
              }
            ].map((value, idx) => (
              <div 
                key={idx}
                className="group relative animate-slide-up"
                style={{animationDelay: `${idx * 150}ms`}}
              >
                <div className="absolute -inset-2 bg-gradient-to-br opacity-0 group-hover:opacity-20 rounded-3xl blur-xl transition-opacity"
                  style={{backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`}}
                ></div>
                
                <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-4 border-2 border-transparent hover:border-red-200">
                  <div className={`w-20 h-20 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center text-5xl shadow-lg mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all mx-auto`}>
                    {value.icon}
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-4 text-center group-hover:text-red-600 transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-center">
                    {value.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Ekibimiz
            </h2>
            <p className="text-xl text-gray-600">
              Deneyimli ustalarımız ve profesyonel ekibimiz
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '👨‍🍳', title: 'Usta Aşçılar', count: '20+', desc: 'Yıllardır bizimle' },
              { icon: '🚚', title: 'Teslimat Ekibi', count: '50+', desc: 'Hızlı ve güvenli' },
              { icon: '👨‍💼', title: 'Müşteri Hizmetleri', count: '24/7', desc: 'Her zaman yanınızda' }
            ].map((team, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all hover:scale-105 text-center group animate-scale-in"
                style={{animationDelay: `${idx * 150}ms`}}
              >
                <div className="text-7xl mb-4 group-hover:scale-125 transition-transform">
                  {team.icon}
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">{team.title}</h3>
                <div className="text-4xl font-black text-red-600 mb-2">{team.count}</div>
                <p className="text-gray-600">{team.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse-slow delay-500"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <div className="text-7xl mb-6 animate-bounce-slow">🤝</div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black mb-6">
            Ailemize Katılın!
          </h2>
          <p className="text-xl mb-8 text-orange-100">
            Franchise fırsatları ve iş ortaklığı için bizimle iletişime geçin
          </p>
          <Link
            href="/bayilik"
            className="inline-block bg-white text-red-600 px-12 py-5 rounded-full font-black text-xl hover:bg-gray-100 transition-all hover:scale-110 shadow-2xl"
          >
            Bayilik Başvurusu Yap →
          </Link>
        </div>
      </section>
    </main>
  );
}