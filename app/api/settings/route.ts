import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { requireAdmin } from '@/lib/authGuard';
import { deleteImage } from '@/lib/imageUpload';
import type { SiteSettings } from '@/lib/types';

// Herkese açık: site genelinde (Footer, Ana Sayfa, İletişim vb.) kullanılan
// iletişim bilgileri, çalışma saatleri, hero görseli gibi bilgileri döner.
// Hassas bir bilgi içermez (admin şifresi vb. bu nesnede yer almaz).
export async function GET() {
  const db = await getDB();
  return NextResponse.json({ settings: db.data.settings });
}

const EDITABLE_STRING_FIELDS: (keyof SiteSettings)[] = [
  'phone',
  'whatsapp',
  'email',
  'address',
  'city',
  'instagramUrl',
  'facebookUrl',
  'twitterUrl',
  'workingHoursWeekday',
  'workingHoursSaturday',
  'workingHoursSunday',
  'logoUrl',
  'heroImageUrl',
  'heroTitleLine1',
  'heroTitleLine2',
  'heroSubtitle',
  'deliveryTimeText',
];

const IMAGE_FIELDS: (keyof SiteSettings)[] = ['logoUrl', 'heroImageUrl'];

// Sadece admin: site ayarlarını günceller.
export async function PATCH(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const body = await req.json().catch(() => ({}));
  const db = await getDB();
  const settings = db.data.settings;

  for (const field of EDITABLE_STRING_FIELDS) {
    if (typeof body[field] === 'string') {
      // Görsel alanları değişiyorsa/kaldırılıyorsa eski dosyayı temizle.
      if (IMAGE_FIELDS.includes(field) && settings[field] && settings[field] !== body[field]) {
        deleteImage(settings[field] as string, 'site');
      }
      (settings[field] as string) = body[field].slice(0, 500).trim();
    }
  }

  if (body.minOrderTotal !== undefined) {
    const val = Number(body.minOrderTotal);
    if (!Number.isFinite(val) || val < 0) {
      return NextResponse.json({ error: 'Geçerli bir minimum sipariş tutarı girin.' }, { status: 400 });
    }
    settings.minOrderTotal = val;
  }

  if (body.freeDeliveryThreshold !== undefined) {
    const val = Number(body.freeDeliveryThreshold);
    if (!Number.isFinite(val) || val < 0) {
      return NextResponse.json({ error: 'Geçerli bir ücretsiz teslimat eşiği girin.' }, { status: 400 });
    }
    settings.freeDeliveryThreshold = val;
  }

  settings.updatedAt = new Date().toISOString();
  await db.write();

  return NextResponse.json({ success: true, settings });
}
