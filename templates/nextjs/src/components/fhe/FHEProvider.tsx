/**
 * FHE Provider Component
 * Provides FHEVM context to the application
 */

'use client';

import React from 'react';
import { FHEVMProvider as SDKProvider } from '@fhevm/universal-sdk/react';

interface FHEProviderProps {
  children: React.ReactNode;
}

export function FHEProvider({ children }: FHEProviderProps) {
  const config = {
    network: (process.env.NEXT_PUBLIC_NETWORK as any) || 'sepolia',
    gatewayUrl: process.env.NEXT_PUBLIC_GATEWAY_URL || 'https://gateway.sepolia.zama.ai',
    contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  };

  return (
    <SDKProvider config={config}>
      {children}
    </SDKProvider>
  );
}
