/**
 * FHE Type Definitions
 * Additional type definitions for FHE operations
 */

export type {
  FHEDataType,
  EncryptedValue,
  EncryptedHandle,
  DecryptionRequest,
  DecryptionResult,
  FHEOperation,
  NetworkInfo,
  APIResponse,
} from '../lib/fhe/types';

export interface FHEConfig {
  network: 'sepolia' | 'mainnet' | 'localhost';
  gatewayUrl: string;
  contractAddress?: string;
}

export interface FHEStatus {
  ready: boolean;
  network?: NetworkInfo;
  error?: Error;
}
