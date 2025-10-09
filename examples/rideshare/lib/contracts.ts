/**
 * Smart Contract Configuration
 * Universal FHEVM SDK Integration Example
 */

// Contract deployed on Sepolia Testnet
export const CONTRACT_ADDRESS = '0x5986FF19B524534F159af67f421ca081c6F5Acff';

// Contract ABI - Essential functions for the Private Rideshare Platform
export const CONTRACT_ABI = [
  // View Functions
  {
    inputs: [{ name: '_driver', type: 'address' }],
    name: 'getDriverInfo',
    outputs: [
      { name: 'isAvailable', type: 'bool' },
      { name: 'isVerified', type: 'bool' },
      { name: 'totalRides', type: 'uint256' },
      { name: 'registrationTime', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: '_rideId', type: 'uint256' }],
    name: 'getRideDetails',
    outputs: [
      { name: 'passenger', type: 'address' },
      { name: 'matchedDriver', type: 'address' },
      { name: 'requestTime', type: 'uint256' },
      { name: 'isActive', type: 'bool' },
      { name: 'isMatched', type: 'bool' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: '_passenger', type: 'address' }],
    name: 'getPassengerRideHistory',
    outputs: [{ name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: '_driver', type: 'address' }],
    name: 'getDriverRideHistory',
    outputs: [{ name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getActiveRideRequestsCount',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getAvailableDriversCount',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: '', type: 'address' }],
    name: 'registeredDrivers',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },

  // Write Functions - Driver
  {
    inputs: [],
    name: 'registerDriver',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: '_available', type: 'bool' }],
    name: 'setDriverAvailability',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: '_rideId', type: 'uint256' }],
    name: 'acceptRide',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: '_rideId', type: 'uint256' }],
    name: 'completeRide',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },

  // Write Functions - Passenger
  {
    inputs: [],
    name: 'requestRide',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: '_rideId', type: 'uint256' }],
    name: 'cancelRide',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },

  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'driver', type: 'address' },
      { indexed: false, name: 'timestamp', type: 'uint256' }
    ],
    name: 'DriverRegistered',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'rideId', type: 'uint256' },
      { indexed: true, name: 'passenger', type: 'address' },
      { indexed: false, name: 'timestamp', type: 'uint256' }
    ],
    name: 'RideRequested',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'driver', type: 'address' }
    ],
    name: 'DriverVerified',
    type: 'event'
  }
] as const;

// Ride status constants
export const RIDE_STATUS = {
  PENDING: 0,
  MATCHED: 1,
  IN_PROGRESS: 2,
  COMPLETED: 3,
  CANCELLED: 4
} as const;

// Network configuration
export const NETWORK_CONFIG = {
  chainId: 11155111, // Sepolia
  name: 'Sepolia',
  rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
  blockExplorer: 'https://sepolia.etherscan.io'
} as const;
