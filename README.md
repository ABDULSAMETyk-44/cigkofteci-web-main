# Adıyaman Çiğköfte — Web Sitesi + Yönetim Sistemi

Bu proje sadece bir tanıtım sitesi değil; **çalışan bir sipariş sistemi, ürün
yönetimi (fotoğraf yüklemeli), bayilik başvuru sistemi, iletişim formu,
otomatik sipariş arşivleme ve bunların hepsini tek yerden yönetebileceğiniz
bir yönetici (admin) paneli** içerir. Tamamen mobil uyumludur.

---

## 1. Yönetici paneline nereden giriş yapılır?

Güvenlik amacıyla sitede **görünür hiçbir "Yönetici Girişi" bağlantısı yoktur**
— ne ana sayfada ne de footer'da. Panele erişmek için tarayıcıdan doğrudan
şu adrese gidilir:

```
https://siteniz.com/admin
```

Giriş yapılmamışsa otomatik olarak `/admin/login` sayfasına yönlendirilirsiniz.
Bu adresi sadece siz (ve yetkilendirdiğiniz kişiler) bilmelidir.

**Varsayılan giriş bilgileri** (ilk kurulumda `.env` dosyanızdan gelir):
- E-posta: `admin@adiyamancigkofte.com`
- Şifre: `Admin123!`

Giriş yaptıktan hemen sonra **Hesap Ayarları → Şifre Değiştir** kısmından
şifrenizi mutlaka değiştirin.

---

## 2. Yönetici panelinde neler var?

| Bölüm | Ne işe yarar |
|---|---|
| **Panel** | Günlük sipariş sayısı/ciro, bekleyen sipariş/mesaj/başvuru sayıları, arşivlenmiş sipariş sayısı, son hareketler |
| **Siparişler** | Tüm siparişleri görüntüleme, filtreleme, detay (ürünler, adres, telefon), durum güncelleme (Yeni → Hazırlanıyor → Yolda → Teslim Edildi / İptal) |
| **Ürünler** | Menüdeki her ürünü ekleyin, düzenleyin, **fotoğraf yükleyin**, fiyat/açıklama/kategori değiştirin, "Popüler" etiketi verin, menüden geçici olarak kaldırın (pasif) veya kalıcı olarak silin |
| **Mesajlar** | İletişim formundan gelen mesajlar, "Yanıtlandı" olarak işaretleme, tek tıkla e-posta ile yanıtlama |
| **Bayilik Başvuruları** | Franchise başvurularını görüntüleme ve durum güncelleme (İnceleniyor / Onaylandı / Reddedildi) |
| **Arşiv** | 6 aydan eski, sonuçlanmış siparişlerin otomatik taşındığı arşiv; aya göre görüntüleme, istenirse "Şimdi Arşivle" ile manuel tetikleme |
| **Bildirimler** | Tüm bildirimlerin geçmişi, okundu/okunmadı takibi |
| **Site Ayarları** | Ana sayfa kapak görseli, logo, başlık metinleri, telefon/e-posta/adres, sosyal medya linkleri, çalışma saatleri, minimum sipariş tutarı ve ücretsiz teslimat eşiği — **sitenin tamamına anında yansır** |
| **Hesap Ayarları** | Şifre değiştirme, e-posta bildirim kurulum bilgisi |

Panelin üst kısmındaki **🔔 zil ikonu**, 20 saniyede bir otomatik güncellenir
ve okunmamış bildirim sayısını gösterir — yeni bir sipariş geldiğinde buradan
anında haberdar olursunuz. Panel tamamen **mobil uyumludur**: telefondan
girdiğinizde menü bir hamburger simgesine dönüşür, tablolar kart görünümüne
geçer.

---

## 3. Ürün yönetimi (fotoğraf yükleme dahil)

**Ürünler** sekmesinden:
1. **"+ Yeni Ürün Ekle"** butonuna basın.
2. Ürün adı, açıklama, fiyat, kategori girin.
3. **Fotoğraf yükleyin** (JPG/PNG/WEBP/GIF, maks. 5MB) — anında önizleme
   gösterilir. Fotoğraf yüklemezseniz, ürün bir emoji ikonuyla gösterilir.
4. "Menüde Görünsün" kutusunu işaretli bırakırsanız ürün hem **Menü**
   sayfasında hem **Sipariş** sayfasında hemen görünür.
