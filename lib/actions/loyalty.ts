"use server";

import { auth } from '@clerk/nextjs/server';
import { LoyaltyService, getMaxRedeemablePoints } from '@/lib/loyalty';

export async function redeemLoyaltyPoints(
  points: number, 
  orderId: string,
  orderTotal: number
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // Get user's current loyalty data
    const loyaltyData = await LoyaltyService.getUserLoyaltyData(userId);
    if (!loyaltyData) {
      return { success: false, error: 'User loyalty data not found' };
    }

    // Check if user has enough points
    if (loyaltyData.rewardPoints < points) {
      return { 
        success: false, 
        error: `Insufficient points. You have ${loyaltyData.rewardPoints} points available.` 
      };
    }

    // Check maximum redeemable points for this order
    const maxRedeemable = getMaxRedeemablePoints(orderTotal, loyaltyData.rewardPoints);
    if (points > maxRedeemable) {
      return { 
        success: false, 
        error: `Maximum ${maxRedeemable} points can be redeemed for this order` 
      };
    }

    const result = await LoyaltyService.redeemPoints(
      userId,
      points,
      orderId,
      `Points redeemed for order discount`
    );

    if (result) {
      return { 
        success: true, 
        message: `Successfully redeemed ${points} points`,
        remainingPoints: loyaltyData.rewardPoints - points
      };
    } else {
      return { success: false, error: 'Failed to redeem points' };
    }

  } catch (error) {
    console.error('Error redeeming points:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function awardOrderPoints(
  userId: string,
  orderId: string, 
  orderTotal: number
) {
  try {
    const result = await LoyaltyService.processOrderCompletion(
      userId,
      orderId,
      orderTotal
    );

    if (result) {
      return { success: true, message: 'Points awarded successfully' };
    } else {
      return { success: false, error: 'Failed to award points' };
    }

  } catch (error) {
    console.error('Error awarding order points:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function awardBonusPointsAction(
  userId: string,
  eventType: string,
  customPoints?: number,
  description?: string
) {
  try {
    const { userId: adminUserId } = await auth();
    
    if (!adminUserId) {
      return { success: false, error: 'Unauthorized' };
    }

    // TODO: Add admin role verification
    // const userRole = await getUserRole(adminUserId);
    // if (userRole !== 'admin') {
    //   return { success: false, error: 'Admin access required' };
    // }

    const result = await LoyaltyService.awardBonusPoints(
      userId,
      eventType,
      customPoints,
      description
    );

    if (result) {
      return { success: true, message: 'Bonus points awarded successfully' };
    } else {
      return { success: false, error: 'Failed to award bonus points' };
    }

  } catch (error) {
    console.error('Error awarding bonus points:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function getLoyaltyTransactionHistory(userId: string, limit: number = 50) {
  try {
    const { userId: requestingUserId } = await auth();
    
    if (!requestingUserId) {
      return { success: false, error: 'Unauthorized' };
    }

    // Allow users to fetch their own data only (unless admin)
    if (requestingUserId !== userId) {
      // TODO: Add admin role check
      // const userRole = await getUserRole(requestingUserId);
      // if (userRole !== 'admin') {
      //   return { success: false, error: 'Access denied' };
      // }
    }

    const transactions = await LoyaltyService.getTransactionHistory(userId, limit);

    return { 
      success: true, 
      transactions 
    };

  } catch (error) {
    console.error('Error fetching transaction history:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function getUserLoyaltyStats(userId: string) {
  try {
    const { userId: requestingUserId } = await auth();
    
    if (!requestingUserId) {
      return { success: false, error: 'Unauthorized' };
    }

    // Allow users to fetch their own data only (unless admin)
    if (requestingUserId !== userId) {
      // TODO: Add admin role check
      // const userRole = await getUserRole(requestingUserId);
      // if (userRole !== 'admin') {
      //   return { success: false, error: 'Access denied' };
      // }
    }

    const loyaltyData = await LoyaltyService.getUserLoyaltyData(userId);

    if (loyaltyData) {
      return { success: true, loyaltyData };
    } else {
      return { success: false, error: 'User loyalty data not found' };
    }

  } catch (error) {
    console.error('Error fetching loyalty stats:', error);
    return { success: false, error: 'Internal server error' };
  }
}