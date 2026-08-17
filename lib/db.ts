import path from 'node:path';
import fs from 'node:fs';
import bcrypt from 'bcryptjs';
import { JSONFilePreset } from 'lowdb/node';
import type { DBSchema, Product, SiteSettings } from './types';
import { DEFAULT_PRODUCTS_SEED, DEFAULT_MIN_ORDER_TOTAL, DEFAULT_FREE_DELIVERY_THRESHOLD } from './products';

// -----------------------------------------------------------------------------
// Basit, dosya tabanlı (JSON) veritabanı katmanı.
//
// Küçük/orta ölçekli bir restoran sitesi için harici bir veritabanı sunucusu
// kurmaya gerek bırakmadan çalışır (SQLite/Postgres kurulumu gerektirmez).
// Tüm veriler /data/db.json dosyasında saklanır ve sunucu her ayağa
// kalktığında otomatik olarak oluşturulur.
//
// Daha büyük ölçekli / çok sunuculu bir kuruluma geçerken bu katman kolayca
// Postgres + Prisma gibi bir yapıya taşınabilir; tüm erişimler bu dosya
// üzerinden (getDB) yapıldığı için değişiklik tek noktadan yönetilir.
// -----------------------------------------------------------------------------

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Varsayılan admin şifresi. İlk kurulumdan sonra MUTLAKA
// admin panelinden (Ayarlar) değiştirilmelidir.
const DEFAULT_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL || 'admin@adiyamancigkofte.com';
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin123!';

function buildDefaultSettings(): SiteSettings {
  return {
    phone: '0850 123 45 67',
    whatsapp: '',
    email: 'info@cigkofte.com',
    address: 'Malatya, Türkiye',
    city: 'Malatya',
    instagramUrl: '',
    facebookUrl: '',
    twitterUrl: '',
    workingHoursWeekday: '10:00 - 22:00',
    workingHoursSaturday: '10:00 - 23:00',
    workingHoursSunday: '11:00 - 22:00',
    logoUrl: '',
    heroImageUrl: '',
    heroTitleLine1: 'En Taze',
    heroTitleLine2: 'Çiğköfte',
    heroSubtitle: 'Geleneksel lezzetin modern adresi. Her lokmada taze, doğal ve sağlıklı malzemeler.',
    deliveryTimeText: '30 dakika',
    minOrderTotal: DEFAULT_MIN_ORDER_TOTAL,
    freeDeliveryThreshold: DEFAULT_FREE_DELIVERY_THRESHOLD,
    updatedAt: new Date().toISOString(),
  };
}

function buildDefaultData(): DBSchema {
  const now = new Date().toISOString();
  const products: Product[] = DEFAULT_PRODUCTS_SEED.map((p, idx) => ({
    id: `seed-${idx}-${p.categoryKey}`,
    name: p.name,
    description: p.description,
    price: p.price,
    categoryKey: p.categoryKey,
    imageUrl: '',
    emoji: p.emoji,
    isActive: true,
    isPopular: p.isPopular,
    createdAt: now,
    updatedAt: now,
  }));

  return {
    orders: [],
    contactMessages: [],
    franchiseApplications: [],
    notifications: [],
    products,
    settings: buildDefaultSettings(),
    admins: [
      {
        id: 'admin-1',
        email: DEFAULT_ADMIN_EMAIL,
        passwordHash: bcrypt.hashSync(DEFAULT_ADMIN_PASSWORD, 10),
        name: 'Site Yöneticisi',
      },
    ],
  };
}

type DB = Awaited<ReturnType<typeof JSONFilePreset<DBSchema>>>;

let dbPromise: Promise<DB> | null = null;

export async function getDB(): Promise<DB> {
  if (!dbPromise) {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const fileExistedBefore = fs.existsSync(DB_FILE);
    dbPromise = (async () => {
      const db = await JSONFilePreset<DBSchema>(DB_FILE, buildDefaultData());
      // lowdb, dosya mevcut değilse varsayılan veriyi yalnızca BELLEKTE tutar,
      // diske otomatik yazmaz. İlk kurulumda dosyanın gerçekten diske
      // yazıldığından emin olmak için (ör. bir sunucu yeniden başlatmasında
      // veya sadece okuma isteklerinde veri kaybı yaşanmaması için) burada
      // açıkça bir kez yazıyoruz.
      if (!fileExistedBefore) {
        await db.write();
      }
      return db;
    })();
  }
  const db = await dbPromise;

  // ÖNEMLİ: Next.js, sayfa bileşenlerini (Server Components) ve API
  // route'larını derleme sırasında ayrı paketler (bundle) halinde
  // oluşturabilir. Bu nedenle, bu modülün üst seviyedeki `dbPromise`
  // singleton'ı her zaman aynı bellek örneğini paylaşacağı garanti
  // edilemez — bir API route'unda yapılan bir güncelleme, farklı bir
  // pakette çalışan bir sayfa bileşeninde hemen görünmeyebilir. Bunu
  // önlemek için her çağrıda diskteki güncel veriyi taze olarak okuruz.
  // (Küçük bir JSON dosyası için bu okumanın performans maliyeti önemsizdir,
  // ama sağladığı veri tutarlılığı bu proje için kritiktir.)
  await db.read();

  // Eski veri dosyalarında eksik olabilecek alanları güvence altına al.
  db.data.orders ??= [];
  db.data.contactMessages ??= [];
  db.data.franchiseApplications ??= [];
  db.data.notifications ??= [];
  db.data.admins ??= [];
  db.data.products ??= buildDefaultData().products;
  db.data.settings = { ...buildDefaultSettings(), ...(db.data.settings ?? {}) };
  if (db.data.admins.length === 0) {
    db.data.admins.push(buildDefaultData().admins[0]);
    await db.write();
  }
  return db;
}

export function newId(): string {
  return crypto.randomUUID();
}
