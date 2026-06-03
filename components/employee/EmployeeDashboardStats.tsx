"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Users
} from "lucide-react";

export function EmployeeDashboardStats() {
  // In a real app, this data would come from an API
  const stats = [
    {
      title: "Pending Orders",
      value: "24",
      change: "+12%",
      changeType: "increase" as const,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Orders Packed",
      value: "156",
      change: "+8%",
      changeType: "increase" as const,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Out for Delivery",
      value: "43",
      change: "+5%",
      changeType: "increase" as const,
      icon: Truck,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Delivered Today",
      value: "89",
      change: "+15%",
      changeType: "increase" as const,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Active Employees",
      value: "12",
      change: "0%",
      changeType: "neutral" as const,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Today's Revenue",
      value: "$12,450",
      change: "+22%",
      changeType: "increase" as const,
      icon: TrendingUp,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="flex items-center space-x-2 text-xs">
              <Badge 
                variant={stat.changeType === "increase" ? "default" : "secondary"}
                className="text-xs"
              >
                {stat.change}
              </Badge>
              <span className="text-gray-500">from yesterday</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}