/**
 * Providers Component
 * Wraps the app with necessary providers
 */

'use client';

import React from 'react';
import { FHEProvider } from '../components/fhe/FHEProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FHEProvider>
      {children}
    </FHEProvider>
  );
}
