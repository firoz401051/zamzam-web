import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { LoyaltyService } from '@/lib/loyalty';

// Admin only endpoint to award bonus points to users
export async function POST(request: NextRequest) {
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

    const { userId, points, description, eventType } = await request.json();

    if (!userId || !points || points <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      );
    }

    const result = await LoyaltyService.awardBonusPoints(
      userId,
      eventType || 'admin_award',
      points,
      description || `Bonus points awarded by admin`
    );

    if (result) {
      return NextResponse.json({ 
        success: true,
        message: `Successfully awarded ${points} points to user` 
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to award points' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error awarding bonus points:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}