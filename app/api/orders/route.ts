import { NextRequest, NextResponse } from 'next/server';
import { getDB, newId } from '@/lib/db';
import { createNotification } from '@/lib/notify';
import { requireAdmin } from '@/lib/authGuard';
import { maybeArchiveOrders } from '@/lib/archive';
import type { Order, OrderItem } from '@/lib/types';

// Herkese açık: müşteri sipariş oluşturur.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, phone, address, notes, items, paymentMethod } = body ?? {};

    if (
      !customerName ||
      typeof customerName !== 'string' ||
      !phone ||
      typeof phone !== 'string' ||
      !address ||
      typeof address !== 'string' ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        { error: 'Lütfen ad soyad, telefon, adres bilgilerini girin ve sepetinize en az bir ürün ekleyin.' },
        { status: 400 }
      );
    }

    const cleanItems: OrderItem[] = items
      .map((it: unknown) => {
        const raw = it as { name?: unknown; unitPrice?: unknown; quantity?: unknown };
        return {
          name: String(raw?.name ?? '').slice(0, 120).trim(),
          unitPrice: Number(raw?.unitPrice) || 0,
          quantity: Math.max(1, Math.min(50, Math.floor(Number(raw?.quantity)) || 1)),
        };
      })
      .filter((it) => it.name.length > 0 && it.unitPrice > 0);

    if (cleanItems.length === 0) {
      return NextResponse.json({ error: 'Sepetinizde geçerli bir ürün bulunamadı.' }, { status: 400 });
    }

    const total = cleanItems.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);

    const db = await getDB();
    const minOrderTotal = db.data.settings.minOrderTotal;

    if (total < minOrderTotal) {
      return NextResponse.json(
        { error: `Minimum sipariş tutarı ${minOrderTotal}₺'dir.` },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const order: Order = {
      id: newId(),
      customerName: customerName.slice(0, 120).trim(),
      phone: phone.slice(0, 40).trim(),
      address: address.slice(0, 500).trim(),
      notes: notes && typeof notes === 'string' ? notes.slice(0, 500).trim() : '',
      items: cleanItems,
      total,
      paymentMethod:
        paymentMethod && typeof paymentMethod === 'string' ? paymentMethod.slice(0, 40) : 'Kapıda Nakit',
      status: 'yeni',
      createdAt: now,
      updatedAt: now,
    };

    db.data.orders.unshift(order);
    await db.write();

    const itemsHtml = cleanItems
      .map((it) => `<li>${it.quantity} × ${it.name} — ${(it.unitPrice * it.quantity).toFixed(2)}₺</li>`)
      .join('');

    await createNotification({
      type: 'siparis',
      refId: order.id,
      title: 'Yeni Sipariş Alındı',
      message: `${order.customerName} adlı müşteri ${order.total.toFixed(2)}₺ tutarında sipariş verdi.`,
      emailSubject: `🛒 Yeni Sipariş — ${order.customerName} (${order.total.toFixed(2)}₺)`,
      emailHtml: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
          <h2 style="color:#dc2626;">🛒 Yeni Sipariş Alındı</h2>
          <p><b>Müşteri:</b> ${order.customerName}</p>
          <p><b>Telefon:</b> ${order.phone}</p>
          <p><b>Adres:</b> ${order.address}</p>
          <p><b>Ödeme Yöntemi:</b> ${order.paymentMethod}</p>
          <p><b>Ürünler:</b></p>
          <ul>${itemsHtml}</ul>
          <p style="font-size:18px;"><b>Toplam: ${order.total.toFixed(2)}₺</b></p>
          ${order.notes ? `<p><b>Sipariş Notu:</b> ${order.notes}</p>` : ''}
          <p style="color:#6b7280;font-size:12px;">Sipariş zamanı: ${new Date(order.createdAt).toLocaleString('tr-TR')}</p>
          <p style="color:#6b7280;font-size:12px;">Bu siparişi yönetici panelinden görüntüleyip durumunu güncelleyebilirsiniz.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (err) {
    console.error('[api/orders][POST]', err);
    return NextResponse.json({ error: 'Sipariş oluşturulurken bir hata oluştu.' }, { status: 500 });
  } finally {
    // Ana akışı bloklamadan, arka planda arşivleme kontrolü yap.
    maybeArchiveOrders().catch((err) => console.error('[archive] otomatik kontrol hatası:', err));
  }
}

// Sadece admin: tüm siparişleri listeler.
export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const db = await getDB();
  return NextResponse.json({ orders: db.data.orders });
}
