import { client } from '@/sanity/lib/client';

export interface LoyaltyTransaction {
  _type: 'loyaltyTransaction';
  userId: string;
  type: 'earned' | 'redeemed' | 'expired' | 'bonus';
  points: number;
  orderId?: string;
  description: string;
  createdAt: string;
  expiresAt?: string;
  metadata?: {
    orderTotal?: number;
    eventType?: string;
    previousTier?: string;
    newTier?: string;
  };
}

export interface UserLoyaltyData {
  loyaltyPoints: number;
  rewardPoints: number;
  membershipType: 'standard' | 'premium' | 'business' | 'vip';
  totalSpent: number;
}

export class LoyaltyService {
  // Get user's loyalty data
  static async getUserLoyaltyData(userId: string): Promise<UserLoyaltyData | null> {
    try {
      const user = await client.fetch(
        `*[_type == "user" && clerkUserId == $userId][0]{
          loyaltyPoints,
          rewardPoints,
          membershipType,
          totalSpent
        }`,
        { userId }
      );
      return user;
    } catch (error) {
      console.error('Error fetching user loyalty data:', error);
      return null;
    }
  }

  // Add points to user account
  static async addPoints(
    userId: string,
    points: number,
    type: LoyaltyTransaction['type'] = 'earned',
    description: string,
    metadata?: LoyaltyTransaction['metadata'],
    orderId?: string
  ): Promise<boolean> {
    try {
      // Get current user data
      const user = await client.fetch(
        `*[_type == "user" && clerkUserId == $userId][0]`,
        { userId }
      );

      if (!user) {
        throw new Error('User not found');
      }

      const newPoints = (user.loyaltyPoints || 0) + points;
      const newRewardPoints = (user.rewardPoints || 0) + points;

      // Calculate new tier
      const { calculateTierFromPoints } = await import('./config');
      const newTier = calculateTierFromPoints(newPoints);

      // Update user's points and tier
      await client
        .patch(user._id)
        .set({
          loyaltyPoints: newPoints,
          rewardPoints: newRewardPoints,
          membershipType: newTier,
          updatedAt: new Date().toISOString(),
        })
        .commit();

      // Create transaction record
      await client.create({
        _type: 'loyaltyTransaction',
        userId,
        type,
        points,
        orderId,
        description,
        createdAt: new Date().toISOString(),
        expiresAt: type === 'earned' ? 
          new Date(Date.now() + 24 * 30 * 24 * 60 * 60 * 1000).toISOString() : // 24 months
          undefined,
        metadata: {
          ...metadata,
          previousTier: user.membershipType,
          newTier,
        },
      });

      return true;
    } catch (error) {
      console.error('Error adding points:', error);
      return false;
    }
  }

  // Redeem points
  static async redeemPoints(
    userId: string,
    points: number,
    orderId: string,
    description: string = 'Points redeemed for order discount'
  ): Promise<boolean> {
    try {
      const user = await client.fetch(
        `*[_type == "user" && clerkUserId == $userId][0]`,
        { userId }
      );

      if (!user) {
        throw new Error('User not found');
      }

      if (user.rewardPoints < points) {
        throw new Error('Insufficient points');
      }

      const newRewardPoints = user.rewardPoints - points;

      // Update user's reward points
      await client
        .patch(user._id)
        .set({
          rewardPoints: newRewardPoints,
          updatedAt: new Date().toISOString(),
        })
        .commit();

      // Create transaction record
      await client.create({
        _type: 'loyaltyTransaction',
        userId,
        type: 'redeemed',
        points: -points,
        orderId,
        description,
        createdAt: new Date().toISOString(),
        metadata: {
          remainingPoints: newRewardPoints,
        },
      });

      return true;
    } catch (error) {
      console.error('Error redeeming points:', error);
      return false;
    }
  }

  // Get user's transaction history
  static async getTransactionHistory(
    userId: string,
    limit: number = 50
  ): Promise<LoyaltyTransaction[]> {
    try {
      const transactions = await client.fetch(
        `*[_type == "loyaltyTransaction" && userId == $userId] | order(createdAt desc)[0...$limit]`,
        { userId, limit }
      );
      return transactions;
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      return [];
    }
  }

  // Process order completion to award points
  static async processOrderCompletion(
    userId: string,
    orderId: string,
    orderTotal: number
  ): Promise<boolean> {
    try {
      // Get user's current tier
      const userData = await this.getUserLoyaltyData(userId);
      if (!userData) return false;

      const { calculateEarnedPoints } = await import('./config');
      const earnedPoints = calculateEarnedPoints(orderTotal, userData.membershipType);

      if (earnedPoints > 0) {
        return await this.addPoints(
          userId,
          earnedPoints,
          'earned',
          `Points earned from order #${orderId}`,
          { orderTotal },
          orderId
        );
      }

      return true;
    } catch (error) {
      console.error('Error processing order completion:', error);
      return false;
    }
  }

  // Award bonus points
  static async awardBonusPoints(
    userId: string,
    eventType: string,
    customPoints?: number,
    description?: string
  ): Promise<boolean> {
    try {
      const { LOYALTY_CONFIG } = await import('./config');
      const points = customPoints || LOYALTY_CONFIG.BONUS_POINTS[eventType as keyof typeof LOYALTY_CONFIG.BONUS_POINTS] || 0;

      if (points > 0) {
        return await this.addPoints(
          userId,
          points,
          'bonus',
          description || `Bonus points for ${eventType}`,
          { eventType }
        );
      }

      return false;
    } catch (error) {
      console.error('Error awarding bonus points:', error);
      return false;
    }
  }

  // Expire old points (cleanup function)
  static async expireOldPoints(): Promise<void> {
    try {
      const expiredDate = new Date();
      expiredDate.setMonth(expiredDate.getMonth() - 24); // 24 months ago

      // Find all expired transactions
      const expiredTransactions = await client.fetch(
        `*[_type == "loyaltyTransaction" && type == "earned" && expiresAt < $expiredDate]`,
        { expiredDate: expiredDate.toISOString() }
      );

      // Process each expired transaction
      for (const transaction of expiredTransactions) {
        await this.addPoints(
          transaction.userId,
          -transaction.points,
          'expired',
          `Points expired from transaction on ${new Date(transaction.createdAt).toDateString()}`
        );
      }
    } catch (error) {
      console.error('Error expiring old points:', error);
    }
  }

  // Get loyalty statistics for admin
  static async getLoyaltyStatistics() {
    try {
      const stats = await client.fetch(`{
        "totalUsers": count(*[_type == "user"]),
        "premiumUsers": count(*[_type == "user" && membershipType == "premium"]),
        "businessUsers": count(*[_type == "user" && membershipType == "business"]),
        "vipUsers": count(*[_type == "user" && membershipType == "vip"]),
        "totalPointsIssued": sum(*[_type == "loyaltyTransaction" && type == "earned"].points),
        "totalPointsRedeemed": sum(*[_type == "loyaltyTransaction" && type == "redeemed"].points),
        "averagePointsPerUser": avg(*[_type == "user"].loyaltyPoints),
        "recentTransactions": *[_type == "loyaltyTransaction"] | order(createdAt desc)[0...10]
      }`);

      return stats;
    } catch (error) {
      console.error('Error fetching loyalty statistics:', error);
      return null;
    }
  }
}