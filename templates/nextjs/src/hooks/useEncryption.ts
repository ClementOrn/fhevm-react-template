/**
 * useEncryption Hook
 * Hook for encryption operations with additional features
 */

'use client';

import { useState, useCallback } from 'react';
import { useEncryption as useSDKEncryption } from '@fhevm/universal-sdk/react';
import type { FHEDataType } from '../lib/fhe/types';

export function useEncryption() {
  const { encrypt: sdkEncrypt, isEncrypting, error } = useSDKEncryption();
  const [history, setHistory] = useState<Array<{
    value: string;
    type: string;
    timestamp: number;
  }>>([]);

  const encrypt = useCallback(
    async (value: any, type: FHEDataType) => {
      const result = await sdkEncrypt(value, type);

      // Add to history
      setHistory((prev) => [
        ...prev,
        {
          value: String(value),
          type,
          timestamp: Date.now(),
        },
      ]);

      return result;
    },
    [sdkEncrypt]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    encrypt,
    isEncrypting,
    error,
    history,
    clearHistory,
  };
}
