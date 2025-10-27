/**
 * Key Manager Component
 * Manages and displays FHE keys
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useFHEVM } from '@fhevm/universal-sdk/react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardBody } from '../ui/Card';

export function KeyManager() {
  const { instance, isReady, network } = useFHEVM();
  const [publicKey, setPublicKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchPublicKey = async () => {
    if (!instance || !isReady) return;

    setIsLoading(true);
    try {
      const key = await instance.getPublicKey();
      setPublicKey(key);
    } catch (error) {
      console.error('Failed to fetch public key:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isReady) {
      fetchPublicKey();
    }
  }, [isReady]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card variant="elevated">
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-800">Key Manager</h2>
        <p className="text-sm text-gray-600 mt-1">
          View and manage your FHE encryption keys
        </p>
      </CardHeader>

      <CardBody>
        <div className="space-y-4">
          {/* Network Info */}
          {network && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Network Information
              </h3>
              <div className="space-y-1 text-xs text-gray-600">
                <p>
                  <strong>Chain ID:</strong> {network.chainId}
                </p>
                <p>
                  <strong>Network:</strong> {network.name}
                </p>
              </div>
            </div>
          )}

          {/* Public Key */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">
                FHE Public Key
              </h3>
              <Button
                size="sm"
                variant="secondary"
                onClick={fetchPublicKey}
                loading={isLoading}
                disabled={!isReady || isLoading}
              >
                Refresh
              </Button>
            </div>

            {publicKey ? (
              <div className="relative">
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-xs break-all max-h-32 overflow-y-auto">
                  {publicKey.substring(0, 100)}...
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyToClipboard}
                  className="mt-2 w-full"
                >
                  {copied ? 'Copied!' : 'Copy Public Key'}
                </Button>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
                <p className="text-sm text-gray-500">
                  {isReady ? 'Click refresh to load public key' : 'Initializing...'}
                </p>
              </div>
            )}
          </div>

          {/* Key Usage Info */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              About FHE Keys
            </h3>
            <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
              <li>The public key is used for client-side encryption</li>
              <li>Keys are network-specific and automatically managed</li>
              <li>No private keys are exposed to the client</li>
              <li>Decryption requires gateway authorization</li>
            </ul>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
