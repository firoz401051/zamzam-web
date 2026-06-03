"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  CreditCard,
  RefreshCw,
  AlertCircle
} from "lucide-react";

export function AccountsStats() {
  // In a real app, this data would come from an API
  const stats = [
    {
      title: "Today's Revenue",
      value: "$12,450",
      change: "+22%",
      changeType: "increase" as const,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Pending Payments",
      value: "$3,250",
      change: "+5 orders",
      changeType: "neutral" as const,
      icon: CreditCard,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Failed Payments",
      value: "$890",
      change: "3 orders",
      changeType: "alert" as const,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Refunds Processed",
      value: "$450",
      change: "2 today",
      changeType: "neutral" as const,
      icon: RefreshCw,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Monthly Revenue",
      value: "$125,680",
      change: "+15%",
      changeType: "increase" as const,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Avg Order Value",
      value: "$87.50",
      change: "-2%",
      changeType: "decrease" as const,
      icon: TrendingDown,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
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
            <div className="flex items-center space-x-2 text-xs mt-1">
              <Badge 
                variant={
                  stat.changeType === "increase" ? "default" : 
                  stat.changeType === "decrease" ? "destructive" :
                  stat.changeType === "alert" ? "destructive" : "secondary"
                }
                className="text-xs"
              >
                {stat.change}
              </Badge>
              <span className="text-gray-500">
                {stat.changeType === "increase" && "vs yesterday"}
                {stat.changeType === "decrease" && "vs yesterday"}
                {stat.changeType === "neutral" && "current"}
                {stat.changeType === "alert" && "requires attention"}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}