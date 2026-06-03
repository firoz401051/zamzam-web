export * from './config';
export * from './service';

// Re-export commonly used functions
export {
  LOYALTY_CONFIG,
  calculateTierFromPoints,
  getPointsToNextTier,
  calculateEarnedPoints,
  calculateRedemptionValue,
  getMaxRedeemablePoints,
} from './config';

export {
  LoyaltyService,
  type LoyaltyTransaction,
  type UserLoyaltyData,
} from './service';