/**
 * FHE Decryption API Route
 * Handles decryption requests through the gateway
 */

import { NextRequest, NextResponse } from 'next/server';
import { FHEVMClient } from '@fhevm/universal-sdk';

const fhevmClient = new FHEVMClient({
  network: process.env.NEXT_PUBLIC_NETWORK || 'sepolia',
  gatewayUrl: process.env.NEXT_PUBLIC_GATEWAY_URL || 'https://gateway.sepolia.zama.ai',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { handle, type = 'euint32', contractAddress, userAddress } = body;

    if (!handle) {
      return NextResponse.json(
        { success: false, error: 'Encrypted handle is required' },
        { status: 400 }
      );
    }

    if (!contractAddress) {
      return NextResponse.json(
        { success: false, error: 'Contract address is required' },
        { status: 400 }
      );
    }

    // Request decryption from gateway
    const decrypted = await fhevmClient.decrypt(
      handle,
      type,
      contractAddress,
      userAddress
    );

    return NextResponse.json({
      success: true,
      decrypted: {
        value: decrypted,
        type,
        handle
      },
      metadata: {
        timestamp: Date.now()
      }
    });
  } catch (error) {
    console.error('Decryption error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Decryption failed',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    description: 'FHE Decryption endpoint. POST with { handle, type, contractAddress, userAddress }',
    note: 'Decryption requires proper authorization from the gateway'
  });
}
