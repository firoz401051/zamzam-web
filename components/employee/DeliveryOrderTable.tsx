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
  Truck, 
  MapPin, 
  Phone,
  CheckCircle,
  Clock
} from "lucide-react";

interface DeliveryOrder {
  id: string;
  orderNumber: string;
  customer: string;
  address: string;
  phone: string;
  items: number;
  total: string;
  status: "ready" | "delivering" | "delivered";
  priority: "normal" | "high" | "urgent";
  estimatedTime: string;
  deliveryNotes?: string;
}

export function DeliveryOrderTable() {
  const [activeTab, setActiveTab] = useState("ready");

  // Mock data - in real app, this would come from API
  const orders: DeliveryOrder[] = [
    {
      id: "1",
      orderNumber: "#ORD-001",
      customer: "John Doe",
      address: "123 Main St, Downtown",
      phone: "+1 (555) 123-4567",
      items: 3,
      total: "$125.99",
      status: "ready",
      priority: "high",
      estimatedTime: "30 mins",
      deliveryNotes: "Ring doorbell twice"
    },
    {
      id: "2",
      orderNumber: "#ORD-002", 
      customer: "Jane Smith",
      address: "456 Oak Ave, Uptown",
      phone: "+1 (555) 987-6543",
      items: 2,
      total: "$89.50",
      status: "delivering",
      priority: "urgent",
      estimatedTime: "15 mins",
      deliveryNotes: "Leave at door if no answer"
    },
    {
      id: "3",
      orderNumber: "#ORD-003",
      customer: "Bob Wilson", 
      address: "789 Pine St, Suburbs",
      phone: "+1 (555) 456-7890",
      items: 5,
      total: "$234.75",
      status: "delivered",
      priority: "normal",
      estimatedTime: "Completed",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready": return "bg-blue-100 text-blue-800";
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

  const filteredOrders = orders.filter(order => {
    if (activeTab === "ready") return order.status === "ready";
    if (activeTab === "delivering") return order.status === "delivering";
    if (activeTab === "delivered") return order.status === "delivered";
    return true;
  });

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    // In real app, this would call an API
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ready" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Ready ({orders.filter(o => o.status === "ready").length})
            </TabsTrigger>
            <TabsTrigger value="delivering" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Delivering ({orders.filter(o => o.status === "delivering").length})
            </TabsTrigger>
            <TabsTrigger value="delivered" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Delivered ({orders.filter(o => o.status === "delivered").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer & Contact</TableHead>
                  <TableHead>Delivery Address</TableHead>
                  <TableHead>Items/Total</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>ETA</TableHead>
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
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customer}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {order.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                        <div>
                          <div className="text-sm">{order.address}</div>
                          {order.deliveryNotes && (
                            <div className="text-xs text-gray-500 mt-1">
                              Note: {order.deliveryNotes}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{order.items} items</div>
                        <div className="text-sm font-medium">{order.total}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`text-xs ${getPriorityColor(order.priority)}`}
                        variant="secondary"
                      >
                        {order.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {order.estimatedTime}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        {order.status === "ready" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleStatusUpdate(order.id, "delivering")}
                          >
                            Start Delivery
                          </Button>
                        )}
                        
                        {order.status === "delivering" && (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleStatusUpdate(order.id, "delivered")}
                          >
                            Mark Delivered
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