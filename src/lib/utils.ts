import { clsx, type ClassValue } from 'clsx';

/**
 * Utility function to combine class names
 * Combines clsx with additional utilities for better class management
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Utility function to create responsive class names
 * @param base - Base class name
 * @param responsive - Object with breakpoint-specific classes
 * @returns Combined class string
 */
export function responsive(
  base: string,
  responsive: {
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  } = {},
) {
  const classes = [base];

  if (responsive.sm) classes.push(`sm:${responsive.sm}`);
  if (responsive.md) classes.push(`md:${responsive.md}`);
  if (responsive.lg) classes.push(`lg:${responsive.lg}`);
  if (responsive.xl) classes.push(`xl:${responsive.xl}`);

  return clsx(classes);
}

/**
 * Utility function to create variant-based class names
 * @param base - Base class name
 * @param variants - Object with variant-specific classes
 * @param selected - Selected variant
 * @returns Combined class string
 */
export function variant<T extends string>(base: string, variants: Record<T, string>, selected?: T) {
  if (!selected || !variants[selected]) {
    return base;
  }

  return clsx(base, variants[selected]);
}

/**
 * Utility function to create size-based class names
 * @param base - Base class name
 * @param sizes - Object with size-specific classes
 * @param selected - Selected size
 * @returns Combined class string
 */
export function size<T extends string>(base: string, sizes: Record<T, string>, selected?: T) {
  if (!selected || !sizes[selected]) {
    return base;
  }

  return clsx(base, sizes[selected]);
}

/**
 * Utility function to format currency
 * @param amount - Amount to format
 * @param currency - Currency code (default: 'EGP')
 * @param locale - Locale (default: 'en-EG')
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = 'EGP', locale: string = 'en-EG'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Utility function to format numbers
 * @param number - Number to format
 * @param locale - Locale (default: 'en-EG')
 * @returns Formatted number string
 */
export function formatNumber(number: number, locale: string = 'en-EG'): string {
  return new Intl.NumberFormat(locale).format(number);
}

/**
 * Utility function to debounce function calls
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Utility function to throttle function calls
 * @param func - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Utility function to generate random ID
 * @param length - Length of the ID (default: 8)
 * @returns Random ID string
 */
export function generateId(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

/**
 * Utility function to check if value is empty
 * @param value - Value to check
 * @returns True if value is empty
 */
export function isEmpty(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Utility function to deep clone an object
 * @param obj - Object to clone
 * @returns Cloned object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T;
  if (typeof obj === 'object') {
    const clonedObj = {} as Record<string, unknown>;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone((obj as Record<string, unknown>)[key]);
      }
    }
    return clonedObj as T;
  }
  return obj;
}
