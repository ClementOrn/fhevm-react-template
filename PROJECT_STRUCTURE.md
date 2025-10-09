# Project Structure

This document describes the structure of the Universal FHEVM SDK repository.

## Directory Overview

```
fhevm-react-template/
├── packages/                    # SDK packages
│   └── fhevm-sdk/              # Main SDK package
│       ├── src/                # Source code
│       │   ├── core/           # Core FHEVM functionality
│       │   │   └── client.ts   # FHEVMClient implementation
│       │   ├── react/          # React integration
│       │   │   ├── hooks.tsx   # React hooks
│       │   │   └── index.ts    # React exports
│       │   ├── vue/            # Vue integration (future)
│       │   ├── types/          # TypeScript type definitions
│       │   │   └── index.ts    # All type exports
│       │   └── index.ts        # Main entry point
│       ├── package.json        # Package configuration
│       └── tsconfig.json       # TypeScript config
│
├── examples/                    # Example applications
│   └── rideshare/              # Private Rideshare Platform
│       ├── app/                # Next.js app directory
│       │   ├── layout.tsx      # Root layout
│       │   ├── page.tsx        # Main page component
│       │   ├── providers.tsx   # Web3 providers
│       │   └── globals.css     # Global styles
│       ├── contracts/          # Smart contracts
│       │   └── PrivateRideShare.sol
│       ├── lib/                # Utilities
│       │   ├── wagmi.ts        # Wagmi configuration
│       │   ├── contracts.ts    # Contract ABIs
│       │   └── utils.ts        # Helper functions
│       ├── test/               # Test files (reference only)
│       ├── package.json        # Example dependencies
│       └── README.md           # Example documentation
│
├── docs/                        # Documentation
│   ├── GETTING_STARTED.md      # Quick start guide
│   ├── API_REFERENCE.md        # Complete API docs
│   ├── SECURITY.md             # Security best practices
│   └── PERFORMANCE.md          # Performance optimization
│
├── README.md                    # Main project README
├── CHANGELOG.md                 # Version history
├── CONTRIBUTING.md              # Contribution guidelines
├── LICENSE                      # MIT License
├── DEMO_INSTRUCTIONS.md         # Video recording guide
├── DEMO_VIDEO_LINK.txt          # Demo video placeholder
└── PROJECT_STRUCTURE.md         # This file
```

## Core Package (`packages/fhevm-sdk`)

### Source Code Structure

#### `src/core/` - Core FHEVM Functionality
- **`client.ts`**: Main `FHEVMClient` class implementation
  - FHEVM instance initialization
  - Encryption/decryption operations
  - Contract interaction
  - Network management
  - Gateway communication

#### `src/react/` - React Integration
- **`hooks.tsx`**: React hooks implementation
  - `FHEVMProvider`: Context provider
  - `useFHEVM`: Access FHEVM instance
  - `useEncryption`: Encryption operations
  - `useDecryption`: Decryption operations
  - `useContract`: Contract interaction
  - `useContractEvent`: Event listening
- **`index.ts`**: React exports

#### `src/vue/` - Vue Integration (Planned)
- Vue 3 composables
- Reactive state management
- Vue-specific utilities

#### `src/types/` - TypeScript Definitions
- **`index.ts`**: All type definitions
  - `FHEVMConfig`: Configuration interface
  - `FHEVMInstance`: Instance interface
  - `FHEVMContract`: Contract interface
  - `FHEDataType`: Supported data types
  - `EncryptedValue`: Encryption result
  - `EncryptedHandle`: Encrypted handle
  - React hook return types
  - Vue composable return types

#### `src/index.ts` - Main Entry Point
- Core exports
- Type exports
- Version information

### Configuration Files

- **`package.json`**: Package metadata, dependencies, scripts
- **`tsconfig.json`**: TypeScript compiler configuration
- **`tsup.config.ts`**: Build configuration (future)

## Example Application (`examples/rideshare`)

### Application Structure

#### `app/` - Next.js Application
- **`layout.tsx`**: Root layout with providers
- **`page.tsx`**: Main application component
  - Passenger flow UI
  - Driver flow UI
  - Stats dashboard
  - Transaction handling
- **`providers.tsx`**: Web3 providers setup
  - Wagmi configuration
  - RainbowKit provider
  - FHEVM provider
- **`globals.css`**: Global styles
  - CSS variables
  - Glassmorphism components
  - Responsive design
  - Animation utilities

#### `contracts/` - Smart Contracts
- **`PrivateRideShare.sol`**: Main contract
  - Driver registration
  - Ride request/matching
  - Access control (pausers)
  - FHE operations
  - Event emissions

#### `lib/` - Utilities
- **`wagmi.ts`**: Wagmi client configuration
- **`contracts.ts`**: Contract ABI and address
- **`utils.ts`**: Helper functions

#### `test/` - Tests (Reference)
- Unit tests for contract
- Integration tests
- Test utilities

### Example Features

