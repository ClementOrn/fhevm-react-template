# Universal FHEVM SDK

A framework-agnostic SDK for building privacy-preserving applications with Zama's Fully Homomorphic Encryption (FHE) technology.

## Features

- **Framework Agnostic**: Works with React, Vue, vanilla JavaScript, and Node.js
- **Type Safe**: Full TypeScript support with comprehensive type definitions
- **Easy Integration**: Simple API for encryption, decryption, and smart contract interaction
- **React Hooks**: Built-in hooks for seamless React integration
- **Vue Composables**: Native Vue 3 composable support
- **Gateway Integration**: Automatic decryption through Zama's gateway service
- **Multiple Networks**: Support for Sepolia, mainnet, and custom networks

## Installation

```bash
npm install @fhevm/universal-sdk
# or
yarn add @fhevm/universal-sdk
# or
pnpm add @fhevm/universal-sdk
```

## Quick Start

### Vanilla JavaScript / TypeScript

```typescript
import { createFHEVM } from '@fhevm/universal-sdk';

// Initialize SDK
const fhevm = createFHEVM({
  network: 'sepolia',
  gatewayUrl: 'https://gateway.sepolia.zama.ai'
});

// Encrypt a value
const encrypted = await fhevm.encrypt(42, 'euint32');

// Get contract instance
const contract = fhevm.getContract(contractAddress, abi);

// Call contract method
const tx = await contract.write('setValue', [encrypted.handles]);

// Decrypt value
const decrypted = await fhevm.decrypt(
  { data: handle, type: 'euint32' },
  'euint32'
);
```

### React

```tsx
import { FHEVMProvider, useFHEVM, useEncryption } from '@fhevm/universal-sdk/react';

// Wrap your app with provider
function App() {
  return (
    <FHEVMProvider config={{ network: 'sepolia' }}>
      <YourComponent />
    </FHEVMProvider>
  );
}

// Use hooks in components
function YourComponent() {
  const { instance, isReady } = useFHEVM();
  const { encrypt, isEncrypting } = useEncryption();

  const handleEncrypt = async () => {
    const result = await encrypt(100, 'euint32');
    console.log('Encrypted:', result);
  };

  return (
    <div>
      {isReady ? (
        <button onClick={handleEncrypt} disabled={isEncrypting}>
          Encrypt Value
        </button>
      ) : (
        <p>Loading FHEVM...</p>
      )}
    </div>
  );
}
```

### Vue 3

```vue
<script setup>
import { useFHEVM, useEncryption } from '@fhevm/universal-sdk/vue';

const { instance, isReady } = useFHEVM({
  network: 'sepolia',
  gatewayUrl: 'https://gateway.sepolia.zama.ai'
});

const { encrypt, isEncrypting } = useEncryption();

const handleEncrypt = async () => {
  const result = await encrypt(100, 'euint32');
  console.log('Encrypted:', result);
};
</script>

<template>
  <div>
    <button
      v-if="isReady.value"
      @click="handleEncrypt"
      :disabled="isEncrypting.value"
    >
      Encrypt Value
    </button>
    <p v-else>Loading FHEVM...</p>
  </div>
</template>
```

## API Reference

### Core API

#### `createFHEVM(config)`

Creates a new FHEVM client instance.

**Parameters:**
- `config.network`: Network name ('sepolia' | 'mainnet' | 'localhost' | 'zama')
- `config.rpcUrl`: Custom RPC URL (optional)
- `config.gatewayUrl`: Zama gateway URL for decryption
- `config.provider`: Custom ethers provider (optional)
- `config.signer`: Ethers signer for transactions (optional)
- `config.chainId`: Chain ID (optional)
- `config.debug`: Enable debug logging (optional)

**Returns:** `FHEVMClient` instance

#### `FHEVMClient.encrypt(value, type)`

Encrypts a value using FHE.

**Parameters:**
- `value`: Value to encrypt (number | bigint | boolean | string)
- `type`: FHE data type ('ebool' | 'euint8' | 'euint16' | 'euint32' | 'euint64' | 'euint128' | 'euint256' | 'eaddress')

**Returns:** `Promise<EncryptedValue>`

#### `FHEVMClient.decrypt(handle, type)`

Decrypts an encrypted handle through the gateway.

**Parameters:**
- `handle`: Encrypted handle from blockchain
- `type`: Original FHE data type

**Returns:** `Promise<number | bigint | boolean | string>`

#### `FHEVMClient.getContract(address, abi)`

Gets a contract instance with FHE support.

**Parameters:**
- `address`: Contract address
- `abi`: Contract ABI

**Returns:** `FHEVMContract`

### React Hooks

#### `useFHEVM()`

Returns the FHEVM instance and status.

**Returns:**
```typescript
{
  instance: FHEVMInstance | null;
  isReady: boolean;
  error: Error | null;
  network: NetworkInfo | null;
}
```

#### `useEncryption()`

Hook for encryption operations.

