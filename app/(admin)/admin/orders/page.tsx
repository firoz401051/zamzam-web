"use client";
import React, { useEffect, useState } from "react";
import Container from "@/components/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Package,
  Search,
  Eye,
  Edit,
  Trash2,
  Download,
  Filter,
  Calendar,
  DollarSign,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useAdmin } from "@/lib/admin";
import PriceFormatter from "@/components/PriceFormatter";
import { backendClient } from "@/sanity/lib/backendClient";
import toast from "react-hot-toast";

interface AdminOrder {
  _id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  orderDate: string;
  products: Array<{
    _key: string;
    quantity: number;
    product: {
      _id: string;
      name: string;
      price: number;
    };
  }>;
  address: {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
}

const AdminOrdersPage = () => {
  const { isAdmin } = useAdmin();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [editedOrder, setEditedOrder] = useState<AdminOrder | null>(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAdmin) return;

      try {
        const query = `*[_type == "order"] | order(orderDate desc) {
          _id,
          orderNumber,
          customerName,
          email,
          totalPrice,
          totalPrice,
          status,
          "paymentStatus": coalesce(paymentStatus, "pending"),
          orderDate,
          address,
          products[] {
            _key,
            quantity,
            product-> {
              _id,
              name,
              price
            }
          }
        }`;

        const fetchedOrders = await backendClient.fetch(query);
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch orders");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [isAdmin]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
  filterStatus === "all" ||
  order.status?.toLowerCase() === filterStatus.toLowerCase();
 
    return matchesSearch && matchesFilter;
  });

  // Handle local updates restricted to the sidebar editing state
  const handleLocalStatusChange = (newStatus: string) => {
    if (editedOrder) {
      setEditedOrder({ ...editedOrder, status: newStatus });
    }
  };

  const handleLocalPaymentStatusChange = (newStatus: string) => {
    if (editedOrder) {
      setEditedOrder({ ...editedOrder, paymentStatus: newStatus });
    }
  };

