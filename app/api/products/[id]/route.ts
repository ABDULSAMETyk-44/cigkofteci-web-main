import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { requireAdmin } from '@/lib/authGuard';
import { deleteProductImage } from '@/lib/imageUpload';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const db = await getDB();
  const product = db.data.products.find((p) => p.id === id);
  if (!product) {
    return NextResponse.json({ error: 'Ürün bulunamadı.' }, { status: 404 });
  }

  if (typeof body.name === 'string' && body.name.trim()) {
    product.name = body.name.slice(0, 120).trim();
  }
  if (typeof body.description === 'string') {
    product.description = body.description.slice(0, 300).trim();
  }
  if (body.price !== undefined) {
    const numericPrice = Number(body.price);
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      return NextResponse.json({ error: 'Geçerli bir fiyat girin.' }, { status: 400 });
    }
    product.price = numericPrice;
  }
  if (typeof body.categoryKey === 'string' && body.categoryKey.trim()) {
    product.categoryKey = body.categoryKey.trim();
  }
  if (typeof body.emoji === 'string') {
    product.emoji = body.emoji.slice(0, 8);
  }
  if (typeof body.isActive === 'boolean') {
    product.isActive = body.isActive;
  }
  if (typeof body.isPopular === 'boolean') {
    product.isPopular = body.isPopular;
  }
  if (typeof body.imageUrl === 'string') {
    // Eski görsel yeni bir görselle değiştiriliyorsa veya kaldırılıyorsa eskisini sil.
    if (product.imageUrl && product.imageUrl !== body.imageUrl) {
      deleteProductImage(product.imageUrl);
    }
    product.imageUrl = body.imageUrl;
  }
  product.updatedAt = new Date().toISOString();

  await db.write();
  return NextResponse.json({ success: true, product });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const { id } = await params;
  const db = await getDB();
  const product = db.data.products.find((p) => p.id === id);
  if (!product) {
    return NextResponse.json({ error: 'Ürün bulunamadı.' }, { status: 404 });
  }

  if (product.imageUrl) {
    deleteProductImage(product.imageUrl);
  }

  db.data.products = db.data.products.filter((p) => p.id !== id);
  await db.write();

  return NextResponse.json({ success: true });
}
