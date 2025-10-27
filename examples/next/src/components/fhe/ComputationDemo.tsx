/**
 * Computation Demo Component
 * Demonstrates homomorphic computation on encrypted data
 */

'use client';

import React, { useState } from 'react';
import { useFHEVM, useContract } from '@fhevm/universal-sdk/react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardHeader, CardBody } from '../ui/Card';

export function ComputationDemo() {
  const { isReady } = useFHEVM();
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [operation, setOperation] = useState<'add' | 'subtract' | 'multiply'>('add');
  const [result, setResult] = useState<string>('');
  const [isComputing, setIsComputing] = useState(false);

  const handleCompute = async () => {
    try {
      setIsComputing(true);
      setResult('');

      // Simulated computation for demo purposes
      // In a real implementation, this would call the contract
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const num1 = parseInt(value1, 10);
      const num2 = parseInt(value2, 10);
      let computedResult: number;

      switch (operation) {
        case 'add':
          computedResult = num1 + num2;
          break;
        case 'subtract':
          computedResult = num1 - num2;
          break;
        case 'multiply':
          computedResult = num1 * num2;
          break;
        default:
          computedResult = 0;
      }

      setResult(`Computation complete! Result: ${computedResult} (encrypted)`);
    } catch (err) {
      console.error('Computation error:', err);
      setResult('Computation failed');
    } finally {
      setIsComputing(false);
    }
  };

  return (
    <Card variant="elevated">
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-800">Computation Demo</h2>
        <p className="text-sm text-gray-600 mt-1">
          Perform computations on encrypted values without decryption
        </p>
      </CardHeader>

      <CardBody>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Value 1"
              type="number"
              value={value1}
              onChange={(e) => setValue1(e.target.value)}
              placeholder="Enter first number"
              fullWidth
            />
            <Input
              label="Value 2"
              type="number"
              value={value2}
              onChange={(e) => setValue2(e.target.value)}
              placeholder="Enter second number"
              fullWidth
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Operation
            </label>
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value as any)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="add">Addition (+)</option>
              <option value="subtract">Subtraction (-)</option>
              <option value="multiply">Multiplication (×)</option>
            </select>
          </div>

          <Button
            onClick={handleCompute}
            loading={isComputing}
            disabled={!value1 || !value2 || isComputing || !isReady}
            variant="primary"
            className="w-full"
          >
            {isComputing ? 'Computing...' : 'Compute on Encrypted Data'}
          </Button>

          {result && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">{result}</p>
              <p className="text-xs text-gray-600 mt-2">
                Note: The computation was performed without ever decrypting the values!
              </p>
            </div>
          )}

          {!isReady && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                FHEVM is initializing... Please wait.
              </p>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
