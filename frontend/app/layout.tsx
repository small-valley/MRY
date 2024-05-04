import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.scss';
import Menu from '@/components/menu/menu';
import Header from '@/components/header/header';
import MobileMenu from '@/components/mobilemenu/mobilemenu';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MRY',
  description: 'Conerstons Program Schedulers',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
