// Performance monitoring utilities for debugging render performance
import React from 'react';

interface PerformanceMetrics {
  componentName: string;
  renderCount: number;
  lastRenderTime: number;
  totalRenderTime: number;
  averageRenderTime: number;
}

class PerformanceMonitor {
  private metrics = new Map<string, PerformanceMetrics>();
  private enabled = process.env.NODE_ENV === 'development';

  startRender(componentName: string): string {
    if (!this.enabled) return '';
    
    const startTime = performance.now();
    const id = `${componentName}-${Date.now()}-${Math.random()}`;
    
    // Store start time in a weak way to avoid memory leaks
    (window as any)[`perf_${id}`] = startTime;
    
    return id;
  }

  endRender(id: string, componentName: string): void {
    if (!this.enabled || !id) return;
    
    const startTime = (window as any)[`perf_${id}`];
    if (!startTime) return;
    
    const renderTime = performance.now() - startTime;
    
    // Clean up
    delete (window as any)[`perf_${id}`];
    
    // Update metrics
    const existing = this.metrics.get(componentName);
    if (existing) {
      existing.renderCount++;
      existing.lastRenderTime = renderTime;
      existing.totalRenderTime += renderTime;
      existing.averageRenderTime = existing.totalRenderTime / existing.renderCount;
    } else {
      this.metrics.set(componentName, {
        componentName,
        renderCount: 1,
        lastRenderTime: renderTime,
        totalRenderTime: renderTime,
        averageRenderTime: renderTime
      });
    }
    
    // Log slow renders
    if (renderTime > 16) { // 16ms = 60fps threshold
      console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
    }
  }

  getMetrics(): PerformanceMetrics[] {
    return Array.from(this.metrics.values());
  }

  logMetrics(): void {
    if (!this.enabled) return;
    
    console.group('Performance Metrics');
    this.metrics.forEach((metric) => {
      console.log(`${metric.componentName}:`, {
        renderCount: metric.renderCount,
        lastRenderTime: `${metric.lastRenderTime.toFixed(2)}ms`,
        averageRenderTime: `${metric.averageRenderTime.toFixed(2)}ms`
      });
    });
    console.groupEnd();
  }

  clearMetrics(): void {
    this.metrics.clear();
  }
}

export const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
export function usePerformanceMonitor(componentName: string) {
  React.useEffect(() => {
    const id = performanceMonitor.startRender(componentName);
    
    return () => {
      performanceMonitor.endRender(id, componentName);
    };
  });
}

// HOC for performance monitoring
export function withPerformanceMonitor<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) {
  return React.forwardRef<any, P>((props, ref) => {
    usePerformanceMonitor(componentName);
    return React.createElement(WrappedComponent, { ...props, ref } as any);
  });
}
