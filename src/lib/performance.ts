/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';

interface PerformanceMetrics {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, unknown>;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private observers: Set<(metrics: PerformanceMetrics[]) => void> = new Set();

  private constructor() {
    if (typeof window !== 'undefined' && 
        process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING === 'true') {
      // Monitor Core Web Vitals only when enabled
      this.observeWebVitals();
    }
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Start timing a performance metric
   */
  startTiming(name: string, metadata?: Record<string, unknown>): void {
    if (typeof window === 'undefined' || 
        process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING !== 'true') return;

    this.metrics.set(name, {
      name,
      startTime: performance.now(),
      metadata,
    });
  }

  /**
   * End timing a performance metric
   */
  endTiming(name: string): PerformanceMetrics | null {
    if (typeof window === 'undefined' || 
        process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING !== 'true') return null;

    const metric = this.metrics.get(name);
    if (!metric) return null;

    const endTime = performance.now();
    const duration = endTime - metric.startTime;

    const completedMetric: PerformanceMetrics = {
      ...metric,
      endTime,
      duration,
    };

    this.metrics.set(name, completedMetric);
    this.notifyObservers([completedMetric]);

    return completedMetric;
  }

  /**
   * Measure a function's execution time
   */
  measureFunction<T>(
    name: string,
    fn: () => T,
    metadata?: Record<string, unknown>
  ): T {
    this.startTiming(name, metadata);
    try {
      const result = fn();
      this.endTiming(name);
      return result;
    } catch (error) {
      this.endTiming(name);
      throw error;
    }
  }

  /**
   * Measure an async function's execution time
   */
  async measureAsyncFunction<T>(
    name: string,
    fn: () => Promise<T>,
    metadata?: Record<string, unknown>
  ): Promise<T> {
    this.startTiming(name, metadata);
    try {
      const result = await fn();
      this.endTiming(name);
      return result;
    } catch (error) {
      this.endTiming(name);
      throw error;
    }
  }

  /**
   * Get all metrics
   */
  getMetrics(): PerformanceMetrics[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Get a specific metric
   */
  getMetric(name: string): PerformanceMetrics | undefined {
    return this.metrics.get(name);
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics.clear();
  }

  /**
   * Subscribe to performance updates
   */
  subscribe(observer: (metrics: PerformanceMetrics[]) => void): () => void {
    this.observers.add(observer);

    return () => {
      this.observers.delete(observer);
    };
  }

  /**
   * Notify observers of performance updates
   */
  private notifyObservers(metrics: PerformanceMetrics[]): void {
    this.observers.forEach(observer => observer(metrics));
  }

  /**
   * Observe Core Web Vitals
   */
  private observeWebVitals(): void {
    if (typeof window === 'undefined') return;

    // Observe Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];

          this.metrics.set('lcp', {
            name: 'lcp',
            startTime: 0,
            endTime: lastEntry.startTime,
            duration: lastEntry.startTime,
            metadata: {
              element: (lastEntry as any).element?.tagName,
              url: (lastEntry as any).url,
            },
          });
        });

        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (error) {
        console.warn('LCP observation not supported:', error);
      }

      // Observe First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            this.metrics.set('fid', {
              name: 'fid',
              startTime: 0,
              endTime: entry.startTime,
              duration: (entry as any).processingStart - entry.startTime,
              metadata: {
                eventType: entry.name,
              },
            });
          });
        });

        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (error) {
        console.warn('FID observation not supported:', error);
      }

      // Observe Cumulative Layout Shift (CLS)
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          });

          this.metrics.set('cls', {
            name: 'cls',
            startTime: 0,
            endTime: performance.now(),
            duration: clsValue,
            metadata: {
              value: clsValue,
            },
          });
        });

        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        console.warn('CLS observation not supported:', error);
      }
    }
  }

  /**
   * Get Core Web Vitals
   */
  getWebVitals(): {
    lcp?: PerformanceMetrics;
    fid?: PerformanceMetrics;
    cls?: PerformanceMetrics;
  } {
    return {
      lcp: this.metrics.get('lcp'),
      fid: this.metrics.get('fid'),
      cls: this.metrics.get('cls'),
    };
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

/**
 * React hook for performance monitoring
 */
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);

  useEffect(() => {
    const unsubscribe = performanceMonitor.subscribe(newMetrics => {
      setMetrics(prev => [...prev, ...newMetrics]);
    });

    return unsubscribe;
  }, []);

  return {
    metrics,
    startTiming: performanceMonitor.startTiming.bind(performanceMonitor),
    endTiming: performanceMonitor.endTiming.bind(performanceMonitor),
    measureFunction:
      performanceMonitor.measureFunction.bind(performanceMonitor),
    measureAsyncFunction:
      performanceMonitor.measureAsyncFunction.bind(performanceMonitor),
    getWebVitals: performanceMonitor.getWebVitals.bind(performanceMonitor),
    clearMetrics: performanceMonitor.clearMetrics.bind(performanceMonitor),
  };
}

/**
 * Higher-order component for performance monitoring
 */
export function withPerformanceMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  return function PerformanceMonitoredComponent(props: P) {
    const { measureFunction } = usePerformanceMonitor();

    return measureFunction(
      `render-${componentName}`,
      () => React.createElement(Component, props),
      { componentName, props }
    );
  };
}

/**
 * Utility function to measure page load time
 */
export function measurePageLoad(): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('load', () => {
    const loadTime = performance.now();
    (performanceMonitor as any).metrics.set('page-load', {
      name: 'page-load',
      startTime: 0,
      endTime: loadTime,
      duration: loadTime,
      metadata: {
        url: window.location.href,
        timestamp: Date.now(),
      },
    });
  });
}

/**
 * Utility function to measure API call performance
 */
export function measureApiCall<T>(
  url: string,
  apiCall: () => Promise<T>
): Promise<T> {
  return performanceMonitor.measureAsyncFunction(`api-call-${url}`, apiCall, {
    url,
    timestamp: Date.now(),
  });
}
