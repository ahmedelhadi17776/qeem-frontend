'use client';

import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';

/**
 * Theme utility functions for managing dark mode
 */
export class ThemeManager {
  private static instance: ThemeManager;
  private listeners: Set<(theme: Theme) => void> = new Set();

  private constructor() {
    if (typeof window !== 'undefined') {
      // Listen for system theme changes
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', () => {
          if (this.getStoredTheme() === 'system') {
            this.notifyListeners('system');
          }
        });
    }
  }

  static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

  /**
   * Get the current theme
   */
  getTheme(): Theme {
    if (typeof window === 'undefined') return 'light';

    const stored = this.getStoredTheme();
    return stored ?? 'system';
  }

  /**
   * Set the theme
   */
  setTheme(theme: Theme): void {
    if (typeof window === 'undefined') return;

    localStorage.setItem('theme', theme);
    this.applyTheme(theme);
    this.notifyListeners(theme);
  }

  /**
   * Get the effective theme (resolves 'system' to actual theme)
   */
  getEffectiveTheme(): 'light' | 'dark' {
    const theme = this.getTheme();

    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }

    return theme;
  }

  /**
   * Apply theme to the document
   */
  private applyTheme(theme: Theme): void {
    if (typeof window === 'undefined') return;

    const effectiveTheme =
      theme === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : theme;

    document.documentElement.setAttribute('data-theme', effectiveTheme);
  }

  /**
   * Get stored theme from localStorage
   */
  private getStoredTheme(): Theme | null {
    if (typeof window === 'undefined') return null;

    const stored = localStorage.getItem('theme');
    return stored as Theme | null;
  }

  /**
   * Notify all listeners of theme changes
   */
  private notifyListeners(theme: Theme): void {
    this.listeners.forEach(listener => listener(theme));
  }

  /**
   * Subscribe to theme changes
   */
  subscribe(listener: (theme: Theme) => void): () => void {
    this.listeners.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Initialize theme on page load
   */
  init(): void {
    if (typeof window === 'undefined') return;

    const theme = this.getTheme();
    this.applyTheme(theme);
  }
}

/**
 * React hook for theme management
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const themeManager = ThemeManager.getInstance();

    // Initialize theme
    themeManager.init();
    setTheme(themeManager.getTheme());
    setMounted(true);

    // Subscribe to theme changes
    const unsubscribe = themeManager.subscribe(newTheme => {
      setTheme(newTheme);
    });

    return unsubscribe;
  }, []);

  const setThemeAndStore = (newTheme: Theme) => {
    const themeManager = ThemeManager.getInstance();
    themeManager.setTheme(newTheme);
  };

  const toggleTheme = () => {
    const currentTheme = theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setThemeAndStore(newTheme);
  };

  return {
    theme,
    setTheme: setThemeAndStore,
    toggleTheme,
    mounted,
    effectiveTheme: mounted
      ? ThemeManager.getInstance().getEffectiveTheme()
      : 'light',
  };
}

/**
 * Utility function to get theme-aware class names
 */
export function getThemeClasses(
  lightClasses: string,
  darkClasses: string
): string {
  return `${lightClasses} [data-theme="dark"]:${darkClasses}`;
}

/**
 * Utility function to check if dark mode is preferred
 */
export function prefersDarkMode(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Utility function to get system theme
 */
export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return prefersDarkMode() ? 'dark' : 'light';
}
