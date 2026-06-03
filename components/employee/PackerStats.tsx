"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Package, 
  CheckCircle, 
  AlertCircle,
  TrendingUp
} from "lucide-react";

export function PackerStats() {
  // In a real app, this data would come from an API
  const stats = [
    {
      title: "Pending Orders",
      value: "8",
      change: "+2 from yesterday",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      priority: "high",
    },
    {
      title: "Confirmed Orders",
      value: "15",
      change: "+5 from yesterday",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      priority: "normal",
    },
    {
      title: "Packed Today",
      value: "23",
      change: "+8 from yesterday",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
      priority: "success",
    },
    {
      title: "Urgent Orders",
      value: "3",
      change: "+1 from yesterday",
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
      priority: "urgent",
    },
    {
      title: "Packing Rate",
      value: "92%",
      change: "+3% efficiency",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      priority: "metric",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
            <p className="text-xs text-gray-500 mt-1">
              {stat.change}
            </p>
            {stat.priority === "urgent" && (
              <Badge variant="destructive" className="text-xs mt-2">
                Needs Attention
              </Badge>
            )}
            {stat.priority === "high" && (
              <Badge variant="secondary" className="text-xs mt-2">
                Priority
              </Badge>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}