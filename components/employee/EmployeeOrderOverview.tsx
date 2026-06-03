"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal } from "lucide-react";

export function EmployeeOrderOverview() {
  // In a real app, this data would come from an API
  const recentOrders = [
    {
      id: "#ORD-001",
      customer: "John Doe",
      status: "pending",
      assignedTo: "Not Assigned",
      total: "$125.99",
      items: 3,
      priority: "normal",
    },
    {
      id: "#ORD-002",
      customer: "Jane Smith", 
      status: "confirmed",
      assignedTo: "Mike Johnson",
      total: "$89.50",
      items: 2,
      priority: "high",
    },
    {
      id: "#ORD-003",
      customer: "Bob Wilson",
      status: "packed",
      assignedTo: "Sarah Davis",
      total: "$234.75",
      items: 5,
      priority: "normal",
    },
    {
      id: "#ORD-004",
      customer: "Alice Brown",
      status: "delivering",
      assignedTo: "Tom Wilson",
      total: "$67.25",
      items: 1,
      priority: "urgent",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "confirmed": return "bg-blue-100 text-blue-800";
      case "packed": return "bg-purple-100 text-purple-800";
      case "delivering": return "bg-orange-100 text-orange-800";
      case "delivered": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "normal": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Recent Orders
          <Button variant="outline" size="sm">
            View All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-gray-900">{order.id}</span>
                  <Badge 
                    className={`text-xs ${getStatusColor(order.status)}`}
                    variant="secondary"
                  >
                    {order.status}
                  </Badge>
                  <Badge 
                    className={`text-xs ${getPriorityColor(order.priority)}`}
                    variant="secondary"
                  >
                    {order.priority}
                  </Badge>
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  <span className="font-medium">{order.customer}</span> • 
                  {order.items} items • {order.total}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Assigned to: {order.assignedTo}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}