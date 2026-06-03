"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  Star, 
  TrendingUp, 
  Award,
  Gift,
  Coins,
  Plus,
  BarChart3
} from 'lucide-react';
import { LOYALTY_CONFIG, type MembershipTier } from '@/lib/loyalty';
import { toast } from 'sonner';

interface LoyaltyStats {
  totalUsers: number;
  premiumUsers: number;
  businessUsers: number;
  vipUsers: number;
  totalPointsIssued: number;
  totalPointsRedeemed: number;
  averagePointsPerUser: number;
  recentTransactions: any[];
}

export default function AdminLoyaltyManager() {
  const [stats, setStats] = useState<LoyaltyStats | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Award Points Form
  const [awardForm, setAwardForm] = useState({
    userId: '',
    points: '',
    description: '',
    eventType: 'admin_award'
  });

  useEffect(() => {
    fetchLoyaltyStats();
  }, []);

  const fetchLoyaltyStats = async () => {
    try {
      const response = await fetch('/api/admin/loyalty/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      } else {
        toast.error('Failed to fetch loyalty statistics');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Error loading loyalty statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleAwardPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!awardForm.userId || !awardForm.points) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('/api/admin/loyalty/bonus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: awardForm.userId,
          points: parseInt(awardForm.points),
          description: awardForm.description,
          eventType: awardForm.eventType
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Points awarded successfully!');
        setAwardForm({
          userId: '',
          points: '',
          description: '',
          eventType: 'admin_award'
        });
        fetchLoyaltyStats(); // Refresh stats
      } else {
        toast.error(data.error || 'Failed to award points');
      }
    } catch (error) {
      console.error('Error awarding points:', error);
      toast.error('Error awarding points');
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'vip': return <Award className="h-4 w-4 text-purple-500" />;
      case 'business': return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'premium': return <Star className="h-4 w-4 text-yellow-500" />;
      default: return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Premium+</p>
                <div className="text-2xl font-bold">
                  {(stats?.premiumUsers || 0) + (stats?.businessUsers || 0) + (stats?.vipUsers || 0)}
                </div>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Points Issued</p>
                <div className="text-2xl font-bold">
                  {(stats?.totalPointsIssued || 0).toLocaleString()}
                </div>
              </div>
              <Coins className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Points Redeemed</p>
                <div className="text-2xl font-bold">
                  {Math.abs(stats?.totalPointsRedeemed || 0).toLocaleString()}
                </div>
              </div>
              <Gift className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Membership Tier Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Membership Tiers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries({
                standard: (stats?.totalUsers || 0) - (stats?.premiumUsers || 0) - (stats?.businessUsers || 0) - (stats?.vipUsers || 0),
                premium: stats?.premiumUsers || 0,
                business: stats?.businessUsers || 0,
                vip: stats?.vipUsers || 0
              }).map(([tier, count]) => (
                <div key={tier} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    {getTierIcon(tier)}
                    <span className="font-medium capitalize">{tier}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{count}</Badge>
                    <div className="text-sm text-gray-500">
                      {stats?.totalUsers ? `${((count / stats.totalUsers) * 100).toFixed(1)}%` : '0%'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Award Points Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Award Bonus Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAwardPoints} className="space-y-4">
              <div>
                <Label htmlFor="userId">User ID (Clerk User ID)</Label>
                <Input
                  id="userId"
                  value={awardForm.userId}
                  onChange={(e) => setAwardForm({...awardForm, userId: e.target.value})}
                  placeholder="user_2xxx..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="points">Points to Award</Label>
                <Input
                  id="points"
                  type="number"
                  min="1"
                  value={awardForm.points}
                  onChange={(e) => setAwardForm({...awardForm, points: e.target.value})}
                  placeholder="100"
                  required
                />
              </div>

              <div>
                <Label htmlFor="eventType">Event Type</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={awardForm.eventType}
                  onChange={(e) => setAwardForm({...awardForm, eventType: e.target.value})}
                >
                  <option value="admin_award">Admin Award</option>
                  <option value="birthday">Birthday Bonus</option>
                  <option value="referral">Referral Bonus</option>
                  <option value="newsletter">Newsletter Signup</option>
                  <option value="productReview">Product Review</option>
                  <option value="firstPurchase">First Purchase</option>
                </select>
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={awardForm.description}
                  onChange={(e) => setAwardForm({...awardForm, description: e.target.value})}
                  placeholder="Reason for awarding points..."
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full">
                Award Points
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      {stats?.recentTransactions && stats.recentTransactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentTransactions.map((transaction, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between py-3 border-b last:border-b-0"
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {transaction.description}
                    </div>
                    <div className="text-xs text-gray-500">
                      User: {transaction.userId} • {new Date(transaction.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold text-sm ${
                      transaction.points > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.points > 0 ? '+' : ''}{transaction.points}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {transaction.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}