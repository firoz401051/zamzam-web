"use client";

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Star, 
  Gift, 
  TrendingUp, 
  History,
  Award,
  Coins
} from 'lucide-react';
import { 
  LOYALTY_CONFIG, 
  calculateTierFromPoints, 
  getPointsToNextTier,
  calculateRedemptionValue,
  type UserLoyaltyData,
  type LoyaltyTransaction 
} from '@/lib/loyalty';

interface LoyaltyPointsProps {
  className?: string;
  showFullDetails?: boolean;
}

export default function LoyaltyPoints({ 
  className = '',
  showFullDetails = true 
}: LoyaltyPointsProps) {
  const { user } = useUser();
  const [loyaltyData, setLoyaltyData] = useState<UserLoyaltyData | null>(null);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchLoyaltyData();
    }
  }, [user?.id]);

  const fetchLoyaltyData = async () => {
    try {
      const response = await fetch(`/api/user/loyalty?userId=${user?.id}`);
      const data = await response.json();
      
      if (data.success) {
        setLoyaltyData(data.loyaltyData);
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error('Error fetching loyalty data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!loyaltyData) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Unable to load loyalty information</p>
        </CardContent>
      </Card>
    );
  }

  const currentTier = loyaltyData.membershipType || 'standard';
  const pointsToNext = getPointsToNextTier(loyaltyData.loyaltyPoints, currentTier);
  const redeemableValue = calculateRedemptionValue(loyaltyData.rewardPoints);
  const tierBenefits = LOYALTY_CONFIG.TIER_BENEFITS[currentTier];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'vip': return 'bg-purple-500';
      case 'business': return 'bg-blue-500';
      case 'premium': return 'bg-gold-500 bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'vip': return <Award className="h-4 w-4" />;
      case 'business': return <TrendingUp className="h-4 w-4" />;
      case 'premium': return <Star className="h-4 w-4" />;
      default: return <Coins className="h-4 w-4" />;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Points Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              Loyalty Points
            </CardTitle>
            <Badge 
              variant="secondary" 
              className={`${getTierColor(currentTier)} text-white`}
            >
              <span className="flex items-center gap-1">
                {getTierIcon(currentTier)}
                {currentTier.toUpperCase()}
              </span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Points Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {loyaltyData.loyaltyPoints.toLocaleString()}
              </div>
              <div className="text-sm text-blue-700">Total Points</div>
            </div>
            <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                ${redeemableValue.toFixed(2)}
              </div>
              <div className="text-sm text-green-700">
                Available ({loyaltyData.rewardPoints} pts)
              </div>
            </div>
          </div>

          {/* Progress to Next Tier */}
          {pointsToNext !== null && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to next tier</span>
                <span className="font-medium">{pointsToNext} points needed</span>
              </div>
              <Progress 
                value={((loyaltyData.loyaltyPoints - LOYALTY_CONFIG.TIER_THRESHOLDS[currentTier]) / 
                        (pointsToNext + loyaltyData.loyaltyPoints - LOYALTY_CONFIG.TIER_THRESHOLDS[currentTier])) * 100} 
                className="h-2"
              />
            </div>
          )}

          {showFullDetails && (
            <>
              {/* Current Tier Benefits */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Your Benefits</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>Earning Rate:</span>
                    <span className="font-medium">
                      {LOYALTY_CONFIG.EARNING_RATES[currentTier]}x points
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span className="font-medium">{tierBenefits.discountPercentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Free Shipping:</span>
                    <span className="font-medium">
                      ${tierBenefits.freeShippingThreshold}+
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Early Access:</span>
                    <span className="font-medium">
                      {tierBenefits.earlyAccess ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHistory(!showHistory)}
                  className="flex items-center gap-2"
                >
                  <History className="h-4 w-4" />
                  History
                </Button>
                {loyaltyData.rewardPoints >= LOYALTY_CONFIG.REDEMPTION.minimumRedemption && (
                  <Button
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => {
                      // Handle redemption - could open a modal
                      console.log('Open redemption modal');
                    }}
                  >
                    <Gift className="h-4 w-4" />
                    Redeem Points
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Transaction History */}
      {showHistory && showFullDetails && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.slice(0, 10).map((transaction, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between py-2 border-b last:border-b-0"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {transaction.description}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold text-sm ${
                        transaction.points > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.points > 0 ? '+' : ''}{transaction.points}
                      </div>
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                      >
                        {transaction.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">
                No transaction history available
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}