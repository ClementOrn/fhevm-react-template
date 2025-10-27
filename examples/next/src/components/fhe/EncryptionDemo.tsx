/**
 * Encryption Demo Component
 * Demonstrates FHE encryption functionality
 */

'use client';

import React, { useState } from 'react';
import { useEncryption } from '@fhevm/universal-sdk/react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardHeader, CardBody } from '../ui/Card';

export function EncryptionDemo() {
  const { encrypt, isEncrypting, error } = useEncryption();
  const [value, setValue] = useState('');
  const [dataType, setDataType] = useState<'euint32' | 'euint64' | 'ebool'>('euint32');
  const [result, setResult] = useState<any>(null);

  const handleEncrypt = async () => {
    try {
      setResult(null);

      let valueToEncrypt: number | bigint | boolean;

      if (dataType === 'ebool') {
        valueToEncrypt = value.toLowerCase() === 'true';
      } else if (dataType === 'euint64') {
        valueToEncrypt = BigInt(value);
      } else {
        valueToEncrypt = parseInt(value, 10);
      }

      const encrypted = await encrypt(valueToEncrypt, dataType);
      setResult(encrypted);
    } catch (err) {
      console.error('Encryption error:', err);
    }
  };

  return (
    <Card variant="elevated">
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-800">Encryption Demo</h2>
        <p className="text-sm text-gray-600 mt-1">
          Encrypt values using fully homomorphic encryption
        </p>
      </CardHeader>

      <CardBody>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Type
            </label>
            <select
              value={dataType}
              onChange={(e) => setDataType(e.target.value as any)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="euint32">Unsigned Int 32</option>
              <option value="euint64">Unsigned Int 64</option>
              <option value="ebool">Boolean</option>
            </select>
          </div>

          <Input
            label="Value to Encrypt"
            type={dataType === 'ebool' ? 'text' : 'number'}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={dataType === 'ebool' ? 'true or false' : 'Enter a number'}
            fullWidth
            helperText={
              dataType === 'ebool'
                ? 'Enter true or false'
                : dataType === 'euint64'
                ? 'Enter a large integer'
                : 'Enter an integer (0-4294967295)'
            }
          />

          <Button
            onClick={handleEncrypt}
            loading={isEncrypting}
            disabled={!value || isEncrypting}
            variant="primary"
            className="w-full"
          >
            {isEncrypting ? 'Encrypting...' : 'Encrypt Value'}
          </Button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>Error:</strong> {error.message}
              </p>
            </div>
          )}

          {result && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-2">
              <p className="text-sm font-medium text-green-800">
                Encryption Successful!
              </p>
              <div className="mt-2 space-y-1">
                <p className="text-xs text-gray-600">
                  <strong>Type:</strong> {result.type}
                </p>
                <p className="text-xs text-gray-600 break-all">
                  <strong>Handle:</strong> {result.handle}
                </p>
                <p className="text-xs text-gray-600 break-all">
                  <strong>Data:</strong> {result.data.substring(0, 50)}...
                </p>
              </div>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
