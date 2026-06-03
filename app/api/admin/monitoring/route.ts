// System Monitoring API Route

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import MonitoringService from '@/lib/monitoring/service';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const metric = searchParams.get('metric');

    let data;

    switch (metric) {
      case 'health':
        data = await MonitoringService.checkSystemHealth();
        break;
      
      case 'performance':
        const timeRange = searchParams.get('timeRange') || '24';
        const hours = parseInt(timeRange);
        data = MonitoringService.getPerformanceMetrics(hours);
        break;
      
      case 'errors':
        const errorLimit = parseInt(searchParams.get('limit') || '100');
        data = MonitoringService.getErrorLogs(errorLimit);
        break;
      
      case 'alerts':
        const includeResolved = searchParams.get('includeResolved') === 'true';
        data = MonitoringService.getAlerts(includeResolved);
        break;

      case 'overview':
        // Get all monitoring data
        const [health, performance, errors, alerts] = await Promise.all([
          MonitoringService.checkSystemHealth(),
          Promise.resolve(MonitoringService.getPerformanceMetrics(1)),
          Promise.resolve(MonitoringService.getErrorLogs(10)),
          Promise.resolve(MonitoringService.getAlerts(false)),
        ]);
        
        data = { health, performance, errors, alerts };
        break;
      
      default:
        return NextResponse.json(
          { error: 'Invalid metric specified' },
          { status: 400 }
        );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Monitoring API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch monitoring data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, alertId } = body;

    switch (action) {
      case 'resolve_alert':
        if (!alertId) {
          return NextResponse.json(
            { error: 'Alert ID is required' },
            { status: 400 }
          );
        }
        MonitoringService.resolveAlert(alertId);
        return NextResponse.json({ success: true });
      
      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Monitoring API error:', error);
    return NextResponse.json(
      { error: 'Failed to process monitoring action' },
      { status: 500 }
    );
  }
}