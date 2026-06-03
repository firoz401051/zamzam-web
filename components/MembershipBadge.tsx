"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Star, 
  Award, 
  TrendingUp, 
  Coins,
  Crown,
  Shield
} from 'lucide-react';
import { LOYALTY_CONFIG, type MembershipTier } from '@/lib/loyalty';

interface MembershipBadgeProps {
  tier: MembershipTier;
  points?: number;
  className?: string;
  variant?: 'badge' | 'card' | 'inline';
  showBenefits?: boolean;
}

export default function MembershipBadge({ 
  tier, 
  points,
  className = '',
  variant = 'badge',
  showBenefits = false
}: MembershipBadgeProps) {
  
  const getTierConfig = (tier: MembershipTier) => {
    const configs = {
      standard: {
        label: 'Standard',
        icon: <Coins className="h-4 w-4" />,
        color: 'bg-gray-500',
        textColor: 'text-gray-700',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        description: 'Welcome to zamzam!'
      },
      premium: {
        label: 'Premium',
        icon: <Star className="h-4 w-4" />,
        color: 'bg-yellow-500',
        textColor: 'text-yellow-700',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        description: 'Enjoy premium benefits and early access'
      },
      business: {
        label: 'Business',
        icon: <TrendingUp className="h-4 w-4" />,
        color: 'bg-blue-500',
        textColor: 'text-blue-700',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        description: 'Perfect for business accounts with volume discounts'
      },
      vip: {
        label: 'VIP',
        icon: <Crown className="h-4 w-4" />,
        color: 'bg-purple-500',
        textColor: 'text-purple-700',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        description: 'Exclusive VIP treatment with maximum benefits'
      }
    };
    
    return configs[tier];
  };

  const config = getTierConfig(tier);
  const benefits = LOYALTY_CONFIG.TIER_BENEFITS[tier];

  if (variant === 'badge') {
    return (
      <Badge 
        variant="secondary" 
        className={`${config.color} text-white ${className}`}
      >
        <span className="flex items-center gap-1">
          {config.icon}
          {config.label}
        </span>
      </Badge>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <div className={`p-1 rounded-full ${config.color}`}>
          {React.cloneElement(config.icon, { className: 'h-3 w-3 text-white' })}
        </div>
        <span className={`font-medium ${config.textColor}`}>
          {config.label}
        </span>
        {points && (
          <span className="text-sm text-gray-500">
            ({points.toLocaleString()} pts)
          </span>
        )}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <Card className={`${config.bgColor} ${config.borderColor} border-2 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-full ${config.color}`}>
              {React.cloneElement(config.icon, { className: 'h-5 w-5 text-white' })}
            </div>
            <div>
              <h3 className={`font-bold text-lg ${config.textColor}`}>
                {config.label} Member
              </h3>
              {points && (
                <p className="text-sm text-gray-600">
                  {points.toLocaleString()} loyalty points
                </p>
              )}
            </div>
          </div>

          <p className={`text-sm ${config.textColor} mb-3`}>
            {config.description}
          </p>

          {showBenefits && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Your Benefits:</h4>
              <div className="grid grid-cols-1 gap-1 text-xs">
                <div className="flex items-center gap-2">
                  <Shield className="h-3 w-3 text-green-500" />
                  <span>{LOYALTY_CONFIG.EARNING_RATES[tier]}x points on every purchase</span>
                </div>
                {benefits.discountPercentage > 0 && (
                  <div className="flex items-center gap-2">
                    <Shield className="h-3 w-3 text-green-500" />
                    <span>{benefits.discountPercentage}% member discount</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Shield className="h-3 w-3 text-green-500" />
                  <span>
                    Free shipping on orders {benefits.freeShippingThreshold === 0 
                      ? 'of any amount' 
                      : `over $${benefits.freeShippingThreshold}`}
                  </span>
                </div>
                {benefits.earlyAccess && (
                  <div className="flex items-center gap-2">
                    <Shield className="h-3 w-3 text-green-500" />
                    <span>Early access to sales and new products</span>
                  </div>
                )}
                {benefits.dedicatedSupport && (
                  <div className="flex items-center gap-2">
                    <Shield className="h-3 w-3 text-green-500" />
                    <span>Dedicated customer support</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return null;
}