import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { LoyaltyService } from '@/lib/loyalty';

// Admin endpoint to get loyalty system statistics
export async function GET() {
  try {
    const { userId: clerkUserId } = await auth();
    
    if (!clerkUserId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // TODO: Add admin role check
    // const userRole = await getUserRole(clerkUserId);
    // if (userRole !== 'admin') {
    //   return NextResponse.json(
    //     { success: false, error: 'Admin access required' },
    //     { status: 403 }
    //   );
    // }

    const stats = await LoyaltyService.getLoyaltyStatistics();

    if (stats) {
      return NextResponse.json({
        success: true,
        stats
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch statistics' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error fetching loyalty statistics:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}