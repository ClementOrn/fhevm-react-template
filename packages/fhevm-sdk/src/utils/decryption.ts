/**
 * Decryption Utilities
 * Helper functions for FHE decryption operations
 */

import type { FHEDataType, EncryptedHandle } from '../types';

/**
 * Validate decryption request
 */
export function validateDecryptionRequest(
  handle: EncryptedHandle,
  type: FHEDataType,
  contractAddress?: string
): void {
  if (!handle || !handle.data) {
    throw new Error('Invalid encrypted handle');
  }

  if (!type) {
    throw new Error('Data type is required for decryption');
  }

  if (contractAddress && !isValidAddress(contractAddress)) {
    throw new Error('Invalid contract address');
  }
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Parse decryption result based on type
 */
export function parseDecryptionResult(
  result: any,
  type: FHEDataType
): number | bigint | boolean | string {
  switch (type) {
    case 'ebool':
      return Boolean(result);

    case 'euint8':
    case 'euint16':
    case 'euint32':
      return Number(result);

    case 'euint64':
    case 'euint128':
    case 'euint256':
      return BigInt(result);

    case 'eaddress':
      return String(result);

    default:
      throw new Error(`Unsupported type for decryption: ${type}`);
  }
}

/**
 * Create EIP-712 signature for decryption authorization
 */
export function createDecryptionSignature(
  handle: EncryptedHandle,
  contractAddress: string,
  userAddress: string
): {
  domain: any;
  types: any;
  value: any;
} {
  const domain = {
    name: 'FHEVM Decryption',
    version: '1',
    chainId: 11155111, // Sepolia
    verifyingContract: contractAddress
  };

  const types = {
    DecryptionRequest: [
      { name: 'handle', type: 'bytes32' },
      { name: 'user', type: 'address' }
    ]
  };

  const value = {
    handle: handle.data,
    user: userAddress
  };

  return { domain, types, value };
}

/**
 * Format handle for gateway request
 */
export function formatHandleForGateway(handle: EncryptedHandle): string {
  if (handle.data instanceof Uint8Array) {
    return `0x${Buffer.from(handle.data).toString('hex')}`;
  }
  return String(handle.data);
}

/**
 * Check if decryption is authorized
 */
export function isDecryptionAuthorized(
  userAddress: string,
  requiredAddress: string
): boolean {
  return userAddress.toLowerCase() === requiredAddress.toLowerCase();
}

/**
 * Get decryption error message
 */
export function getDecryptionErrorMessage(error: any): string {
  if (error.message?.includes('unauthorized')) {
    return 'User is not authorized to decrypt this value';
  }
  if (error.message?.includes('invalid handle')) {
    return 'Invalid encrypted handle provided';
  }
  if (error.message?.includes('gateway')) {
    return 'Gateway decryption service is unavailable';
  }
  return error.message || 'Decryption failed';
}
