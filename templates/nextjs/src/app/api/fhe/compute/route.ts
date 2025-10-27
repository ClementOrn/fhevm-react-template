/**
 * FHE Homomorphic Computation API Route
 * Demonstrates server-side computation on encrypted data
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
    const { operation, operands, contractAddress, abi } = body;

    if (!operation || !operands || !Array.isArray(operands)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Operation and operands array are required'
        },
        { status: 400 }
      );
    }

    if (!contractAddress || !abi) {
      return NextResponse.json(
        {
          success: false,
          error: 'Contract address and ABI are required'
        },
        { status: 400 }
      );
    }

    // Get contract instance
    const contract = fhevmClient.getContract(contractAddress, abi);

    // Perform homomorphic operation
    let result;
    switch (operation) {
      case 'add':
        result = await contract.write('add', operands);
        break;
      case 'subtract':
        result = await contract.write('subtract', operands);
        break;
      case 'multiply':
        result = await contract.write('multiply', operands);
        break;
      case 'compare':
        result = await contract.write('compare', operands);
        break;
      default:
        return NextResponse.json(
          {
            success: false,
            error: `Unsupported operation: ${operation}`
          },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      result: {
        operation,
        transactionHash: result.hash,
        blockNumber: result.blockNumber
      },
      metadata: {
        timestamp: Date.now()
      }
    });
  } catch (error) {
    console.error('Computation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Computation failed'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    supportedOperations: ['add', 'subtract', 'multiply', 'compare'],
    description: 'FHE Computation endpoint. POST with { operation, operands, contractAddress, abi }',
    example: {
      operation: 'add',
      operands: ['0x1234...', '0x5678...'],
      contractAddress: '0xabc...',
      abi: []
    }
  });
}
