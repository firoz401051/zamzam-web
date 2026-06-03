import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { LoyaltyService } from '@/lib/loyalty';

export async function GET(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();
    const { searchParams } = new URL(request.url);
    const requestedUserId = searchParams.get('userId');

    // Allow users to fetch their own data, or admin to fetch any user's data
    if (!clerkUserId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const targetUserId = requestedUserId || clerkUserId;

    // Fetch loyalty data and recent transactions
    const [loyaltyData, transactions] = await Promise.all([
      LoyaltyService.getUserLoyaltyData(targetUserId),
      LoyaltyService.getTransactionHistory(targetUserId, 20)
    ]);

    if (!loyaltyData) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      loyaltyData,
      transactions
    });

  } catch (error) {
    console.error('Error fetching loyalty data:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();
    
    if (!clerkUserId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { action, points, description, orderId, eventType } = await request.json();

    let result = false;

    switch (action) {
      case 'redeem':
        if (!points || !orderId) {
          return NextResponse.json(
            { success: false, error: 'Missing required fields for redemption' },
            { status: 400 }
          );
        }
        result = await LoyaltyService.redeemPoints(
          clerkUserId,
          points,
          orderId,
          description
        );
        break;

      case 'bonus':
        if (!eventType) {
          return NextResponse.json(
            { success: false, error: 'Missing event type for bonus points' },
            { status: 400 }
          );
        }
        result = await LoyaltyService.awardBonusPoints(
          clerkUserId,
          eventType,
          points,
          description
        );
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

    if (result) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to process request' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error processing loyalty request:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}