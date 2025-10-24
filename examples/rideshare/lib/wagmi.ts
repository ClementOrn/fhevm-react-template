/**
 * Wagmi Configuration for Universal FHEVM SDK Example
 */

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

// Get WalletConnect project ID from environment
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

if (!projectId) {
  console.warn('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set');
}

// Configure chains for the application
export const config = getDefaultConfig({
  appName: 'Private Rideshare Platform',
  projectId,
  chains: [sepolia],
  ssr: true,
});

// Chain configuration
export const supportedChains = [sepolia];

// Default chain
export const defaultChain = sepolia;
