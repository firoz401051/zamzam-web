import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { BusinessIntelligenceService } from '@/lib/business-intelligence';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // TODO: Add admin role check
    // const userRole = await getUserRole(userId);
    // if (userRole !== 'admin') {
    //   return NextResponse.json(
    //     { success: false, error: 'Admin access required' },
    //     { status: 403 }
    //   );
    // }

    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') as '7d' | '30d' | '90d' | '1y' || '30d';

    const revenueData = await BusinessIntelligenceService.getRevenueAnalytics(timeframe);

    return NextResponse.json({
      success: true,
      data: revenueData
    });

  } catch (error) {
    console.error('Error fetching revenue analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}