# Universal FHEVM SDK - Complete Integration Examples

This document demonstrates how the Private Rideshare Platform example integrates the Universal FHEVM SDK, showcasing all key features.

## Table of Contents

1. [SDK Setup](#sdk-setup)
2. [React Hooks Integration](#react-hooks-integration)
3. [Contract Interaction](#contract-interaction)
4. [Real-World Usage Examples](#real-world-usage-examples)
5. [Advanced Features](#advanced-features)

---

## SDK Setup

### 1. Provider Configuration

**File**: `examples/rideshare/app/providers.tsx`

```typescript
import { FHEVMProvider } from '@fhevm/universal-sdk/react';

// FHEVM SDK Configuration
const fhevmConfig = {
  network: 'sepolia',
  gatewayUrl: 'https://gateway.sepolia.zama.ai',
  chainId: 11155111,
  debug: process.env.NODE_ENV === 'development'
};

export function Providers({ children }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <FHEVMProvider config={fhevmConfig}>
            {children}
          </FHEVMProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

**Key Points**:
- ✅ Wrap entire app with `FHEVMProvider`
- ✅ Configure network and gateway URL
- ✅ Enable debug mode for development
- ✅ Works alongside other Web3 providers (Wagmi, RainbowKit)

---

## React Hooks Integration

### 2. useFHEVM Hook

**Usage in `examples/rideshare/app/page.tsx`**:

```typescript
import { useFHEVM } from '@fhevm/universal-sdk/react';

export default function Home() {
  const { instance, isReady, error, network } = useFHEVM();

  if (!isReady) {
    return <div>Loading FHEVM...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <div className="badge badge-success">FHEVM Ready</div>
      <p>Connected to {network?.name}</p>
    </div>
  );
}
```

**Features Demonstrated**:
- ✅ Access FHEVM instance
- ✅ Check ready state
- ✅ Handle errors gracefully
- ✅ Display network information

### 3. useEncryption Hook

**Example: Encrypting Ride Fare**:

```typescript
import { useEncryption } from '@fhevm/universal-sdk/react';

function RequestRideForm() {
  const { encrypt, isEncrypting, error } = useEncryption();

  const handleSubmit = async (fare: number) => {
    try {
      // Encrypt the fare amount
      const encryptedFare = await encrypt(fare, 'euint32');

      // Use encrypted fare in contract call
      await contract.write('requestRide', [encryptedFare.handles]);

      console.log('Ride requested with encrypted fare!');
    } catch (err) {
      console.error('Encryption failed:', err);
    }
  };

  return (
    <button
      onClick={() => handleSubmit(50000)}
      disabled={isEncrypting}
    >
      {isEncrypting ? 'Encrypting...' : 'Request Ride'}
    </button>
  );
}
```

**Features Demonstrated**:
- ✅ Client-side encryption
- ✅ Loading state management
- ✅ Error handling
- ✅ Type-safe encryption (euint32)

### 4. useContract Hook

**Full Example from `examples/rideshare/app/page.tsx`**:

```typescript
import { useContract } from '@fhevm/universal-sdk/react';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../lib/contracts';

export default function Home() {
  const { contract, read, write, isLoading, error } = useContract(
    CONTRACT_ADDRESS,
    CONTRACT_ABI
  );

  // Read driver information
  const loadDriverInfo = async (address: string) => {
    try {
      const info = await read('getDriverInfo', [address]);
      return {
        isAvailable: info[0],
        isVerified: info[1],
        totalRides: Number(info[2]),
        registrationTime: Number(info[3])
      };
    } catch (error) {
      console.error('Failed to load driver info:', error);
      return null;
    }
  };

  // Register as driver
  const registerDriver = async () => {
    try {
      const receipt = await write('registerDriver', []);
      console.log('Registration successful:', receipt.hash);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  // Request a ride
  const requestRide = async () => {
    try {
      const receipt = await write('requestRide', []);
      console.log('Ride requested:', receipt.hash);
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  return (
    <div>
      <button onClick={registerDriver} disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Register as Driver'}
      </button>
      <button onClick={requestRide} disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Request Ride'}
      </button>
    </div>
  );
}
```

**Features Demonstrated**:
- ✅ Read contract data (view functions)
- ✅ Write to contract (state-changing functions)
- ✅ Loading state for transactions
- ✅ Error handling
- ✅ Transaction receipts

### 5. useContractEvent Hook

**Example: Listening to Driver Registration Events**:

```typescript
import { useContractEvent } from '@fhevm/universal-sdk/react';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../lib/contracts';

function DriverNotifications() {
  const [notifications, setNotifications] = useState<string[]>([]);

  // Listen to DriverRegistered events
  useContractEvent(
    CONTRACT_ADDRESS,
    CONTRACT_ABI,
    'DriverRegistered',
    (driver, timestamp) => {
      const message = `New driver registered: ${driver}`;
      setNotifications(prev => [...prev, message]);
      console.log('Event:', message, 'at', timestamp);
    }
  );

  // Listen to RideRequested events
  useContractEvent(
    CONTRACT_ADDRESS,
    CONTRACT_ABI,
    'RideRequested',
    (rideId, passenger, timestamp) => {
      const message = `Ride #${rideId} requested by ${passenger}`;
      setNotifications(prev => [...prev, message]);
    }
  );

  return (
    <div>
      <h3>Live Notifications</h3>
      {notifications.map((msg, i) => (
        <div key={i} className="notification">{msg}</div>
      ))}
    </div>
  );
}
```

**Features Demonstrated**:
- ✅ Real-time event listening
- ✅ Multiple event listeners
- ✅ Event parameter handling
- ✅ Automatic cleanup on unmount

---

## Contract Interaction

### 6. Complete Passenger Flow

**File**: `examples/rideshare/app/page.tsx` (Passenger tab)

```typescript
function PassengerFlow() {
  const { read, write, isLoading } = useContract(CONTRACT_ADDRESS, CONTRACT_ABI);
  const { address } = useAccount();
  const [rideHistory, setRideHistory] = useState<number[]>([]);

  // Load ride history
  useEffect(() => {
    if (!address) return;

    const loadHistory = async () => {
      const history = await read('getPassengerRideHistory', [address]);
      setRideHistory(history);
    };

    loadHistory();
    const interval = setInterval(loadHistory, 10000);
    return () => clearInterval(interval);
  }, [address, read]);

  // Request a ride
  const handleRequestRide = async () => {
    try {
      const receipt = await write('requestRide', []);
      console.log('Ride requested:', receipt.hash);

      // Transaction successful - reload history
      const history = await read('getPassengerRideHistory', [address]);
      setRideHistory(history);
    } catch (error) {
      console.error('Failed to request ride:', error);
    }
  };

  return (
    <div className="glass-card">
      <h3>Request a Ride</h3>
      <button
        onClick={handleRequestRide}
        disabled={isLoading}
        className="btn btn-primary"
      >
        {isLoading ? 'Processing...' : 'Request Ride'}
      </button>

      <div className="mt-6">
        <h4>Your Ride History</h4>
        {rideHistory.length === 0 ? (
          <p>No rides yet</p>
        ) : (
          <div className="space-y-2">
            {rideHistory.map((rideId) => (
              <div key={rideId.toString()} className="badge badge-secondary">
                Ride #{rideId.toString()}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

### 7. Complete Driver Flow

**File**: `examples/rideshare/app/page.tsx` (Driver tab)

```typescript
function DriverFlow() {
  const { read, write, isLoading } = useContract(CONTRACT_ADDRESS, CONTRACT_ABI);
  const { address } = useAccount();
  const [isRegistered, setIsRegistered] = useState(false);
  const [driverInfo, setDriverInfo] = useState<any>(null);

  // Check registration and load driver info
  useEffect(() => {
    if (!address) return;

    const loadDriverData = async () => {
      // Check if registered
      const registered = await read('registeredDrivers', [address]);
      setIsRegistered(registered);

      // If registered, get driver info
      if (registered) {
        const info = await read('getDriverInfo', [address]);
        setDriverInfo({
          isAvailable: info[0],
          isVerified: info[1],
          totalRides: Number(info[2]),
          registrationTime: Number(info[3])
        });
      }
    };

    loadDriverData();
    const interval = setInterval(loadDriverData, 10000);
    return () => clearInterval(interval);
  }, [address, read]);

  // Register as driver
  const handleRegister = async () => {
    try {
      const receipt = await write('registerDriver', []);
      console.log('Registration successful:', receipt.hash);
      setIsRegistered(true);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  // Toggle availability
  const handleToggleAvailability = async () => {
    try {
      const newAvailability = !driverInfo.isAvailable;
      const receipt = await write('setDriverAvailability', [newAvailability]);
      console.log('Availability updated:', receipt.hash);

      // Update local state
      setDriverInfo(prev => ({ ...prev, isAvailable: newAvailability }));
    } catch (error) {
      console.error('Failed to update availability:', error);
    }
  };

  if (!isRegistered) {
    return (
      <div className="glass-card text-center">
        <h3>Become a Driver</h3>
        <p>Register to start accepting ride requests</p>
        <button
          onClick={handleRegister}
          disabled={isLoading}
          className="btn btn-primary"
        >
          {isLoading ? 'Registering...' : 'Register as Driver'}
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card">
      <h3>Driver Dashboard</h3>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span>Status</span>
          <span className={`badge ${driverInfo?.isVerified ? 'badge-success' : 'badge-warning'}`}>
            {driverInfo?.isVerified ? 'Verified' : 'Pending Verification'}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Total Rides</span>
          <span className="font-bold">{driverInfo?.totalRides || 0}</span>
        </div>

        <div className="flex justify-between">
          <span>Availability</span>
          <button
            onClick={handleToggleAvailability}
            disabled={isLoading}
            className={`btn btn-sm ${driverInfo?.isAvailable ? 'btn-success' : 'btn-secondary'}`}
          >
            {driverInfo?.isAvailable ? 'Available' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## Real-World Usage Examples

### 8. Platform Statistics Dashboard

```typescript
function StatsDashboard() {
  const { read } = useContract(CONTRACT_ADDRESS, CONTRACT_ABI);
  const [stats, setStats] = useState({
    activeRides: 0,
    availableDrivers: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      const [activeRides, availableDrivers] = await Promise.all([
        read('getActiveRideRequestsCount', []),
        read('getAvailableDriversCount', [])
      ]);

      setStats({
        activeRides: Number(activeRides),
        availableDrivers: Number(availableDrivers)
      });
    };

    loadStats();
    const interval = setInterval(loadStats, 15000);
    return () => clearInterval(interval);
  }, [read]);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="stat-card">
        <div className="stat-label">Active Ride Requests</div>
        <div className="stat-value">{stats.activeRides}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Available Drivers</div>
        <div className="stat-value">{stats.availableDrivers}</div>
      </div>
    </div>
  );
}
```

### 9. Ride Details Viewer

```typescript
function RideDetailsViewer({ rideId }: { rideId: number }) {
  const { read } = useContract(CONTRACT_ADDRESS, CONTRACT_ABI);
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    const loadDetails = async () => {
      const [passenger, driver, requestTime, isActive, isMatched] =
        await read('getRideDetails', [rideId]);

      setDetails({
        passenger,
        matchedDriver: driver,
        requestTime: Number(requestTime),
        isActive,
        isMatched
      });
    };

    loadDetails();
  }, [rideId, read]);

  if (!details) return <div>Loading...</div>;

  return (
    <div className="glass-card">
      <h4>Ride #{rideId}</h4>
      <div className="space-y-2">
        <div>Passenger: {formatAddress(details.passenger)}</div>
        {details.isMatched && (
          <div>Driver: {formatAddress(details.matchedDriver)}</div>
        )}
        <div>Requested: {formatDate(details.requestTime)}</div>
        <div>
          Status:
          <span className={`badge ${details.isActive ? 'badge-success' : 'badge-secondary'}`}>
            {details.isActive ? 'Active' : 'Completed'}
          </span>
        </div>
      </div>
    </div>
  );
}
```

---

## Advanced Features

### 10. Transaction with Custom Gas

```typescript
async function registerDriverWithCustomGas() {
  const { write } = useContract(CONTRACT_ADDRESS, CONTRACT_ABI);

  try {
    const receipt = await write('registerDriver', [], {
      gasLimit: 500000n,
      // gasPrice: optional
      // value: optional (for payable functions)
    });

    console.log('Transaction hash:', receipt.hash);
    console.log('Gas used:', receipt.gasUsed.toString());
  } catch (error) {
    console.error('Transaction failed:', error);
  }
}
```

### 11. Error Handling Best Practices

```typescript
function RobustContractInteraction() {
  const { write, error } = useContract(CONTRACT_ADDRESS, CONTRACT_ABI);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAction = async () => {
    try {
      setErrorMessage('');
      const receipt = await write('registerDriver', []);
      console.log('Success:', receipt.hash);
    } catch (err: any) {
      // Parse error for user-friendly message
      let message = 'An error occurred';

      if (err.code === 'ACTION_REJECTED') {
        message = 'You rejected the transaction';
      } else if (err.message?.includes('Already registered')) {
        message = 'You are already registered as a driver';
      } else if (err.message?.includes('Contract paused')) {
        message = 'The platform is temporarily paused';
      }

      setErrorMessage(message);
    }
  };

  return (
    <div>
      <button onClick={handleAction}>Register</button>
      {errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}
    </div>
  );
}
```

### 12. Multiple Contract Instances

```typescript
function MultiContractExample() {
  const { instance } = useFHEVM();

  useEffect(() => {
    if (!instance) return;

    // Create multiple contract instances
    const rideContract = instance.getContract(RIDE_CONTRACT_ADDRESS, RIDE_ABI);
    const tokenContract = instance.getContract(TOKEN_CONTRACT_ADDRESS, TOKEN_ABI);

    // Use both contracts
    const loadData = async () => {
      const rideCount = await rideContract.read('getRideCount', []);
      const balance = await tokenContract.read('balanceOf', [address]);

      console.log('Rides:', rideCount);
      console.log('Balance:', balance);
    };

    loadData();
  }, [instance]);
}
```

---

## Summary

The Private Rideshare Platform demonstrates complete integration of the Universal FHEVM SDK:

✅ **Setup**: Proper provider configuration
✅ **Hooks**: All 5 React hooks used in real scenarios
✅ **Read Operations**: Multiple view function calls
✅ **Write Operations**: State-changing transactions
✅ **Events**: Real-time event listening
✅ **Error Handling**: Robust error management
✅ **Loading States**: User feedback during operations
✅ **Real-Time Updates**: Periodic data refreshes

This example serves as a complete reference implementation for building privacy-preserving applications with FHEVM.

---

**Files referenced**:
- `examples/rideshare/app/page.tsx` - Main UI component
- `examples/rideshare/app/providers.tsx` - SDK provider setup
- `examples/rideshare/lib/contracts.ts` - Contract configuration
- `examples/rideshare/lib/wagmi.ts` - Wagmi configuration

**Live deployment**: Contract at `0x5986FF19B524534F159af67f421ca081c6F5Acff` on Sepolia testnet
