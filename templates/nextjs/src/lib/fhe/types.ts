/**
 * FHE Type Definitions
 * Type definitions for FHE operations
 */

export type FHEDataType =
  | 'ebool'
  | 'euint4'
  | 'euint8'
  | 'euint16'
  | 'euint32'
  | 'euint64'
  | 'euint128'
  | 'eaddress';

export interface EncryptedValue {
  data: string;
  type: FHEDataType;
  handle?: string;
}

export interface EncryptedHandle {
  handle: string;
  type: FHEDataType;
}

export interface DecryptionRequest {
  handle: string;
  type: FHEDataType;
  contractAddress: string;
  userAddress?: string;
}

export interface DecryptionResult {
  value: number | bigint | boolean | string;
  type: FHEDataType;
  handle: string;
}

export interface FHEOperation {
  operation: 'add' | 'subtract' | 'multiply' | 'compare';
  operands: string[];
  contractAddress: string;
}

export interface NetworkInfo {
  chainId: number;
  name: string;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
