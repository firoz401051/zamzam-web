"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp,
  Users,
  DollarSign,
  ShoppingCart,
  Target,
  AlertTriangle,
  Activity,
  Brain,
  PieChart as PieChartIcon,
  BarChart3,
  Calendar,
  Download
} from 'lucide-react';
import { BusinessIntelligenceService } from '@/lib/business-intelligence';
import type {
  RevenueData,
  CustomerSegment,
  ProductPerformance,
  ForecastData,
  InventoryInsight
} from '@/lib/business-intelligence';
import { toast } from 'sonner';

interface AdvancedMetrics {
  customerLifetimeValue: number;
  churnRate: number;
  acquisitionCost: number;
  conversionRate: number;
  calculatedAt: string;
}

export default function BusinessIntelligenceDashboard() {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [customerSegments, setCustomerSegments] = useState<CustomerSegment[]>([]);
  const [productPerformance, setProductPerformance] = useState<ProductPerformance[]>([]);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [inventoryInsights, setInventoryInsights] = useState<InventoryInsight[]>([]);
  const [advancedMetrics, setAdvancedMetrics] = useState<AdvancedMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeframe]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const [
        revenue,
        segments,
        performance,
        forecast,
        inventory,
        metrics
      ] = await Promise.all([
        BusinessIntelligenceService.getRevenueAnalytics(timeframe),
        BusinessIntelligenceService.getCustomerSegmentation(),
        BusinessIntelligenceService.getProductPerformance(20),
        BusinessIntelligenceService.getRevenueForecast(6),
        BusinessIntelligenceService.getInventoryInsights(),
        BusinessIntelligenceService.getAdvancedMetrics()
      ]);

      setRevenueData(revenue);
      setCustomerSegments(segments);
      setProductPerformance(performance);
      setForecastData(forecast);
      setInventoryInsights(inventory);
      setAdvancedMetrics(metrics);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const exportData = async (type: string) => {
    try {
      let data: any[] = [];
      let filename = '';

      switch (type) {
        case 'revenue':
          data = revenueData;
          filename = `revenue-analytics-${timeframe}.csv`;
          break;
        case 'customers':
          data = customerSegments;
          filename = 'customer-segments.csv';
          break;
        case 'products':
          data = productPerformance;
          filename = 'product-performance.csv';
          break;
        case 'inventory':
          data = inventoryInsights;
          filename = 'inventory-insights.csv';
          break;
      }

      if (data.length === 0) {
        toast.error('No data to export');
        return;
      }

      // Convert to CSV
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(row => Object.values(row).join(',')).join('\n');
      const csv = `${headers}\n${rows}`;

      // Download file
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success(`${filename} downloaded successfully`);
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  };

  // Calculate key metrics from data
  const totalRevenue = revenueData.reduce((sum, day) => sum + day.revenue, 0);
  const avgOrderValue = revenueData.length > 0 
    ? revenueData.reduce((sum, day) => sum + day.avgOrderValue, 0) / revenueData.length 
    : 0;
  const totalOrders = revenueData.reduce((sum, day) => sum + day.orders, 0);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-purple-500" />
            Business Intelligence
          </h1>
          <p className="text-gray-600 mt-1">Advanced analytics and insights</p>
        </div>
        
        {/* Timeframe Selector */}
        <div className="flex items-center gap-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button onClick={fetchAnalyticsData} variant="outline" size="sm">
            <Activity className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Order Value</p>
                <div className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</div>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Customer CLV</p>
                <div className="text-2xl font-bold">
                  ${advancedMetrics?.customerLifetimeValue.toFixed(0) || '0'}
                </div>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Churn Rate</p>
                <div className="text-2xl font-bold">
                  {advancedMetrics?.churnRate.toFixed(1) || '0'}%
                </div>
              </div>
              <Target className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        {/* Revenue Analytics */}
        <TabsContent value="revenue" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Revenue Analytics</h2>
            <Button onClick={() => exportData('revenue')} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value: any) => [`$${value}`, 'Revenue']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Orders vs Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis yAxisId="left" tickFormatter={(value) => `$${value}`} />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#8884d8" 
                      name="Revenue ($)"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="orders" 
                      stroke="#82ca9d" 
                      name="Orders"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Order Value</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip 
                      formatter={(value: any) => [`$${value}`, 'AOV']}
                    />
                    <Bar dataKey="avgOrderValue" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Customer Segmentation */}
        <TabsContent value="customers" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Customer Segmentation</h2>
            <Button onClick={() => exportData('customers')} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={customerSegments as any}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ segment, count }) => `${segment}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {customerSegments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Segment</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={customerSegments}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="segment" />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip formatter={(value: any) => [`$${value}`, 'Revenue']} />
                    <Bar dataKey="totalSpent" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Segment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customerSegments.map((segment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <div>
                        <h3 className="font-medium">{segment.segment}</h3>
                        <p className="text-sm text-gray-600">{segment.count} customers</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${segment.totalSpent.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">
                        Avg: ${segment.avgOrderValue.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Product Performance */}
        <TabsContent value="products" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Product Performance</h2>
            <Button onClick={() => exportData('products')} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Products by Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={productPerformance.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value: any) => [`$${value}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Performance Table</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Product</th>
                      <th className="text-right p-2">Revenue</th>
                      <th className="text-right p-2">Units Sold</th>
                      <th className="text-right p-2">Profit Margin</th>
                      <th className="text-center p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productPerformance.slice(0, 15).map((product, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">{product.name}</td>
                        <td className="p-2 text-right">${product.revenue.toLocaleString()}</td>
                        <td className="p-2 text-right">{product.unitsSold}</td>
                        <td className="p-2 text-right">{(product.profitMargin * 100).toFixed(1)}%</td>
                        <td className="p-2 text-center">
                          {product.trending && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Trending
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue Forecast */}
        <TabsContent value="forecast" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Revenue Forecast</h2>
            <Badge variant="outline">
              <Calendar className="h-3 w-3 mr-1" />
              Next 6 Periods
            </Badge>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Predicted Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    formatter={(value: any) => [`$${value}`, 'Predicted Revenue']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predictedRevenue" 
                    stroke="#ff7300" 
                    strokeDasharray="5 5"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Forecast Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {forecastData.map((forecast, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{forecast.period}</div>
                      <div className="text-sm text-gray-600">
                        Confidence: {(forecast.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        ${forecast.predictedRevenue.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        Based on: {forecast.factors.join(', ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory Insights */}
        <TabsContent value="inventory" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Inventory Optimization</h2>
            <Button onClick={() => exportData('inventory')} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {['reorder', 'reduce', 'optimize', 'normal'].map((recommendation) => {
              const count = inventoryInsights.filter(item => item.recommendation === recommendation).length;
              const colors = {
                reorder: 'bg-red-100 text-red-800',
                reduce: 'bg-yellow-100 text-yellow-800',
                optimize: 'bg-blue-100 text-blue-800',
                normal: 'bg-green-100 text-green-800'
              };

              return (
                <Card key={recommendation}>
                  <CardContent className="p-6 text-center">
                    <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${colors[recommendation as keyof typeof colors]}`}>
                      {recommendation.charAt(0).toUpperCase() + recommendation.slice(1)}
                    </div>
                    <div className="text-2xl font-bold mt-2">{count}</div>
                    <div className="text-sm text-gray-600">Products</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Inventory Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Product</th>
                      <th className="text-right p-2">Current Stock</th>
                      <th className="text-right p-2">Reorder Point</th>
                      <th className="text-right p-2">Demand Forecast</th>
                      <th className="text-center p-2">Recommendation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryInsights.slice(0, 20).map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">{item.name}</td>
                        <td className="p-2 text-right">{item.currentStock}</td>
                        <td className="p-2 text-right">{item.reorderPoint}</td>
                        <td className="p-2 text-right">{item.demandForecast}</td>
                        <td className="p-2 text-center">
                          <Badge
                            variant={item.recommendation === 'reorder' ? 'destructive' : 'secondary'}
                            className={
                              item.recommendation === 'reorder' ? 'bg-red-100 text-red-800' :
                              item.recommendation === 'reduce' ? 'bg-yellow-100 text-yellow-800' :
                              item.recommendation === 'optimize' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }
                          >
                            {item.recommendation}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}