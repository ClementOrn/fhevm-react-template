/**
 * Security Utilities
 * Security-related helper functions
 */

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

/**
 * Validate numeric input
 */
export function validateNumericInput(
  value: string,
  min?: number,
  max?: number
): { valid: boolean; error?: string } {
  const num = Number(value);

  if (isNaN(num)) {
    return { valid: false, error: 'Invalid number format' };
  }

  if (min !== undefined && num < min) {
    return { valid: false, error: `Value must be at least ${min}` };
  }

  if (max !== undefined && num > max) {
    return { valid: false, error: `Value must be at most ${max}` };
  }

  return { valid: true };
}

/**
 * Rate limiter for API calls
 */
export class RateLimiter {
  private calls: number[] = [];
  private maxCalls: number;
  private timeWindow: number;

  constructor(maxCalls: number = 10, timeWindowMs: number = 60000) {
    this.maxCalls = maxCalls;
    this.timeWindow = timeWindowMs;
  }

  check(): boolean {
    const now = Date.now();
    this.calls = this.calls.filter((time) => now - time < this.timeWindow);

    if (this.calls.length >= this.maxCalls) {
      return false;
    }

    this.calls.push(now);
    return true;
  }

  reset(): void {
    this.calls = [];
  }
}

/**
 * Generate secure random ID
 */
export function generateSecureId(length: number = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);

  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }

  return result;
}
