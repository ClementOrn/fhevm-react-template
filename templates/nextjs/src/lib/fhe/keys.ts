/**
 * FHE Key Management
 * Utilities for managing FHE keys
 */

/**
 * Generate EIP-712 signature structure for decryption
 */
export function generateDecryptionSignature(
  userAddress: string,
  contractAddress: string,
  handle: string,
  chainId: number = 11155111 // Sepolia by default
) {
  return {
    domain: {
      name: 'FHEVM',
      version: '1',
      chainId,
      verifyingContract: contractAddress,
    },
    types: {
      Decrypt: [
        { name: 'account', type: 'address' },
        { name: 'handle', type: 'bytes32' },
      ],
    },
    primaryType: 'Decrypt' as const,
    message: {
      account: userAddress,
      handle,
    },
  };
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate encrypted handle format
 */
export function isValidHandle(handle: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(handle);
}

/**
 * Format public key for display
 */
export function formatPublicKey(publicKey: string, length: number = 20): string {
  if (publicKey.length <= length * 2) {
    return publicKey;
  }
  return `${publicKey.slice(0, length)}...${publicKey.slice(-length)}`;
}
