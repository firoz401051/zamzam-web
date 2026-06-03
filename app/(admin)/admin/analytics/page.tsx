"use client";
import React, { useEffect, useState } from "react";
import Container from "@/components/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Package,
  Eye,
  ShoppingCart,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAdmin } from "@/lib/admin";
import PriceFormatter from "@/components/PriceFormatter";
import { backendClient } from "@/sanity/lib/backendClient";

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  conversionRate: number;
  avgOrderValue: number;
  revenueGrowth: number;
  ordersGrowth: number;
  usersGrowth: number;
  monthlyRevenue: Array<{ month: string; revenue: number; orders: number }>;
  topProducts: Array<{ name: string; sales: number; revenue: number }>;
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
  }>;
}

const AdminAnalyticsPage = () => {
  const { isAdmin } = useAdmin();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    conversionRate: 0,
    avgOrderValue: 0,
    revenueGrowth: 0,
    ordersGrowth: 0,
    usersGrowth: 0,
    monthlyRevenue: [],
    topProducts: [],
    recentActivity: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!isAdmin) return;

      try {
        // Fetch analytics data
        const analyticsQuery = `{
          "paidOrders": *[_type == "order" && status == "paid"].totalPrice,
          "totalOrders": count(*[_type == "order"]),
          "recentOrders": *[_type == "order"] | order(_createdAt desc)[0...10] {
            _id,
            orderNumber,
            customerName,
            totalPrice,
            status,
            _createdAt
          },
          "monthlyData": *[_type == "order" && status == "paid"] {
            totalPrice,
            _createdAt
          }
        }`;

        const data = await backendClient.fetch(analyticsQuery);

        // Calculate total revenue and average order value manually
        const paidOrderPrices = data.paidOrders || [];
        const totalRevenue = paidOrderPrices.reduce(
          (sum: number, price: number) => sum + price,
          0
        );
        const avgOrderValue =
          paidOrderPrices.length > 0
            ? totalRevenue / paidOrderPrices.length
            : 0;

        // Process monthly revenue data
        const monthlyRevenue = processMonthlyData(data.monthlyData || []);

        // Generate mock data for demonstration
        const mockAnalytics: AnalyticsData = {
          totalRevenue: totalRevenue || 15750.0,
          totalOrders: data.totalOrders || 142,
          totalUsers: 89, // This would come from user management system
          conversionRate: 3.4,
          avgOrderValue: avgOrderValue || 111.0,
          revenueGrowth: 12.5,
          ordersGrowth: 8.2,
          usersGrowth: 15.7,
          monthlyRevenue: monthlyRevenue,
          topProducts: [
            { name: "Wireless Headphones", sales: 45, revenue: 2250.0 },
            { name: "Smart Watch", sales: 32, revenue: 1920.0 },
            { name: "Laptop Stand", sales: 28, revenue: 840.0 },
            { name: "USB-C Cable", sales: 67, revenue: 670.0 },
            { name: "Phone Case", sales: 54, revenue: 540.0 },
          ],
          recentActivity: [
            {
              type: "order",
              description: "New order #ORD-001234",
              timestamp: "2 minutes ago",
            },
            {
              type: "user",
              description: "New user registration",
              timestamp: "5 minutes ago",
            },
            {
              type: "payment",
              description: "Payment received $125.99",
              timestamp: "10 minutes ago",
            },
            {
              type: "order",
              description: "Order #ORD-001233 shipped",
              timestamp: "15 minutes ago",
            },
            {
              type: "user",
              description: "User updated profile",
              timestamp: "20 minutes ago",
            },
          ],
        };

        setAnalytics(mockAnalytics);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [isAdmin]);

  const processMonthlyData = (orders: { totalPrice: number; _createdAt: string }[]) => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        return {
            month: d.toLocaleString('default', { month: 'short' }),
            monthIndex: d.getMonth(),
            year: d.getFullYear(),
            revenue: 0,
            orders: 0
        };
    });

    orders.forEach(order => {
        const date = new Date(order._createdAt);
        const monthIndex = date.getMonth();
        const year = date.getFullYear();

        const monthData = last6Months.find(m => m.monthIndex === monthIndex && m.year === year);
        if (monthData) {
            monthData.revenue += order.totalPrice;
            monthData.orders += 1;
        }
    });

    return last6Months.map(({ month, revenue, orders }) => ({ month, revenue, orders }));
  };

  const statsCards = [
    {
      title: "Total Revenue",
      value: <PriceFormatter amount={analytics.totalRevenue} />,
      icon: DollarSign,
      color: "bg-green-500",
      change: `+${analytics.revenueGrowth}%`,
      changeType: "positive" as const,
    },
    {
      title: "Total Orders",
      value: analytics.totalOrders.toLocaleString(),
      icon: Package,
      color: "bg-blue-500",
      change: `+${analytics.ordersGrowth}%`,
      changeType: "positive" as const,
    },
    {
      title: "Total Users",
      value: analytics.totalUsers.toLocaleString(),
      icon: Users,
      color: "bg-purple-500",
      change: `+${analytics.usersGrowth}%`,
      changeType: "positive" as const,
    },
    {
      title: "Conversion Rate",
      value: `${analytics.conversionRate}%`,
      icon: TrendingUp,
      color: "bg-orange-500",
      change: "+0.3%",
      changeType: "positive" as const,
    },
    {
      title: "Avg Order Value",
      value: <PriceFormatter amount={analytics.avgOrderValue} />,
      icon: ShoppingCart,
      color: "bg-indigo-500",
      change: "+$8.50",
      changeType: "positive" as const,
    },
    {
      title: "Monthly Growth",
      value: "12.5%",
      icon: BarChart3,
      color: "bg-emerald-500",
      change: "+2.1%",
      changeType: "positive" as const,
    },
  ];

  if (isLoading) {
    return (
      <Container className="py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="flex flex-col space-y-8">
          {/* Header */}
          <div className="border-b border-gray-200 pb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600">
              Real-time insights and performance metrics
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statsCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 ${stat.color} rounded-lg`}>
                          <stat.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            {stat.title}
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            {stat.value}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center">
                      <span className="text-green-600 text-sm font-medium">
                        {stat.change}
                      </span>
                      <span className="text-gray-500 text-sm ml-2">
                        vs last month
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Monthly Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Monthly Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.monthlyRevenue.map((data, index) => (
                    <div
                      key={data.month}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm font-medium text-gray-600">
                        {data.month}
                      </span>
                      <div className="flex items-center space-x-4">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(data.revenue / 4000) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold w-20 text-right">
                          <PriceFormatter amount={data.revenue} />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Top Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topProducts.map((product, index) => (
                    <div
                      key={product.name}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-500">
                          #{index + 1}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {product.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">
                          <PriceFormatter amount={product.revenue} />
                        </p>
                        <p className="text-xs text-gray-500">
                          {product.sales} sales
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <div
                      className={`p-2 rounded-full ${
                        activity.type === "order"
                          ? "bg-blue-100"
                          : activity.type === "user"
                          ? "bg-green-100"
                          : activity.type === "payment"
                          ? "bg-purple-100"
                          : "bg-gray-100"
                      }`}
                    >
                      {activity.type === "order" && (
                        <Package className="h-4 w-4 text-blue-600" />
                      )}
                      {activity.type === "user" && (
                        <Users className="h-4 w-4 text-green-600" />
                      )}
                      {activity.type === "payment" && (
                        <DollarSign className="h-4 w-4 text-purple-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.timestamp}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
      </div>
    </Container>
  );
};

export default AdminAnalyticsPage;
