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

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    const [
      productPerformance,
      forecast,
      inventoryInsights,
      advancedMetrics
    ] = await Promise.all([
      BusinessIntelligenceService.getProductPerformance(limit),
      BusinessIntelligenceService.getRevenueForecast(6),
      BusinessIntelligenceService.getInventoryInsights(),
      BusinessIntelligenceService.getAdvancedMetrics()
    ]);

    return NextResponse.json({
      success: true,
      data: {
        productPerformance,
        forecast,
        inventoryInsights,
        advancedMetrics
      }
    });

  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}