/**
 * FHE Server Operations
 * Server-side FHE operations (for API routes)
 */

import { FHEVMClient } from '@fhevm/universal-sdk';

/**
 * Create server-side FHEVM client
 */
export function createServerFHEVM(): FHEVMClient {
  return new FHEVMClient({
    network: (process.env.NEXT_PUBLIC_NETWORK as any) || 'sepolia',
    gatewayUrl: process.env.NEXT_PUBLIC_GATEWAY_URL || 'https://gateway.sepolia.zama.ai',
  });
}

/**
 * Verify encrypted data format
 */
export function verifyEncryptedData(data: any): boolean {
  if (!data || typeof data !== 'object') {
    return false;
  }

  return (
    typeof data.data === 'string' &&
    typeof data.type === 'string' &&
    (data.handle === undefined || typeof data.handle === 'string')
  );
}

/**
 * Process homomorphic operation
 */
export async function processHomomorphicOperation(
  operation: string,
  operands: any[],
  contractAddress: string,
  abi: any[]
): Promise<any> {
  const client = createServerFHEVM();
  const contract = client.getContract(contractAddress, abi);

  switch (operation) {
    case 'add':
      return contract.write('add', operands);
    case 'subtract':
      return contract.write('subtract', operands);
    case 'multiply':
      return contract.write('multiply', operands);
    case 'compare':
      return contract.write('compare', operands);
    default:
      throw new Error(`Unsupported operation: ${operation}`);
  }
}
