import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { MonitoringService } from '@/lib/monitoring';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const systemStatus = await MonitoringService.getSystemStatus();

    return NextResponse.json({
      success: true,
      data: systemStatus
    });

  } catch (error) {
    console.error('Error fetching system status:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { action, alertId } = await request.json();

    if (action === 'resolve_alert' && alertId) {
      const success = MonitoringService.resolveAlert(alertId);
      
      if (success) {
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json(
          { success: false, error: 'Alert not found' },
          { status: 404 }
        );
      }
    }

    if (action === 'health_check') {
      const health = await MonitoringService.checkSystemHealth();
      return NextResponse.json({
        success: true,
        data: health
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error processing monitoring request:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}