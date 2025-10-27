/**
 * API Type Definitions
 * Type definitions for API requests and responses
 */

import type { FHEDataType } from './fhe';

export interface EncryptRequest {
  value: number | bigint | boolean | string;
  type: FHEDataType;
  contractAddress?: string;
}

export interface EncryptResponse {
  success: boolean;
  encrypted?: {
    data: string;
    type: FHEDataType;
    handle?: string;
  };
  metadata?: {
    originalType: FHEDataType;
    timestamp: number;
  };
  error?: string;
}

export interface DecryptRequest {
  handle: string;
  type: FHEDataType;
  contractAddress: string;
  userAddress?: string;
}

export interface DecryptResponse {
  success: boolean;
  decrypted?: {
    value: number | bigint | boolean | string;
    type: FHEDataType;
    handle: string;
  };
  metadata?: {
    timestamp: number;
  };
  error?: string;
  details?: string;
}

export interface ComputeRequest {
  operation: string;
  operands: any[];
  contractAddress: string;
  abi: any[];
}

export interface ComputeResponse {
  success: boolean;
  result?: {
    operation: string;
    transactionHash: string;
    blockNumber?: number;
  };
  metadata?: {
    timestamp: number;
  };
  error?: string;
}

export interface KeysResponse {
  success: boolean;
  publicKey?: string;
  keyType?: string;
  usage?: string;
  network?: any;
  description?: string;
  error?: string;
}
