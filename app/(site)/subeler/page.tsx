const subeler = [
  {
    name: 'Malatya Merkez Şubesi',
    address: 'Caferağa Mah. Moda Cad. No:123 Battalgazi/Malatya',
    phone: '0216 123 45 67',
    hours: 'Pzt-Paz: 10:00 - 22:00',
    color: 'from-red-500 to-orange-600'
  },
  {
    name: 'Kernek Şubesi',
    address: 'Barbaros Bulvarı No:456 Battalgazi/Malatya',
    phone: '0212 234 56 78',
    hours: 'Pzt-Paz: 10:00 - 23:00',
    color: 'from-orange-500 to-yellow-500'
  },
  {
    name: 'Ankara Kızılay Şubesi',
    address: 'Atatürk Bulvarı No:789 Kızılay/Ankara',
    phone: '0312 345 67 89',
    hours: 'Pzt-Paz: 10:00 - 22:00',
    color: 'from-purple-500 to-pink-600'
  },
  {
    name: 'İzmir Alsancak Şubesi',
    address: 'Kıbrıs Şehitleri Cad. No:321 Alsancak/İzmir',
    phone: '0232 456 78 90',
    hours: 'Pzt-Paz: 10:00 - 22:00',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    name: 'Koyunoğlu Şubesi',
    address: 'Cumhuriyet Cad. No:555 Yeşilyurt/Malatya',
    phone: '0242 567 89 01',
    hours: 'Pzt-Paz: 10:00 - 23:00',
    color: 'from-green-500 to-emerald-600'
  },
  {
    name: 'Bursa Şubesi',
    address: 'Fethiye Cad. No:666 Osmangazi/Bursa',
    phone: '0224 678 90 12',
    hours: 'Pzt-Paz: 10:00 - 22:00',
    color: 'from-indigo-500 to-purple-600'
  },
];

export default function SubelerPage() {
  return (
    <main className="min-h-screen pt-20 bg-gradient-to-b from-orange-50 to-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-red-600 via-orange-600 to-red-700 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <div className="absolute top-10 left-10 text-8xl opacity-20 animate-float">🏪</div>
        <div className="absolute top-20 right-20 text-7xl opacity-20 animate-float delay-300">📍</div>
        <div className="absolute bottom-10 right-10 text-6xl opacity-20 animate-float delay-500">🗺️</div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <div className="inline-block bg-yellow-400 text-red-900 px-6 py-2 rounded-full font-bold text-sm mb-6 animate-bounce-slow">
            📍 Türkiye Geneli
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black mb-6 animate-scale-in">
            Şubelerimiz
          </h1>
          <p className="text-2xl text-orange-100 max-w-2xl mx-auto animate-fade-in delay-200">
            Size en yakın şubeyi bulun ve taptaze lezzetimizin tadını çıkarın
          </p>
        </div>
      </section>

      {/* Branches Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subeler.map((sube, idx) => (
              <div
                key={idx}
                className="group relative animate-scale-in hover-glow"
                style={{animationDelay: `${idx * 100}ms`}}
              >
                <div className="absolute -inset-2 bg-gradient-to-br opacity-0 group-hover:opacity-20 rounded-3xl blur-xl transition-opacity"
                  style={{backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`}}
                ></div>
                
                <div className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-transparent hover:border-red-200">
                  {/* Color Header */}
                  <div className={`h-3 bg-gradient-to-r ${sube.color}`}></div>
                  
                  <div className="p-8">
                    {/* Branch Name */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-14 h-14 bg-gradient-to-br ${sube.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-125 group-hover:rotate-12 transition-all`}>
                        🏪
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 group-hover:text-red-600 transition-colors">
                        {sube.name}
                      </h3>
                    </div>
                    
                    {/* Info */}
                    <div className="space-y-4 mb-6">
                      <div className="flex items-start gap-3 text-gray-700">
                        <span className="text-2xl flex-shrink-0 mt-1">📍</span>
                        <p className="leading-relaxed">{sube.address}</p>
                      </div>
                      
                      <div className="flex items-center gap-3 text-gray-700">
                        <span className="text-2xl">📞</span>
                        <a href={`tel:${sube.phone.replace(/\s/g, '')}`} className="font-bold hover:text-red-600 transition-colors">
                          {sube.phone}
                        </a>
                      </div>
                      
                      <div className="flex items-center gap-3 text-gray-700">
                        <span className="text-2xl">🕐</span>
                        <p className="font-medium">{sube.hours}</p>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-3">
                      <a
                        href={`tel:${sube.phone.replace(/\s/g, '')}`}
                        className={`bg-gradient-to-r ${sube.color} text-white py-3 rounded-xl font-bold text-center hover:scale-105 transition-all shadow-md text-sm`}
                      >
                        📞 Ara
                      </a>
                      <button className="bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all text-sm">
                        🗺️ Yol Tarifi
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Franchise Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="text-7xl mb-6 animate-bounce-slow">🤝</div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black mb-6">
            Franchise Fırsatı
          </h2>
          <p className="text-xl mb-4 text-pink-100">
            Başarılı markamızın bir parçası olmak ister misiniz?
          </p>
          <p className="text-lg mb-8 text-pink-100 max-w-2xl mx-auto">
            Franchise başvurusu için bizimle iletişime geçin. Deneyimli ekibimiz 
            size her adımda destek olmaya hazır.
          </p>
          <a
            href="/bayilik"
            className="inline-block bg-white text-purple-600 px-12 py-5 rounded-full font-black text-xl hover:bg-gray-100 transition-all hover:scale-110 shadow-2xl"
          >
            Bayilik Başvurusu Yap →
          </a>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Türkiye Genelinde Hizmetinizdeyiz
            </h2>
            <p className="text-xl text-gray-600">
              50+ şubemizle her zaman size yakınız
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl h-96 flex items-center justify-center shadow-xl animate-scale-in">
            <div className="text-center">
              <div className="text-8xl mb-4">🗺️</div>
              <p className="text-2xl font-bold text-gray-600">Harita Yakında Eklenecek</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}