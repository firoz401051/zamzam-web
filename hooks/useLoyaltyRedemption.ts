"use client";

import { useState, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { 
  calculateRedemptionValue, 
  getMaxRedeemablePoints,
  LOYALTY_CONFIG,
  type UserLoyaltyData 
} from '@/lib/loyalty';
import { toast } from 'sonner';

interface UseLoyaltyRedemptionProps {
  orderTotal: number;
  onRedemptionSuccess?: (redeemedPoints: number, discountAmount: number) => void;
}

export function useLoyaltyRedemption({ 
  orderTotal, 
  onRedemptionSuccess 
}: UseLoyaltyRedemptionProps) {
  const { user } = useUser();
  const [loyaltyData, setLoyaltyData] = useState<UserLoyaltyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [redeeming, setRedeeming] = useState(false);
  const [selectedPoints, setSelectedPoints] = useState(0);

  // Fetch user's loyalty data
  const fetchLoyaltyData = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/user/loyalty?userId=${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setLoyaltyData(data.loyaltyData);
      }
    } catch (error) {
      console.error('Error fetching loyalty data:', error);
      toast.error('Failed to load loyalty information');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Calculate redemption details
  const getRedemptionDetails = useCallback(() => {
    if (!loyaltyData || selectedPoints <= 0) {
      return {
        discountAmount: 0,
        canRedeem: false,
        maxRedeemablePoints: 0,
        remainingPointsAfter: loyaltyData?.rewardPoints || 0,
      };
    }

    const maxRedeemablePoints = getMaxRedeemablePoints(orderTotal, loyaltyData.rewardPoints);
    const discountAmount = calculateRedemptionValue(selectedPoints);
    const canRedeem = selectedPoints >= LOYALTY_CONFIG.REDEMPTION.minimumRedemption && 
                     selectedPoints <= maxRedeemablePoints &&
                     selectedPoints <= loyaltyData.rewardPoints;

    return {
      discountAmount,
      canRedeem,
      maxRedeemablePoints,
      remainingPointsAfter: loyaltyData.rewardPoints - selectedPoints,
    };
  }, [loyaltyData, selectedPoints, orderTotal]);

  // Redeem points for an order
  const redeemPoints = useCallback(async (orderId: string) => {
    if (!loyaltyData || !user?.id || selectedPoints <= 0) {
      toast.error('Invalid redemption request');
      return false;
    }

    const { canRedeem, discountAmount } = getRedemptionDetails();
    
    if (!canRedeem) {
      toast.error('Unable to redeem the selected points');
      return false;
    }

    setRedeeming(true);
    try {
      const response = await fetch('/api/user/loyalty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'redeem',
          points: selectedPoints,
          orderId,
          description: `Redeemed ${selectedPoints} points for $${discountAmount.toFixed(2)} order discount`
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(`Successfully redeemed ${selectedPoints} points for $${discountAmount.toFixed(2)} discount!`);
        
        // Update local loyalty data
        setLoyaltyData(prev => prev ? {
          ...prev,
          rewardPoints: prev.rewardPoints - selectedPoints
        } : null);
        
        // Reset selected points
        setSelectedPoints(0);
        
        // Notify parent component
        onRedemptionSuccess?.(selectedPoints, discountAmount);
        
        return true;
      } else {
        toast.error(data.error || 'Failed to redeem points');
        return false;
      }
    } catch (error) {
      console.error('Error redeeming points:', error);
      toast.error('Error processing redemption');
      return false;
    } finally {
      setRedeeming(false);
    }
  }, [selectedPoints, loyaltyData, user?.id, getRedemptionDetails, onRedemptionSuccess]);

  // Set points to maximum redeemable amount
  const setMaxRedeemablePoints = useCallback(() => {
    if (!loyaltyData) return;
    
    const maxPoints = getMaxRedeemablePoints(orderTotal, loyaltyData.rewardPoints);
    setSelectedPoints(maxPoints);
  }, [loyaltyData, orderTotal]);

  // Validate selected points
  const validateSelectedPoints = useCallback((points: number) => {
    if (!loyaltyData) return false;
    
    const maxPoints = getMaxRedeemablePoints(orderTotal, loyaltyData.rewardPoints);
    return points >= LOYALTY_CONFIG.REDEMPTION.minimumRedemption && 
           points <= maxPoints && 
           points <= loyaltyData.rewardPoints;
  }, [loyaltyData, orderTotal]);

  return {
    // Data
    loyaltyData,
    selectedPoints,
    loading,
    redeeming,
    
    // Actions
    fetchLoyaltyData,
    setSelectedPoints,
    redeemPoints,
    setMaxRedeemablePoints,
    
    // Computed values
    redemptionDetails: getRedemptionDetails(),
    validateSelectedPoints,
    
    // Constants
    minimumRedemption: LOYALTY_CONFIG.REDEMPTION.minimumRedemption,
    pointsPerDollar: LOYALTY_CONFIG.REDEMPTION.pointsPerDollar,
  };
}