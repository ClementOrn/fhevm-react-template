/**
 * Core FHEVM Client Implementation
 */

import { createInstance, FhevmInstance, getPublicKey, initFhevm } from 'fhevmjs';
import { ethers, Contract, Provider, Signer } from 'ethers';
import type {
  FHEVMConfig,
  FHEVMInstance,
  FHEVMContract,
  FHEDataType,
  EncryptedValue,
  EncryptedHandle,
  NetworkInfo,
  ContractCallOptions,
  FHEVMTransactionReceipt
} from '../types';

/**
 * Network configurations
 */
const NETWORKS: Record<string, { rpcUrl: string; chainId: number; gatewayUrl: string }> = {
  sepolia: {
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
    chainId: 11155111,
    gatewayUrl: 'https://gateway.sepolia.zama.ai'
  },
  localhost: {
    rpcUrl: 'http://127.0.0.1:8545',
    chainId: 31337,
    gatewayUrl: 'http://localhost:8080'
  },
  zama: {
    rpcUrl: 'https://devnet.zama.ai/',
    chainId: 8009,
    gatewayUrl: 'https://gateway.zama.ai'
  }
};

/**
 * FHEVM Client - Core implementation
 */
export class FHEVMClient implements FHEVMInstance {
  private instance: FhevmInstance | null = null;
  private provider: Provider;
  private signer: Signer | null;
  private config: Required<Omit<FHEVMConfig, 'provider' | 'signer' | 'contractAddress' | 'abi'>>;
  private ready = false;

  constructor(config: FHEVMConfig = {}) {
    const networkConfig = config.network ? NETWORKS[config.network] : null;

    this.config = {
      network: config.network || 'localhost',
      rpcUrl: config.rpcUrl || networkConfig?.rpcUrl || 'http://127.0.0.1:8545',
      gatewayUrl: config.gatewayUrl || networkConfig?.gatewayUrl || 'http://localhost:8080',
      chainId: config.chainId || networkConfig?.chainId || 31337,
      debug: config.debug || false
    };

    // Initialize provider
    this.provider = config.provider || new ethers.JsonRpcProvider(this.config.rpcUrl);
    this.signer = config.signer || null;

    // Initialize FHEVM
    this.initialize();
  }

