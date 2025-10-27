/**
 * FHE Operations API Route
 * Handles general FHE operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { FHEVMClient } from '@fhevm/universal-sdk';

// Initialize FHEVM client
const fhevmClient = new FHEVMClient({
  network: process.env.NEXT_PUBLIC_NETWORK || 'sepolia',
  gatewayUrl: process.env.NEXT_PUBLIC_GATEWAY_URL || 'https://gateway.sepolia.zama.ai',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operation, data } = body;

    switch (operation) {
      case 'initialize':
        // Initialize FHEVM instance
        const isReady = fhevmClient.isReady();
        return NextResponse.json({
          success: true,
          ready: isReady,
          message: 'FHEVM client initialized'
        });

      case 'getPublicKey':
        // Get public key for encryption
        const publicKey = await fhevmClient.getPublicKey();
        return NextResponse.json({
          success: true,
          publicKey
        });

      case 'getNetwork':
        // Get network information
        const network = await fhevmClient.getNetwork();
        return NextResponse.json({
          success: true,
          network
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid operation' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('FHE operation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const isReady = fhevmClient.isReady();
    const network = await fhevmClient.getNetwork();

    return NextResponse.json({
      success: true,
      status: {
        ready: isReady,
        network
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
