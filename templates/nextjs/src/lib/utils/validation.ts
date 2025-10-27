/**
 * Validation Utilities
 * Input validation helper functions
 */

/**
 * Validate Ethereum address format
 */
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate transaction hash
 */
export function isValidTxHash(hash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
}

/**
 * Validate FHE data type
 */
export function isValidFHEType(type: string): boolean {
  const validTypes = [
    'ebool',
    'euint4',
    'euint8',
    'euint16',
    'euint32',
    'euint64',
    'euint128',
    'eaddress',
  ];
  return validTypes.includes(type);
}

/**
 * Validate value for FHE type
 */
export function validateValueForType(
  value: any,
  type: string
): { valid: boolean; error?: string } {
  switch (type) {
    case 'ebool':
      if (typeof value !== 'boolean') {
        return { valid: false, error: 'Value must be a boolean' };
      }
      break;

    case 'euint4':
      if (typeof value !== 'number' || value < 0 || value > 15) {
        return { valid: false, error: 'Value must be between 0 and 15' };
      }
      break;

    case 'euint8':
      if (typeof value !== 'number' || value < 0 || value > 255) {
        return { valid: false, error: 'Value must be between 0 and 255' };
      }
      break;

    case 'euint16':
      if (typeof value !== 'number' || value < 0 || value > 65535) {
        return { valid: false, error: 'Value must be between 0 and 65535' };
      }
      break;

    case 'euint32':
      if (typeof value !== 'number' || value < 0 || value > 4294967295) {
        return { valid: false, error: 'Value must be between 0 and 4294967295' };
      }
      break;

    case 'euint64':
    case 'euint128':
      if (typeof value !== 'bigint' && typeof value !== 'number') {
        return { valid: false, error: 'Value must be a number or bigint' };
      }
      if (value < 0) {
        return { valid: false, error: 'Value must be non-negative' };
      }
      break;

    case 'eaddress':
      if (typeof value !== 'string' || !isValidEthereumAddress(value)) {
        return { valid: false, error: 'Value must be a valid Ethereum address' };
      }
      break;

    default:
      return { valid: false, error: `Unknown FHE type: ${type}` };
  }

  return { valid: true };
}

/**
 * Validate API response
 */
export function isValidAPIResponse(response: any): boolean {
  return (
    response &&
    typeof response === 'object' &&
    typeof response.success === 'boolean'
  );
}
