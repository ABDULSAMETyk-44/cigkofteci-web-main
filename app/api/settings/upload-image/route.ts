import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/authGuard';
import { saveImage } from '@/lib/imageUpload';

export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  try {
    const formData = await req.formData();
    const file = formData.get('image');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'Görsel dosyası bulunamadı.' }, { status: 400 });
    }

    const result = await saveImage(file, 'site');
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, url: result.url });
  } catch (err) {
    console.error('[api/settings/upload-image]', err);
    return NextResponse.json({ error: 'Görsel yüklenirken bir hata oluştu.' }, { status: 500 });
  }
}
