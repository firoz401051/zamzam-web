"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Eye, 
  XCircle,
  RefreshCw,
  DollarSign,
  AlertCircle
} from "lucide-react";

interface AccountsOrder {
  id: string;
  orderNumber: string;
  customer: string;
  total: string;
  paymentStatus: "paid" | "pending" | "failed" | "cancelled";
  paymentMethod: "stripe" | "cod" | "card";
  orderStatus: "pending" | "confirmed" | "packed" | "delivering" | "delivered" | "cancelled";
  createdAt: string;
  canCancel: boolean;
  needsRefund: boolean;
}

export function AccountsOrderTable() {
  // Mock data - in real app, this would come from API
  const orders: AccountsOrder[] = [
    {
      id: "1",
      orderNumber: "#ORD-001",
      customer: "John Doe",
      total: "$125.99",
      paymentStatus: "failed",
      paymentMethod: "stripe",
      orderStatus: "pending",
      createdAt: "2024-01-15 09:30",
      canCancel: true,
      needsRefund: false
    },
    {
      id: "2",
      orderNumber: "#ORD-002",
      customer: "Jane Smith",
      total: "$89.50",
      paymentStatus: "paid",
      paymentMethod: "stripe",
      orderStatus: "delivered",
      createdAt: "2024-01-15 08:15",
      canCancel: false,
      needsRefund: true
    },
    {
      id: "3",
      orderNumber: "#ORD-003", 
      customer: "Bob Wilson",
      total: "$234.75",
      paymentStatus: "pending",
      paymentMethod: "cod",
      orderStatus: "confirmed",
      createdAt: "2024-01-15 10:20",
      canCancel: true,
      needsRefund: false
    },
    {
      id: "4",
      orderNumber: "#ORD-004",
      customer: "Alice Brown",
      total: "$67.25",
      paymentStatus: "paid",
      paymentMethod: "stripe", 
      orderStatus: "delivering",
      createdAt: "2024-01-15 07:45",
      canCancel: false,
      needsRefund: false
    },
  ];

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "failed": return "bg-red-100 text-red-800";
      case "cancelled": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "confirmed": return "bg-blue-100 text-blue-800";
      case "packed": return "bg-purple-100 text-purple-800";
      case "delivering": return "bg-orange-100 text-orange-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleCancelOrder = (orderId: string) => {
    // In real app, this would call an API
    console.log(`Cancelling order ${orderId}`);
  };

  const handleRefund = (orderId: string) => {
    // In real app, this would call an API
    console.log(`Processing refund for order ${orderId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          All Orders Management
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <AlertCircle className="h-4 w-4" />
            <span>Financial oversight</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{order.orderNumber}</span>
                    {order.paymentStatus === "failed" && (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell className="font-medium">{order.total}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Badge 
                      className={`text-xs ${getPaymentStatusColor(order.paymentStatus)}`}
                      variant="secondary"
                    >
                      {order.paymentStatus}
                    </Badge>
                    <div className="text-xs text-gray-500 capitalize">
                      {order.paymentMethod}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    className={`text-xs ${getOrderStatusColor(order.orderStatus)}`}
                    variant="secondary"
                  >
                    {order.orderStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {order.createdAt}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {order.canCancel && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCancelOrder(order.id)}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {order.needsRefund && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRefund(order.id)}
                        className="text-blue-600 border-blue-300 hover:bg-blue-50"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Summary Footer */}
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                ${orders.filter(o => o.paymentStatus === "paid").reduce((sum, o) => sum + parseFloat(o.total.slice(1)), 0).toFixed(2)}
              </div>
              <div className="text-gray-600">Paid Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                ${orders.filter(o => o.paymentStatus === "pending").reduce((sum, o) => sum + parseFloat(o.total.slice(1)), 0).toFixed(2)}
              </div>
              <div className="text-gray-600">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                ${orders.filter(o => o.paymentStatus === "failed").reduce((sum, o) => sum + parseFloat(o.total.slice(1)), 0).toFixed(2)}
              </div>
              <div className="text-gray-600">Failed</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}