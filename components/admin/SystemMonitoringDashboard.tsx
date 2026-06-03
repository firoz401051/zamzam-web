"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Server,
  Database,
  Zap,
  Eye,
  Shield,
  TrendingUp,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { MonitoringService } from '@/lib/monitoring';
import type {
  SystemHealth,
  HealthCheck,
  PerformanceMetric,
  ErrorLog,
  Alert
} from '@/lib/monitoring';
import { toast } from 'sonner';

export default function SystemMonitoringDashboard() {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchMonitoringData();
    
    // Set up auto-refresh every 30 seconds
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(fetchMonitoringData, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const fetchMonitoringData = async () => {
    try {
      const systemStatus = await MonitoringService.getSystemStatus();
      
      setSystemHealth(systemStatus.health);
      setPerformanceMetrics(systemStatus.performance.metrics);
      setErrorLogs(systemStatus.errors.logs);
      setAlerts(systemStatus.alerts.active);
    } catch (error) {
      console.error('Error fetching monitoring data:', error);
      toast.error('Failed to load monitoring data');
    } finally {
      setLoading(false);
    }
  };

  const runHealthCheck = async () => {
    setLoading(true);
    try {
      const health = await MonitoringService.checkSystemHealth();
      setSystemHealth(health);
      toast.success('Health check completed');
    } catch (error) {
      toast.error('Health check failed');
    } finally {
      setLoading(false);
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      const success = MonitoringService.resolveAlert(alertId);
      if (success) {
        setAlerts(alerts.filter(alert => alert.id !== alertId));
        toast.success('Alert resolved');
      } else {
        toast.error('Failed to resolve alert');
      }
    } catch (error) {
      toast.error('Error resolving alert');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'pass':
      case 'good':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
      case 'warn':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'critical':
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'pass':
      case 'good':
        return 'bg-green-100 text-green-800';
      case 'warning':
      case 'warn':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
      case 'fail':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && !systemHealth) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-500" />
            System Monitoring
          </h1>
          <p className="text-gray-600 mt-1">Real-time system health and performance monitoring</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setAutoRefresh(!autoRefresh)}
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto Refresh
          </Button>
          <Button onClick={runHealthCheck} variant="outline" size="sm" disabled={loading}>
            <Activity className="h-4 w-4 mr-2" />
            Run Health Check
          </Button>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">System Status</p>
                <div className="flex items-center gap-2 mt-1">
                  {systemHealth && getStatusIcon(systemHealth.status)}
                  <span className="text-xl font-bold capitalize">
                    {systemHealth?.status || 'Unknown'}
                  </span>
                </div>
              </div>
              <Server className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Uptime</p>
                <div className="text-xl font-bold">
                  {systemHealth ? `${Math.floor(systemHealth.uptime / 3600)}h ${Math.floor((systemHealth.uptime % 3600) / 60)}m` : '0h 0m'}
                </div>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Alerts</p>
                <div className="text-xl font-bold">{alerts.length}</div>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Error Rate</p>
                <div className="text-xl font-bold">{errorLogs.length}/24h</div>
              </div>
              <Zap className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monitoring Tabs */}
      <Tabs defaultValue="health" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="health">Health Checks</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="errors">Error Logs</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        {/* Health Checks */}
        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Health Checks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemHealth?.checks.map((check, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(check.status)}
                      <div>
                        <h3 className="font-medium capitalize">{check.name.replace('_', ' ')}</h3>
                        <p className="text-sm text-gray-600">{check.message}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(check.status)}>
                        {check.status}
                      </Badge>
                      {check.responseTime && (
                        <div className="text-sm text-gray-500 mt-1">
                          {check.responseTime}ms
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Last Health Check Details */}
          {systemHealth && (
            <Card>
              <CardHeader>
                <CardTitle>Health Check Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Last Check:</span>
                    <p>{new Date(systemHealth.timestamp).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="font-medium">System Uptime:</span>
                    <p>{Math.floor(systemHealth.uptime)} seconds</p>
                  </div>
                  <div>
                    <span className="font-medium">Total Checks:</span>
                    <p>{systemHealth.checks.length}</p>
                  </div>
                  <div>
                    <span className="font-medium">Failed Checks:</span>
                    <p>{systemHealth.checks.filter(c => c.status === 'fail').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Performance Metrics */}
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={performanceMetrics.slice(-50)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleString()}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ r: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {performanceMetrics.slice(-10).map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{metric.name}</h3>
                      <p className="text-sm text-gray-600">
                        Threshold: {metric.threshold}{metric.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        {metric.value}{metric.unit}
                      </div>
                      <Badge className={getStatusColor(metric.status)}>
                        {metric.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Error Logs */}
        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Error Logs</CardTitle>
            </CardHeader>
            <CardContent>
              {errorLogs.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {errorLogs.map((error, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-red-50 border-red-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-red-100 text-red-800">
                              {error.level}
                            </Badge>
                            <span className="text-sm text-gray-600">
                              {new Date(error.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <h3 className="font-medium mt-1">{error.message}</h3>
                          {error.stack && (
                            <details className="mt-2">
                              <summary className="text-sm text-gray-600 cursor-pointer">
                                Stack trace
                              </summary>
                              <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                                {error.stack}
                              </pre>
                            </details>
                          )}
                          {error.context && (
                            <div className="mt-2 text-sm">
                              <span className="font-medium">Context:</span>
                              <pre className="text-xs bg-gray-100 p-2 rounded mt-1">
                                {JSON.stringify(error.context, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                  <p>No recent errors found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts */}
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              {alerts.length > 0 ? (
                <div className="space-y-3">
                  {alerts.map((alert, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getSeverityColor(alert.severity)}>
                              {alert.severity}
                            </Badge>
                            <Badge variant="outline">{alert.type}</Badge>
                            <span className="text-sm text-gray-600">
                              {new Date(alert.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <h3 className="font-medium">{alert.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                          {alert.metadata && (
                            <details className="mt-2">
                              <summary className="text-sm text-gray-600 cursor-pointer">
                                Additional details
                              </summary>
                              <pre className="text-xs bg-gray-100 p-2 rounded mt-1">
                                {JSON.stringify(alert.metadata, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                        <Button
                          onClick={() => resolveAlert(alert.id)}
                          variant="outline"
                          size="sm"
                        >
                          Resolve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                  <p>No active alerts</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}