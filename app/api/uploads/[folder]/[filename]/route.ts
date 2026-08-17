import path from 'node:path';
import fs from 'node:fs';
import { NextRequest, NextResponse } from 'next/server';
import { getUploadDir, isValidUploadFolder } from '@/lib/imageUpload';

const CONTENT_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};

// Yüklenen görselleri (ürün fotoğrafları, site görselleri) herkese açık
// şekilde sunar. Next.js'in /public klasöründeki dosya listesini sunucu
// başlangıcında önbelleğe alması (bkz. lib/imageUpload.ts açıklaması)
// nedeniyle, çalışma zamanında yüklenen görseller /public yerine burada,
// her istekte diskten taze okunan bir route üzerinden sunulur.
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ folder: string; filename: string }> }
) {
  const { folder, filename } = await params;

  if (!isValidUploadFolder(folder)) {
    return NextResponse.json({ error: 'Geçersiz klasör.' }, { status: 400 });
  }

  // Yol geçişi (path traversal) saldırılarına karşı temel güvenlik kontrolü.
  if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return NextResponse.json({ error: 'Geçersiz dosya adı.' }, { status: 400 });
  }

  const extension = path.extname(filename).toLowerCase();
  const contentType = CONTENT_TYPES[extension];
  if (!contentType) {
    return NextResponse.json({ error: 'Desteklenmeyen dosya türü.' }, { status: 400 });
  }

  const filePath = path.join(getUploadDir(folder), filename);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Görsel bulunamadı.' }, { status: 404 });
  }

  try {
    const fileBuffer = fs.readFileSync(filePath);
    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        // Dosya adları benzersiz (UUID) olduğu için agresif önbellekleme güvenlidir.
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err) {
    console.error('[api/uploads]', err);
    return NextResponse.json({ error: 'Görsel okunurken bir hata oluştu.' }, { status: 500 });
  }
}
