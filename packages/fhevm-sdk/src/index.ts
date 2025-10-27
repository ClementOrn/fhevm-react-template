/**
 * Universal FHEVM SDK
 *
 * A framework-agnostic SDK for building privacy-preserving applications
 * with Zama's Fully Homomorphic Encryption (FHE) technology.
 */

// Core exports
export { FHEVMClient, createFHEVM } from './core/client';

// Type exports
export type {
  FHEVMConfig,
  FHEVMInstance,
  FHEVMContract,
  FHEDataType,
  EncryptedValue,
  EncryptedHandle,
  NetworkInfo,
  ContractCallOptions,
  FHEVMTransactionReceipt,
  Network
} from './types';

// Utils exports
export * from './utils';

// Version
export const VERSION = '1.0.0';