**Returns:**
```typescript
{
  encrypt: (value: any, type: FHEDataType) => Promise<EncryptedValue>;
  isEncrypting: boolean;
  error: Error | null;
}
```

#### `useContract(address, abi)`

Hook for contract interactions.

**Returns:**
```typescript
{
  contract: FHEVMContract | null;
  read: (functionName: string, args?: any[]) => Promise<any>;
  write: (functionName: string, args?: any[]) => Promise<TransactionReceipt>;
  isLoading: boolean;
  error: Error | null;
}
```

## Supported Data Types

| Type | Description | Range |
|------|-------------|-------|
| `ebool` | Encrypted boolean | true/false |
| `euint8` | Encrypted 8-bit unsigned integer | 0 - 255 |
| `euint16` | Encrypted 16-bit unsigned integer | 0 - 65,535 |
| `euint32` | Encrypted 32-bit unsigned integer | 0 - 4,294,967,295 |
| `euint64` | Encrypted 64-bit unsigned integer | 0 - 2^64-1 |
| `euint128` | Encrypted 128-bit unsigned integer | 0 - 2^128-1 |
| `euint256` | Encrypted 256-bit unsigned integer | 0 - 2^256-1 |
| `eaddress` | Encrypted Ethereum address | 20 bytes |

## Configuration

### Network Options

```typescript
{
  network: 'sepolia',        // Sepolia testnet
  network: 'mainnet',        // Ethereum mainnet
  network: 'localhost',      // Local development
  network: 'zama'           // Zama devnet
}
```

### Custom Network

```typescript
{
  rpcUrl: 'https://custom-rpc.example.com',
  gatewayUrl: 'https://custom-gateway.example.com',
  chainId: 12345
}
```

## Advanced Usage

### Contract Interaction

```typescript
// Get contract instance
const contract = fhevm.getContract(contractAddress, abi);

// Read encrypted value
const encryptedBalance = await contract.read('getBalance', [userAddress]);

// Write with encrypted input
const encrypted = await fhevm.encrypt(1000, 'euint32');
await contract.write('transfer', [recipientAddress, encrypted.handles]);

// Listen to events
contract.on('Transfer', (from, to, amount) => {
  console.log(`Transfer from ${from} to ${to}`);
});
```

### Batch Operations

```typescript
// Encrypt multiple values
const values = [10, 20, 30];
const encrypted = await Promise.all(
  values.map(v => fhevm.encrypt(v, 'euint32'))
);

// Use in contract call
await contract.write('batchTransfer', [recipients, encrypted.map(e => e.handles)]);
```

### Error Handling

```typescript
try {
  const encrypted = await fhevm.encrypt(value, 'euint32');
} catch (error) {
  if (error.message.includes('not ready')) {
    console.error('FHEVM not initialized yet');
  } else if (error.message.includes('invalid value')) {
    console.error('Value out of range for type');
  } else {
    console.error('Encryption failed:', error);
  }
}
```

## Examples

Check out the `examples/` directory for complete working examples:

- **Next.js**: Full-featured Next.js 14 application with App Router
- **PrivateRideShare**: Production-ready privacy-preserving rideshare platform

## Testing

```bash
# Run SDK tests
npm test

# Run with coverage
npm run test:coverage
```

## Development

```bash
# Install dependencies
npm install

# Build SDK
npm run build

# Watch mode
npm run dev

# Lint
npm run lint
```

## Architecture

```
@fhevm/universal-sdk/
├── core/           # Framework-agnostic core logic
│   └── client.ts   # Main FHEVM client
├── react/          # React hooks and providers
│   ├── hooks.tsx
│   └── index.ts
├── vue/            # Vue composables (coming soon)
├── types/          # TypeScript type definitions
│   └── index.ts
└── utils/          # Utility functions
    ├── encryption.ts
    └── decryption.ts
```

## Security Considerations

- **Client-side Encryption**: All encryption happens client-side; plaintext values never leave the user's device
- **Gateway Authorization**: Decryption requires proper authorization through EIP-712 signatures
- **Type Validation**: All inputs are validated before encryption
- **Secure Communication**: All gateway requests use HTTPS

## Browser Compatibility

- Chrome/Edge: ✅ Latest 2 versions
- Firefox: ✅ Latest 2 versions
- Safari: ✅ Latest 2 versions
- Node.js: ✅ 18.x and higher

## License

MIT License - see [LICENSE](../../LICENSE) for details

## Support

- **Documentation**: [https://docs.zama.ai/fhevm](https://docs.zama.ai/fhevm)
- **GitHub Issues**: [Report bugs](https://github.com/fhevm/universal-sdk/issues)
- **Discord**: [Join our community](https://discord.gg/zama)
- **Email**: support@fhevm.io

## Contributing

Contributions are welcome! Please read our [Contributing Guide](../../CONTRIBUTING.md) for details.

## Changelog

See [CHANGELOG.md](../../CHANGELOG.md) for release history.

---

Built with ❤️ by the Zama team
