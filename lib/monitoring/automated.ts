// Automated Monitoring Tasks

import MonitoringService from './service';

class AutomatedMonitoring {
  private static instance: AutomatedMonitoring;
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {}

  static getInstance(): AutomatedMonitoring {
    if (!AutomatedMonitoring.instance) {
      AutomatedMonitoring.instance = new AutomatedMonitoring();
    }
    return AutomatedMonitoring.instance;
  }

  // Start all monitoring tasks
  startMonitoring() {
    // Only start monitoring on the server side
    if (typeof window !== 'undefined') {
      console.warn('Monitoring can only be started on the server side');
      return;
    }

    try {
      this.startPerformanceMonitoring();
      this.startBusinessMetricsMonitoring();
      this.startHealthChecks();
      this.startErrorTracking();
      console.log('✅ All monitoring tasks started successfully');
    } catch (error) {
      console.error('❌ Failed to start monitoring tasks:', error);
    }
  }

  // Stop all monitoring tasks
  stopMonitoring() {
    this.intervals.forEach((interval) => {
      clearInterval(interval);
    });
    this.intervals.clear();
  }

  // Monitor system performance - SIMPLIFIED to prevent edge runtime issues
  private startPerformanceMonitoring() {
    // Only run on server side
    if (typeof window !== 'undefined') return;

    const interval = setInterval(async () => {
      try {
        // Skip API monitoring to prevent URL parsing issues in edge runtime
        // const startTime = Date.now();
        // const response = await fetch('/api/health', {
        //   method: 'HEAD',
        //   signal: AbortSignal.timeout(5000)
        // });
        // const responseTime = Date.now() - startTime;
        
        // Monitor memory usage (only available on server)
        if (typeof process !== 'undefined' && process.memoryUsage) {
          const memoryUsage = process.memoryUsage();
          const heapUsedMB = memoryUsage.heapUsed / 1024 / 1024;
          
          MonitoringService.recordPerformanceMetric(
            'memory_usage',
            heapUsedMB,
            'MB',
            512 // 512 MB threshold
          );
        }

      } catch (error) {
        // Don't log monitoring errors to prevent infinite loops
        console.warn('Performance monitoring warning:', error);
      }
    }, 60000); // Every minute

    this.intervals.set('performance', interval);
  }

  // Monitor business metrics
  private startBusinessMetricsMonitoring() {
    // Only run on server side
    if (typeof window !== 'undefined') return;

    const interval = setInterval(async () => {
      try {
        await MonitoringService.monitorBusinessMetrics();
      } catch (error) {
        MonitoringService.logError(
          error instanceof Error ? error : new Error('Business metrics monitoring failed'),
          { context: 'automated_business_monitoring' }
        );
      }
    }, 300000); // Every 5 minutes

    this.intervals.set('business', interval);
  }

  // Run health checks periodically
  private startHealthChecks() {
    // Only run on server side
    if (typeof window !== 'undefined') return;

    const interval = setInterval(async () => {
      try {
        const health = await MonitoringService.checkSystemHealth();
        
        // Create alerts for critical issues
        if (health.status === 'critical') {
          MonitoringService.createAlert({
            type: 'system',
            severity: 'critical',
            title: 'System Health Critical',
            message: 'One or more critical system components are failing',
            metadata: { 
              failedChecks: health.checks.filter((c: any) => c.status === 'fail').length,
              checks: health.checks 
            }
          });
        }
      } catch (error) {
        MonitoringService.logError(
          error instanceof Error ? error : new Error('Health check monitoring failed'),
          { context: 'automated_health_monitoring' }
        );
      }
    }, 120000); // Every 2 minutes

    this.intervals.set('health', interval);
  }

  // Track application errors - DISABLED to prevent infinite loops
  private startErrorTracking() {
    // Note: Console.error override is disabled to prevent infinite error loops
    // that were causing the monitoring system to crash the application.
    // Error tracking will be handled through explicit error reporting instead.
    
    // Only set up Node.js process listeners on the server side
    if (typeof window === 'undefined' && typeof process !== 'undefined' && process.on) {
      // Set up unhandled promise rejection tracking
      process.on('unhandledRejection', (reason, promise) => {
        try {
          MonitoringService.logError(
            reason instanceof Error ? reason : new Error(String(reason)),
            { 
              context: 'unhandled_promise_rejection',
              promise: String(promise)
            }
          );
        } catch (err) {
          // Prevent infinite loops by not logging monitoring errors
          console.warn('Monitoring error:', err);
        }
      });

      // Set up uncaught exception tracking
      process.on('uncaughtException', (error) => {
        try {
          MonitoringService.logError(error, {
            context: 'uncaught_exception'
          });
          
          // Create critical alert
          MonitoringService.createAlert({
            type: 'error',
            severity: 'critical',
            title: 'Uncaught Exception',
            message: error.message,
            metadata: { 
              stack: error.stack,
              name: error.name
            }
          });
        } catch (err) {
          // Prevent infinite loops by not logging monitoring errors
          console.warn('Monitoring error:', err);
        }
      });
    }

    // Set up browser-side error tracking
    if (typeof window !== 'undefined') {
      // Listen for unhandled errors in the browser
      window.addEventListener('error', (event) => {
        MonitoringService.logError(event.error || new Error(event.message), {
          context: 'window_error',
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        });
      });

      // Listen for unhandled promise rejections in the browser
      window.addEventListener('unhandledrejection', (event) => {
        MonitoringService.logError(
          event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
          { 
            context: 'window_unhandled_rejection'
          }
        );
      });
    }
  }

  // Custom error reporter for React error boundaries
  static reportError(error: Error, errorInfo: any) {
    MonitoringService.logError(error, {
      context: 'react_error_boundary',
      componentStack: errorInfo.componentStack,
      errorBoundary: true
    });

    MonitoringService.createAlert({
      type: 'error',
      severity: 'high',
      title: 'React Component Error',
      message: error.message,
      metadata: {
        componentStack: errorInfo.componentStack,
        stack: error.stack
      }
    });
  }

  // Performance tracking for API routes
  static trackApiPerformance(path: string, method: string, responseTime: number, statusCode: number) {
    MonitoringService.recordPerformanceMetric(
      `api_${method.toLowerCase()}_${path.replace(/[^a-zA-Z0-9]/g, '_')}`,
      responseTime,
      'ms',
      1000 // 1 second threshold
    );

    // Track error rates
    if (statusCode >= 500) {
      MonitoringService.logError(
        new Error(`API Error: ${method} ${path} returned ${statusCode}`),
        {
          context: 'api_error',
          path,
          method,
          statusCode,
          responseTime
        }
      );
    }
  }

  // Database query performance tracking
  static trackDatabasePerformance(operation: string, duration: number, recordCount?: number) {
    MonitoringService.recordPerformanceMetric(
      `db_${operation}`,
      duration,
      'ms',
      5000 // 5 second threshold
    );

    if (recordCount !== undefined) {
      MonitoringService.recordPerformanceMetric(
        `db_${operation}_records`,
        recordCount,
        'count',
        10000 // 10k records threshold
      );
    }
  }

  // User session tracking
  static trackUserSession(userId: string, action: string, metadata?: Record<string, any>) {
    // This could be used for user behavior analytics
    console.log(`User ${userId} performed ${action}`, metadata);
  }
}

export default AutomatedMonitoring;