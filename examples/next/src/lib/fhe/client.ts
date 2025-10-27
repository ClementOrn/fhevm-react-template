/**
 * FHE Client Operations
 * Client-side FHE operations and utilities
 */

import { FHEVMClient } from '@fhevm/universal-sdk';

let fhevmInstance: FHEVMClient | null = null;

/**
 * Initialize FHEVM client
 */
export async function initializeFHEVM(): Promise<FHEVMClient> {
  if (fhevmInstance && fhevmInstance.isReady()) {
    return fhevmInstance;
  }

  fhevmInstance = new FHEVMClient({
    network: (process.env.NEXT_PUBLIC_NETWORK as any) || 'sepolia',
    gatewayUrl: process.env.NEXT_PUBLIC_GATEWAY_URL || 'https://gateway.sepolia.zama.ai',
  });

  // Wait for initialization
  while (!fhevmInstance.isReady()) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return fhevmInstance;
}

/**
 * Get FHEVM instance
 */
export function getFHEVMInstance(): FHEVMClient | null {
  return fhevmInstance;
}

/**
 * Encrypt value client-side
 */
export async function encryptValue(
  value: number | bigint | boolean | string,
  type: string,
  contractAddress?: string
): Promise<any> {
  const instance = await initializeFHEVM();
  return instance.encrypt(value, type, contractAddress);
}

/**
 * Request decryption from gateway
 */
export async function decryptValue(
  handle: string,
  type: string,
  contractAddress: string,
  userAddress?: string
): Promise<number | bigint | boolean | string> {
  const instance = await initializeFHEVM();
  return instance.decrypt(handle, type, contractAddress, userAddress);
}

/**
 * Get public key for encryption
 */
export async function getPublicKey(): Promise<string> {
  const instance = await initializeFHEVM();
  return instance.getPublicKey();
}
