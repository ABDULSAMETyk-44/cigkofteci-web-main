import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { getDB } from '@/lib/db';

// Bu layout, admin panelinden (Site Ayarları) değiştirilebilen canlı verileri
// (telefon, e-posta, logo, vb.) okur. Statik/önbelleğe alınmış olarak
// oluşturulursa, admin bir değişiklik yaptığında site yeniden derlenene
// kadar eski bilgiler görünmeye devam eder. Bunu önlemek için sayfanın her
// istekte sunucuda taze olarak render edilmesini zorunlu kılıyoruz.
export const dynamic = 'force-dynamic';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const db = await getDB();
  const settings = db.data.settings;

  return (
    <>
      <Navigation settings={settings} />
      {children}
      <Footer settings={settings} />
    </>
  );
}