5. "⭐ Popüler Etiketi" ile ürünü öne çıkarabilirsiniz.

Var olan bir ürünü düzenlemek için kart üzerindeki **✏️ Düzenle**'ye,
menüden geçici kaldırmak için **👁️ / 🚫** simgesine, kalıcı silmek için
**🗑️**'ya tıklayın. Yaptığınız her değişiklik **anında** Menü ve Sipariş
sayfalarına yansır — ayrı bir "yayınla" adımı yoktur.

---

## 4. Site ayarları (logo, kapak görseli, iletişim bilgileri)

**Site Ayarları** sekmesinden, kod dokunmadan şunları değiştirebilirsiniz:

- **Logo** ve **ana sayfa kapak görseli** (fotoğraf yükleyerek)
- Ana sayfa başlık ve alt başlık metinleri
- **Telefon, WhatsApp, e-posta, adres, şehir**
- Instagram / Facebook / Twitter (X) linkleri
- Çalışma saatleri (hafta içi / cumartesi / pazar)
- Teslimat süresi metni, minimum sipariş tutarı, ücretsiz teslimat eşiği

Bu bilgiler sitenin her yerinde (Footer, Ana Sayfa, İletişim, Sipariş,
Bayilik sayfaları) otomatik olarak kullanılır — yani telefon numaranızı bir
kez değiştirdiğinizde tüm sayfalarda anında güncellenir, kodda tek tek arayıp
değiştirmenize gerek kalmaz. "Popüler" olarak işaretlediğiniz ürünler (bkz.
Ürünler sekmesi) ana sayfadaki "Popüler Lezzetler" bölümünde otomatik olarak
görünür.

## 5. Sipariş arşivleme nasıl çalışır?

`data/db.json` dosyasının sürekli büyümesini önlemek için, **6 aydan eski
VE sonuçlanmış (Teslim Edildi / İptal) siparişler otomatik olarak** aylık
arşiv dosyalarına taşınır:

```
data/
├── db.json                    ← aktif / güncel siparişler
└── archive/
    ├── orders-2026-01.json
    ├── orders-2026-02.json
    └── ...
```

Önemli noktalar:
- **Tarih tabanlıdır**, kayıt sayısına göre değil — 6 ay eşiği (`.env`
  dosyasındaki `ARCHIVE_AFTER_MONTHS` ile değiştirilebilir) daha anlamlı ve
  öngörülebilir bir kural olduğu için tercih edildi.
- **Aktif süreçteki siparişler asla arşivlenmez.** Bir sipariş 8 ay önce
  oluşturulmuş olsa bile hâlâ "Hazırlanıyor" durumundaysa arşive taşınmaz;
  yalnızca "Teslim Edildi" veya "İptal" durumundaki eski siparişler taşınır.
- Arşivleme, her yeni sipariş oluşturulduğunda otomatik olarak arka planda
  kontrol edilir (herhangi bir performans kaybı yaratmadan). Ayrıca **Arşiv**
  sayfasındaki **"🗄️ Şimdi Arşivle"** butonuyla istediğiniz an manuel olarak
  da tetikleyebilirsiniz.
- Arşivlenen siparişler **kaybolmaz** — Arşiv sayfasından aya göre
  görüntülenebilir, sadece ana sipariş listesini hızlı ve düzenli tutmak için
  ayrı dosyalara taşınır.

---

## 6. Kurulum (geliştirici / hosting sağlayıcınız için)

