import { Black_Ops_One, Inter } from 'next/font/google';

import { Footer } from '@/components/Footer';
import { LayoutWrapper } from '@/components/LayoutWrapper';
import { Providers } from '@/components/Providers';

import type { Metadata } from 'next';

import './globals.css';

const blackOps = Black_Ops_One({
  weight: '400',
  variable: '--font-black-ops',
  subsets: ['latin'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: `CRYPTOBROZ - Manage Your Digital Assets`,
  description: `Your premier crypto platform for tracking and managing digital asset balances`,
  other: {
    'view-transition': 'same-origin',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body className={`${blackOps.variable} ${inter.variable} font-inter`}>
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
