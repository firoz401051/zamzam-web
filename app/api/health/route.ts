// Health Check API Route

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import MonitoringService from '@/lib/monitoring/service';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Simple health check
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV
    };

    const responseTime = Date.now() - startTime;
    
    // Track API performance
    MonitoringService.recordPerformanceMetric(
      'api_health_check',
      responseTime,
      'ms',
      100 // 100ms threshold
    );

    return NextResponse.json(health);
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    MonitoringService.logError(
      error instanceof Error ? error : new Error('Health check failed'),
      {
        context: 'health_check_api',
        responseTime
      }
    );

    return NextResponse.json(
      { status: 'error', message: 'Health check failed' },
      { status: 500 }
    );
  }
}

export async function HEAD() {
  // For lightweight health checks
  return new NextResponse(null, { status: 200 });
}