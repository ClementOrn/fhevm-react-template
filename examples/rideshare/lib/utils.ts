/**
 * Utility Functions for Universal FHEVM SDK Example
 */

import { type ClassValue, clsx } from 'clsx';

/**
 * Merge class names (for Tailwind CSS)
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Format Ethereum address for display
 */
export function formatAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format timestamp to readable date
 */
export function formatDate(timestamp: number | bigint): string {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Format time ago (e.g., "2 minutes ago")
 */
export function formatTimeAgo(timestamp: number | bigint): string {
  const now = Date.now();
  const time = Number(timestamp) * 1000;
  const diff = now - time;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length = 50): string {
  if (!text || text.length <= length) return text;
  return `${text.slice(0, length)}...`;
}

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if value is valid Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Parse error message for user-friendly display
 */
export function parseError(error: any): string {
  if (typeof error === 'string') return error;

  if (error?.reason) return error.reason;
  if (error?.message) {
    // Extract message from common error formats
    const msg = error.message;
    if (msg.includes('user rejected')) return 'Transaction rejected by user';
    if (msg.includes('insufficient funds')) return 'Insufficient funds for transaction';
    if (msg.includes('execution reverted')) {
      const match = msg.match(/execution reverted: (.+?)"/);
      return match ? match[1] : 'Transaction failed';
    }
    return msg;
  }

  return 'An unknown error occurred';
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Format number with commas
 */
export function formatNumber(num: number | bigint): string {
  return Number(num).toLocaleString('en-US');
}

/**
 * Convert Wei to Ether
 */
export function weiToEther(wei: bigint): string {
  const ether = Number(wei) / 1e18;
  return ether.toFixed(4);
}

/**
 * Convert Ether to Wei
 */
export function etherToWei(ether: string | number): bigint {
  return BigInt(Math.floor(Number(ether) * 1e18));
}
