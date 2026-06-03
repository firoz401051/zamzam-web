"use client";
import React, { useEffect, useState } from "react";
import Container from "@/components/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdmin } from "@/lib/admin";
import {
  Users,
  Package,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Activity,
  ArrowRight,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import PriceFormatter from "@/components/PriceFormatter";
import { backendClient } from "@/sanity/lib/backendClient";

interface AdminStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  pendingOrders: number;
  recentSignups: number;
  conversionRate: number;
  avgOrderValue: number;
}

const AdminDashboard = () => {
  const { isAdmin, user } = useAdmin();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    pendingOrders: 0,
    recentSignups: 0,
    conversionRate: 0,
    avgOrderValue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        // Fetch orders statistics
        const ordersQuery = `{
          "totalOrders": count(*[_type == "order"]),
          "paidOrders": *[_type == "order" && status == "paid"].totalPrice,
          "pendingOrders": count(*[_type == "order" && status == "pending"]),
          "recentOrders": *[_type == "order"] | order(_createdAt desc)[0...5] {
            _id,
            orderNumber,
            customerName,
            totalPrice,
            status,
            _createdAt
          },
          "allOrders": *[_type == "order"] {
            email,
            _createdAt
          }
        }`;

        // Fetch products statistics
        const productsQuery = `{
          "totalProducts": count(*[_type == "product"]),
          "outOfStock": count(*[_type == "product" && stock <= 0]),
          "lowStock": count(*[_type == "product" && stock > 0 && stock <= 10])
        }`;

        const [ordersData, productsData] = await Promise.all([
          backendClient.fetch(ordersQuery),
          backendClient.fetch(productsQuery),
        ]);

        // Calculate total revenue and average order value manually
        const paidOrderPrices = ordersData.paidOrders || [];
        const totalRevenue = paidOrderPrices.reduce(
          (sum: number, price: number) => sum + price,
          0
        );
        const avgOrderValue =
          paidOrderPrices.length > 0
            ? totalRevenue / paidOrderPrices.length
            : 0;

        // Calculate User Stats from Orders (proxy for Users)
        const allOrders = ordersData.allOrders || [];
        const uniqueEmails = new Set(allOrders.map((o: any) => o.email));
        const totalUsers = uniqueEmails.size;

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const recentSignups = new Set(
          allOrders
            .filter((o: any) => new Date(o._createdAt) > sevenDaysAgo)
            .map((o: any) => o.email)
        ).size;

        // Calculate conversion rate (Orders / Unique Customers) as a proxy
        const conversionRate = totalUsers > 0 
          ? (ordersData.totalOrders / totalUsers) 
          : 0;

        setStats({
          totalUsers: totalUsers,
          totalOrders: ordersData.totalOrders || 0,
          totalRevenue: totalRevenue,
          totalProducts: productsData.totalProducts || 0,
          pendingOrders: ordersData.pendingOrders || 0,
          recentSignups: recentSignups, 
          conversionRate: parseFloat(conversionRate.toFixed(2)), 
          avgOrderValue: avgOrderValue,
        });
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAdmin) {
      fetchAdminStats();
    }
  }, [isAdmin]);

  const statsCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "bg-blue-500",
      change: "+12 this week",
      changeType: "positive" as const,
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      icon: Package,
      color: "bg-green-500",
      change: `${stats.pendingOrders} pending`,
      changeType: "neutral" as const,
    },
    {
      title: "Total Revenue",
      value: <PriceFormatter amount={stats.totalRevenue} />,
      icon: DollarSign,
      color: "bg-emerald-500",
      change: "+8.2% from last month",
      changeType: "positive" as const,
    },
    {
      title: "Total Products",
      value: stats.totalProducts.toLocaleString(),
      icon: ShoppingCart,
      color: "bg-purple-500",
      change: "5 low stock",
      changeType: "warning" as const,
    },
    {
      title: "Conversion Rate",
      value: `${stats.conversionRate}%`,
      icon: TrendingUp,
      color: "bg-orange-500",
      change: "+0.3% this week",
      changeType: "positive" as const,
    },
    {
      title: "Avg Order Value",
      value: <PriceFormatter amount={stats.avgOrderValue} />,
      icon: BarChart3,
      color: "bg-indigo-500",
      change: "+$12 this month",
      changeType: "positive" as const,
    },
  ];

  const quickActions = [
    {
      title: "Manage Users",
      description: "Add, edit, or remove users",
      icon: Users,
      href: "/admin/users",
      color: "bg-blue-500",
    },
    {
      title: "View Orders",
      description: "Manage pending and completed orders",
      icon: Package,
      href: "/admin/orders",
      color: "bg-green-500",
    },
    {
      title: "Analytics",
      description: "View detailed analytics and reports",
      icon: BarChart3,
      href: "/admin/analytics",
      color: "bg-purple-500",
    },
  ];

  if (isLoading) {
    return (
      <Container>
        <div className="animate-pulse flex flex-col space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {user?.firstName || "Admin"}! Here's your platform
            overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
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
                  <div className="mt-4">
                    <Badge
                      variant={
                        stat.changeType === "positive"
                          ? "default"
                          : stat.changeType === "warning"
                          ? "destructive"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {stat.change}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={action.href}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`p-3 ${action.color} rounded-lg`}>
                              <action.icon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {action.title}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {action.description}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Database Status
                </h4>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">
                    Connected and healthy
                  </span>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">API Status</h4>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">
                    All services operational
                  </span>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Payment Gateway
                </h4>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">
                    Razorpay connected
                  </span>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Storage</h4>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">
                    85% capacity used
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default AdminDashboard;
