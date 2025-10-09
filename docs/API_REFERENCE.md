# API Reference

Complete API documentation for the Universal FHEVM SDK.

## Table of Contents

1. [Core API](#core-api)
2. [React Hooks](#react-hooks)
3. [Type Definitions](#type-definitions)
4. [Error Handling](#error-handling)

## Core API

### `createFHEVM(config?)`

Creates a new FHEVM client instance.

**Parameters:**
- `config` (optional): `FHEVMConfig` - Configuration object

**Returns:** `FHEVMClient`

**Example:**
```typescript
import { createFHEVM } from '@fhevm/universal-sdk'

const fhevm = createFHEVM({
  network: 'sepolia',
  gatewayUrl: 'https://gateway.sepolia.zama.ai'
})
```

### `FHEVMClient`

Main client class for FHEVM operations.

#### `encrypt(value, type)`

Encrypts a value for use in FHE contracts.

**Parameters:**
- `value`: `number | bigint | boolean | string` - Value to encrypt
- `type`: `FHEDataType` - Target FHE data type

**Returns:** `Promise<EncryptedValue>`

**Example:**
```typescript
const encrypted = await fhevm.encrypt(42, 'euint32')
```

#### `decrypt(handle, type)`

Decrypts an encrypted handle.

**Parameters:**
- `handle`: `EncryptedHandle` - Handle to decrypt
- `type`: `FHEDataType` - Expected data type

**Returns:** `Promise<number | bigint | boolean | string>`

**Example:**
```typescript
const decrypted = await fhevm.decrypt(handle, 'euint32')
```

#### `getContract(address, abi)`

Creates a contract instance.

**Parameters:**
- `address`: `string` - Contract address
- `abi`: `ContractInterface` - Contract ABI

**Returns:** `FHEVMContract`

**Example:**
```typescript
const contract = fhevm.getContract(
  '0x5986FF19B524534F159af67f421ca081c6F5Acff',
  ABI
)
```

#### `isReady()`

Checks if the FHEVM instance is initialized.

**Returns:** `boolean`

**Example:**
```typescript
if (fhevm.isReady()) {
  // Perform operations
}
```

#### `getNetwork()`

Gets network information.

**Returns:** `Promise<NetworkInfo>`

**Example:**
```typescript
const network = await fhevm.getNetwork()
console.log(network.chainId) // 11155111
```

#### `setSigner(signer)`

Sets the signer for transactions.

**Parameters:**
- `signer`: `Signer` - Ethers signer instance

**Example:**
```typescript
import { ethers } from 'ethers'

const signer = new ethers.Wallet(PRIVATE_KEY, provider)
fhevm.setSigner(signer)
```

### `FHEVMContract`

Contract wrapper for FHEVM operations.

#### `read(functionName, args?)`

Calls a read-only contract function.

**Parameters:**
- `functionName`: `string` - Function name to call
- `args`: `Array<any>` (optional) - Function arguments

**Returns:** `Promise<any>`

**Example:**
```typescript
const value = await contract.read('getValue', [])
const balance = await contract.read('balanceOf', [address])
```

#### `write(functionName, args?, options?)`

Calls a state-changing contract function.

**Parameters:**
- `functionName`: `string` - Function name to call
- `args`: `Array<any>` (optional) - Function arguments
- `options`: `ContractCallOptions` (optional) - Transaction options

**Returns:** `Promise<FHEVMTransactionReceipt>`

**Example:**
```typescript
const receipt = await contract.write('transfer', [recipient, amount], {
  gasLimit: 500000n,
  value: ethers.parseEther('0.1')
})
```

#### `on(eventName, listener)`

Listens to contract events.

**Parameters:**
- `eventName`: `string` - Event name
- `listener`: `(...args: Array<any>) => void` - Event listener

**Example:**
```typescript
contract.on('Transfer', (from, to, amount) => {
  console.log(`Transfer: ${from} → ${to}`)
})
```

#### `off(eventName, listener)`

Removes event listener.

**Parameters:**
- `eventName`: `string` - Event name
- `listener`: `(...args: Array<any>) => void` - Event listener to remove

**Example:**
```typescript
contract.off('Transfer', transferListener)
```

#### `address`

Gets the contract address.

**Type:** `string`

**Example:**
```typescript
console.log(contract.address) // "0x5986..."
```

## React Hooks

### `FHEVMProvider`

Provider component that wraps your application.

**Props:**
- `config`: `FHEVMConfig` - FHEVM configuration
- `children`: `ReactNode` - Child components

**Example:**
```typescript
<FHEVMProvider config={{ network: 'sepolia' }}>
  <App />
</FHEVMProvider>
```

### `useFHEVM()`

Hook to access the FHEVM instance.

**Returns:** `UseFHEVMReturn`
- `instance`: `FHEVMInstance | null` - FHEVM instance
- `isReady`: `boolean` - Ready state
- `error`: `Error | null` - Error if any
- `network`: `NetworkInfo | null` - Network information

**Example:**
```typescript
const { instance, isReady, error, network } = useFHEVM()

if (isReady) {
  console.log('FHEVM is ready on', network?.name)
}
```

### `useEncryption()`

Hook for encryption operations.

**Returns:** `UseEncryptionReturn`
- `encrypt`: `(value, type) => Promise<EncryptedValue>` - Encryption function
- `isEncrypting`: `boolean` - Loading state
- `error`: `Error | null` - Error if any

**Example:**
```typescript
const { encrypt, isEncrypting, error } = useEncryption()

const handleSubmit = async (value: number) => {
  const encrypted = await encrypt(value, 'euint32')
  // Use encrypted value
}
```

### `useDecryption()`

Hook for decryption operations.

**Returns:** `UseDecryptionReturn`
- `decrypt`: `(handle, type) => Promise<number | bigint | boolean | string>` - Decryption function
- `isDecrypting`: `boolean` - Loading state
- `error`: `Error | null` - Error if any

**Example:**
```typescript
const { decrypt, isDecrypting, error } = useDecryption()

const handleDecrypt = async (handle: EncryptedHandle) => {
  const value = await decrypt(handle, 'euint32')
  console.log('Decrypted:', value)
}
```

### `useContract(address, abi)`

Hook for contract interaction.

**Parameters:**
- `address`: `string` - Contract address
- `abi`: `ContractInterface` - Contract ABI

**Returns:** `UseContractReturn`
- `contract`: `FHEVMContract | null` - Contract instance
- `read`: `(functionName, args?) => Promise<any>` - Read function
- `write`: `(functionName, args?, options?) => Promise<FHEVMTransactionReceipt>` - Write function
- `isLoading`: `boolean` - Loading state
- `error`: `Error | null` - Error if any

**Example:**
```typescript
const { contract, read, write, isLoading } = useContract(
  CONTRACT_ADDRESS,
  ABI
)

const value = await read('getValue', [])
await write('setValue', [encryptedValue])
```

### `useContractEvent(address, abi, eventName, listener)`

Hook to listen to contract events.

**Parameters:**
- `address`: `string` - Contract address
- `abi`: `ContractInterface` - Contract ABI
- `eventName`: `string` - Event name
- `listener`: `(...args: Array<any>) => void` - Event listener

**Example:**
```typescript
useContractEvent(
  CONTRACT_ADDRESS,
  ABI,
  'Transfer',
  (from, to, amount) => {
    console.log(`Transfer from ${from} to ${to}`)
  }
)
```

## Type Definitions

### `FHEDataType`

Supported FHE data types.

```typescript
type FHEDataType =
  | 'ebool'
  | 'euint8'
  | 'euint16'
  | 'euint32'
  | 'euint64'
  | 'euint128'
  | 'euint256'
  | 'eaddress'
```

### `Network`

Supported networks.

```typescript
type Network = 'sepolia' | 'mainnet' | 'localhost' | 'zama'
```

### `FHEVMConfig`

Configuration interface.

```typescript
interface FHEVMConfig {
  network?: Network
  rpcUrl?: string
  gatewayUrl?: string
  contractAddress?: string
  abi?: ContractInterface
  provider?: Provider
  signer?: Signer
  chainId?: number
  debug?: boolean
}
```

### `EncryptedValue`

Encrypted value result.

```typescript
interface EncryptedValue {
  handles: Uint8Array
  inputProof: string
}
```

### `EncryptedHandle`

Encrypted data handle.

```typescript
interface EncryptedHandle {
  data: Uint8Array
  type: FHEDataType
}
```

### `ContractCallOptions`

Transaction options.

```typescript
interface ContractCallOptions {
  gasLimit?: bigint
  gasPrice?: bigint
  value?: bigint
  nonce?: number
}
```

### `FHEVMTransactionReceipt`

Transaction receipt.

```typescript
interface FHEVMTransactionReceipt {
  hash: string
  blockNumber: number
  status: number
  gasUsed: bigint
  logs: Array<any>
}
```

### `NetworkInfo`

Network information.

```typescript
interface NetworkInfo {
  chainId: number
  name: string
  ensAddress?: string
}
```

## Error Handling

### Common Errors

#### `FHEVM instance not ready`

Thrown when attempting operations before initialization.

```typescript
try {
  await fhevm.encrypt(42, 'euint32')
} catch (error) {
  if (error.message.includes('not ready')) {
    // Wait for initialization
  }
}
```

#### `FHEVM instance not found`

Thrown when using React hooks without `FHEVMProvider`.

```typescript
// Solution: Wrap app with FHEVMProvider
<FHEVMProvider config={config}>
  <App />
</FHEVMProvider>
```

#### `Encryption failed`

Thrown when encryption operation fails.

```typescript
try {
  await encrypt(value, 'euint32')
} catch (error) {
  console.error('Encryption failed:', error.message)
}
```

#### `Decryption failed`

Thrown when decryption request fails.

```typescript
try {
  await decrypt(handle, 'euint32')
} catch (error) {
  console.error('Decryption failed:', error.message)
}
```

#### `Contract read failed`

Thrown when contract read operation fails.

```typescript
try {
  await contract.read('getValue', [])
} catch (error) {
  console.error('Read failed:', error.message)
}
```

#### `Contract write failed`

Thrown when contract write operation fails.

```typescript
try {
  await contract.write('setValue', [value])
} catch (error) {
  if (error.code === 'ACTION_REJECTED') {
    console.log('User rejected transaction')
  } else {
    console.error('Transaction failed:', error)
  }
}
```

### Error Codes

- `ACTION_REJECTED`: User rejected wallet action
- `INSUFFICIENT_FUNDS`: Not enough balance for transaction
- `UNPREDICTABLE_GAS_LIMIT`: Gas estimation failed
- `NONCE_EXPIRED`: Transaction nonce is too low
- `REPLACEMENT_UNDERPRICED`: Replacement transaction underpriced

---

For more examples, see the [Getting Started Guide](./GETTING_STARTED.md) and [Rideshare Example](../examples/rideshare/README.md).
