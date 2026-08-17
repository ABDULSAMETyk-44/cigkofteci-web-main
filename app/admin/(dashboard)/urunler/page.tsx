'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { categories } from '@/lib/products';
import type { Product } from '@/lib/types';

interface ProductFormState {
  id?: string;
  name: string;
  description: string;
  price: string;
  categoryKey: string;
  emoji: string;
  isActive: boolean;
  isPopular: boolean;
  imageUrl: string;
}

const emptyForm: ProductFormState = {
  name: '',
  description: '',
  price: '',
  categoryKey: categories[0]?.key ?? '',
  emoji: '🍽️',
  isActive: true,
  isPopular: false,
  imageUrl: '',
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('hepsi');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const load = useCallback(async () => {
    const res = await fetch('/api/products', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      setProducts(data.products ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreateModal = () => {
    setForm(emptyForm);
    setImagePreview('');
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setForm({
      id: p.id,
      name: p.name,
      description: p.description,
      price: String(p.price),
      categoryKey: p.categoryKey,
      emoji: p.emoji,
      isActive: p.isActive,
      isPopular: p.isPopular,
      imageUrl: p.imageUrl,
    });
    setImagePreview(p.imageUrl);
    setError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm(emptyForm);
    setImagePreview('');
    setError('');
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Anlık önizleme
    const localPreview = URL.createObjectURL(file);
    setImagePreview(localPreview);
    setUploadingImage(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('/api/products/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Görsel yüklenemedi.');
        setImagePreview(form.imageUrl);
      } else {
        setForm((f) => ({ ...f, imageUrl: data.url }));
      }
    } catch {
      setError('Görsel yüklenirken bağlantı hatası oluştu.');
      setImagePreview(form.imageUrl);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setForm((f) => ({ ...f, imageUrl: '' }));
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError('Ürün adı zorunludur.');
      return;
    }
    const priceNum = Number(form.price);
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      setError('Geçerli bir fiyat girin.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: priceNum,
        categoryKey: form.categoryKey,
        emoji: form.emoji,
        isActive: form.isActive,
        isPopular: form.isPopular,
        imageUrl: form.imageUrl,
      };

      const res = form.id
        ? await fetch(`/api/products/${form.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Ürün kaydedilemedi.');
        setSaving(false);
        return;
      }

      await load();
      closeModal();
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (p: Product) => {
    const res = await fetch(`/api/products/${p.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !p.isActive }),
    });
    if (res.ok) {
      const data = await res.json();
      setProducts((prev) => prev.map((x) => (x.id === p.id ? data.product : x)));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await fetch(`/api/products/${deleteTarget.id}`, { method: 'DELETE' });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  const filtered =
    filterCategory === 'hepsi' ? products : products.filter((p) => p.categoryKey === filterCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Ürünler</h1>
          <p className="text-gray-500 mt-1">Menüdeki ürünleri ekleyin, düzenleyin, fotoğraflarını yükleyin.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-5 py-3 rounded-xl font-black text-sm bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700 transition-all shadow-lg"
        >
          + Yeni Ürün Ekle
        </button>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterCategory('hepsi')}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
            filterCategory === 'hepsi'
              ? 'bg-gray-900 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          Tümü ({products.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setFilterCategory(cat.key)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              filterCategory === cat.key
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-gray-500">Yükleniyor...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-12 text-center text-gray-400">
          Bu kategoride ürün bulunamadı.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <div
              key={p.id}
              className={`bg-white rounded-2xl shadow-md overflow-hidden transition-all ${
                !p.isActive ? 'opacity-50' : ''
              }`}
            >
              <div className="relative h-36 bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center overflow-hidden">
                {p.imageUrl ? (
                  <Image src={p.imageUrl} alt={p.name} fill className="object-cover" sizes="300px" unoptimized />
                ) : (
                  <span className="text-6xl">{p.emoji}</span>
                )}
                {p.isPopular && (
                  <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-1 rounded-full shadow">
                    ⭐ Popüler
                  </span>
                )}
                {!p.isActive && (
                  <span className="absolute top-2 left-2 bg-gray-800 text-white text-[10px] font-black px-2 py-1 rounded-full">
                    Pasif
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="font-black text-gray-900 text-sm truncate">{p.name}</div>
                <div className="text-xs text-gray-500 truncate mb-2">{p.description || '—'}</div>
                <div className="flex items-center justify-between">
                  <span className="font-black text-red-600 text-lg">{p.price}₺</span>
                  <span className="text-[11px] text-gray-400 font-bold uppercase">
                    {categories.find((c) => c.key === p.categoryKey)?.name ?? p.categoryKey}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => openEditModal(p)}
                    className="flex-1 px-3 py-2 rounded-lg text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
                  >
                    ✏️ Düzenle
                  </button>
                  <button
                    onClick={() => toggleActive(p)}
                    className="px-3 py-2 rounded-lg text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
                    title={p.isActive ? 'Pasife al' : 'Aktife al'}
                  >
                    {p.isActive ? '👁️' : '🚫'}
                  </button>
                  <button
                    onClick={() => setDeleteTarget(p)}
                    className="px-3 py-2 rounded-lg text-xs font-bold bg-red-50 hover:bg-red-100 text-red-600 transition-all"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / edit modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-xl font-black text-gray-900">
                {form.id ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-700 text-2xl">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded-xl px-4 py-3">
                  {error}
                </div>
              )}

              {/* Image upload */}
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm">Ürün Görseli</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden shrink-0 relative">
                    {imagePreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imagePreview} alt="Önizleme" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl">{form.emoji}</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleImageSelect}
                      className="block w-full text-xs text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                    />
                    {uploadingImage && <p className="text-xs text-orange-600 font-medium">Yükleniyor...</p>}
                    {imagePreview && !uploadingImage && (
                      <button
                        type="button"
                        onClick={removeImage}
                        className="text-xs font-bold text-red-600 hover:text-red-700"
                      >
                        Görseli kaldır (emoji kullanılsın)
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1.5 text-sm">Ürün Adı *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-all text-gray-900 text-sm"
                  placeholder="Örn: Klasik Çiğköfte"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1.5 text-sm">Açıklama</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-all text-gray-900 text-sm"
                  placeholder="Kısa ürün açıklaması"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-1.5 text-sm">Fiyat (₺) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-all text-gray-900 text-sm"
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1.5 text-sm">Kategori *</label>
                  <select
                    value={form.categoryKey}
                    onChange={(e) => setForm({ ...form, categoryKey: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-all text-gray-900 text-sm"
                  >
                    {categories.map((cat) => (
                      <option key={cat.key} value={cat.key}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1.5 text-sm">
                  Emoji (görsel yoksa gösterilir)
                </label>
                <input
                  type="text"
                  value={form.emoji}
                  onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                  className="w-24 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-all text-gray-900 text-center text-lg"
                  maxLength={4}
                />
              </div>

              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-5 h-5 rounded accent-red-600"
                  />
                  <span className="text-sm font-bold text-gray-700">Menüde Görünsün (Aktif)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isPopular}
                    onChange={(e) => setForm({ ...form, isPopular: e.target.checked })}
                    className="w-5 h-5 rounded accent-red-600"
                  />
                  <span className="text-sm font-bold text-gray-700">⭐ Popüler Etiketi</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="flex-1 px-4 py-3 rounded-xl font-black text-sm bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700 transition-all disabled:opacity-50"
                >
                  {saving ? 'Kaydediliyor...' : form.id ? 'Güncelle' : 'Ürünü Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-black text-gray-900 mb-2">Ürünü Sil</h3>
            <p className="text-gray-600 text-sm mb-6">
              <b>{deleteTarget.name}</b> ürününü kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem
              geri alınamaz.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-sm bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                Vazgeç
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-3 rounded-xl font-black text-sm bg-red-600 hover:bg-red-700 text-white"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
