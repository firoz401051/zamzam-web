"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle,
  Clock
} from "lucide-react";

export function EmployeeRecentActivity() {
  // In a real app, this data would come from an API
  const activities = [
    {
      id: 1,
      type: "order_packed",
      user: "Mike Johnson",
      action: "marked order #ORD-001 as packed",
      time: "2 minutes ago",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      id: 2,
      type: "order_delivered",
      user: "Sarah Davis",
      action: "delivered order #ORD-002 successfully", 
      time: "15 minutes ago",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      id: 3,
      type: "order_out_delivery",
      user: "Tom Wilson",
      action: "started delivery for order #ORD-003",
      time: "32 minutes ago",
      icon: Truck,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      id: 4,
      type: "order_cancelled",
      user: "Anna Smith",
      action: "cancelled order #ORD-004 due to stock issues",
      time: "1 hour ago",
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      id: 5,
      type: "order_confirmed",
      user: "Mike Johnson",
      action: "confirmed order #ORD-005 for processing",
      time: "1 hour ago",
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              {/* Activity Icon */}
              <div className={`p-2 rounded-lg ${activity.bgColor} mt-1`}>
                <activity.icon className={`h-4 w-4 ${activity.color}`} />
              </div>

              {/* Activity Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <div className="h-6 w-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                    {getUserInitials(activity.user)}
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {activity.user}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {activity.action}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* View All Activity Link */}
        <div className="mt-6 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View all activity
          </button>
        </div>
      </CardContent>
    </Card>
  );
}