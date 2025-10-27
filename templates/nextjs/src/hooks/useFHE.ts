/**
 * useFHE Hook
 * Main hook for FHE operations
 */

'use client';

import { useFHEVM } from '@fhevm/universal-sdk/react';

/**
 * Custom hook that wraps the SDK's useFHEVM hook
 * with additional functionality
 */
export function useFHE() {
  const { instance, isReady, error, network } = useFHEVM();

  return {
    instance,
    isReady,
    error,
    network,
    isInitialized: isReady && !error,
  };
}
