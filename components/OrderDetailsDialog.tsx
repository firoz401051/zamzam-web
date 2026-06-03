import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import PriceFormatter from "./PriceFormatter";
import { Order } from "@/sanity.types";
import { Button } from "./ui/button";
import Link from "next/link";
import { Badge } from "./ui/badge";
import {
  Calendar,
  CreditCard,
  Download,
  ExternalLink,
  MapPin,
  Package,
  User,
  Mail,
} from "lucide-react";
import { Separator } from "./ui/separator";
import { motion, AnimatePresence } from "framer-motion";

interface OrderDetailsDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!order) return null;

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "cod_pending":
        return "bg-orange-100 text-orange-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <DialogHeader className="pb-6">
                <DialogTitle className="text-2xl font-bold text-zamzam-text-dark">
                  Order #{order.orderNumber}
                </DialogTitle>
                <p className="text-zamzam-text-light">
                  Complete order information and details
                </p>
              </DialogHeader>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Order Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Order Summary Info */}
                  <div className="bg-zamzam-surface rounded-lg p-4 space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Order Information
                    </h3>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-zamzam-text-light" />
                        <div>
                          <p className="text-zamzam-text-light">Order Date</p>
                          <p className="font-medium">
                            {order.orderDate &&
                              new Date(order.orderDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-zamzam-text-light" />
                        <div>
                          <p className="text-zamzam-text-light">Customer</p>
                          <p className="font-medium">{order.customerName}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-zamzam-text-light" />
                        <div>
                          <p className="text-zamzam-text-light">Email</p>
                          <p className="font-medium text-xs">{order.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-zamzam-text-light" />
                        <div>
                          <p className="text-zamzam-text-light">Payment</p>
                          <p className="font-medium">
                            {order.stripeCheckoutSessionId
                              ? "Online Payment"
                              : "Cash on Delivery"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status
                          ? order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)
                          : "Unknown"}
                      </Badge>
                      <Badge
                        className={
                          order.stripeCheckoutSessionId
                            ? "bg-green-100 text-green-800"
                            : "bg-orange-100 text-orange-800"
                        }
                      >
                        {order.stripeCheckoutSessionId ? "Paid" : "COD Pending"}
                      </Badge>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  {order.address && (
                    <div className="bg-zamzam-surface rounded-lg p-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                        <MapPin className="w-5 h-5" />
                        Shipping Address
                      </h3>
                      <div className="space-y-1 text-sm">
                        <p className="font-medium">{order.address.name}</p>
                        <p className="text-zamzam-text-light">
                          {order.address.address}
                          <br />
                          {order.address.city}, {order.address.state}{" "}
                          {order.address.zip}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Order Items */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Order Items</h3>
                    <div className="space-y-3">
                      {order.products?.map((item, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-4 p-4 bg-white rounded-lg border"
                        >
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                            {/* Note: You'll need to handle product images properly based on your data structure */}
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Product Item</p>
                            <p className="text-sm text-zamzam-text-light">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">Price Info</p>
                            <p className="text-sm text-zamzam-text-light">
                              Per item
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Order Total */}
                  <div className="bg-zamzam-surface rounded-lg p-4 space-y-3">
                    <h3 className="text-lg font-semibold">Order Total</h3>

                    {order.amountDiscount && order.amountDiscount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Discount</span>
                        <PriceFormatter
                          amount={order.amountDiscount}
                          className="text-green-600 font-medium"
                        />
                      </div>
                    )}

                    <Separator />

                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <PriceFormatter amount={order.totalPrice || 0} />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    {order.invoice?.hosted_invoice_url && (
                      <Button asChild className="w-full gap-2">
                        <Link
                          href={order.invoice.hosted_invoice_url}
                          target="_blank"
                        >
                          <Download className="w-4 h-4" />
                          Download Invoice
                        </Link>
                      </Button>
                    )}

                    <Button variant="outline" asChild className="w-full gap-2">
                      <Link href={`/user/orders/${order.orderNumber}`}>
                        <ExternalLink className="w-4 h-4" />
                        View Full Details
                      </Link>
                    </Button>
                  </div>

                  {/* Invoice Info */}
                  {order.invoice?.number && (
                    <div className="bg-zamzam-surface rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-2">Invoice</h3>
                      <p className="text-sm text-zamzam-text-light">
                        Invoice #: {order.invoice.number}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default OrderDetailsDialog;
