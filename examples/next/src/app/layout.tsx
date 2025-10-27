/**
 * Root Layout
 * Main layout component with providers
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FHEVM SDK Examples - Next.js',
  description: 'Complete examples of FHEVM SDK integration with Next.js',
  keywords: ['FHEVM', 'FHE', 'encryption', 'privacy', 'blockchain', 'Next.js'],
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
