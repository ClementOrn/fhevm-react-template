/**
 * Web3 Providers Configuration
 * Integrates Wagmi, RainbowKit, and Universal FHEVM SDK
 */

'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { FHEVMProvider } from '@fhevm/universal-sdk/react';
import { config } from '../lib/wagmi';
import '@rainbow-me/rainbowkit/styles.css';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

// FHEVM SDK Configuration
const fhevmConfig = {
  network: 'sepolia' as const,
  gatewayUrl: 'https://gateway.sepolia.zama.ai',
  chainId: 11155111,
  debug: process.env.NODE_ENV === 'development'
};

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <FHEVMProvider config={fhevmConfig}>
            {children}
          </FHEVMProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