### Gereksinimler
- Node.js 18.18 veya üzeri (önerilen: Node 20+)
- Görsellerin ve veritabanının kalıcı olabilmesi için **disk üzerinde
  sürekli çalışan bir sunucu** (VPS, kendi sunucunuz, Docker + volume).
  "Serverless" platformlar (ör. Vercel'in standart dağıtımı) için ek
  yapılandırma gerekir — bkz. bölüm 7.

### Adımlar

```bash
# 1) Bağımlılıkları yükleyin
npm install

# 2) Ortam değişkenlerini ayarlayın
cp .env.example .env
# .env dosyasını açıp aşağıdaki kısımda anlatılan alanları doldurun

# 3) Geliştirme sunucusunu başlatın
npm run dev
# tarayıcıda http://localhost:3000

# 4) Canlıya almak için
npm run build
npm run start
```

### `.env` dosyasında mutlaka ayarlamanız gerekenler

```env
# Oturum güvenliği için rastgele, uzun bir anahtar (zorunlu, canlıda mutlaka değiştirin)
ADMIN_SESSION_SECRET=uzun-ve-rastgele-bir-deger

# İlk admin hesabınız (sistem ilk kez çalıştığında otomatik oluşturulur)
DEFAULT_ADMIN_EMAIL=admin@sizin-siteniz.com
DEFAULT_ADMIN_PASSWORD=GucluBirSifre123!
```

> ⚠️ `DEFAULT_ADMIN_EMAIL`/`DEFAULT_ADMIN_PASSWORD` yalnızca veritabanı dosyası
> (`data/db.json`) hiç yokken, yani **ilk kurulumda** kullanılır. Panelden
> şifrenizi değiştirdikten sonra bu değerlerin bir önemi kalmaz.

---

## 7. E-posta bildirimlerini nasıl açarım?

Sipariş/mesaj/başvuru geldiğinde size **e-posta** de gitmesini istiyorsanız
`.env` dosyanıza SMTP bilgilerinizi girmeniz yeterli:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=isletmeniz@gmail.com
SMTP_PASS=uygulama-sifreniz
NOTIFY_EMAIL=siparis-bildirimleri@gmail.com
MAIL_FROM=isletmeniz@gmail.com
```

**Gmail kullanıyorsanız:** normal şifreniz çalışmaz, Google hesabınızda
["Uygulama Şifreleri"](https://myaccount.google.com/apppasswords) bölümünden
16 haneli bir uygulama şifresi oluşturup `SMTP_PASS` alanına onu yazmalısınız.

**SMTP tanımlamazsanız ne olur?** Hiçbir şey bozulmaz — sipariş/mesaj/başvuru
sistemi normal çalışmaya devam eder, sadece e-posta gönderilmez. Bildirimler
her durumda admin panelindeki zil ikonunda görünür.

---

## 8. Veri ve görseller nerede saklanıyor? Önemli notlar

Küçük/orta ölçekli bir işletme sitesi için harici bir veritabanı sunucusu
kurmadan çalışsın diye tüm veriler dosya sisteminde saklanır:

```
data/
├── db.json                    ← siparişler, mesajlar, başvurular, ürünler, ayarlar, admin hesabı
├── archive/                    ← arşivlenmiş eski siparişler (aylık dosyalar)
└── uploads/
    ├── products/                ← yüklenen ürün fotoğrafları
    └── site/                    ← logo, ana sayfa kapak görseli
```

Bu dosyalar sunucu ilk çalıştığında otomatik oluşturulur. Elinizle
silmediğiniz sürece verileriniz kalıcıdır. **Bu klasörü düzenli olarak
yedeklemenizi öneririz.**

> ⚠️ **Önemli — "Serverless" platformlar hakkında:** Vercel gibi geçici
> (ephemeral) dosya sistemine sahip platformlarda `data/` klasörüne yazılan
> her şey (siparişler, yüklenen fotoğraflar) bir sonraki dağıtımda
> (deploy) veya sunucu yeniden başlatıldığında **silinebilir**. Bu proje
> disk üzerinde kalıcı çalışan bir sunucu (VPS, kendi sunucunuz, Docker +
> kalıcı volume) için tasarlanmıştır. Böyle bir platforma taşımak isterseniz,
> `lib/db.ts` ve `lib/imageUpload.ts` dosyalarının bir bulut veritabanı
> (Postgres, MongoDB) ve bulut depolama servisine (S3, Cloudinary) bağlanacak
> şekilde güncellenmesi gerekir — mimari buna kolayca uyarlanacak şekilde
> tek noktadan (bu iki dosya) yönetilecek şekilde tasarlandı.

---

## 9. Sipariş sistemi nasıl çalışıyor? (teknik özet)

1. Müşteri `/siparis` sayfasında ürünleri sepete ekler. Ürün listesi artık
   **veritabanından canlı olarak** çekilir (`GET /api/products`) — yani admin
   panelinden eklediğiniz/düzenlediğiniz her ürün anında sipariş ve menü
   sayfalarına yansır.
2. "Siparişi Tamamla" butonuna basınca bilgiler `POST /api/orders` uç noktasına
   gönderilir.
3. Sunucu siparişi doğrular (zorunlu alanlar, minimum tutar — varsayılan
   30₺), `data/db.json` dosyasına kaydeder, admin paneline bir bildirim
   düşürür, (SMTP açıksa) size e-posta gönderir ve arka planda otomatik
   arşivleme kontrolü yapar.
4. Siz admin panelinden **Siparişler** sekmesinde siparişi görür, telefon/adres
   bilgisiyle müşteriyi arayıp onaylar ve durumunu günceller.

Aynı akış **İletişim formu** (`/iletisim` → `POST /api/contact`) ve
**Bayilik başvurusu** (`/bayilik` → `POST /api/franchise`) için de geçerlidir.

---

## 10. Proje yapısı

```
app/
  layout.tsx                 → Kök layout (yalnızca <html>/<body>, font)
  (site)/                    → Herkese açık site sayfaları (ortak Navigation+Footer ile)
    layout.tsx                → Navigation + Footer (site ayarlarını sunucuda okur)
    page.tsx                  → Ana sayfa (canlı hero görseli + popüler ürünler)
    menu/                     → Menü (veritabanından canlı ürün listesi)
    hakkimizda/, subeler/    → Tanıtım sayfaları
    siparis/                 → Sipariş sayfası (gerçek sepet + canlı ürünler)
    iletisim/                → İletişim formu (backend bağlantılı)
    bayilik/                 → Bayilik/Franchise başvuru formu
  admin/                      → Yönetici paneli (Navigation/Footer YOK, kendi arayüzü var)
    (auth)/login/             → Giriş sayfası (korumasız)
    (dashboard)/              → Giriş korumalı panel sayfaları
      page.tsx                 → Panel (özet istatistikler)
      siparisler/              → Sipariş yönetimi
      urunler/                 → Ürün yönetimi + fotoğraf yükleme
      mesajlar/                → İletişim mesajları
      bayilik/                 → Bayilik başvuruları
      arsiv/                   → Arşivlenmiş siparişler
      bildirimler/             → Bildirim geçmişi
      site-ayarlari/           → Logo, kapak görseli, iletişim bilgileri
      ayarlar/                 → Şifre değiştirme
  api/                        → Backend uç noktaları (orders, products, settings, uploads, vb.)

lib/
  db.ts                    → Basit dosya tabanlı veritabanı (data/db.json)
  auth.ts, authGuard.ts    → Admin oturum yönetimi
  mailer.ts, notify.ts     → E-posta ve bildirim mantığı
  products.ts              → Kategoriler ve genel sabitler
  imageUpload.ts           → Görsel yükleme/silme (ürün + site görselleri)
  archive.ts               → Sipariş arşivleme mantığı

proxy.ts                   → /admin sayfalarını girişsiz erişime kapatır (Next.js 16'da "middleware"in yeni adı)
```

---

## 11. Sık sorulan sorular

**Sipariş bittiğinde müşteriye SMS/WhatsApp gönderilir mi?**
Hayır, şu anki sürüm e-posta bildirimi ve admin panelindeki bildirimleri
destekler. SMS/WhatsApp entegrasyonu (örn. Twilio, WhatsApp Business API) ek
bir geliştirme ile eklenebilir.

**Online ödeme (kredi kartı ile anında tahsilat) var mı?**
Hayır, şu anki sistemde ödeme yöntemi müşteri tarafından seçilir (Kapıda
Nakit / Kapıda Kart / Mobil Ödeme) ve tahsilat teslimat sırasında yapılır.
Bir ödeme sağlayıcısı (iyzico, PayTR, Stripe vb.) entegre etmek isterseniz
bu da ayrı bir geliştirme konusudur.

**Birden fazla admin hesabı ekleyebilir miyim?**
Şu anki sürümde panel üzerinden yeni admin ekleme arayüzü yoktur; ihtiyaç
duyarsanız `data/db.json` içindeki `admins` listesine geliştirici desteğiyle
yeni bir kayıt eklenebilir.

**Arşivlenen bir siparişi geri getirebilir miyim?**
Şu anki sürümde panel üzerinden "arşivden geri al" butonu yoktur (arşiv salt
okunurdur). Gerekirse `data/archive/orders-YYYY-AA.json` dosyasından ilgili
kaydı manuel olarak `data/db.json` içine taşıyabilirsiniz.
