/**
 * Home Page
 * Main page showcasing FHEVM SDK examples
 */

'use client';

import React, { useState } from 'react';
import { useFHEVM } from '@fhevm/universal-sdk/react';
import { EncryptionDemo } from '../components/fhe/EncryptionDemo';
import { ComputationDemo } from '../components/fhe/ComputationDemo';
import { KeyManager } from '../components/fhe/KeyManager';
import { BankingExample } from '../components/examples/BankingExample';
import { MedicalExample } from '../components/examples/MedicalExample';

export default function HomePage() {
  const { isReady, error, network } = useFHEVM();
  const [activeTab, setActiveTab] = useState<'demos' | 'examples'>('demos');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="glass-panel mx-4 mt-4 p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FHEVM SDK Examples
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Complete Next.js integration with Universal FHEVM SDK
              </p>
            </div>
            <div className="flex items-center gap-3">
              {network && (
                <div className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
                  {network.name}
                </div>
              )}
              <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                isReady
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {isReady ? '● Ready' : '○ Initializing...'}
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>Error:</strong> {error.message}
              </p>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="glass-panel p-2 inline-flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('demos')}
            className={`btn ${activeTab === 'demos' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Core Demos
          </button>
          <button
            onClick={() => setActiveTab('examples')}
            className={`btn ${activeTab === 'examples' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Use Case Examples
          </button>
        </div>

        {/* Content Sections */}
        {activeTab === 'demos' ? (
          <div className="space-y-8">
            {/* Introduction */}
            <div className="glass-card p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Core FHE Operations
              </h2>
              <p className="text-gray-600">
                These demos showcase the fundamental operations of the FHEVM SDK:
                encryption, homomorphic computation, and key management. All operations
                preserve data privacy through fully homomorphic encryption.
              </p>
            </div>

            {/* Demos Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EncryptionDemo />
              <ComputationDemo />
            </div>

            {/* Key Manager */}
            <div className="max-w-2xl mx-auto">
              <KeyManager />
            </div>

            {/* Features List */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                SDK Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-gray-800">Framework Agnostic</h4>
                    <p className="text-sm text-gray-600">Works with Next.js, React, Vue, and Node.js</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-gray-800">TypeScript First</h4>
                    <p className="text-sm text-gray-600">Full type safety and IntelliSense support</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-gray-800">Wagmi-like API</h4>
                    <p className="text-sm text-gray-600">Familiar hooks pattern for web3 developers</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-gray-800">Zero Config</h4>
                    <p className="text-sm text-gray-600">Works out of the box with sensible defaults</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Introduction */}
            <div className="glass-card p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Real-World Use Cases
              </h2>
              <p className="text-gray-600">
                These examples demonstrate practical applications of FHE technology
                in banking and healthcare scenarios, showing how to build
                privacy-preserving applications.
              </p>
            </div>

            {/* Examples Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BankingExample />
              <MedicalExample />
            </div>

            {/* Use Cases Info */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Why Use FHE?
              </h3>
              <div className="space-y-3 text-gray-600">
                <p>
                  <strong className="text-gray-800">Banking & Finance:</strong> Process
                  financial transactions and calculations without exposing sensitive
                  account balances or transaction amounts.
                </p>
                <p>
                  <strong className="text-gray-800">Healthcare:</strong> Store and
                  analyze medical records while maintaining patient privacy and HIPAA
                  compliance.
                </p>
                <p>
                  <strong className="text-gray-800">Data Privacy:</strong> Perform
                  computations on encrypted data without ever decrypting it, ensuring
                  end-to-end privacy.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-600 text-sm">
        <p>Built with Universal FHEVM SDK</p>
        <p className="mt-2">
          <a
            href="https://docs.zama.ai/fhevm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Documentation
          </a>
          {' · '}
          <a
            href="https://github.com/zama-ai/fhevm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
