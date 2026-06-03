'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Eye,
  MousePointer,
  Search,
  Calendar
} from 'lucide-react';

interface AnalyticsData {
  pageViews: { name: string; views: number; }[];
  userMetrics: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    returningUsers: number;
  };
  ecommerce: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    conversionRate: number;
  };
  topProducts: { name: string; views: number; sales: number; }[];
  topPages: { page: string; views: number; bounceRate: number; }[];
  userBehavior: {
    searchQueries: { term: string; count: number; }[];
    cartAbandonment: number;
    checkoutCompletionRate: number;
  };
  performance: {
    avgPageLoadTime: number;
    avgApiResponseTime: number;
  };
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/dashboard?range=${timeRange}`);
      if (response.ok) {
        const analyticsData = await response.json();
        setData(analyticsData);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <AnalyticsSkeleton />;
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">No Analytics Data</h3>
          <p className="text-gray-500">Analytics data will appear once tracking is enabled.</p>
        </div>
      </div>
    );
  }

  const COLORS = ['#2563eb', '#dc2626', '#059669', '#d97706', '#7c3aed'];

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <div className="flex gap-2">
          {[
            { label: '7 Days', value: '7d' },
            { label: '30 Days', value: '30d' },
            { label: '90 Days', value: '90d' },
            { label: '1 Year', value: '1y' }
          ].map((range) => (
            <Button
              key={range.value}
              variant={timeRange === range.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range.value)}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.ecommerce.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {data.ecommerce.totalOrders} orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.userMetrics.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {data.userMetrics.newUsers} new users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.ecommerce.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              AOV: ${data.ecommerce.averageOrderValue.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Load Time</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.performance.avgPageLoadTime}ms</div>
            <p className="text-xs text-muted-foreground">
              API: {data.performance.avgApiResponseTime}ms
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Page Views Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Page Views</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.pageViews}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#2563eb" />
                <Bar dataKey="sales" fill="#059669" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{page.page}</p>
                    <p className="text-xs text-gray-500">{page.views} views</p>
                  </div>
                  <Badge variant={page.bounceRate > 50 ? 'destructive' : 'default'}>
                    {page.bounceRate}% bounce
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search Queries */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Searches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.userBehavior.searchQueries.map((query, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{query.term}</span>
                  </div>
                  <span className="text-sm text-gray-500">{query.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Behavior Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>User Behavior</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Cart Abandonment</span>
                <Badge variant="destructive">
                  {data.userBehavior.cartAbandonment}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Checkout Completion</span>
                <Badge variant="default">
                  {data.userBehavior.checkoutCompletionRate}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Returning Users</span>
                <Badge variant="secondary">
                  {((data.userMetrics.returningUsers / data.userMetrics.totalUsers) * 100).toFixed(1)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Loading skeleton component
function AnalyticsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-200 rounded w-64"></div>
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 bg-gray-200 rounded w-16"></div>
          ))}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-32"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}