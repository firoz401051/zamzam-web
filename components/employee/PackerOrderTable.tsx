"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Package, 
  CheckCircle, 
  Clock,
  AlertTriangle
} from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  items: number;
  total: string;
  status: "pending" | "confirmed" | "packed";
  priority: "normal" | "high" | "urgent";
  createdAt: string;
  notes?: string;
}

export function PackerOrderTable() {
  const [activeTab, setActiveTab] = useState("pending");

  // Mock data - in real app, this would come from API
  const orders: Order[] = [
    {
      id: "1",
      orderNumber: "#ORD-001",
      customer: "John Doe",
      items: 3,
      total: "$125.99",
      status: "pending",
      priority: "high",
      createdAt: "2024-01-15 09:30",
      notes: "Customer requested expedited processing"
    },
    {
      id: "2", 
      orderNumber: "#ORD-002",
      customer: "Jane Smith",
      items: 2,
      total: "$89.50", 
      status: "pending",
      priority: "urgent",
      createdAt: "2024-01-15 10:15",
      notes: "Next day delivery required"
    },
    {
      id: "3",
      orderNumber: "#ORD-003",
      customer: "Bob Wilson",
      items: 5,
      total: "$234.75",
      status: "confirmed",
      priority: "normal",
      createdAt: "2024-01-15 08:45"
    },
    {
      id: "4",
      orderNumber: "#ORD-004",
      customer: "Alice Brown",
      items: 1,
      total: "$67.25",
      status: "packed",
      priority: "normal",
      createdAt: "2024-01-15 07:20"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "confirmed": return "bg-blue-100 text-blue-800";
      case "packed": return "bg-green-100 text-green-800";
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

  const filteredOrders = orders.filter(order => {
    if (activeTab === "pending") return order.status === "pending";
    if (activeTab === "confirmed") return order.status === "confirmed";
    if (activeTab === "packed") return order.status === "packed";
    return true;
  });

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    // In real app, this would call an API
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending ({orders.filter(o => o.status === "pending").length})
            </TabsTrigger>
            <TabsTrigger value="confirmed" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Confirmed ({orders.filter(o => o.status === "confirmed").length})
            </TabsTrigger>
            <TabsTrigger value="packed" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Packed ({orders.filter(o => o.status === "packed").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{order.orderNumber}</span>
                        <Badge 
                          className={`text-xs ${getStatusColor(order.status)}`}
                          variant="secondary"
                        >
                          {order.status}
                        </Badge>
                      </div>
                      {order.notes && (
                        <div className="text-xs text-gray-500 mt-1 flex items-center">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {order.notes}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.items}</TableCell>
                    <TableCell>{order.total}</TableCell>
                    <TableCell>
                      <Badge 
                        className={`text-xs ${getPriorityColor(order.priority)}`}
                        variant="secondary"
                      >
                        {order.priority}
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
                        
                        {order.status === "pending" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleStatusUpdate(order.id, "confirmed")}
                          >
                            Confirm
                          </Button>
                        )}
                        
                        {order.status === "confirmed" && (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleStatusUpdate(order.id, "packed")}
                          >
                            Mark Packed
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredOrders.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No {activeTab} orders found
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}