1. **Passenger Features**
   - Request rides
   - View ride history
   - Track ride status
   - Privacy-preserving transactions

2. **Driver Features**
   - Register as driver
   - Toggle availability
   - Accept ride requests
   - Complete rides
   - View earnings

3. **Platform Features**
   - Real-time statistics
   - Emergency pause mechanism
   - Driver verification
   - Access control

## Documentation (`docs/`)

### Documentation Files

- **`GETTING_STARTED.md`**: Comprehensive quick start guide
  - Installation instructions
  - Framework integration guides
  - Basic usage examples
  - Troubleshooting

- **`API_REFERENCE.md`**: Complete API documentation
  - Core API reference
  - React hooks reference
  - Type definitions
  - Error handling

- **`SECURITY.md`** (Future): Security best practices
  - Encryption guidelines
  - Key management
  - Gateway security
  - Smart contract security

- **`PERFORMANCE.md`** (Future): Performance optimization
  - Bundle size optimization
  - Caching strategies
  - Gas optimization
  - Network optimization

## Root Files

### Essential Files

- **`README.md`**: Main project documentation
  - Project overview
  - Quick start (< 10 lines)
  - Features and benefits
  - Example usage
  - Competition criteria
  - Links and resources

- **`CHANGELOG.md`**: Version history
  - Release notes
  - New features
  - Bug fixes
  - Breaking changes
  - Future roadmap

- **`CONTRIBUTING.md`**: Contribution guidelines
  - How to contribute
  - Development setup
  - Code style
  - Testing requirements
  - Commit conventions
  - Community guidelines

- **`LICENSE`**: MIT License
  - Open source license
  - Usage permissions
  - Disclaimer

- **`DEMO_INSTRUCTIONS.md`**: Demo video guide
  - Recording requirements
  - Content structure
  - Tools and setup
  - Script template
  - Editing tips

- **`DEMO_VIDEO_LINK.txt`**: Video placeholder
  - Link to demo video
  - Hosting information
  - Access instructions

## File Naming Conventions

### Source Files
- **TypeScript/JavaScript**: camelCase (e.g., `client.ts`, `hooks.tsx`)
- **React Components**: PascalCase (e.g., `FHEVMProvider.tsx`)
- **Type Definitions**: PascalCase (e.g., `types/index.ts`)
- **Configuration**: lowercase or kebab-case (e.g., `tsconfig.json`, `next.config.js`)

### Documentation
- **Markdown**: UPPERCASE (e.g., `README.md`, `CONTRIBUTING.md`)
- **Guides**: UPPERCASE (e.g., `GETTING_STARTED.md`, `API_REFERENCE.md`)

### Smart Contracts
- **Solidity**: PascalCase (e.g., `PrivateRideShare.sol`)

## Import Paths

### SDK Imports
```typescript
// Core
import { createFHEVM, FHEVMClient } from '@fhevm/universal-sdk'

// React
import { FHEVMProvider, useFHEVM } from '@fhevm/universal-sdk/react'

// Types
import type { FHEVMConfig, FHEDataType } from '@fhevm/universal-sdk'
```

### Internal Imports (SDK Development)
```typescript
// Relative imports within SDK
import { FHEVMClient } from '../core/client'
import type { FHEVMConfig } from '../types'
```

## Build Output

### SDK Build
```
dist/
├── index.js           # CommonJS bundle
├── index.mjs          # ESM bundle
├── index.d.ts         # Type definitions
├── react/
│   ├── index.js
│   ├── index.mjs
│   └── index.d.ts
└── vue/
    ├── index.js
    ├── index.mjs
    └── index.d.ts
```

### Example Build (Next.js)
```
.next/
├── static/            # Static assets
├── server/            # Server-side code
└── cache/             # Build cache
```

## Testing Structure

```
test/
├── unit/              # Unit tests
│   ├── client.test.ts
│   └── hooks.test.tsx
├── integration/       # Integration tests
│   └── contract.test.ts
└── utils/             # Test utilities
    └── helpers.ts
```

## Deployment Structure

### NPM Package
```
@fhevm/universal-sdk/
├── dist/              # Compiled code
├── package.json       # Package metadata
├── README.md          # Documentation
└── LICENSE            # License file
```

### Example Deployment
- Frontend: Vercel (Next.js)
- Contract: Sepolia Testnet
- CDN: unpkg.com for browser builds

## Development Workflow

1. **SDK Development**: Work in `packages/fhevm-sdk/src/`
2. **Build SDK**: `npm run build` in SDK directory
3. **Example Development**: Work in `examples/rideshare/`
4. **Testing**: Run tests in respective directories
5. **Documentation**: Update docs as features are added

## Version Control

- Main branch: `main`
- Development branch: `develop`
- Feature branches: `feature/feature-name`
- Release tags: `v1.0.0`, `v1.1.0`, etc.

---

For questions about the project structure, see [CONTRIBUTING.md](./CONTRIBUTING.md) or open an issue on GitHub.