  /**
   * Initialize FHEVM instance
   */
  private async initialize(): Promise<void> {
    try {
      if (this.config.debug) {
        console.log('[FHEVM] Initializing with config:', this.config);
      }

      // Initialize fhevmjs
      await initFhevm();

      // Create instance with public key from gateway
      const publicKey = await this.getPublicKeyFromGateway();

      this.instance = await createInstance({
        chainId: this.config.chainId,
        publicKey
      });

      this.ready = true;

      if (this.config.debug) {
        console.log('[FHEVM] Initialized successfully');
      }
    } catch (error) {
      console.error('[FHEVM] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Get public key from gateway
   */
  private async getPublicKeyFromGateway(): Promise<string> {
    try {
      const response = await fetch(`${this.config.gatewayUrl}/publicKey`);
      if (!response.ok) {
        throw new Error(`Failed to fetch public key: ${response.statusText}`);
      }
      const data = await response.json();
      return data.publicKey || getPublicKey(this.config.chainId);
    } catch (error) {
      console.warn('[FHEVM] Using fallback public key');
      return getPublicKey(this.config.chainId);
    }
  }

  /**
   * Wait for instance to be ready
   */
  private async waitForReady(): Promise<void> {
    if (this.ready) return;

    return new Promise((resolve) => {
      const check = setInterval(() => {
        if (this.ready) {
          clearInterval(check);
          resolve();
        }
      }, 100);
    });
  }

  /**
   * Encrypt a value
   */
  async encrypt(
    value: number | bigint | boolean | string,
    type: FHEDataType
  ): Promise<EncryptedValue> {
    await this.waitForReady();

    if (!this.instance) {
      throw new Error('FHEVM instance not initialized');
    }

    try {
      let numValue: number | bigint;

      // Convert value based on type
      if (type === 'ebool') {
        numValue = value ? 1 : 0;
      } else if (type === 'eaddress') {
        numValue = BigInt(value as string);
      } else {
        numValue = typeof value === 'bigint' ? value : Number(value);
      }

      // Create encrypted input
      const input = this.instance.createEncryptedInput('0x0000000000000000000000000000000000000000', this.signer?.address || '0x0000000000000000000000000000000000000000');

      // Add value based on type
      switch (type) {
        case 'ebool':
          input.addBool(Boolean(numValue));
          break;
        case 'euint8':
          input.add8(Number(numValue));
          break;
        case 'euint16':
          input.add16(Number(numValue));
          break;
        case 'euint32':
          input.add32(Number(numValue));
          break;
        case 'euint64':
          input.add64(BigInt(numValue));
          break;
        case 'euint128':
          input.add128(BigInt(numValue));
          break;
        case 'euint256':
          input.add256(BigInt(numValue));
          break;
        case 'eaddress':
          input.addAddress(value as string);
          break;
        default:
          throw new Error(`Unsupported type: ${type}`);
      }

      const encryptedInput = input.encrypt();

      return {
        handles: encryptedInput.handles[0],
        inputProof: encryptedInput.inputProof
      };
    } catch (error) {
      console.error('[FHEVM] Encryption failed:', error);
      throw error;
    }
  }

  /**
   * Decrypt a handle
   */
  async decrypt(
    handle: EncryptedHandle,
    type: FHEDataType
  ): Promise<number | bigint | boolean | string> {
    await this.waitForReady();

    try {
      const response = await fetch(`${this.config.gatewayUrl}/decrypt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          handle: ethers.hexlify(handle.data),
          type
        })
      });

      if (!response.ok) {
        throw new Error(`Decryption failed: ${response.statusText}`);
      }

      const result = await response.json();

      // Convert result based on type
      if (type === 'ebool') {
        return Boolean(result.value);
      } else if (type === 'eaddress') {
        return result.value as string;
      } else if (type.includes('128') || type.includes('256')) {
        return BigInt(result.value);
      } else {
        return Number(result.value);
      }
    } catch (error) {
      console.error('[FHEVM] Decryption failed:', error);
      throw error;
    }
  }

  /**
   * Get contract instance
   */
  getContract(address: string, abi: any): FHEVMContract {
    const contract = new Contract(
      address,
      abi,
      this.signer || this.provider
    );

    return new FHEVMContractWrapper(contract, this);
  }

  /**
   * Check if instance is ready
   */
  isReady(): boolean {
    return this.ready;
  }

  /**
   * Get network information
   */
  async getNetwork(): Promise<NetworkInfo> {
    const network = await this.provider.getNetwork();
    return {
      chainId: Number(network.chainId),
      name: network.name
    };
  }

  /**
   * Set signer
   */
  setSigner(signer: Signer): void {
    this.signer = signer;
  }

  /**
   * Get provider
   */
  getProvider(): Provider {
    return this.provider;
  }
}

/**
 * FHEVM Contract Wrapper
 */
class FHEVMContractWrapper implements FHEVMContract {
  constructor(
    private contract: Contract,
    private client: FHEVMClient
  ) {}

  get address(): string {
    return this.contract.target as string;
  }

  async read(functionName: string, args: Array<any> = []): Promise<any> {
    try {
      return await this.contract[functionName](...args);
    } catch (error) {
      console.error(`[FHEVM] Contract read failed (${functionName}):`, error);
      throw error;
    }
  }

  async write(
    functionName: string,
    args: Array<any> = [],
    options: ContractCallOptions = {}
  ): Promise<FHEVMTransactionReceipt> {
    try {
      const tx = await this.contract[functionName](...args, {
        gasLimit: options.gasLimit,
        gasPrice: options.gasPrice,
        value: options.value,
        nonce: options.nonce
      });

      const receipt = await tx.wait();

      return {
        hash: receipt.hash,
        blockNumber: receipt.blockNumber,
        status: receipt.status,
        gasUsed: receipt.gasUsed,
        logs: receipt.logs
      };
    } catch (error) {
      console.error(`[FHEVM] Contract write failed (${functionName}):`, error);
      throw error;
    }
  }

  on(eventName: string, listener: (...args: Array<any>) => void): void {
    this.contract.on(eventName, listener);
  }

  off(eventName: string, listener: (...args: Array<any>) => void): void {
    this.contract.off(eventName, listener);
  }
}

/**
 * Create FHEVM instance
 */
export function createFHEVM(config: FHEVMConfig = {}): FHEVMClient {
  return new FHEVMClient(config);
}
