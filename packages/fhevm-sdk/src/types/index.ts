/**
 * Universal FHEVM SDK Type Definitions
 */

import type { ContractInterface, Provider, Signer } from 'ethers';

/**
 * Supported FHE data types
 */
export type FHEDataType = 'ebool' | 'euint8' | 'euint16' | 'euint32' | 'euint64' | 'euint128' | 'euint256' | 'eaddress';

/**
 * Network configuration
 */
export type Network = 'sepolia' | 'mainnet' | 'localhost' | 'zama';

/**
 * FHEVM SDK Configuration
 */
export interface FHEVMConfig {
  /**
   * Network to connect to
   */
  network?: Network;

  /**
   * Custom RPC URL (overrides network)
   */
  rpcUrl?: string;

  /**
   * Zama Gateway URL for decryption
   */
  gatewayUrl?: string;

  /**
   * Contract address
   */
  contractAddress?: string;

  /**
   * Contract ABI
   */
  abi?: ContractInterface;

  /**
   * Custom provider (overrides network and rpcUrl)
   */
  provider?: Provider;

  /**
   * Signer for transactions
   */
  signer?: Signer;

  /**
   * Chain ID
   */
  chainId?: number;

  /**
   * Enable debug logging
   */
  debug?: boolean;
}

/**
 * Encrypted value handle returned by the blockchain
 */
export interface EncryptedHandle {
  data: Uint8Array;
  type: FHEDataType;
}

/**
 * Encryption result
 */
export interface EncryptedValue {
  handles: Uint8Array;
  inputProof: string;
}

/**
 * Decryption request
 */
export interface DecryptionRequest {
  handle: EncryptedHandle;
  contractAddress: string;
  userAddress: string;
}

/**
 * Contract interaction options
 */
export interface ContractCallOptions {
  gasLimit?: bigint;
  gasPrice?: bigint;
  value?: bigint;
  nonce?: number;
}

/**
 * Transaction receipt with decryption
 */
export interface FHEVMTransactionReceipt {
  hash: string;
  blockNumber: number;
  status: number;
  gasUsed: bigint;
  logs: Array<any>;
}

/**
 * FHEVM Instance interface
 */
export interface FHEVMInstance {
  /**
   * Encrypt a value
   */
  encrypt(value: number | bigint | boolean | string, type: FHEDataType): Promise<EncryptedValue>;

  /**
   * Decrypt a handle
   */
  decrypt(handle: EncryptedHandle, type: FHEDataType): Promise<number | bigint | boolean | string>;

  /**
   * Get contract instance
   */
  getContract(address: string, abi: ContractInterface): FHEVMContract;

  /**
   * Check if instance is ready
   */
  isReady(): boolean;

  /**
   * Get network information
   */
  getNetwork(): Promise<NetworkInfo>;
}

/**
 * FHEVM Contract interface
 */
export interface FHEVMContract {
  /**
   * Call a read-only function
   */
  read(functionName: string, args?: Array<any>): Promise<any>;

  /**
   * Call a state-changing function
   */
  write(functionName: string, args?: Array<any>, options?: ContractCallOptions): Promise<FHEVMTransactionReceipt>;

  /**
   * Listen to contract events
   */
  on(eventName: string, listener: (...args: Array<any>) => void): void;

  /**
   * Remove event listener
   */
  off(eventName: string, listener: (...args: Array<any>) => void): void;

  /**
   * Get contract address
   */
  address: string;
}

/**
 * Network information
 */
export interface NetworkInfo {
  chainId: number;
  name: string;
  ensAddress?: string;
}

/**
 * React hook return types
 */
export interface UseFHEVMReturn {
  instance: FHEVMInstance | null;
  isReady: boolean;
  error: Error | null;
  network: NetworkInfo | null;
}

export interface UseEncryptionReturn {
  encrypt: (value: number | bigint | boolean | string, type: FHEDataType) => Promise<EncryptedValue>;
  isEncrypting: boolean;
  error: Error | null;
}

export interface UseDecryptionReturn {
  decrypt: (handle: EncryptedHandle, type: FHEDataType) => Promise<number | bigint | boolean | string>;
  isDecrypting: boolean;
  error: Error | null;
}

export interface UseContractReturn {
  contract: FHEVMContract | null;
  read: (functionName: string, args?: Array<any>) => Promise<any>;
  write: (functionName: string, args?: Array<any>, options?: ContractCallOptions) => Promise<FHEVMTransactionReceipt>;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Vue composable return types
 */
export interface VueUseFHEVMReturn {
  instance: { value: FHEVMInstance | null };
  isReady: { value: boolean };
  error: { value: Error | null };
  network: { value: NetworkInfo | null };
}
