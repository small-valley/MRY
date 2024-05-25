import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.scss';
import Root from '@/components/root/Root';
import Providers from '@/components/common/ProgressBarProvider';

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
        <Root>
          <Providers>{children}</Providers>
        </Root>
      </body>
    </html>
  );
}
