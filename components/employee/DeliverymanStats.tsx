"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Truck, 
  MapPin, 
  CheckCircle, 
  Clock,
  Route,
  TrendingUp
} from "lucide-react";

export function DeliverymanStats() {
  // In a real app, this data would come from an API
  const stats = [
    {
      title: "Ready for Pickup",
      value: "12",
      change: "+3 new orders",
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Out for Delivery",
      value: "8",
      change: "Current route",
      icon: Truck,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Delivered Today",
      value: "15",
      change: "+5 from yesterday",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Active Routes",
      value: "3",
      change: "Optimized paths",
      icon: Route,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Delivery Rate",
      value: "95%",
      change: "+2% this week",
      icon: TrendingUp,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
}