// System Monitoring and Health Check Service

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  checks: HealthCheck[];
  timestamp: string;
  uptime: number;
}

export interface HealthCheck {
  name: string;
  status: 'pass' | 'warn' | 'fail';
  responseTime?: number;
  message?: string;
  details?: Record<string, any>;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  threshold: number;
  status: 'good' | 'warning' | 'critical';
  timestamp: string;
}

export interface ErrorLog {
  id: string;
  timestamp: string;
  level: 'error' | 'warning' | 'info';
  message: string;
  stack?: string;
  context?: Record<string, any>;
  userId?: string;
  url?: string;
  userAgent?: string;
}

export interface Alert {
  id: string;
  type: 'system' | 'performance' | 'error' | 'business';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  resolved: boolean;
  resolvedAt?: string;
  metadata?: Record<string, any>;
}

class MonitoringService {
  private static performanceMetrics: PerformanceMetric[] = [];
  private static errorLogs: ErrorLog[] = [];
  private static alerts: Alert[] = [];

  // System Health Monitoring
  static async checkSystemHealth(): Promise<SystemHealth> {
    const startTime = Date.now();
    const checks: HealthCheck[] = [];

    try {
      // Database connectivity check
      const dbCheck = await this.checkDatabaseHealth();
      checks.push(dbCheck);

      // API endpoints health check
      const apiCheck = await this.checkApiHealth();
      checks.push(apiCheck);

      // External services check
      const externalCheck = await this.checkExternalServices();
      checks.push(externalCheck);

      // Memory and CPU check
      const systemResourceCheck = await this.checkSystemResources();
      checks.push(systemResourceCheck);

      // Determine overall status
      const failedChecks = checks.filter(check => check.status === 'fail').length;
      const warningChecks = checks.filter(check => check.status === 'warn').length;

      let status: 'healthy' | 'warning' | 'critical' = 'healthy';
      if (failedChecks > 0) {
        status = 'critical';
      } else if (warningChecks > 0) {
        status = 'warning';
      }

      return {
        status,
        checks,
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      };

    } catch (error) {
      console.error('Error checking system health:', error);
      return {
        status: 'critical',
        checks: [{
          name: 'system',
          status: 'fail',
          message: 'Failed to perform health check',
          details: { error: error instanceof Error ? error.message : 'Unknown error' }
        }],
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      };
    }
  }

