/**
 * FHE Encryption API Route
 * Handles client-side encryption requests
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
    const { value, type = 'euint32', contractAddress } = body;

    if (value === undefined || value === null) {
      return NextResponse.json(
        { success: false, error: 'Value is required' },
        { status: 400 }
      );
    }

    // Encrypt the value
    const encrypted = await fhevmClient.encrypt(value, type, contractAddress);

    return NextResponse.json({
      success: true,
      encrypted: {
        data: encrypted.data,
        type: encrypted.type,
        handle: encrypted.handle
      },
      metadata: {
        originalType: type,
        timestamp: Date.now()
      }
    });
  } catch (error) {
    console.error('Encryption error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Encryption failed'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    supportedTypes: [
      'ebool',
      'euint4',
      'euint8',
      'euint16',
      'euint32',
      'euint64',
      'euint128',
      'eaddress'
    ],
    description: 'FHE Encryption endpoint. POST with { value, type, contractAddress }'
  });
}
