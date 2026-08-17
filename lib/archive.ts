import path from 'node:path';
import fs from 'node:fs';
import { getDB } from './db';
import type { Order } from './types';

// -----------------------------------------------------------------------------
// Sipariş arşivleme modülü.
//
// data/db.json dosyasının sürekli büyümesini engellemek için, belirli bir
// süreden eski VE sonuçlanmış (teslim edildi / iptal) siparişler otomatik
// olarak aylık arşiv dosyalarına taşınır:
//
//   data/
//   ├── db.json                    ← aktif / güncel siparişler
//   └── archive/
//       ├── orders-2026-01.json
//       ├── orders-2026-02.json
//       └── ...
//
// Tarih tabanlı çalışır (kayıt sayısına göre değil): varsayılan olarak
// 6 aydan eski, sonuçlanmış siparişler arşive taşınır. Aktif süreçteki
// (yeni/hazırlanıyor/yolda) siparişler ne kadar eski olursa olsun arşive
// taşınmaz. Eşik süre .env dosyasındaki ARCHIVE_AFTER_MONTHS ile
// değiştirilebilir.
// -----------------------------------------------------------------------------

const ARCHIVE_DIR = path.join(process.cwd(), 'data', 'archive');
const DEFAULT_ARCHIVE_AFTER_MONTHS = Number(process.env.ARCHIVE_AFTER_MONTHS) || 6;
const MONTH_FILE_PATTERN = /^\d{4}-\d{2}$/;

function monthKeyOf(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function ensureArchiveDir(): void {
  if (!fs.existsSync(ARCHIVE_DIR)) {
    fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
  }
}

function archiveFilePath(month: string): string {
  return path.join(ARCHIVE_DIR, `orders-${month}.json`);
}

function isFinalStatus(status: Order['status']): boolean {
  return status === 'teslim-edildi' || status === 'iptal';
}

export interface ArchiveMonthSummary {
  month: string; // "2026-07"
  count: number;
  totalRevenue: number;
}

/** Arşivdeki tüm ayları ve o aydaki kayıt sayısını listeler. */
export function listArchiveMonths(): ArchiveMonthSummary[] {
  ensureArchiveDir();
  const files = fs.readdirSync(ARCHIVE_DIR).filter((f) => f.startsWith('orders-') && f.endsWith('.json'));

  return files
    .map((f) => {
      const month = f.replace('orders-', '').replace('.json', '');
      try {
        const raw = fs.readFileSync(path.join(ARCHIVE_DIR, f), 'utf-8');
        const data = JSON.parse(raw) as Order[];
        const totalRevenue = data
          .filter((o) => o.status !== 'iptal')
          .reduce((sum, o) => sum + o.total, 0);
        return { month, count: data.length, totalRevenue };
      } catch {
        return { month, count: 0, totalRevenue: 0 };
      }
    })
    .sort((a, b) => b.month.localeCompare(a.month));
}

/** Belirli bir aya ait arşivlenmiş siparişleri döner (örn. "2026-07"). */
export function getArchivedOrders(month: string): Order[] {
  if (!MONTH_FILE_PATTERN.test(month)) return [];
  ensureArchiveDir();
  const filePath = archiveFilePath(month);
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Order[];
  } catch {
    return [];
  }
}

/**
 * Eşik süreden eski VE sonuçlanmış siparişleri data/db.json'dan alıp
 * aylık arşiv dosyalarına taşır. Geriye kaç kaydın arşivlendiğini
 * ve hangi ay dosyalarının etkilendiğini döner.
 */
export async function archiveOldOrders(
  monthsThreshold: number = DEFAULT_ARCHIVE_AFTER_MONTHS
): Promise<{ archivedCount: number; months: string[] }> {
  const db = await getDB();
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - monthsThreshold);

  const toKeep: Order[] = [];
  const toArchive: Order[] = [];

  for (const order of db.data.orders) {
    const createdAt = new Date(order.createdAt);
    if (isFinalStatus(order.status) && createdAt < cutoff) {
      toArchive.push(order);
    } else {
      toKeep.push(order);
    }
  }

  if (toArchive.length === 0) {
    return { archivedCount: 0, months: [] };
  }

  ensureArchiveDir();

  const byMonth = new Map<string, Order[]>();
  for (const order of toArchive) {
    const month = monthKeyOf(order.createdAt);
    if (!byMonth.has(month)) byMonth.set(month, []);
    byMonth.get(month)!.push(order);
  }

  for (const [month, orders] of byMonth) {
    const filePath = archiveFilePath(month);
    let existing: Order[] = [];
    if (fs.existsSync(filePath)) {
      try {
        existing = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Order[];
      } catch {
        existing = [];
      }
    }
    const existingIds = new Set(existing.map((o) => o.id));
    const merged = [...existing, ...orders.filter((o) => !existingIds.has(o.id))];
    // En yeni en üstte olacak şekilde sırala.
    merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    fs.writeFileSync(filePath, JSON.stringify(merged, null, 2), 'utf-8');
  }

  db.data.orders = toKeep;
  await db.write();

  return { archivedCount: toArchive.length, months: Array.from(byMonth.keys()) };
}

/**
 * Yeni bir sipariş oluşturulduktan sonra çağrılan hafif kontrol.
 * Arşivlenecek bir şey yoksa hiçbir disk yazma işlemi yapmadan hemen döner,
 * bu yüzden her siparişte çağrılması performansı etkilemez.
 */
export async function maybeArchiveOrders(): Promise<void> {
  try {
    const db = await getDB();
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - DEFAULT_ARCHIVE_AFTER_MONTHS);

    const hasArchivableOrder = db.data.orders.some(
      (o) => isFinalStatus(o.status) && new Date(o.createdAt) < cutoff
    );

    if (hasArchivableOrder) {
      await archiveOldOrders();
    }
  } catch (err) {
    console.error('[archive] Otomatik arşivleme kontrolü sırasında hata:', err);
  }
}

export function getArchiveAfterMonths(): number {
  return DEFAULT_ARCHIVE_AFTER_MONTHS;
}
