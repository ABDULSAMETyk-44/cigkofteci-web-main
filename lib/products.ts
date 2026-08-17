// Menü/sipariş kategorileri ve genel sabitler.
//
// Ürünlerin kendisi artık statik değil — veritabanında (data/db.json) saklanır
// ve admin panelinden (Ürünler) eklenip/düzenlenip/silinebilir. Bu dosya
// yalnızca kategori tanımlarını ve genel sipariş sabitlerini tutar.
// Ürünlerin ilk kurulumdaki varsayılan listesi (seed) için bkz. lib/db.ts.

export interface Category {
  key: string;
  name: string;
  icon: string;
  color: string; // tailwind gradient classes
}

export const categories: Category[] = [
  { key: 'cigkofte', name: 'Çiğköfte Çeşitleri', icon: '🌯', color: 'from-red-500 to-orange-600' },
  { key: 'durum', name: 'Dürümler', icon: '🥙', color: 'from-orange-500 to-yellow-500' },
  { key: 'icecek', name: 'İçecekler', icon: '🥤', color: 'from-blue-500 to-cyan-500' },
  { key: 'yan', name: 'Yan Ürünler', icon: '🍟', color: 'from-yellow-500 to-orange-500' },
];

export function getCategory(key: string): Category | undefined {
  return categories.find((c) => c.key === key);
}

// Bu değerler artık admin panelinden (Site Ayarları) düzenlenebilir.
// Burada yalnızca ilk kurulumdaki varsayılan (seed) değerler olarak kalır.
export const DEFAULT_MIN_ORDER_TOTAL = 30;
export const DEFAULT_FREE_DELIVERY_THRESHOLD = 100;

// İlk kurulumda veritabanına eklenecek varsayılan ürün listesi (seed).
// Sadece data/db.json hiç yokken (ilk çalıştırmada) kullanılır.
export const DEFAULT_PRODUCTS_SEED = [
  { name: 'Klasik Çiğköfte', price: 100, categoryKey: 'cigkofte', emoji: '🌯', description: 'Geleneksel tarifimizle hazırlanmış (Porsiyon)', isPopular: true },
  { name: 'Acılı Çiğköfte', price: 100, categoryKey: 'cigkofte', emoji: '🔥', description: 'Acı sevenler için özel (Porsiyon)', isPopular: false },
  { name: 'Özel Çiğköfte', price: 155, categoryKey: 'cigkofte', emoji: '⭐', description: 'Ekstra baharatlı ve lezzetli (Porsiyon)', isPopular: false },
  { name: 'Çiğköfte Tabağı', price: 175, categoryKey: 'cigkofte', emoji: '🍽️', description: 'Salata ve garnitürlerle', isPopular: false },

  { name: 'Çiğköfte Dürüm', price: 100, categoryKey: 'durum', emoji: '🥙', description: 'Lavaşta çiğköfte', isPopular: true },
  { name: 'Özel Dürüm', price: 120, categoryKey: 'durum', emoji: '✨', description: 'Ekstra malzemeli', isPopular: false },
  { name: 'İkili Dürüm', price: 175, categoryKey: 'durum', emoji: '🎁', description: '2 adet dürüm', isPopular: false },

  { name: 'Ayran', price: 20, categoryKey: 'icecek', emoji: '🥛', description: 'Taze ayran', isPopular: false },
  { name: 'Şalgam', price: 30, categoryKey: 'icecek', emoji: '🍷', description: 'Acı/Acısız', isPopular: true },
  { name: 'Coca Cola', price: 55, categoryKey: 'icecek', emoji: '🥤', description: '330ml', isPopular: false },
  { name: 'Limonata', price: 20, categoryKey: 'icecek', emoji: '🍋', description: 'Ev yapımı', isPopular: false },

  { name: 'Patates Kızartması', price: 45, categoryKey: 'yan', emoji: '🍟', description: 'Çıtır patates', isPopular: false },
  { name: 'Soğan Halkası', price: 40, categoryKey: 'yan', emoji: '🧅', description: 'Kızarmış soğan halkası', isPopular: false },
  { name: 'Atom', price: 55, categoryKey: 'yan', emoji: '🌶️', description: 'Acılı közlenmiş biber', isPopular: true },
];