  private static async checkDatabaseHealth(): Promise<HealthCheck> {
    const startTime = Date.now();
    
    try {
      // Test Sanity connection
      const { client } = await import('@/sanity/lib/client');
      await client.fetch('count(*[_type == "product"][0...1])');
      
      const responseTime = Date.now() - startTime;
      
      return {
        name: 'database',
        status: responseTime < 1000 ? 'pass' : 'warn',
        responseTime,
        message: responseTime < 1000 ? 'Database responsive' : 'Database slow response',
      };
    } catch (error) {
      return {
        name: 'database',
        status: 'fail',
        responseTime: Date.now() - startTime,
        message: 'Database connection failed',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }

  private static async checkApiHealth(): Promise<HealthCheck> {
    const startTime = Date.now();
    
    try {
      // Test internal API endpoints
      const endpoints = [
        '/api/products',
        '/api/categories',
        '/api/user/profile'
      ];

      const results = await Promise.allSettled(
        endpoints.map(async (endpoint) => {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${endpoint}`, {
            method: 'HEAD',
            signal: AbortSignal.timeout(5000)
          });
          return { endpoint, status: response.status };
        })
      );

      const failedEndpoints = results.filter(result => 
        result.status === 'rejected' || 
        (result.status === 'fulfilled' && result.value.status >= 500)
      ).length;

      const responseTime = Date.now() - startTime;

      return {
        name: 'api',
        status: failedEndpoints === 0 ? 'pass' : failedEndpoints < endpoints.length ? 'warn' : 'fail',
        responseTime,
        message: `${endpoints.length - failedEndpoints}/${endpoints.length} API endpoints healthy`,
        details: { totalEndpoints: endpoints.length, failedEndpoints }
      };

    } catch (error) {
      return {
        name: 'api',
        status: 'fail',
        responseTime: Date.now() - startTime,
        message: 'API health check failed',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }

  private static async checkExternalServices(): Promise<HealthCheck> {
    const startTime = Date.now();
    
    try {
      // Check external service dependencies
      const services = [
        { name: 'Stripe', url: 'https://api.stripe.com/v1' },
        { name: 'Clerk', url: 'https://api.clerk.dev' }
      ];

      const results = await Promise.allSettled(
        services.map(async (service) => {
          const response = await fetch(service.url, {
            method: 'HEAD',
            signal: AbortSignal.timeout(5000)
          });
          return { service: service.name, status: response.status };
        })
      );

      const failedServices = results.filter(result => 
        result.status === 'rejected' || 
        (result.status === 'fulfilled' && result.value.status >= 500)
      ).length;

      const responseTime = Date.now() - startTime;

      return {
        name: 'external_services',
        status: failedServices === 0 ? 'pass' : failedServices < services.length ? 'warn' : 'fail',
        responseTime,
        message: `${services.length - failedServices}/${services.length} external services reachable`,
        details: { totalServices: services.length, failedServices }
      };

    } catch (error) {
      return {
        name: 'external_services',
        status: 'warn',
        responseTime: Date.now() - startTime,
        message: 'External services check partial failure',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }

  private static async checkSystemResources(): Promise<HealthCheck> {
    try {
      const memoryUsage = process.memoryUsage();
      const cpuUsage = process.cpuUsage();
      
      // Convert to MB
      const heapUsedMB = memoryUsage.heapUsed / 1024 / 1024;
      const heapTotalMB = memoryUsage.heapTotal / 1024 / 1024;
      const memoryUsagePercent = (heapUsedMB / heapTotalMB) * 100;

      let status: 'pass' | 'warn' | 'fail' = 'pass';
      let message = 'System resources normal';

      if (memoryUsagePercent > 90) {
        status = 'fail';
        message = 'Critical memory usage';
      } else if (memoryUsagePercent > 75) {
        status = 'warn';
        message = 'High memory usage';
      }

      return {
        name: 'system_resources',
        status,
        message,
        details: {
          memoryUsage: {
            heapUsed: `${heapUsedMB.toFixed(2)} MB`,
            heapTotal: `${heapTotalMB.toFixed(2)} MB`,
            usagePercent: `${memoryUsagePercent.toFixed(2)}%`
          },
          uptime: `${Math.floor(process.uptime())} seconds`
        }
      };

    } catch (error) {
      return {
        name: 'system_resources',
        status: 'fail',
        message: 'Failed to check system resources',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }

  // Performance Monitoring
  static recordPerformanceMetric(name: string, value: number, unit: string, threshold: number) {
    const status = value > threshold ? 'critical' : value > threshold * 0.8 ? 'warning' : 'good';
    
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      threshold,
      status,
      timestamp: new Date().toISOString()
    };

    this.performanceMetrics.push(metric);
    
    // Keep only last 1000 metrics
    if (this.performanceMetrics.length > 1000) {
      this.performanceMetrics = this.performanceMetrics.slice(-1000);
    }

    // Create alert if critical
    if (status === 'critical') {
      this.createAlert({
        type: 'performance',
        severity: 'high',
        title: `Performance Alert: ${name}`,
        message: `${name} exceeded threshold: ${value}${unit} > ${threshold}${unit}`,
        metadata: { metric }
      });
    }
  }

  static getPerformanceMetrics(hours: number = 24): PerformanceMetric[] {
    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - hours);
    
    return this.performanceMetrics.filter(metric => 
      new Date(metric.timestamp) > cutoff
    );
  }

  // Error Tracking
  static logError(error: Error | string, context?: Record<string, any>, userId?: string, url?: string, userAgent?: string) {
    const errorLog: ErrorLog = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      level: 'error',
      message: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      context,
      userId,
      url,
      userAgent
    };

    this.errorLogs.push(errorLog);
    
    // Keep only last 10000 errors
    if (this.errorLogs.length > 10000) {
      this.errorLogs = this.errorLogs.slice(-10000);
    }

    // Create alert for errors
    this.createAlert({
      type: 'error',
      severity: 'medium',
      title: 'Application Error',
      message: errorLog.message,
      metadata: { errorId: errorLog.id, context }
    });

    console.error('Application Error:', errorLog);
  }

  static getErrorLogs(hours: number = 24): ErrorLog[] {
    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - hours);
    
    return this.errorLogs.filter(log => 
      new Date(log.timestamp) > cutoff
    );
  }

  // Alert Management
  static createAlert(alertData: Omit<Alert, 'id' | 'timestamp' | 'resolved'>) {
    const alert: Alert = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      resolved: false,
      ...alertData
    };

    this.alerts.push(alert);
    
    // Keep only last 1000 alerts
    if (this.alerts.length > 1000) {
      this.alerts = this.alerts.slice(-1000);
    }

    // In a real implementation, this would trigger notifications
    console.warn('Alert Created:', alert);
  }

  static getAlerts(includeResolved: boolean = false): Alert[] {
    return includeResolved ? this.alerts : this.alerts.filter(alert => !alert.resolved);
  }

  static resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      alert.resolvedAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  // Business Intelligence Monitoring
  static async monitorBusinessMetrics() {
    try {
      const { BusinessIntelligenceService } = await import('../business-intelligence/analytics');
      
      // Monitor key business metrics
      const revenueData = await BusinessIntelligenceService.getRevenueAnalytics('7d');
      const todayRevenue = revenueData.find((d: any) => d.date === new Date().toISOString().split('T')[0])?.revenue || 0;
      
      // Create alerts for business anomalies
      if (todayRevenue < 1000) { // Threshold example
        this.createAlert({
          type: 'business',
          severity: 'medium',
          title: 'Low Daily Revenue',
          message: `Today's revenue (${todayRevenue}) is below expected threshold`,
          metadata: { revenue: todayRevenue, threshold: 1000 }
        });
      }

      // Monitor inventory levels
      const inventoryInsights = await BusinessIntelligenceService.getInventoryInsights();
      const lowStockProducts = inventoryInsights.filter((p: any) => p.recommendation === 'reorder');
      
      if (lowStockProducts.length > 0) {
        this.createAlert({
          type: 'business',
          severity: 'medium',
          title: 'Low Stock Alert',
          message: `${lowStockProducts.length} products need restocking`,
          metadata: { products: lowStockProducts.map((p: any) => p.name) }
        });
      }

    } catch (error) {
      this.logError(error instanceof Error ? error : new Error('Business metrics monitoring failed'));
    }
  }

  // Get comprehensive system status
  static async getSystemStatus() {
    const [health, performanceMetrics, recentErrors, activeAlerts] = await Promise.all([
      this.checkSystemHealth(),
      Promise.resolve(this.getPerformanceMetrics(1)), // Last hour
      Promise.resolve(this.getErrorLogs(24)), // Last 24 hours
      Promise.resolve(this.getAlerts(false)) // Active alerts only
    ]);

    return {
      health,
      performance: {
        metrics: performanceMetrics,
        summary: {
          totalMetrics: performanceMetrics.length,
          criticalMetrics: performanceMetrics.filter(m => m.status === 'critical').length,
          warningMetrics: performanceMetrics.filter(m => m.status === 'warning').length
        }
      },
      errors: {
        logs: recentErrors.slice(-50), // Latest 50 errors
        summary: {
          totalErrors: recentErrors.length,
          errorRate: recentErrors.length / 24 // Errors per hour
        }
      },
      alerts: {
        active: activeAlerts,
        summary: {
          total: activeAlerts.length,
          critical: activeAlerts.filter(a => a.severity === 'critical').length,
          high: activeAlerts.filter(a => a.severity === 'high').length,
          medium: activeAlerts.filter(a => a.severity === 'medium').length,
          low: activeAlerts.filter(a => a.severity === 'low').length
        }
      },
      timestamp: new Date().toISOString()
    };
  }
}

export default MonitoringService;