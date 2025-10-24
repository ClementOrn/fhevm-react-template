/**
 * Root Layout for Private Rideshare Platform
 * Universal FHEVM SDK Example Application
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Private Rideshare Platform',
  description: 'Privacy-preserving rideshare platform powered by FHEVM',
  keywords: ['fhevm', 'privacy', 'rideshare', 'blockchain', 'encryption'],
  authors: [{ name: 'FHEVM Community' }],
  openGraph: {
    title: 'Private Rideshare Platform',
    description: 'Privacy-preserving rideshare platform powered by FHEVM',
    type: 'website'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
