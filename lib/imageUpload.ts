import path from 'node:path';
import fs from 'node:fs';
import { randomUUID } from 'node:crypto';

// -----------------------------------------------------------------------------
// Görsel yükleme modülü (ürün fotoğrafları + site görselleri, ör. ana sayfa
// hero görseli, için ortak kullanılır).
//
// ÖNEMLİ: Görseller /public klasörüne DEĞİL, /data/uploads/<klasör> altına
// kaydedilir ve /api/uploads/<klasör>/[dosya] uç noktası üzerinden dinamik
// olarak sunulur (bkz. app/api/uploads/[folder]/[filename]/route.ts).
//
// Neden /public kullanılmıyor? Next.js'in production sunucusu (next start),
// /public klasöründeki dosya listesini sunucu başlatılırken önbelleğe alır;
// sunucu ÇALIŞIRKEN eklenen yeni dosyalar (yani admin panelinden yapılan
// her görsel yüklemesi) sunucu yeniden başlatılana kadar 404 döner. Bunu
// test ederek doğruladık. Bu yüzden yüklenen görseller, her istekte diskten
// taze okunan bir API route üzerinden sunulur — böylece yükleme anında
// hemen erişilebilir olurlar.
//
// NOT: Bu yöntem kalıcı bir disk üzerinde çalışan bir sunucu (ör. VPS,
// kendi sunucunuz, Docker container + volume) gerektirir. Vercel gibi
// "serverless"/geçici dosya sistemi olan platformlarda yüklenen dosyalar
// yeniden dağıtımda (deploy) silinebilir — böyle bir platforma taşınırsa
// bu modülün bir bulut depolama servisine (S3, Cloudinary vb.) bağlanacak
// şekilde güncellenmesi gerekir.
// -----------------------------------------------------------------------------

export type UploadFolder = 'products' | 'site';

export const UPLOAD_FOLDERS: UploadFolder[] = ['products', 'site'];

const UPLOAD_ROOT = path.join(process.cwd(), 'data', 'uploads');
const PUBLIC_PATH_PREFIX = '/api/uploads';

const ALLOWED_MIME_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export interface SaveImageResult {
  success: boolean;
  url?: string;
  error?: string;
}

export function getUploadDir(folder: UploadFolder): string {
  return path.join(UPLOAD_ROOT, folder);
}

export function isValidUploadFolder(folder: string): folder is UploadFolder {
  return UPLOAD_FOLDERS.includes(folder as UploadFolder);
}

export async function saveImage(file: File, folder: UploadFolder): Promise<SaveImageResult> {
  if (!file || file.size === 0) {
    return { success: false, error: 'Dosya bulunamadı.' };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { success: false, error: "Görsel boyutu 5MB'ı geçemez." };
  }

  const extension = ALLOWED_MIME_TYPES[file.type];
  if (!extension) {
    return { success: false, error: 'Yalnızca JPG, PNG, WEBP veya GIF formatları desteklenir.' };
  }

  try {
    const uploadDir = getUploadDir(folder);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${randomUUID()}.${extension}`;
    const filePath = path.join(uploadDir, fileName);

    const arrayBuffer = await file.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(arrayBuffer));

    return { success: true, url: `${PUBLIC_PATH_PREFIX}/${folder}/${fileName}` };
  } catch (err) {
    console.error('[imageUpload] Görsel kaydedilirken hata:', err);
    return { success: false, error: 'Görsel kaydedilirken bir hata oluştu.' };
  }
}

export function deleteImage(imageUrl: string, folder: UploadFolder): void {
  const prefix = `${PUBLIC_PATH_PREFIX}/${folder}/`;
  if (!imageUrl || !imageUrl.startsWith(prefix)) return;
  try {
    const fileName = imageUrl.replace(prefix, '');
    // Yol geçişi (path traversal) saldırılarına karşı temel bir güvenlik kontrolü.
    if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) return;
    const filePath = path.join(getUploadDir(folder), fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error('[imageUpload] Görsel silinirken hata:', err);
  }
}

// Geriye dönük uyumluluk için ürün-özel yardımcı fonksiyonlar.
export async function saveProductImage(file: File): Promise<SaveImageResult> {
  return saveImage(file, 'products');
}

export function deleteProductImage(imageUrl: string): void {
  deleteImage(imageUrl, 'products');
}
