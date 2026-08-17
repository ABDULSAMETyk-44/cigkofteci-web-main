'use client';

import { useState, useMemo, useEffect } from 'react';
import { categories } from '@/lib/products';
import type { Product, SiteSettings } from '@/lib/types';

interface CartLine {
  productId: string;
  quantity: number;
}

export default function SiparisPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'Kapıda Nakit',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<{ orderId: string; total: number } | null>(null);

  useEffect(() => {
    fetch('/api/products', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => setProducts(data.products ?? []))
      .catch(() => setError('Ürünler yüklenirken bir hata oluştu.'))
      .finally(() => setProductsLoading(false));

    fetch('/api/settings', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => setSettings(data.settings ?? null))
      .catch(() => {});
  }, []);

  const minOrderTotal = settings?.minOrderTotal ?? 30;
  const freeDeliveryThreshold = settings?.freeDeliveryThreshold ?? 100;
  const deliveryPhone = settings?.phone ?? '0850 123 45 67';

  const cartWithDetails = useMemo(
    () =>
      cart
        .map((line) => {
          const product = products.find((p) => p.id === line.productId);
          if (!product) return null;
          return { ...product, quantity: line.quantity };
        })
        .filter((x): x is (typeof products)[number] & { quantity: number } => x !== null),
    [cart, products]
  );

  const total = cartWithDetails.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItemCount = cartWithDetails.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.productId === productId);
      if (existing) {
        return prev.map((l) => (l.productId === productId ? { ...l, quantity: l.quantity + 1 } : l));
      }
      return [...prev, { productId, quantity: 1 }];
    });
  };

  const changeQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((l) => (l.productId === productId ? { ...l, quantity: l.quantity + delta } : l))
        .filter((l) => l.quantity > 0)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((l) => l.productId !== productId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (cartWithDetails.length === 0) {
      setError('Lütfen sepetinize en az bir ürün ekleyin.');
      return;
    }
    if (total < minOrderTotal) {
      setError(`Minimum sipariş tutarı ${minOrderTotal}₺'dir.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customer.name,
          phone: customer.phone,
          address: customer.address,
          notes: customer.notes,
          paymentMethod: customer.paymentMethod,
          items: cartWithDetails.map((item) => ({
            name: item.name,
            unitPrice: item.price,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Sipariş gönderilirken bir hata oluştu.');
        setIsSubmitting(false);
        return;
      }

      setSuccess({ orderId: data.order.id, total: data.order.total });
      setCart([]);
      setCustomer({ name: '', phone: '', address: '', paymentMethod: 'Kapıda Nakit', notes: '' });
    } catch {
      setError('Bağlantı hatası. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-10 text-center">
          <div className="text-7xl mb-6">🎉</div>
          <h1 className="text-3xl font-black text-gray-900 mb-3">Siparişiniz Alındı!</h1>
          <p className="text-gray-600 mb-1">
            Toplam tutar: <span className="font-black text-red-600">{success.total.toFixed(2)}₺</span>
          </p>
          <p className="text-gray-400 text-xs mb-6">Sipariş No: {success.orderId.slice(0, 8).toUpperCase()}</p>
          <p className="text-gray-600 mb-8">
            Siparişiniz en kısa sürede hazırlanacak ve <b>{settings?.deliveryTimeText ?? "30 dakika"}</b> içinde adresinize teslim edilecektir.
          </p>
          <button
            onClick={() => setSuccess(null)}
            className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-4 rounded-xl font-black hover:from-red-700 hover:to-orange-700 transition-all hover:scale-105 shadow-lg"
          >
            Yeni Sipariş Ver
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-20 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="inline-block bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-2 rounded-full font-bold text-sm mb-6 shadow-lg">
            🛒 Online Sipariş
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-4">Sipariş Ver</h1>
          <p className="text-xl text-gray-600">
            Ürünleri sepete ekleyin, taptaze çiğköftemiz{' '}
            <span className="text-red-600 font-bold">{settings?.deliveryTimeText ?? "30 dakika"}</span> içinde kapınızda olsun!
          </p>
        </div>
      </section>

      <section className="py-8 pb-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Product picker */}
            <div className="lg:col-span-2 space-y-8">
              {productsLoading ? (
                <div className="bg-white rounded-2xl shadow-md p-12 text-center text-gray-400">
                  Ürünler yükleniyor...
                </div>
              ) : (
                categories.map((cat) => {
                  const catProducts = products.filter((p) => p.categoryKey === cat.key && p.isActive);
                  if (catProducts.length === 0) return null;
                  return (
                    <div key={cat.key}>
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className={`w-10 h-10 bg-gradient-to-br ${cat.color} rounded-xl flex items-center justify-center text-xl shadow-md`}
                        >
                          {cat.icon}
                        </div>
                        <h2 className="text-xl font-black text-gray-900">{cat.name}</h2>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {catProducts.map((product) => (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => addToCart(product.id)}
                            className="text-left bg-white rounded-2xl shadow-md hover:shadow-xl p-4 flex items-center gap-3 transition-all hover:scale-[1.02] group"
                          >
                            {product.imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-14 h-14 rounded-xl object-cover shrink-0 group-hover:scale-110 transition-transform"
                              />
                            ) : (
                              <span className="text-3xl group-hover:scale-110 transition-transform shrink-0">
                                {product.emoji}
                              </span>
                            )}
                            <span className="flex-1 min-w-0">
                              <span className="block font-bold text-gray-900 text-sm">{product.name}</span>
                              <span className="block text-xs text-gray-500 truncate">
                                {product.description}
                              </span>
                            </span>
                            <span className="text-right shrink-0">
                              <span className="block font-black text-red-600">{product.price}₺</span>
                              <span className="text-xs text-orange-500 font-bold">+ Ekle</span>
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Cart + form */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl shadow-2xl p-6 sticky top-24">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center text-xl shadow-lg">
                    🛍️
                  </div>
                  <h2 className="text-xl font-black text-gray-900">
                    Sepetiniz {totalItemCount > 0 && <span className="text-red-600">({totalItemCount})</span>}
                  </h2>
                </div>

                {cartWithDetails.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-6">
                    Sepetiniz boş. Soldan ürün ekleyerek başlayın.
                  </p>
                ) : (
                  <div className="space-y-3 mb-5 max-h-64 overflow-y-auto pr-1">
                    {cartWithDetails.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
                        <span className="text-xl">{item.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-gray-900 text-sm truncate">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.price}₺ / adet</div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => changeQuantity(item.id, -1)}
                            className="w-7 h-7 bg-gray-200 hover:bg-red-600 hover:text-white rounded-lg font-bold text-sm transition-all"
                          >
                            −
                          </button>
                          <span className="w-5 text-center font-bold text-sm">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => changeQuantity(item.id, 1)}
                            className="w-7 h-7 bg-gray-200 hover:bg-red-600 hover:text-white rounded-lg font-bold text-sm transition-all"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-300 hover:text-red-500 text-lg ml-1"
                          aria-label="Kaldır"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {cartWithDetails.length > 0 && (
                  <div className="border-t border-gray-100 pt-4 mb-5 space-y-1">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Ara Toplam</span>
                      <span>{total.toFixed(2)}₺</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Teslimat</span>
                      <span>{total >= freeDeliveryThreshold ? 'Ücretsiz' : 'Adreste belirlenir'}</span>
                    </div>
                    <div className="flex justify-between text-lg font-black text-gray-900 pt-1">
                      <span>Toplam</span>
                      <span className="text-red-600">{total.toFixed(2)}₺</span>
                    </div>
                    {total < minOrderTotal && (
                      <p className="text-xs text-orange-600 font-medium pt-1">
                        Minimum sipariş tutarı {minOrderTotal}₺&apos;dir.
                      </p>
                    )}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded-xl px-4 py-3">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-gray-700 font-bold mb-1.5 text-sm">Ad Soyad *</label>
                    <input
                      type="text"
                      required
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-all text-gray-900 text-sm"
                      placeholder="Adınız ve soyadınız"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1.5 text-sm">Telefon *</label>
                    <input
                      type="tel"
                      required
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-all text-gray-900 text-sm"
                      placeholder="0555 123 45 67"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1.5 text-sm">Adres *</label>
                    <textarea
                      required
                      value={customer.address}
                      onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-all h-20 text-gray-900 text-sm"
                      placeholder="Teslimat adresiniz"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1.5 text-sm">Ödeme Yöntemi</label>
                    <select
                      value={customer.paymentMethod}
                      onChange={(e) => setCustomer({ ...customer, paymentMethod: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-all text-gray-900 text-sm"
                    >
                      <option value="Kapıda Nakit">💵 Kapıda Nakit</option>
                      <option value="Kapıda Kredi Kartı">💳 Kapıda Kredi Kartı</option>
                      <option value="Mobil Ödeme">📱 Mobil Ödeme</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1.5 text-sm">Sipariş Notu</label>
                    <textarea
                      value={customer.notes}
                      onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-all h-16 text-gray-900 text-sm"
                      placeholder="Özel talepleriniz (opsiyonel)"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || cartWithDetails.length === 0}
                    className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-4 rounded-xl font-black text-lg hover:from-red-700 hover:to-orange-700 transition-all hover:scale-105 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isSubmitting ? '⏳ İşleniyor...' : `Siparişi Tamamla${total > 0 ? ` · ${total.toFixed(0)}₺` : ''}`}
                  </button>
                </form>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl shadow-xl p-6 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">📞</span>
                  <h3 className="text-lg font-black">Yardıma mı ihtiyacınız var?</h3>
                </div>
                <a
                  href={`tel:${deliveryPhone.replace(/\s/g, '')}`}
                  className="block w-full bg-white text-blue-600 py-3 rounded-xl font-bold text-center hover:bg-blue-50 transition-all"
                >
                  {deliveryPhone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
