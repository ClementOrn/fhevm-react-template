/**
 * useComputation Hook
 * Hook for homomorphic computation operations
 */

'use client';

import { useState, useCallback } from 'react';
import { useContract } from '@fhevm/universal-sdk/react';

interface ComputationOptions {
  contractAddress: string;
  abi: any[];
}

export function useComputation(options: ComputationOptions) {
  const { contract, write, isLoading, error } = useContract(
    options.contractAddress,
    options.abi
  );
  const [lastResult, setLastResult] = useState<any>(null);

  const compute = useCallback(
    async (operation: string, operands: any[]) => {
      const result = await write(operation, operands);
      setLastResult(result);
      return result;
    },
    [write]
  );

  const add = useCallback(
    async (a: any, b: any) => {
      return compute('add', [a, b]);
    },
    [compute]
  );

  const subtract = useCallback(
    async (a: any, b: any) => {
      return compute('subtract', [a, b]);
    },
    [compute]
  );

  const multiply = useCallback(
    async (a: any, b: any) => {
      return compute('multiply', [a, b]);
    },
    [compute]
  );

  const compare = useCallback(
    async (a: any, b: any) => {
      return compute('compare', [a, b]);
    },
    [compute]
  );

  return {
    contract,
    compute,
    add,
    subtract,
    multiply,
    compare,
    isComputing: isLoading,
    error,
    lastResult,
  };
}
