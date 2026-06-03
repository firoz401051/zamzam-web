// Loyalty Points System Configuration

export const LOYALTY_CONFIG = {
  // Points earning rates (points per dollar spent)
  EARNING_RATES: {
    standard: 1,    // 1 point per $1
    premium: 1.5,   // 1.5 points per $1
    business: 2,    // 2 points per $1
    vip: 3,         // 3 points per $1
  },

  // Tier thresholds (total points needed to reach tier)
  TIER_THRESHOLDS: {
    standard: 0,
    premium: 1000,
    business: 5000,
    vip: 15000,
  },

  // Tier benefits
  TIER_BENEFITS: {
    standard: {
      discountPercentage: 0,
      freeShippingThreshold: 50,
      earlyAccess: false,
      dedicatedSupport: false,
    },
    premium: {
      discountPercentage: 5,
      freeShippingThreshold: 25,
      earlyAccess: true,
      dedicatedSupport: false,
    },
    business: {
      discountPercentage: 10,
      freeShippingThreshold: 0,
      earlyAccess: true,
      dedicatedSupport: true,
    },
    vip: {
      discountPercentage: 15,
      freeShippingThreshold: 0,
      earlyAccess: true,
      dedicatedSupport: true,
    },
  },

  // Redemption rates
  REDEMPTION: {
    pointsPerDollar: 100,  // 100 points = $1
    minimumRedemption: 500, // Minimum 500 points to redeem
    maximumRedemptionPercentage: 50, // Max 50% of order total
  },

  // Special earning opportunities
  BONUS_POINTS: {
    firstPurchase: 500,
    birthday: 200,
    productReview: 50,
    referral: 1000,
    newsletter: 100,
  },

  // Expiration settings
  EXPIRATION: {
    enabled: true,
    months: 24, // Points expire after 24 months
  },
} as const;

export type MembershipTier = keyof typeof LOYALTY_CONFIG.TIER_THRESHOLDS;
export type LoyaltyEvent = keyof typeof LOYALTY_CONFIG.BONUS_POINTS;

// Helper functions
export function calculateTierFromPoints(totalPoints: number): MembershipTier {
  if (totalPoints >= LOYALTY_CONFIG.TIER_THRESHOLDS.vip) return 'vip';
  if (totalPoints >= LOYALTY_CONFIG.TIER_THRESHOLDS.business) return 'business';
  if (totalPoints >= LOYALTY_CONFIG.TIER_THRESHOLDS.premium) return 'premium';
  return 'standard';
}

export function getPointsToNextTier(currentPoints: number, currentTier: MembershipTier) {
  const tiers = Object.keys(LOYALTY_CONFIG.TIER_THRESHOLDS) as MembershipTier[];
  const currentIndex = tiers.indexOf(currentTier);
  
  if (currentIndex === tiers.length - 1) {
    return null; // Already at highest tier
  }
  
  const nextTier = tiers[currentIndex + 1];
  return LOYALTY_CONFIG.TIER_THRESHOLDS[nextTier] - currentPoints;
}

export function calculateEarnedPoints(
  amount: number,
  tier: MembershipTier = 'standard'
): number {
  return Math.floor(amount * LOYALTY_CONFIG.EARNING_RATES[tier]);
}

export function calculateRedemptionValue(points: number): number {
  return points / LOYALTY_CONFIG.REDEMPTION.pointsPerDollar;
}

export function getMaxRedeemablePoints(
  orderTotal: number,
  availablePoints: number
): number {
  const maxRedemptionAmount = (orderTotal * LOYALTY_CONFIG.REDEMPTION.maximumRedemptionPercentage) / 100;
  const maxRedeemableByAmount = maxRedemptionAmount * LOYALTY_CONFIG.REDEMPTION.pointsPerDollar;
  
  return Math.min(availablePoints, maxRedeemableByAmount);
}