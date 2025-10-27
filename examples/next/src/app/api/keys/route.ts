/**
 * Key Management API Route
 * Handles FHE key operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { FHEVMClient } from '@fhevm/universal-sdk';

const fhevmClient = new FHEVMClient({
  network: process.env.NEXT_PUBLIC_NETWORK || 'sepolia',
  gatewayUrl: process.env.NEXT_PUBLIC_GATEWAY_URL || 'https://gateway.sepolia.zama.ai',
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const operation = searchParams.get('operation');

    switch (operation) {
      case 'publicKey':
        // Get FHE public key
        const publicKey = await fhevmClient.getPublicKey();
        return NextResponse.json({
          success: true,
          publicKey,
          keyType: 'FHE Public Key',
          usage: 'Used for client-side encryption'
        });

      case 'networkKeys':
        // Get network-specific keys
        const network = await fhevmClient.getNetwork();
        return NextResponse.json({
          success: true,
          network,
          description: 'Network key information'
        });

      default:
        return NextResponse.json({
          success: true,
          availableOperations: ['publicKey', 'networkKeys'],
          description: 'Key management endpoint',
          usage: 'GET /api/keys?operation={operation}'
        });
    }
  } catch (error) {
    console.error('Key operation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Key operation failed'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operation, data } = body;

    switch (operation) {
      case 'generateEIP712Signature':
        // Generate EIP-712 signature for decryption
        if (!data?.userAddress || !data?.contractAddress) {
          return NextResponse.json(
            {
              success: false,
              error: 'userAddress and contractAddress are required'
            },
            { status: 400 }
          );
        }

        // This would typically use the user's wallet to sign
        // For demo purposes, we return the structure
        return NextResponse.json({
          success: true,
          signatureStructure: {
            domain: {
              name: 'FHEVM',
              version: '1',
              chainId: 11155111, // Sepolia
              verifyingContract: data.contractAddress
            },
            types: {
              Decrypt: [
                { name: 'account', type: 'address' },
                { name: 'handle', type: 'bytes32' }
              ]
            },
            primaryType: 'Decrypt',
            message: {
              account: data.userAddress,
              handle: data.handle || '0x'
            }
          },
          note: 'Sign this with the user wallet to authorize decryption'
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid operation'
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Key operation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Key operation failed'
      },
      { status: 500 }
    );
  }
}