  const handleSaveChanges = async () => {
    if (!editedOrder) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/orders/${editedOrder._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: editedOrder.status,
          paymentStatus: editedOrder.paymentStatus,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update order");
      }

      const { order: updatedOrder } = await response.json();

      // Update local state
      setOrders(
        orders.map((order) =>
          order._id === updatedOrder._id
            ? { ...order, ...updatedOrder }
            : order
        )
      );

      setSelectedOrder(updatedOrder);
      setEditedOrder(updatedOrder);
      toast.success("Order changes saved successfully");
      setIsOrderDetailOpen(false);
    } catch (error: any) {
      console.error("Error updating order:", error);
      toast.error(error.message || "Failed to update order");
    } finally {
      setIsSaving(false);
    }
  };



  const [isDeleteOrderOpen, setIsDeleteOrderOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteOrderClick = (orderId: string) => {
    setOrderToDelete(orderId);
    setIsDeleteOrderOpen(true);
  };

  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
         throw new Error("Failed to delete order");
      }
      
      setOrders(orders.filter((order) => order._id !== orderToDelete));
      toast.success("Order deleted successfully");
      setIsDeleteOrderOpen(false);
      setOrderToDelete(null);
      // Remove from selected if it was selected
      setSelectedOrderIds(prev => prev.filter(id => id !== orderToDelete));
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
    } finally {
      setIsDeleting(false);
    }
  };

  // Bulk Delete Logic
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedOrderIds.length === filteredOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredOrders.map((order) => order._id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedOrderIds.length === 0) return;
    setIsBulkDeleting(true);
    try {
      const response = await fetch("/api/admin/orders/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderIds: selectedOrderIds }),
      });

      if (!response.ok) throw new Error("Failed to delete orders");

      const result = await response.json();
      setOrders(orders.filter((order) => !selectedOrderIds.includes(order._id)));
      setSelectedOrderIds([]);
      setIsBulkDeleteOpen(false);
      toast.success(result.message || "Orders deleted successfully");
    } catch (error) {
      console.error("Error bulk deleting orders:", error);
      toast.error("Failed to delete selected orders");
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
      case "completed":
      case "delivered":
        return "bg-green-100 text-green-800";
      case "pending":
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
      case "failed":
        return "bg-red-100 text-red-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusOptions = () => [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  const getPaymentStatusOptions = () => [
    "pending",
    "paid",
    "failed",
    "refunded",
  ];

  if (isLoading) {
    return (
      <Container>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Order Management
              </h1>
              <p className="text-gray-600">Manage all customer orders</p>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Orders
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold">
  {
    orders.filter(
      (o) =>
        o.paymentStatus === "paid" &&
        ["confirmed", "processing", "shipped", "delivered"].includes(
          o.status
        )
    ).length
  }
</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold">
                      {
  orders.filter(
    (o) =>
      o.paymentStatus === "paid" &&
      ["confirmed", "processing"].includes(o.status)
  ).length
}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold">
                      {
  orders.filter(
    (o) =>
      o.paymentStatus === "paid" &&
      ["shipped", "delivered"].includes(o.status)
  ).length
}
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Revenue</p>
                    <p className="text-2xl font-bold">
                      <PriceFormatter
                        amount={
  orders
    .filter(
      (o) =>
        o.paymentStatus === "paid" &&
        ["confirmed", "processing", "shipped", "delivered"].includes(
          o.status
        )
    )
    .reduce(
      (sum, o) => sum + (o.totalPrice || 0),
      0
    )
}
                      />
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-emerald-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search orders by number, customer name, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="flex h-10 w-full md:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="all">All Orders</option>

<optgroup label="Active Orders">
  <option value="confirmed">Confirmed</option>
  <option value="processing">Processing</option>
  <option value="shipped">Shipped</option>
  <option value="delivered">Delivered</option>
</optgroup>

<optgroup label="Exception Orders">
  <option value="pending">Pending</option>
  <option value="cancelled">Cancelled</option>
</optgroup>

                </select>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Action Bar */}
          {selectedOrderIds.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-blue-800">
                  {selectedOrderIds.length} orders selected
                </span>
              </div>
              <div className="flex items-center space-x-2">
                 <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedOrderIds([])}
                  className="bg-white hover:bg-blue-50"
                 >
                   Cancel Selection
                 </Button>
                 <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setIsBulkDeleteOpen(true)}
                 >
                   <Trash2 className="h-4 w-4 mr-2" />
                   Delete Selected
                 </Button>
              </div>
            </div>
          )}

          {/* Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Orders ({filteredOrders.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox 
                          checked={filteredOrders.length > 0 && selectedOrderIds.length === filteredOrders.length}
                          onCheckedChange={toggleSelectAll}
                          aria-label="Select all"
                        />
                      </TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order, index) => (
                      <motion.tr
                        key={order._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`border-b ${selectedOrderIds.includes(order._id) ? "bg-blue-50/50" : ""}`}
                      >
                         <TableCell>
                            <Checkbox 
                              checked={selectedOrderIds.includes(order._id)}
                              onCheckedChange={() => toggleOrderSelection(order._id)}
                              aria-label={`Select order ${order.orderNumber}`}
                            />
                         </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">#{order.orderNumber}</p>
                            <p className="text-sm text-gray-500">
                              {order.products?.length || 0} items
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.customerName}</p>
                            <p className="text-sm text-gray-500">
                              {order.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`px-2 py-1 rounded text-xs font-medium inline-block text-center min-w-[80px] ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <PriceFormatter amount={order.totalPrice} />
                        </TableCell>
                        <TableCell>
                          {new Date(order.orderDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedOrder(order);
                                setEditedOrder(order);
                                setIsOrderDetailOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteOrderClick(order._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Order Detail Sheet */}
          <Sheet open={isOrderDetailOpen} onOpenChange={setIsOrderDetailOpen}>
            <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
              <SheetHeader className="mb-6">
                <SheetTitle>Order Details</SheetTitle>
                <SheetDescription>
                  Manage order status and view details for #
                  {editedOrder?.orderNumber}
                </SheetDescription>
              </SheetHeader>
              {editedOrder && (
                <div className="space-y-8">
                  {/* Status Management */}
                  <div className="bg-gray-50 p-4 rounded-lg border space-y-4">
                     <h3 className="text-sm font-semibold text-gray-900 mb-2">Order Management</h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <Label className="text-sm font-medium text-gray-500">Order Status</Label>
                           <select
                              value={editedOrder.status}
                              onChange={(e) => handleLocalStatusChange(e.target.value)}
                              className={`w-full p-2 rounded-md border text-sm font-medium bg-white ${getStatusColor(editedOrder.status)}`}
                            >
                               {getStatusOptions().map(status => (
                                  <option key={status} value={status}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                  </option>
                               ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                           <Label className="text-sm font-medium text-gray-500">Payment Status</Label>
                           <select
                              value={editedOrder.paymentStatus}
                              onChange={(e) => handleLocalPaymentStatusChange(e.target.value)}
                              className={`w-full p-2 rounded-md border text-sm font-medium bg-white ${
                                editedOrder.paymentStatus === 'paid' ? 'text-green-700 border-green-200' :
                                editedOrder.paymentStatus === 'pending' ? 'text-yellow-700 border-yellow-200' :
                                'text-red-700 border-red-200'
                              }`}
                            >
                               {getPaymentStatusOptions().map(status => (
                                  <option key={status} value={status}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                  </option>
                               ))}
                            </select>
                        </div>
                     </div>
                  </div>

                  {/* Customer Info */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 text-sm">
                        {editedOrder.customerName.charAt(0)}
                      </div>
                      Customer Information
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                      <p className="flex justify-between">
                        <span className="text-gray-500">Name:</span>
                        <span className="font-medium">
                          {editedOrder.customerName}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-500">Email:</span>
                        <span className="font-medium">{editedOrder.email}</span>
                      </p>
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      Shipping Address
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-1 text-sm">
                      <p className="font-medium">
                        {editedOrder.address?.name ||
                          editedOrder.customerName}
                      </p>
                      <p className="text-gray-600">
                        {editedOrder.address?.address}
                      </p>
                      <p className="text-gray-600">
                        {editedOrder.address?.city},{" "}
                        {editedOrder.address?.state}{" "}
                        {editedOrder.address?.zip}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Order Items</h3>
                    <div className="border rounded-lg divide-y">
                      {editedOrder.products?.map((item) => (
                        <div
                          key={item._key}
                          className="flex justify-between items-center p-4 hover:bg-gray-50"
                        >
                          <div>
                            <p className="font-medium text-sm">
                              {item.product?.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium text-sm">
                            <PriceFormatter
                              amount={(item.product?.price || 0) * item.quantity}
                            />
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="border-t pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Subtotal</span>
                        <PriceFormatter amount={editedOrder.totalPrice} />
                      </div>
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <PriceFormatter
                          amount={editedOrder.totalPrice}
                          className="text-zamzam-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
               <SheetFooter className="mt-6 sm:justify-between flex-col sm:flex-row gap-4 border-t pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsOrderDetailOpen(false)}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveChanges} 
                    disabled={
                      isSaving || 
                      !editedOrder ||
                      (editedOrder.status === selectedOrder?.status && 
                       editedOrder.paymentStatus === selectedOrder?.paymentStatus)
                    }
                    className="w-full sm:w-auto"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
               </SheetFooter>
            </SheetContent>
          </Sheet>

          {/* Delete Confirmation Dialog */}
          <Dialog open={isDeleteOrderOpen} onOpenChange={setIsDeleteOrderOpen}>
            <DialogPortal>
              <DialogOverlay />
              <DialogPrimitive.Content
                className={cn(
                  "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg"
                )}
              >
                <DialogHeader>
                  <DialogTitle>Delete Order</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this order? This action cannot
                    be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-100">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-600 shadow-sm border border-red-100">
                       <Trash2 className="h-5 w-5" />
                    </div>
                    <div>
                         <p className="font-medium text-red-900">Irreversible Action</p>
                         <p className="text-sm text-red-700">This will permanently remove the order record.</p>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsDeleteOrderOpen(false);
                        setOrderToDelete(null);
                      }}
                      className="w-full sm:w-auto"
                      disabled={isDeleting}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={confirmDeleteOrder}
                      className="w-full sm:w-auto"
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete Order"}
                    </Button>
                  </div>
                </DialogFooter>
              </DialogPrimitive.Content>
            </DialogPortal>
          </Dialog>

          {/* Bulk Delete Confirmation Dialog */}
          <Dialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}>
            <DialogPortal>
              <DialogOverlay />
              <DialogPrimitive.Content
                className={cn(
                  "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg"
                )}
              >
                <DialogHeader>
                  <DialogTitle>Delete Selected Orders</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete {selectedOrderIds.length} orders? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-100">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-600 shadow-sm border border-red-100">
                       <Trash2 className="h-5 w-5" />
                    </div>
                    <div>
                         <p className="font-medium text-red-900">Irreversible Action</p>
                         <p className="text-sm text-red-700">This will permanently remove the selected {selectedOrderIds.length} orders.</p>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0">
                    <Button
                      variant="outline"
                      onClick={() => setIsBulkDeleteOpen(false)}
                      className="w-full sm:w-auto"
                      disabled={isBulkDeleting}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleBulkDelete}
                      className="w-full sm:w-auto"
                      disabled={isBulkDeleting}
                    >
                      {isBulkDeleting ? "Deleting..." : "Delete Orders"}
                    </Button>
                  </div>
                </DialogFooter>
              </DialogPrimitive.Content>
            </DialogPortal>
          </Dialog>
      </div>
    </Container>
  );
};

export default AdminOrdersPage;
