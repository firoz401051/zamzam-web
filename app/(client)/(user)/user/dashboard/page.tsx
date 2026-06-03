import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getMyOrders } from "@/sanity/helpers";
import { Package, ShoppingCart, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PriceFormatter from "@/components/PriceFormatter";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardRecentActivity from "@/components/dashboard/DashboardRecentActivity";

const DashboardPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch orders server-side
  let orders: any[] = [];
  try {
    orders = await getMyOrders(userId);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
  }

  // Get recent orders for display
  const recentOrders = orders.slice(0, 3);

  // Calculate total spent
  const totalSpent = orders.reduce(
    (sum, order) => sum + (order.totalPrice || 0),
    0
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "processing":
        return "bg-yellow-100 text-yellow-700";
      case "shipped":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-zamzam-text-dark">Overview</h2>
        <p className="text-zamzam-text-muted">
          Here&apos;s what&apos;s happening with your account today.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-white shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-zamzam-primary-light rounded-lg">
              <Package className="w-6 h-6 text-zamzam-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zamzam-text-dark">
                {orders.length}
              </p>
              <p className="text-sm text-zamzam-text-muted">Total Orders</p>
            </div>
          </div>
        </Card>

        <DashboardStats totalOrders={orders.length} totalSpent={totalSpent} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-linear-to-r from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">My Cart</h3>
                <p className="text-sm text-blue-700">
                  View cart items and checkout
                </p>
              </div>
            </div>
            <Link href="/cart">
              <Button
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-700 hover:bg-blue-200"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="p-6 bg-linear-to-r from-red-50 to-red-100 border-red-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500 rounded-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-red-900">Wishlist</h3>
                <p className="text-sm text-red-700">Your saved items</p>
              </div>
            </div>
            <Link href="/wishlist">
              <Button
                variant="outline"
                size="sm"
                className="border-red-300 text-red-700 hover:bg-red-200"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="p-6 bg-white shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-zamzam-text-dark">
            Recent Orders
          </h3>
          <Link href="/user/orders">
            <Button variant="outline" size="sm">
              View All Orders
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <div
                key={order._id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-zamzam-primary/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-zamzam-surface rounded-lg">
                    <Package className="w-5 h-5 text-zamzam-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-zamzam-text-dark">
                      Order #{order.orderNumber}
                    </p>
                    <p className="text-sm text-zamzam-text-muted">
                      {order.products?.length || 0} item
                      {(order.products?.length || 0) !== 1 ? "s" : ""} •{" "}
                      {new Date(order._createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={`mb-2 ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </Badge>
                  <p className="font-semibold text-zamzam-text-dark">
                    <PriceFormatter amount={order.totalPrice} />
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-zamzam-text-muted">No orders yet</p>
              <Link href="/products">
                <Button className="mt-4" size="sm">
                  Start Shopping
                </Button>
              </Link>
            </div>
          )}
        </div>
      </Card>

      {/* Recent Activity */}
      <DashboardRecentActivity recentOrders={recentOrders} />
    </div>
  );
};

export default DashboardPage;
