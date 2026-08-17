import Link from 'next/link';
import Image from 'next/image';
import { getDB } from '@/lib/db';

// Admin panelinden değiştirilebilen ayarları (hero görseli/metni) ve
// ürünleri (popüler ürünler) her istekte taze okumak için statik
// önbellekleme kapatılır — bkz. app/(site)/layout.tsx açıklaması.
export const dynamic = 'force-dynamic';

export default async function Home() {
  const db = await getDB();
  const settings = db.data.settings;
  const popularProducts = db.data.products
    .filter((p) => p.isActive && p.isPopular)
    .slice(0, 3);

  const features = [
    {
      icon: 'https://img.icons8.com/3d-fluency/94/organic-food.png',
      baslik: '100% Doğal',
      aciklama: 'Hiçbir katkı maddesi yok. Sadece doğal, taze malzemeler.',
      renk: 'from-green-400 to-emerald-500',
      parlama: 'rgba(52, 211, 153, 0.4)'
    },
    {
      icon: 'https://img.icons8.com/3d-fluency/94/fast-delivery.png',
      baslik: 'Hızlı Teslimat',
      aciklama: `${settings.deliveryTimeText} içinde kapınızda, taptaze ve sıcak.`,
      renk: 'from-yellow-400 to-orange-500',
      parlama: 'rgba(251, 146, 60, 0.4)'
    },
    {
      icon: 'https://img.icons8.com/3d-fluency/94/chef.png',
      baslik: 'Usta Ellerden',
      aciklama: 'Yılların deneyimi ile her gün özenle hazırlanıyor.',
      renk: 'from-red-400 to-pink-500',
      parlama: 'rgba(239, 68, 68, 0.4)'
    }
  ];

  const degerler = [
    {
      baslik: 'Premium Kalite',
      yazi: 'En kaliteli bulgur, domates ve baharatları özenle seçiyoruz.',
      gradient: 'from-green-400 to-emerald-500',
      icon: 'https://img.icons8.com/3d-fluency/94/medal.png'
    },
    {
      baslik: 'Hijyen Standartları',
      yazi: 'Modern tesislerimizde en yüksek hijyen koşullarında üretim.',
      gradient: 'from-blue-400 to-cyan-500',
      icon: 'https://img.icons8.com/3d-fluency/94/hand-wash.png'
    },
    {
      baslik: 'Müşteri Odaklı',
      yazi: 'Memnuniyetiniz bizim için her şeyden önemli.',
      gradient: 'from-purple-400 to-pink-500',
      icon: 'https://img.icons8.com/3d-fluency/94/like.png'
    }
  ];

  return (
    <main className="min-h-screen overflow-hidden">
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-orange-600 to-red-700 transform -skew-y-6 origin-top-left"></div>
        
        <div className="absolute top-20 right-10 w-72 h-72 bg-yellow-400/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-orange-400/30 rounded-full blur-3xl animate-pulse-slow delay-500"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-pink-400/20 rounded-full blur-2xl animate-float delay-300"></div>
        
        <div className="absolute top-1/4 right-1/4 w-32 h-32 border-4 border-white/20 rounded-full animate-rotate"></div>
        <div className="absolute bottom-1/4 left-1/3 w-24 h-24 border-4 border-yellow-300/30 rounded-full animate-rotate" style={{animationDirection: 'reverse'}}></div>
        
        {/* Arka planı görsel ile kaplıyoruz (admin panelinden yüklenmişse) */}
<div className="relative w-full min-h-screen bg-[length:140%_auto] md:bg-cover bg-no-repeat transition-all duration-300" 
     style={settings.heroImageUrl ? {
       backgroundImage: `url('${settings.heroImageUrl}')`,
       backgroundPosition: "center calc(50% + 25px)"
     } : undefined}>
  
  {/* Görsel varsa okunabilirlik için hafif karartma katmanı */}
  {settings.heroImageUrl && <div className="absolute inset-0 bg-black/25"></div>}


  <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
    <div className="text-white space-y-6">
      
      {/* 2 cm aşağı kaydırıldı (mt-8 eklenerek) */}
      <div className="inline-block mt-8 bg-yellow-400 text-red-900 px-6 py-2 rounded-full font-bold text-sm animate-bounce-slow shadow-lg">
        <span className="inline-block w-3 h-3 bg-red-600 rounded-full mr-2"></span>
        2010'den Beri Kaliteli Hizmet
      </div>
      
      <h1 className="text-4xl sm:text-6xl md:text-8xl font-black leading-tight">
        <span className="block animate-fade-in-left">{settings.heroTitleLine1}</span>
        <span className="block text-yellow-300 animate-fade-in-right delay-200">{settings.heroTitleLine2}</span>
      </h1>
      
      <p className="text-xl md:text-2xl text-orange-100 leading-relaxed animate-fade-in delay-400">
        {settings.heroSubtitle}
      </p>
      
      {/* ... Diğer içerikler aynı kalıyor ... */}
      <div className="flex gap-4 flex-wrap animate-slide-up delay-600">
        <Link
          href="/menu"
          className="group relative bg-yellow-400 text-red-900 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-yellow-300 transition-all hover:scale-110 shadow-2xl overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            Menüyü Keşfet
            <span className="inline-block group-hover:translate-x-2 transition-transform text-2xl">→</span>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
        </Link>
        {/* ... Sipariş butonu ve istatistikler ... */}
      </div>
    </div>
    
    {/* Sağ taraf içeriği (Görsel ve kartlar) */}
    <div className="relative animate-scale-in delay-300">
       {/* ... Kart içeriği aynı ... */}
    </div>
  </div>
</div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
          <div className="text-white text-center">
            <div className="text-sm mb-2 opacity-80">Keşfet</div>
            <div className="text-4xl">↓</div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-white to-orange-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle, #dc2626 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <span className="inline-block text-red-600 font-bold text-lg mb-2 animate-pulse-slow">ÖZELLİKLERİMİZ</span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-4">
              Neden <span className="gradient-text">Biz?</span>
            </h2>
            <div className="w-24 h-2 bg-gradient-to-r from-red-500 to-orange-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((ozellik, sira) => (
              <div
                key={sira}
                className="group relative animate-slide-up"
                style={{animationDelay: `${sira * 150}ms`}}
              >
                <div 
                  className="absolute -inset-2 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                  style={{background: ozellik.parlama}}
                ></div>
                
                <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-6 border-2 border-transparent hover:border-red-200">
                  <div className={`absolute -top-8 left-8 w-20 h-20 bg-gradient-to-br ${ozellik.renk} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-125 group-hover:rotate-12 transition-all duration-500`}>
                    <Image 
                      src={ozellik.icon} 
                      alt={ozellik.baslik} 
                      width={64} 
                      height={64}
                      unoptimized
                    />
                  </div>
                  
                  <div className="pt-12">
                    <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-red-600 transition-colors">
                      {ozellik.baslik}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{ozellik.aciklama}</p>
                  </div>
                  
                  <div className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-700 bg-gradient-to-r ${ozellik.renk} rounded-full`}></div>
                  
                  <div className="absolute top-4 right-4 w-4 h-4 bg-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity animate-pulse-slow"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-red-600 via-orange-600 to-red-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 text-white animate-fade-in">
            <span className="inline-block text-yellow-300 font-bold text-lg mb-2 animate-bounce-slow">MENÜMÜZ</span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black mb-4">
              Popüler Lezzetler
            </h2>
            <p className="text-xl text-orange-100">Her damak zevkine uygun çeşitler</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {popularProducts.length === 0 ? (
              <p className="col-span-3 text-center text-orange-100">
                Şu anda öne çıkan ürün bulunmuyor.
              </p>
            ) : (
              popularProducts.map((urun, num) => (
              <div
                key={urun.id}
                className="group relative animate-scale-in hover-glow"
                style={{animationDelay: `${num * 150}ms`}}
              >
                {num === 0 && (
                  <div className="absolute -top-4 -right-4 bg-yellow-400 text-red-900 px-4 py-2 rounded-full font-bold text-sm z-20 shadow-xl animate-pulse-slow flex items-center gap-1">
                    <Image 
                      src="https://img.icons8.com/3d-fluency/24/star.png" 
                      alt="star" 
                      width={20} 
                      height={20}
                      unoptimized
                    />
                    En Çok Satan
                  </div>
                )}
                
                <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-105">
                  <div className="relative bg-gradient-to-br from-orange-400 to-red-500 h-56 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent"></div>
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-500"></div>

                    <div className="relative z-10 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 animate-float">
                      {urun.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={urun.imageUrl}
                          alt={urun.name}
                          className="w-36 h-36 object-cover rounded-2xl shadow-lg"
                        />
                      ) : (
                        <span className="text-8xl">{urun.emoji}</span>
                      )}
                    </div>
                    
                    <div className="absolute top-4 left-4 w-8 h-8 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity animate-pulse-slow"></div>
                    <div className="absolute bottom-4 right-4 w-6 h-6 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity animate-pulse-slow delay-200"></div>
                  </div>
                  
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-2 text-gray-900 group-hover:text-red-600 transition-colors">
                      {urun.name}
                    </h3>
                    <p className="text-gray-600 mb-6">{urun.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-4xl font-black text-red-600 group-hover:scale-110 transition-transform">
                        {urun.price}₺
                      </div>
                      <Link
                        href="/siparis"
                        className="relative bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:from-red-700 hover:to-orange-700 transition-all hover:scale-110 shadow-lg overflow-hidden group/btn"
                      >
                        <span className="relative z-10">Sipariş Ver</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="h-2 bg-gradient-to-r from-orange-400 to-red-500"></div>
                </div>
              </div>
              ))
            )}
          </div>

          <div className="text-center mt-12 animate-fade-in delay-500">
            <Link
              href="/menu"
              className="group inline-block bg-white text-red-600 px-12 py-5 rounded-2xl font-black text-xl hover:bg-yellow-400 hover:text-red-900 transition-all hover:scale-110 shadow-2xl relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Tüm Menüyü Görüntüle
                <span className="inline-block group-hover:translate-x-2 transition-transform text-2xl">→</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative animate-fade-in-left">
              <div className="absolute -inset-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl opacity-20 blur-2xl animate-pulse-slow"></div>
              
              <div className="relative bg-gradient-to-br from-red-500 to-orange-600 rounded-3xl p-12 text-white shadow-2xl hover:scale-105 transition-transform duration-500">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full"></div>
                
                <div className="relative z-10">
                  <div className="w-24 h-24 bg-white/20 rounded-2xl mb-6 animate-bounce-slow flex items-center justify-center">
                    <Image 
                      src="https://img.icons8.com/3d-fluency/94/book.png" 
                      alt="story" 
                      width={80} 
                      height={80}
                      unoptimized
                    />
                  </div>
                  <h3 className="text-4xl font-black mb-4">Hikayemiz</h3>
                  <p className="text-lg leading-relaxed opacity-90 mb-6">
                    2010 yılından bu yana, geleneksel lezzetleri modern dokunuşlarla birleştirerek 
                    en taze çiğköfteleri üretiyoruz. Babadan oğula geçen tariflerimiz, 
                    bugün binlerce mutlu müşteriye ulaşıyor.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { rakam: '1000+', metin: 'Günlük Müşteri' },
                      { rakam: '%100', metin: 'Memnuniyet' }
                    ].map((bilgi, indeks) => (
                      <div 
                        key={indeks}
                        className="glass rounded-xl p-4 text-center hover:bg-white/30 transition-all cursor-pointer group animate-scale-in"
                        style={{animationDelay: `${indeks * 100}ms`}}
                      >
                        <div className="text-3xl font-bold group-hover:scale-125 transition-transform">
                          {bilgi.rakam}
                        </div>
                        <div className="text-sm opacity-90">{bilgi.metin}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {degerler.map((deger, pozisyon) => (
                <div 
                  key={pozisyon}
                  className="flex gap-6 items-start group hover:translate-x-4 transition-all duration-500 animate-fade-in-right"
                  style={{animationDelay: `${pozisyon * 150}ms`}}
                >
                  <div className={`flex-shrink-0 w-20 h-20 bg-gradient-to-br ${deger.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-125 group-hover:rotate-12 transition-all duration-500`}>
                    <Image 
                      src={deger.icon} 
                      alt={deger.baslik} 
                      width={64} 
                      height={64}
                      unoptimized
                    />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                      {deger.baslik}
                    </h4>
                    <p className="text-gray-600">{deger.yazi}</p>
                  </div>
                </div>
              ))}

              <Link
                href="/hakkimizda"
                className="group inline-flex items-center gap-2 text-red-600 font-bold text-lg hover:gap-4 transition-all mt-4 animate-fade-in delay-500"
              >
                Daha Fazla Bilgi
                <span className="inline-block group-hover:translate-x-2 transition-transform text-xl">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2 animate-pulse-slow delay-300"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full animate-float"></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="w-32 h-32 mx-auto mb-6 animate-bounce-slow">
            <Image 
              src="https://img.icons8.com/3d-fluency/144/rocket.png" 
              alt="rocket" 
              width={128} 
              height={128}
              unoptimized
            />
          </div>
          
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-white mb-6 leading-tight animate-scale-in">
            Acıktınız mı?
          </h2>
          
          <p className="text-2xl md:text-3xl text-white/90 mb-10 animate-fade-in delay-200">
            Taptaze çiğköftemiz {settings.deliveryTimeText} içinde kapınızda!
          </p>
          
          <Link
            href="/siparis"
            className="group inline-block bg-white text-red-600 px-16 py-6 rounded-full font-black text-2xl hover:bg-gray-100 transition-all hover:scale-110 shadow-2xl animate-slide-up delay-400 relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              Hemen Sipariş Ver
              <span className="inline-block group-hover:scale-125 transition-transform text-3xl">→</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent animate-shimmer"></div>
          </Link>
          
          <div className="mt-6 animate-fade-in delay-600">
            <p className="text-white/90 text-lg mb-2 flex items-center justify-center gap-2">
              <Image 
                src="https://img.icons8.com/3d-fluency/48/gift.png" 
                alt="gift" 
                width={28} 
                height={28}
                unoptimized
              />
              İlk siparişinize özel
            </p>
            <p className="text-yellow-300 font-black text-3xl animate-pulse-slow">%15 İNDİRİM!</p>
          </div>
        </div>
      </section>
    </main>
  );
}