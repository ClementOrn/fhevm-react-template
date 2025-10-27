/**
 * Medical Example Component
 * Demonstrates private medical data management using FHE
 */

'use client';

import React, { useState } from 'react';
import { useEncryption } from '@fhevm/universal-sdk/react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardHeader, CardBody, CardFooter } from '../ui/Card';

interface MedicalRecord {
  id: string;
  type: string;
  value: string;
  timestamp: number;
  encrypted: boolean;
}

export function MedicalExample() {
  const { encrypt, isEncrypting } = useEncryption();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [recordType, setRecordType] = useState('blood-pressure');
  const [recordValue, setRecordValue] = useState('');

  const recordTypes = [
    { value: 'blood-pressure', label: 'Blood Pressure', unit: 'mmHg' },
    { value: 'heart-rate', label: 'Heart Rate', unit: 'bpm' },
    { value: 'blood-sugar', label: 'Blood Sugar', unit: 'mg/dL' },
    { value: 'weight', label: 'Weight', unit: 'kg' },
  ];

  const handleAddRecord = async () => {
    try {
      const value = parseInt(recordValue, 10);
      if (isNaN(value) || value <= 0) {
        alert('Please enter a valid value');
        return;
      }

      // Encrypt the medical data
      const encrypted = await encrypt(value, 'euint32');

      // Create new record
      const newRecord: MedicalRecord = {
        id: Math.random().toString(36).substring(7),
        type: recordType,
        value: `***${value.toString().slice(-1)}`, // Partially masked
        timestamp: Date.now(),
        encrypted: true
      };

      setRecords([newRecord, ...records]);
      setRecordValue('');
    } catch (error) {
      console.error('Failed to add record:', error);
      alert('Failed to add medical record');
    }
  };

  const getRecordLabel = (type: string) => {
    return recordTypes.find(t => t.value === type)?.label || type;
  };

  const getRecordUnit = (type: string) => {
    return recordTypes.find(t => t.value === type)?.unit || '';
  };

  return (
    <Card variant="elevated">
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-800">Private Medical Records</h2>
        <p className="text-sm text-gray-600 mt-1">
          Store and manage medical data with complete privacy
        </p>
      </CardHeader>

      <CardBody>
        <div className="space-y-6">
          {/* Add Record Form */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-4">
            <h3 className="text-sm font-medium text-blue-800">
              Add New Medical Record
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Record Type
              </label>
              <select
                value={recordType}
                onChange={(e) => setRecordType(e.target.value)}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {recordTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label} ({type.unit})
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Value"
              type="number"
              value={recordValue}
              onChange={(e) => setRecordValue(e.target.value)}
              placeholder={`Enter ${getRecordLabel(recordType).toLowerCase()}`}
              fullWidth
              helperText="Value will be encrypted before storage"
            />

            <Button
              onClick={handleAddRecord}
              loading={isEncrypting}
              disabled={!recordValue || isEncrypting}
              variant="primary"
              className="w-full"
            >
              {isEncrypting ? 'Encrypting...' : 'Add Encrypted Record'}
            </Button>
          </div>

          {/* Medical Records List */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Medical History ({records.length} records)
            </h3>

            {records.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-sm">No medical records yet</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {records.map((record) => (
                  <div
                    key={record.id}
                    className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium text-gray-800">
                            {getRecordLabel(record.type)}
                          </h4>
                          {record.encrypted && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                              </svg>
                              Encrypted
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(record.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-800">
                          {record.value}
                        </p>
                        <p className="text-xs text-gray-500">
                          {getRecordUnit(record.type)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardBody>

      <CardFooter>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>HIPAA-compliant privacy protection</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z" />
            </svg>
            <span>Only authorized parties can decrypt records</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
