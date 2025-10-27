/**
 * Encryption Utilities
 * Helper functions for FHE encryption operations
 */

import type { FHEDataType, EncryptedValue } from '../types';

/**
 * Validate encryption input
 */
export function validateEncryptionInput(
  value: number | bigint | boolean | string,
  type: FHEDataType
): void {
  switch (type) {
    case 'ebool':
      if (typeof value !== 'boolean' && value !== 0 && value !== 1) {
        throw new Error('Value must be boolean for ebool type');
      }
      break;

    case 'euint8':
      const uint8Value = Number(value);
      if (uint8Value < 0 || uint8Value > 255) {
        throw new Error('Value must be between 0 and 255 for euint8 type');
      }
      break;

    case 'euint16':
      const uint16Value = Number(value);
      if (uint16Value < 0 || uint16Value > 65535) {
        throw new Error('Value must be between 0 and 65535 for euint16 type');
      }
      break;

    case 'euint32':
      const uint32Value = Number(value);
      if (uint32Value < 0 || uint32Value > 4294967295) {
        throw new Error('Value must be between 0 and 4294967295 for euint32 type');
      }
      break;

    case 'euint64':
    case 'euint128':
    case 'euint256':
      if (typeof value !== 'bigint' && typeof value !== 'number') {
        throw new Error(`Value must be a number or bigint for ${type} type`);
      }
      break;

    case 'eaddress':
      if (typeof value !== 'string' || !value.match(/^0x[a-fA-F0-9]{40}$/)) {
        throw new Error('Value must be a valid Ethereum address for eaddress type');
      }
      break;

    default:
      throw new Error(`Unsupported type: ${type}`);
  }
}

/**
 * Convert value to appropriate format for encryption
 */
export function normalizeEncryptionValue(
  value: number | bigint | boolean | string,
  type: FHEDataType
): number | bigint | boolean | string {
  switch (type) {
    case 'ebool':
      return Boolean(value);

    case 'euint8':
    case 'euint16':
    case 'euint32':
      return Number(value);

    case 'euint64':
    case 'euint128':
    case 'euint256':
      return typeof value === 'bigint' ? value : BigInt(value);

    case 'eaddress':
      return value as string;

    default:
      throw new Error(`Unsupported type: ${type}`);
  }
}

/**
 * Get size in bits for a given data type
 */
export function getTypeSizeInBits(type: FHEDataType): number {
  switch (type) {
    case 'ebool':
      return 1;
    case 'euint8':
      return 8;
    case 'euint16':
      return 16;
    case 'euint32':
      return 32;
    case 'euint64':
      return 64;
    case 'euint128':
      return 128;
    case 'euint256':
      return 256;
    case 'eaddress':
      return 160;
    default:
      throw new Error(`Unsupported type: ${type}`);
  }
}

/**
 * Check if a type is supported
 */
export function isSupportedType(type: string): type is FHEDataType {
  const supportedTypes: FHEDataType[] = [
    'ebool',
    'euint8',
    'euint16',
    'euint32',
    'euint64',
    'euint128',
    'euint256',
    'eaddress'
  ];
  return supportedTypes.includes(type as FHEDataType);
}

/**
 * Format encrypted value for display
 */
export function formatEncryptedValue(encrypted: EncryptedValue): string {
  return `0x${Buffer.from(encrypted.handles).toString('hex')}`;
}
