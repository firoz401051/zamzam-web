"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Gift, 
  Coins, 
  Calculator,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useLoyaltyRedemption } from '@/hooks';
import MembershipBadge from './MembershipBadge';

interface LoyaltyRedemptionProps {
  orderTotal: number;
  onApplyDiscount?: (discountAmount: number, pointsUsed: number) => void;
  onRemoveDiscount?: () => void;
  className?: string;
}

export default function LoyaltyRedemption({
  orderTotal,
  onApplyDiscount,
  onRemoveDiscount,
  className = ''
}: LoyaltyRedemptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState<{
    amount: number;
    points: number;
  } | null>(null);

  const {
    loyaltyData,
    selectedPoints,
    loading,
    redeeming,
    fetchLoyaltyData,
    setSelectedPoints,
    redemptionDetails,
    validateSelectedPoints,
    minimumRedemption,
    pointsPerDollar,
  } = useLoyaltyRedemption({
    orderTotal,
    onRedemptionSuccess: (points, discount) => {
      setAppliedDiscount({ amount: discount, points });
      onApplyDiscount?.(discount, points);
      setIsExpanded(false);
    }
  });

  useEffect(() => {
    fetchLoyaltyData();
  }, [fetchLoyaltyData]);

  const handleApplyDiscount = () => {
    if (redemptionDetails.canRedeem) {
      setAppliedDiscount({ 
        amount: redemptionDetails.discountAmount, 
        points: selectedPoints 
      });
      onApplyDiscount?.(redemptionDetails.discountAmount, selectedPoints);
      setIsExpanded(false);
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setSelectedPoints(0);
    onRemoveDiscount?.();
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="animate-pulse flex items-center gap-3">
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!loyaltyData || loyaltyData.rewardPoints < minimumRedemption) {
    return null; // Don't show if user doesn't have enough points
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            Loyalty Points
          </span>
          {loyaltyData && (
            <MembershipBadge 
              tier={loyaltyData.membershipType} 
              variant="badge"
            />
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Points Display */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-blue-600" />
            <span className="font-medium">Available Points</span>
          </div>
          <div className="text-right">
            <div className="font-bold text-blue-600">
              {loyaltyData.rewardPoints.toLocaleString()}
            </div>
            <div className="text-xs text-blue-700">
              ≈ ${(loyaltyData.rewardPoints / pointsPerDollar).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Applied Discount Display */}
        {appliedDiscount && (
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-700">
                Discount Applied
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-green-600">
                -${appliedDiscount.amount.toFixed(2)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveDiscount}
                className="h-6 px-2 text-xs text-green-700 hover:text-green-800"
              >
                Remove
              </Button>
            </div>
          </div>
        )}

        {/* Redemption Interface */}
        {!appliedDiscount && (
          <>
            {!isExpanded ? (
              <Button 
                variant="outline" 
                onClick={() => setIsExpanded(true)}
                className="w-full"
                disabled={loyaltyData.rewardPoints < minimumRedemption}
              >
                <Calculator className="h-4 w-4 mr-2" />
                Use Points for Discount
              </Button>
            ) : (
              <div className="space-y-4 border rounded-lg p-4">
                <div className="space-y-2">
                  <Label>Points to Use (Min: {minimumRedemption})</Label>
                  <div className="space-y-3">
                    <Input
                      type="number"
                      min={minimumRedemption}
                      max={redemptionDetails.maxRedeemablePoints}
                      value={selectedPoints || ''}
                      onChange={(e) => setSelectedPoints(parseInt(e.target.value) || 0)}
                      placeholder={`${minimumRedemption} - ${redemptionDetails.maxRedeemablePoints}`}
                    />
                    
                    {redemptionDetails.maxRedeemablePoints > minimumRedemption && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{minimumRedemption}</span>
                          <span>{redemptionDetails.maxRedeemablePoints}</span>
                        </div>
                        <Slider
                          value={[selectedPoints]}
                          onValueChange={(value: number[]) => setSelectedPoints(value[0])}
                          min={minimumRedemption}
                          max={redemptionDetails.maxRedeemablePoints}
                          step={50}
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Redemption Preview */}
                {selectedPoints > 0 && (
                  <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Points to use:</span>
                      <span className="font-medium">{selectedPoints.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Discount amount:</span>
                      <span className="font-medium text-green-600">
                        -${redemptionDetails.discountAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Remaining points:</span>
                      <span className="font-medium">
                        {redemptionDetails.remainingPointsAfter.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Validation Messages */}
                {selectedPoints > 0 && !validateSelectedPoints(selectedPoints) && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>
                      {selectedPoints < minimumRedemption 
                        ? `Minimum ${minimumRedemption} points required`
                        : selectedPoints > redemptionDetails.maxRedeemablePoints
                        ? `Maximum ${redemptionDetails.maxRedeemablePoints} points allowed for this order`
                        : 'Invalid point amount'
                      }
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsExpanded(false);
                      setSelectedPoints(0);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleApplyDiscount}
                    disabled={!redemptionDetails.canRedeem || redeeming}
                    className="flex-1"
                  >
                    {redeeming ? 'Applying...' : 'Apply Discount'}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Info Text */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• {pointsPerDollar} points = $1.00 discount</p>
          <p>• Maximum 50% of order total can be discounted</p>
          <p>• Points expire after 24 months</p>
        </div>
      </CardContent>
    </Card>
  );
}