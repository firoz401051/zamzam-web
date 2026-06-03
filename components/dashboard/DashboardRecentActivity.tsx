"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import useCartStore from "@/store";
import { Package, Heart, Star, Eye, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "../ui/card";

interface RecentActivity {
  id: string;
  type: "order" | "wishlist" | "review" | "view";
  description: string;
  date: string;
  link?: string;
}

interface DashboardRecentActivityProps {
  recentOrders: any[];
}

const DashboardRecentActivity: React.FC<DashboardRecentActivityProps> = ({
  recentOrders,
}) => {
  const { favoriteProduct } = useCartStore();

  const recentActivity = useMemo((): RecentActivity[] => {
    const activity: RecentActivity[] = [];

    // Add order activity
    recentOrders.forEach((order) => {
      activity.push({
        id: `order-${order._id}`,
        type: "order",
        description: `Order #${order.orderNumber} was ${order.status}`,
        date: new Date(order._createdAt).toLocaleDateString(),
        link: `/user/orders/${order.orderNumber}`,
      });
    });

    // Add wishlist activity
    if (favoriteProduct.length > 0) {
      favoriteProduct.slice(0, 2).forEach((product, index) => {
        activity.push({
          id: `wishlist-${product._id}`,
          type: "wishlist",
          description: `Added ${product.name} to wishlist`,
          date: "Recently",
        });
      });
    }

    return activity.slice(0, 5);
  }, [recentOrders, favoriteProduct]);

  const getActivityIcon = (type: RecentActivity["type"]) => {
    switch (type) {
      case "order":
        return <Package className="w-4 h-4 text-zamzam-primary" />;
      case "wishlist":
        return <Heart className="w-4 h-4 text-red-500" />;
      case "review":
        return <Star className="w-4 h-4 text-yellow-500" />;
      case "view":
        return <Eye className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <Card className="p-6 bg-white shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-zamzam-text-dark mb-6">
        Recent Activity
      </h2>

      <div className="space-y-4">
        {recentActivity.map((activity) => (
          <div key={activity.id} className="flex items-center gap-4">
            <div className="flex-shrink-0">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1">
              <p className="text-sm text-zamzam-text-dark">
                {activity.description}
              </p>
              <p className="text-xs text-zamzam-text-muted">
                {activity.date}
              </p>
            </div>
            {activity.link && (
              <Link href={activity.link}>
                <Button variant="outline" size="sm" className="text-xs">
                  View
                </Button>
              </Link>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default DashboardRecentActivity;
