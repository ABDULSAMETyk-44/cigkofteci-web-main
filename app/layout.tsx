import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Çiğköfte - En Taze, En Lezzetli',
  description: 'Geleneksel lezzetin modern adresi. Taptaze çiğköfte ve dürüm çeşitleri.',
  keywords: 'çiğköfte, dürüm, vegan, sağlıklı yemek, online sipariş',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}