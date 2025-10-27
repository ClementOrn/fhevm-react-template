/**
 * Banking Example Component
 * Demonstrates private banking operations using FHE
 */

'use client';

import React, { useState } from 'react';
import { useEncryption, useContract } from '@fhevm/universal-sdk/react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardHeader, CardBody, CardFooter } from '../ui/Card';

export function BankingExample() {
  const { encrypt, isEncrypting } = useEncryption();
  const [balance, setBalance] = useState<number>(1000);
  const [amount, setAmount] = useState('');
  const [operation, setOperation] = useState<'deposit' | 'withdraw'>('deposit');
  const [txHistory, setTxHistory] = useState<Array<{
    type: string;
    amount: string;
    timestamp: number;
  }>>([]);

  const handleTransaction = async () => {
    try {
      const value = parseInt(amount, 10);
      if (isNaN(value) || value <= 0) {
        alert('Please enter a valid amount');
        return;
      }

      // Encrypt the transaction amount
      const encrypted = await encrypt(value, 'euint32');

      // Simulate transaction processing
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update balance (in real app, this would come from contract)
      if (operation === 'deposit') {
        setBalance(balance + value);
      } else {
        if (value > balance) {
          alert('Insufficient balance');
          return;
        }
        setBalance(balance - value);
      }

      // Add to transaction history
      setTxHistory([
        {
          type: operation,
          amount: `***${value.toString().slice(-2)}`,
          timestamp: Date.now()
        },
        ...txHistory
      ]);

      setAmount('');
    } catch (error) {
      console.error('Transaction error:', error);
      alert('Transaction failed');
    }
  };

  return (
    <Card variant="elevated">
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-800">Private Banking</h2>
        <p className="text-sm text-gray-600 mt-1">
          Conduct private financial transactions using FHE
        </p>
      </CardHeader>

      <CardBody>
        <div className="space-y-6">
          {/* Balance Display */}
          <div className="text-center p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
            <p className="text-sm opacity-90">Current Balance</p>
            <p className="text-4xl font-bold mt-2">
              ${balance.toLocaleString()}
            </p>
            <p className="text-xs opacity-75 mt-2">(Encrypted on-chain)</p>
          </div>

          {/* Transaction Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Operation Type
              </label>
              <div className="flex gap-2">
                <Button
                  variant={operation === 'deposit' ? 'primary' : 'outline'}
                  onClick={() => setOperation('deposit')}
                  className="flex-1"
                >
                  Deposit
                </Button>
                <Button
                  variant={operation === 'withdraw' ? 'primary' : 'outline'}
                  onClick={() => setOperation('withdraw')}
                  className="flex-1"
                >
                  Withdraw
                </Button>
              </div>
            </div>

            <Input
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              fullWidth
              helperText="Amount will be encrypted before submission"
            />

            <Button
              onClick={handleTransaction}
              loading={isEncrypting}
              disabled={!amount || isEncrypting}
              variant={operation === 'deposit' ? 'success' : 'danger'}
              className="w-full"
            >
              {isEncrypting
                ? 'Processing...'
                : `${operation === 'deposit' ? 'Deposit' : 'Withdraw'} Funds`}
            </Button>
          </div>

          {/* Transaction History */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Recent Transactions
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {txHistory.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No transactions yet
                </p>
              ) : (
                txHistory.map((tx, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800 capitalize">
                        {tx.type}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(tx.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${
                        tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {tx.type === 'deposit' ? '+' : '-'}${tx.amount}
                      </p>
                      <p className="text-xs text-gray-500">Encrypted</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </CardBody>

      <CardFooter>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>All transactions are encrypted and privacy-preserving</span>
        </div>
      </CardFooter>
    </Card>
  );
}
