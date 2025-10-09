/**
 * React Hooks for FHEVM
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type {
  FHEVMConfig,
  FHEVMInstance,
  UseFHEVMReturn,
  UseEncryptionReturn,
  UseDecryptionReturn,
  UseContractReturn,
  FHEDataType,
  EncryptedValue,
  EncryptedHandle,
  ContractCallOptions,
  NetworkInfo
} from '../types';
import { FHEVMClient } from '../core/client';

/**
 * FHEVM Context
 */
const FHEVMContext = createContext<FHEVMInstance | null>(null);

/**
 * FHEVM Provider Props
 */
interface FHEVMProviderProps {
  config: FHEVMConfig;
  children: ReactNode;
}

/**
 * FHEVM Provider Component
 */
export function FHEVMProvider({ config, children }: FHEVMProviderProps) {
  const [instance] = useState(() => new FHEVMClient(config));

  return (
    <FHEVMContext.Provider value={instance}>
      {children}
    </FHEVMContext.Provider>
  );
}

/**
 * Hook to access FHEVM instance
 */
export function useFHEVM(): UseFHEVMReturn {
  const instance = useContext(FHEVMContext);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [network, setNetwork] = useState<NetworkInfo | null>(null);

  useEffect(() => {
    if (!instance) {
      setError(new Error('FHEVM instance not found. Did you wrap your app with FHEVMProvider?'));
      return;
    }

    const checkReady = setInterval(() => {
      if (instance.isReady()) {
        setIsReady(true);
        clearInterval(checkReady);

        // Fetch network info
        instance.getNetwork()
          .then(setNetwork)
          .catch(setError);
      }
    }, 100);

    return () => clearInterval(checkReady);
  }, [instance]);

  return {
    instance,
    isReady,
    error,
    network
  };
}

/**
 * Hook for encryption operations
 */
export function useEncryption(): UseEncryptionReturn {
  const { instance, isReady } = useFHEVM();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const encrypt = async (
    value: number | bigint | boolean | string,
    type: FHEDataType
  ): Promise<EncryptedValue> => {
    if (!instance || !isReady) {
      throw new Error('FHEVM instance not ready');
    }

    setIsEncrypting(true);
    setError(null);

    try {
      const result = await instance.encrypt(value, type);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Encryption failed');
      setError(error);
      throw error;
    } finally {
      setIsEncrypting(false);
    }
  };

  return {
    encrypt,
    isEncrypting,
    error
  };
}

/**
 * Hook for decryption operations
 */
export function useDecryption(): UseDecryptionReturn {
  const { instance, isReady } = useFHEVM();
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const decrypt = async (
    handle: EncryptedHandle,
    type: FHEDataType
  ): Promise<number | bigint | boolean | string> => {
    if (!instance || !isReady) {
      throw new Error('FHEVM instance not ready');
    }

    setIsDecrypting(true);
    setError(null);

    try {
      const result = await instance.decrypt(handle, type);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Decryption failed');
      setError(error);
      throw error;
    } finally {
      setIsDecrypting(false);
    }
  };

  return {
    decrypt,
    isDecrypting,
    error
  };
}

/**
 * Hook for contract interaction
 */
export function useContract(address: string, abi: any): UseContractReturn {
  const { instance, isReady } = useFHEVM();
  const [contract, setContract] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (instance && isReady && address && abi) {
      try {
        const contractInstance = instance.getContract(address, abi);
        setContract(contractInstance);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to create contract instance'));
      }
    }
  }, [instance, isReady, address, abi]);

  const read = async (functionName: string, args: Array<any> = []): Promise<any> => {
    if (!contract) {
      throw new Error('Contract not initialized');
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await contract.read(functionName, args);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Contract read failed');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const write = async (
    functionName: string,
    args: Array<any> = [],
    options: ContractCallOptions = {}
  ): Promise<any> => {
    if (!contract) {
      throw new Error('Contract not initialized');
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await contract.write(functionName, args, options);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Contract write failed');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    contract,
    read,
    write,
    isLoading,
    error
  };
}

/**
 * Hook to watch contract events
 */
export function useContractEvent(
  address: string,
  abi: any,
  eventName: string,
  listener: (...args: Array<any>) => void
): void {
  const { instance, isReady } = useFHEVM();

  useEffect(() => {
    if (!instance || !isReady || !address || !abi) return;

    const contract = instance.getContract(address, abi);
    contract.on(eventName, listener);

    return () => {
      contract.off(eventName, listener);
    };
  }, [instance, isReady, address, abi, eventName, listener]);
}
