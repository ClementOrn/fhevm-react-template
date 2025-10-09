'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { ConnectButton } from '@rainbowkit/rainbowkit';
import { useFHEVM, useContract } from '@fhevm/universal-sdk/react';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../lib/contracts';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { instance, isReady } = useFHEVM();
  const { contract, read, write, isLoading } = useContract(CONTRACT_ADDRESS, CONTRACT_ABI);

  const [activeTab, setActiveTab] = useState<'passenger' | 'driver'>('passenger');
  const [isRegistered, setIsRegistered] = useState(false);
  const [driverInfo, setDriverInfo] = useState<any>(null);
  const [rideHistory, setRideHistory] = useState<any[]>([]);
  const [stats, setStats] = useState({ activeRides: 0, availableDrivers: 0 });

  // Load driver info and stats
  useEffect(() => {
    if (!isConnected || !address || !contract) return;

    const loadData = async () => {
      try {
        // Check if registered as driver
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

        // Get ride history based on active tab
        const history = activeTab === 'passenger'
          ? await read('getPassengerRideHistory', [address])
          : await read('getDriverRideHistory', [address]);
        setRideHistory(history || []);

        // Get platform stats
        const [activeRides, availableDrivers] = await Promise.all([
          read('getActiveRideRequestsCount', []),
          read('getAvailableDriversCount', [])
        ]);
        setStats({
          activeRides: Number(activeRides),
          availableDrivers: Number(availableDrivers)
        });
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
    const interval = setInterval(loadData, 10000); // Refresh every 10s

    return () => clearInterval(interval);
  }, [isConnected, address, contract, read, activeTab]);

  // Register as driver
  const handleRegisterDriver = async () => {
    if (!contract) return;
    try {
      await write('registerDriver', []);
      setIsRegistered(true);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  // Request a ride
  const handleRequestRide = async () => {
    if (!contract) return;
    try {
      await write('requestRide', []);
    } catch (error) {
      console.error('Ride request failed:', error);
    }
  };

  // Toggle driver availability
  const handleToggleAvailability = async () => {
    if (!contract || !driverInfo) return;
    try {
      await write('setDriverAvailability', [!driverInfo.isAvailable]);
    } catch (error) {
      console.error('Failed to update availability:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="glass-panel mx-4 mt-4 p-6">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Private Rideshare Platform
            </h1>
            <p className="text-sm text-gray-600 mt-1">Powered by FHEVM Universal SDK</p>
          </div>
          <div className="flex items-center gap-4">
            {isReady && <div className="badge badge-success">FHEVM Ready</div>}
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!isConnected ? (
          <div className="glass-card p-12 text-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
            <p className="text-gray-600 mb-6">
              Connect your wallet to start using the privacy-preserving rideshare platform.
            </p>
            <ConnectButton />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stats Section */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="stat-card">
                <div className="stat-label">Active Ride Requests</div>
                <div className="stat-value">{stats.activeRides}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Available Drivers</div>
                <div className="stat-value">{stats.availableDrivers}</div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="lg:col-span-3">
              <div className="glass-panel p-2 inline-flex gap-2">
                <button
                  onClick={() => setActiveTab('passenger')}
                  className={`btn ${activeTab === 'passenger' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  Passenger
                </button>
                <button
                  onClick={() => setActiveTab('driver')}
                  className={`btn ${activeTab === 'driver' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  Driver
                </button>
              </div>
            </div>

            {/* Passenger View */}
            {activeTab === 'passenger' && (
              <>
                <div className="lg:col-span-2">
                  <div className="glass-card p-6">
                    <h3 className="text-xl font-bold mb-4">Request a Ride</h3>
                    <p className="text-gray-600 mb-6">
                      Request a ride and available drivers will be matched with you.
                    </p>
                    <button
                      onClick={handleRequestRide}
                      disabled={isLoading}
                      className="btn btn-primary w-full"
                    >
                      {isLoading ? 'Processing...' : 'Request Ride'}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="glass-card p-6">
                    <h3 className="text-lg font-bold mb-4">Ride History</h3>
                    {rideHistory.length === 0 ? (
                      <p className="text-gray-500 text-sm">No rides yet</p>
                    ) : (
                      <div className="space-y-2">
                        {rideHistory.slice(-5).reverse().map((rideId) => (
                          <div key={rideId.toString()} className="badge badge-secondary">
                            Ride #{rideId.toString()}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Driver View */}
            {activeTab === 'driver' && (
              <>
                {!isRegistered ? (
                  <div className="lg:col-span-3">
                    <div className="glass-card p-8 text-center max-w-md mx-auto">
                      <h3 className="text-xl font-bold mb-4">Become a Driver</h3>
                      <p className="text-gray-600 mb-6">
                        Register as a driver to start accepting ride requests.
                      </p>
                      <button
                        onClick={handleRegisterDriver}
                        disabled={isLoading}
                        className="btn btn-primary"
                      >
                        {isLoading ? 'Registering...' : 'Register as Driver'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="lg:col-span-2">
                      <div className="glass-card p-6">
                        <h3 className="text-xl font-bold mb-4">Driver Dashboard</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">Status</span>
                            <span className={`badge ${driverInfo?.isVerified ? 'badge-success' : 'badge-warning'}`}>
                              {driverInfo?.isVerified ? 'Verified' : 'Pending Verification'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">Total Rides</span>
                            <span className="font-bold">{driverInfo?.totalRides || 0}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">Availability</span>
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
                    </div>

                    <div>
                      <div className="glass-card p-6">
                        <h3 className="text-lg font-bold mb-4">Ride History</h3>
                        {rideHistory.length === 0 ? (
                          <p className="text-gray-500 text-sm">No rides completed</p>
                        ) : (
                          <div className="space-y-2">
                            {rideHistory.slice(-5).reverse().map((rideId) => (
                              <div key={rideId.toString()} className="badge badge-secondary">
                                Ride #{rideId.toString()}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-600 text-sm">
        <p>Built with Universal FHEVM SDK • Privacy-First Ridesharing</p>
        <p className="mt-2">
          Contract: <a href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            {CONTRACT_ADDRESS}
          </a>
        </p>
      </footer>
    </div>
  );
}
