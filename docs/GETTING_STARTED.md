# Getting Started with Universal FHEVM SDK

This guide will help you get started with the Universal FHEVM SDK in less than 10 minutes.

## Table of Contents

1. [Installation](#installation)
2. [Quick Start](#quick-start)
3. [Framework Integration](#framework-integration)
4. [Basic Usage](#basic-usage)
5. [Advanced Features](#advanced-features)
6. [Troubleshooting](#troubleshooting)

## Installation

### NPM

```bash
npm install @fhevm/universal-sdk
```

### Yarn

```bash
yarn add @fhevm/universal-sdk
```

### PNPM

```bash
pnpm add @fhevm/universal-sdk
```

### CDN (Browser)

```html
<script src="https://unpkg.com/@fhevm/universal-sdk"></script>
```

## Quick Start

### 1. Basic Setup (Vanilla JavaScript/TypeScript)

```typescript
import { createFHEVM } from '@fhevm/universal-sdk'

// Initialize SDK
const fhevm = createFHEVM({
  network: 'sepolia'
})

// Wait for initialization
while (!fhevm.isReady()) {
  await new Promise(resolve => setTimeout(resolve, 100))
}

// Encrypt data
const encrypted = await fhevm.encrypt(42, 'euint32')

// Interact with contract
const contract = fhevm.getContract(
  '0x5986FF19B524534F159af67f421ca081c6F5Acff',
  ABI
)

await contract.write('submitValue', [encrypted.handles])
```

### 2. React/Next.js Setup

```typescript
// app/providers.tsx
'use client'

import { FHEVMProvider } from '@fhevm/universal-sdk/react'

const fhevmConfig = {
  network: 'sepolia',
  gatewayUrl: 'https://gateway.sepolia.zama.ai'
}

export function Providers({ children }) {
  return (
    <FHEVMProvider config={fhevmConfig}>
      {children}
    </FHEVMProvider>
  )
}
```

```typescript
// app/page.tsx
'use client'

import { useFHEVM, useEncryption, useContract } from '@fhevm/universal-sdk/react'

export default function Home() {
  const { instance, isReady } = useFHEVM()
  const { encrypt } = useEncryption()
  const { write } = useContract(CONTRACT_ADDRESS, ABI)

  const handleSubmit = async () => {
    const encrypted = await encrypt(42, 'euint32')
    await write('submitValue', [encrypted.handles])
  }

  return (
    <div>
      {isReady && <button onClick={handleSubmit}>Submit</button>}
    </div>
  )
}
```

### 3. Node.js Backend Setup

```typescript
import { FHEVMClient } from '@fhevm/universal-sdk'
import { ethers } from 'ethers'

// Create provider and signer
const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/YOUR_KEY')
const signer = new ethers.Wallet(PRIVATE_KEY, provider)

// Initialize client
const client = new FHEVMClient({
  provider,
  signer,
  network: 'sepolia'
})

// Encrypt and submit
const encrypted = await client.encrypt(42, 'euint32')
const contract = client.getContract(CONTRACT_ADDRESS, ABI)
await contract.write('submitValue', [encrypted.handles])
```

## Framework Integration

### Next.js App Router

1. **Create providers file** (`app/providers.tsx`):

```typescript
'use client'

import { FHEVMProvider } from '@fhevm/universal-sdk/react'
import { ReactNode } from 'react'

const fhevmConfig = {
  network: 'sepolia',
  gatewayUrl: 'https://gateway.sepolia.zama.ai'
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <FHEVMProvider config={fhevmConfig}>
      {children}
    </FHEVMProvider>
  )
}
```

2. **Wrap your app** (`app/layout.tsx`):

```typescript
import { Providers } from './providers'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
```

3. **Use in components**:

```typescript
'use client'

import { useFHEVM, useEncryption } from '@fhevm/universal-sdk/react'

export default function MyComponent() {
  const { isReady } = useFHEVM()
  const { encrypt, isEncrypting } = useEncryption()

  // Use the hooks...
}
```

### Vue 3

```typescript
// composables/useFHEVM.ts
import { ref, onMounted } from 'vue'
import { createFHEVM } from '@fhevm/universal-sdk'

const instance = createFHEVM({ network: 'sepolia' })
const isReady = ref(false)

onMounted(() => {
  const check = setInterval(() => {
    if (instance.isReady()) {
      isReady.value = true
      clearInterval(check)
    }
  }, 100)
})

export function useFHEVM() {
  return { instance, isReady }
}
```

### React (Create React App)

```typescript
// App.tsx
import { FHEVMProvider } from '@fhevm/universal-sdk/react'

const fhevmConfig = {
  network: 'sepolia'
}

function App() {
  return (
    <FHEVMProvider config={fhevmConfig}>
      <YourComponents />
    </FHEVMProvider>
  )
}
```

## Basic Usage

### Encrypting Data

```typescript
import { useFHEVM, useEncryption } from '@fhevm/universal-sdk/react'

const { encrypt } = useEncryption()

// Encrypt different types
const encBool = await encrypt(true, 'ebool')
const encUint32 = await encrypt(42, 'euint32')
const encUint64 = await encrypt(1000000n, 'euint64')
const encAddress = await encrypt('0x...', 'eaddress')
```

### Decrypting Data

```typescript
import { useDecryption } from '@fhevm/universal-sdk/react'

const { decrypt } = useDecryption()

// Decrypt handle from contract
const decrypted = await decrypt(handle, 'euint32')
console.log(decrypted) // 42
```

### Contract Interaction

```typescript
import { useContract } from '@fhevm/universal-sdk/react'

const { contract, read, write } = useContract(CONTRACT_ADDRESS, ABI)

// Read from contract
const value = await read('getValue', [])

// Write to contract
const receipt = await write('setValue', [encryptedValue], {
  gasLimit: 500000n
})
```

### Event Listening

```typescript
import { useContractEvent } from '@fhevm/universal-sdk/react'

useContractEvent(
  CONTRACT_ADDRESS,
  ABI,
  'Transfer',
  (from, to, amount) => {
    console.log(`Transfer: ${from} → ${to}`)
  }
)
```

## Advanced Features

### Custom Network Configuration

```typescript
const fhevm = createFHEVM({
  rpcUrl: 'https://your-custom-rpc.com',
  chainId: 12345,
  gatewayUrl: 'https://your-gateway.com',
  debug: true
})
```

### Multiple Contract Instances

```typescript
const contract1 = fhevm.getContract(ADDRESS_1, ABI_1)
const contract2 = fhevm.getContract(ADDRESS_2, ABI_2)

// Use contracts independently
await contract1.write('function1', [arg1])
await contract2.write('function2', [arg2])
```

### Transaction Options

```typescript
await contract.write('transfer', [recipient, amount], {
  gasLimit: 500000n,
  gasPrice: 50000000000n, // 50 gwei
  value: ethers.parseEther('0.1') // Send ETH with transaction
})
```

### Error Handling

```typescript
try {
  const encrypted = await encrypt(value, 'euint32')
  await contract.write('submitValue', [encrypted.handles])
} catch (error) {
  if (error.code === 'ACTION_REJECTED') {
    console.log('User rejected transaction')
  } else {
    console.error('Transaction failed:', error)
  }
}
```

## Troubleshooting

### Common Issues

#### SDK not initializing

**Problem**: `FHEVM instance not ready`

**Solution**:
```typescript
// Wait for instance to be ready
const { isReady } = useFHEVM()

// Only perform operations when ready
if (isReady) {
  // Safe to use FHEVM
}
```

#### Gateway connection failed

**Problem**: `Failed to fetch public key`

**Solution**:
```typescript
// Use custom gateway URL
const fhevm = createFHEVM({
  network: 'sepolia',
  gatewayUrl: 'https://gateway.sepolia.zama.ai'
})
```

#### Type errors in TypeScript

**Problem**: Type mismatches

**Solution**:
```typescript
// Import types explicitly
import type { FHEDataType, EncryptedValue } from '@fhevm/universal-sdk'

const type: FHEDataType = 'euint32'
const encrypted: EncryptedValue = await encrypt(42, type)
```

#### Contract calls failing

**Problem**: `Transaction reverted`

**Solution**:
```typescript
// Check contract is paused
const isPaused = await contract.read('paused', [])
if (isPaused) {
  console.log('Contract is paused')
}

// Ensure sufficient gas
await contract.write('function', [args], {
  gasLimit: 1000000n // Increase gas limit
})
```

### Getting Help

- **Documentation**: [View full docs](../README.md)
- **Examples**: Check the [examples directory](../examples)
- **GitHub Issues**: [Report bugs](https://github.com/fhevm/universal-sdk/issues)
- **Discord**: [Join community](https://discord.gg/zama)

## Next Steps

- Explore the [Rideshare Example](../examples/rideshare/README.md)
- Read the [API Reference](./API_REFERENCE.md)
- Learn about [Security Best Practices](./SECURITY.md)
- Check out [Performance Optimization](./PERFORMANCE.md)

---

**Ready to build privacy-preserving applications!** 🚀
