import { NextRequest, NextResponse } from 'next/server';
import { getDB, newId } from '@/lib/db';
import { getAdminSession } from '@/lib/authGuard';
import type { Product } from '@/lib/types';

// Herkese açık: menü/sipariş sayfaları için sadece aktif ürünleri döner.
// Admin oturumu varsa (panel kullanıyor) pasif ürünler dahil tüm ürünleri döner.
export async function GET(req: NextRequest) {
  const session = await getAdminSession(req);
  const db = await getDB();

  const products = session ? db.data.products : db.data.products.filter((p) => p.isActive);

  return NextResponse.json({ products });
}

// Sadece admin: yeni ürün oluşturur.
export async function POST(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Yetkisiz erişim. Lütfen yönetici girişi yapın.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, description, price, categoryKey, imageUrl, emoji, isActive, isPopular } = body ?? {};

    if (!name || typeof name !== 'string' || !categoryKey || typeof categoryKey !== 'string') {
      return NextResponse.json({ error: 'Ürün adı ve kategori zorunludur.' }, { status: 400 });
    }

    const numericPrice = Number(price);
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      return NextResponse.json({ error: 'Geçerli bir fiyat girin.' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const product: Product = {
      id: newId(),
      name: name.slice(0, 120).trim(),
      description: description && typeof description === 'string' ? description.slice(0, 300).trim() : '',
      price: numericPrice,
      categoryKey: categoryKey.trim(),
      imageUrl: imageUrl && typeof imageUrl === 'string' ? imageUrl : '',
      emoji: emoji && typeof emoji === 'string' ? emoji.slice(0, 8) : '🍽️',
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      isPopular: Boolean(isPopular),
      createdAt: now,
      updatedAt: now,
    };

    const db = await getDB();
    db.data.products.push(product);
    await db.write();

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (err) {
    console.error('[api/products][POST]', err);
    return NextResponse.json({ error: 'Ürün oluşturulurken bir hata oluştu.' }, { status: 500 });
  }
}
