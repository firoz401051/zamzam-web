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

    const customerSegments = await BusinessIntelligenceService.getCustomerSegmentation();

    return NextResponse.json({
      success: true,
      data: customerSegments
    });

  } catch (error) {
    console.error('Error fetching customer segmentation:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}